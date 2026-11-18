# 📦 Products App — Data Models, Seeding & Persistence

This module manages the product catalog and product images for the **CBIR E-Commerce Platform**. It provides models, migrations, persistent fixtures, and management commands to seed and restore the catalog data required by the Django backend and the ResNet50 visual retrieval engine.

---

## 🗄️ 1. Models Overview

### `Product` (`apps.products.models.Product`)
Represents an item in the store:
* `external_id`: Unique integer matching the original source ID (e.g. from DummyJSON). Ensures idempotency and avoids duplicates.
* `name`: Product title (up to 200 characters).
* `slug`: Unique URL slug formatted as `f"{slugify(title)}-{external_id}"` to prevent collisions.
* `description`: Detailed text description.
* `price`: `DecimalField(10, 2)` with a check constraint (`price >= 0`).
* `brand`: Brand name string (optional, defaults to empty string).
* `stock`: Available inventory count (`PositiveIntegerField`, default `0`).
* `category`: Foreign key to `categories.Category` (`on_delete=models.PROTECT`, related name `"products"`).
* `is_active`: Boolean flag indicating visibility (`default=True`).
* `created_at` / `updated_at`: Automated timestamps.

### `ProductImage` (`apps.products.models.ProductImage`)
Stores images associated with products on local disk for CBIR processing:
* `product`: Foreign key to `Product` (`on_delete=models.CASCADE`, related name `"images"`).
* `image`: `ImageField` uploading to `products/{product_id}/{uuid}.{ext}` under `MEDIA_ROOT`.
* `alt_text`: Accessibility description string.
* `is_primary`: Boolean indicating the thumbnail image. A database constraint ensures **only one primary image per product**.
* `position`: Ordering index (`0` for primary/thumbnail).

---

## 🚀 2. Quick Setup Commands (For New Workers / Collaborators)

When setting up this project or pulling new changes, follow these commands:

### Step 1: Run Database Migrations
Create or update the PostgreSQL tables:
```bash
docker compose exec backend python manage.py migrate
```

---

### Step 2: Populate Catalog & Images (2 Options)

#### Option A: Offline Restore from Fixture (Fastest & 100% Offline)
The repository includes a committed database fixture with all **24 categories** and **194 products**:
```bash
docker compose exec backend python manage.py loaddata initial_products.json
```
> **Note:** This populates the PostgreSQL database tables. For ResNet50 visual feature extraction, you also need the physical image files in your media folder.

#### Option B: Fresh One-Time Seed & Local Image Download
Fetches the catalog once from DummyJSON, creates all categories, products, and **downloads all physical image files directly to the local media volume**:
```bash
# Recommended: Seeds 194 products and downloads 1 primary image per product for CBIR:
docker compose exec backend python manage.py seed_dummyjson --primary-only

# Or test with a small batch first:
docker compose exec backend python manage.py seed_dummyjson --limit 10 --primary-only
```

---

## 💾 3. Docker Volume Persistence Architecture

This module relies on two persistent Docker volumes defined in `docker-compose.yml`:

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│         postgres_data           │       │           media_data            │
│   (Named Volume in PostgreSQL)  │       │     (Named Volume in Backend)   │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ • categories_category table     │       │ • /app/media/products/1/..jpg   │
│ • products_product table        │       │ • /app/media/products/2/..webp  │
│ • products_productimage table   │       │ • Physical files on disk        │
└─────────────────────────────────┘       └─────────────────────────────────┘
                ▲                                          ▲
                │ SQL Queries                              │ File System Access
                └───────────────┬──────────────────────────┘
                                │
                        [ Django Backend ]
                                │
                    [ ResNet50 Feature Extractor ]
```

* **`postgres_data`**: Preserves all categories, product records, foreign keys, and image metadata across `docker compose down` and `docker compose up`.
* **`media_data`**: Preserves the actual downloaded binary image files in `/app/media/products/`. ResNet50 feature extraction operates directly on these local files.

---

## 🛠️ 4. Management Command Reference (`seed_dummyjson`)

The custom command is located in `backend/apps/products/management/commands/seed_dummyjson.py`.

### Available CLI Flags

| Flag | Default | Description |
|---|---|---|
| `--limit <int>` | `None` (all) | Limit the number of products to process (e.g. `--limit 10`). |
| `--primary-only` | `False` | Download only the primary thumbnail image per product (recommended). |
| `--skip-existing` | `False` | Skip items where `external_id` is already in the database. |
| `--force` | `False` | Re-download images and overwrite existing products. |
| `--timeout <sec>`| `15` | Network timeout for HTTP requests and image downloads. |

### Creating a New Backup Fixture
If you modify product data and want to update the committed fixture:
```bash
docker compose exec backend python manage.py dumpdata categories products --indent 2 -o /app/apps/products/fixtures/initial_products.json
```

---

## 🔍 5. Verification Commands

Run these commands to verify that your database and disk storage are populated correctly:

```bash
# 1. Verify table counts in PostgreSQL:
docker compose exec db psql -U cbir_user -d cbir_ecommerce -c "SELECT (SELECT count(*) FROM categories_category) as categories, (SELECT count(*) FROM products_product) as products, (SELECT count(*) FROM products_productimage) as images;"

# Expected output:
#  categories | products | images 
# ------------+----------+--------
#          24 |      194 |    194

# 2. Verify physical image files exist inside the container:
docker compose exec backend sh -c "find /app/media/products/ -type f | wc -l"
# Expected output: 194
```

---

## 🌐 6. Visual Inspection

Once the backend is running, you can inspect the products visually:
* **Django Admin:** [http://localhost:8000/admin/products/product/](http://localhost:8000/admin/products/product/)
* **Django Admin Images:** [http://localhost:8000/admin/products/productimage/](http://localhost:8000/admin/products/productimage/)
* **React Frontend:** [http://localhost:5173/products](http://localhost:5173/products)
