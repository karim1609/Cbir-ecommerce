import os
import uuid
from decimal import Decimal
from pathlib import Path
from typing import Optional

import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from apps.categories.models import Category
from apps.products.models import Product, ProductImage


class Command(BaseCommand):
    help = "One-time seed: fetch products from DummyJSON and store them locally in PostgreSQL & media storage."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Limit the number of products to import (useful for quick testing, e.g. --limit 10).",
        )
        parser.add_argument(
            "--primary-only",
            action="store_true",
            help="Download only the primary thumbnail image per product (recommended for faster seeding).",
        )
        parser.add_argument(
            "--skip-existing",
            action="store_true",
            help="Skip products that already exist in the database (based on external_id).",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force overwrite existing products and re-download images.",
        )
        parser.add_argument(
            "--timeout",
            type=int,
            default=15,
            help="HTTP timeout in seconds for API and image downloads (default: 15).",
        )

    def handle(self, *args, **options):
        limit = options["limit"]
        primary_only = options["primary_only"]
        skip_existing = options["skip_existing"]
        force = options["force"]
        timeout = options["timeout"]

        self.stdout.write(self.style.MIGRATE_HEADING("=== DummyJSON One-Time Database Seeder ==="))
        self.stdout.write(f"Options: limit={limit}, primary_only={primary_only}, skip_existing={skip_existing}, force={force}")

        # 1. Fetch products from DummyJSON API
        api_url = "https://dummyjson.com/products?limit=0"
        self.stdout.write(f"Connecting to {api_url}...")
        try:
            response = requests.get(api_url, timeout=timeout)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            self.stderr.write(self.style.ERROR(f"Failed to fetch data from DummyJSON: {e}"))
            return

        all_products = data.get("products", [])
        total_found = len(all_products)
        self.stdout.write(self.style.SUCCESS(f"Found {total_found} products from DummyJSON."))

        if limit and limit > 0:
            products_to_import = all_products[:limit]
            self.stdout.write(f"Applying limit: importing {len(products_to_import)} products.")
        else:
            products_to_import = all_products

        # 2. Iterate and import
        created_count = 0
        updated_count = 0
        skipped_count = 0
        image_count = 0
        failed_count = 0

        for index, item in enumerate(products_to_import, start=1):
            external_id = item.get("id")
            title = item.get("title", "").strip()

            if not external_id or not title:
                continue

            # Check existing
            existing_product = Product.objects.filter(external_id=external_id).first()
            if existing_product and skip_existing and not force:
                self.stdout.write(f"[{index}/{len(products_to_import)}] Skipping #{external_id}: '{title}' (already exists)")
                skipped_count += 1
                continue

            try:
                # Resolve Category
                raw_category = item.get("category", "General").replace("-", " ").title()
                category_slug = slugify(raw_category)
                category, _ = Category.objects.get_or_create(
                    name=raw_category,
                    defaults={"slug": category_slug, "description": f"{raw_category} category"},
                )

                # Format fields
                price = Decimal(str(item.get("price", 0)))
                stock = int(item.get("stock", 0))
                brand = (item.get("brand") or "").strip()[:100]
                description = item.get("description", "").strip()
                slug = f"{slugify(title)[:180]}-{external_id}"

                # Save Product in atomic block
                with transaction.atomic():
                    product, created = Product.objects.update_or_create(
                        external_id=external_id,
                        defaults={
                            "name": title[:200],
                            "slug": slug,
                            "description": description,
                            "price": price,
                            "stock": stock,
                            "brand": brand,
                            "category": category,
                            "is_active": True,
                        },
                    )

                if created:
                    created_count += 1
                    status_text = "Created"
                else:
                    updated_count += 1
                    status_text = "Updated"

                # Image resolution
                thumbnail_url = item.get("thumbnail")
                images_urls = item.get("images", [])

                # Decide which image URLs to process
                images_to_download = []
                if thumbnail_url:
                    images_to_download.append((thumbnail_url, True, 0))

                if not primary_only:
                    pos = 1
                    for img_url in images_urls:
                        if img_url != thumbnail_url:
                            images_to_download.append((img_url, False, pos))
                            pos += 1

                # Download images
                images_saved_for_product = 0
                for img_url, is_primary, position in images_to_download:
                    # If product already has a primary image and force is not set, avoid duplicate downloads
                    if not force and is_primary and product.images.filter(is_primary=True).exists():
                        continue

                    img_file = self._download_image(img_url, timeout)
                    if img_file:
                        # Extract extension
                        ext = Path(img_url.split("?")[0]).suffix.lower() or ".jpg"
                        file_name = f"{uuid.uuid4().hex[:12]}{ext}"

                        prod_img = ProductImage(
                            product=product,
                            is_primary=is_primary,
                            position=position,
                            alt_text=f"{product.name} image {position}",
                        )
                        prod_img.image.save(file_name, img_file, save=True)
                        image_count += 1
                        images_saved_for_product += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"[{index}/{len(products_to_import)}] {status_text} #{external_id}: '{product.name[:30]}' ({images_saved_for_product} images saved)"
                    )
                )

            except Exception as e:
                failed_count += 1
                self.stderr.write(self.style.ERROR(f"[{index}/{len(products_to_import)}] Error importing #{external_id}: {e}"))

        # 3. Final Summary
        self.stdout.write("\n" + self.style.MIGRATE_HEADING("=== Seed Summary ==="))
        self.stdout.write(f"Total processed : {len(products_to_import)}")
        self.stdout.write(f"Created         : {created_count}")
        self.stdout.write(f"Updated         : {updated_count}")
        self.stdout.write(f"Skipped         : {skipped_count}")
        self.stdout.write(f"Failed          : {failed_count}")
        self.stdout.write(f"Images saved    : {image_count}")
        self.stdout.write(self.style.SUCCESS("All products and local images stored successfully!"))

    def _download_image(self, url: str, timeout: int) -> Optional[ContentFile]:
        """Download an image URL safely with timeout and return a ContentFile."""
        try:
            res = requests.get(url, timeout=timeout)
            if res.status_code == 200 and res.content:
                return ContentFile(res.content)
            else:
                self.stderr.write(self.style.WARNING(f"HTTP {res.status_code} when downloading {url}"))
        except requests.RequestException as e:
            self.stderr.write(self.style.WARNING(f"Network error downloading image {url}: {e}"))
        return None
