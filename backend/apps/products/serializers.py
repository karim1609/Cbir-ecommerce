from rest_framework import serializers
from apps.categories.serializers import CategorySerializer
from apps.products.models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    alt = serializers.CharField(source="alt_text")
    isPrimary = serializers.BooleanField(source="is_primary")

    class Meta:
        model = ProductImage
        fields = ["id", "url", "alt", "isPrimary"]

    def get_url(self, obj) -> str:
        if not obj.image:
            return ""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    price = serializers.SerializerMethodField()
    originalPrice = serializers.SerializerMethodField()
    inStock = serializers.SerializerMethodField()
    stockCount = serializers.IntegerField(source="stock")
    rating = serializers.SerializerMethodField()
    reviewCount = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    isFeatured = serializers.SerializerMethodField()
    isTrending = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", format="%Y-%m-%dT%H:%M:%SZ")

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "originalPrice",
            "category",
            "images",
            "rating",
            "reviewCount",
            "inStock",
            "stockCount",
            "tags",
            "brand",
            "isFeatured",
            "isTrending",
            "createdAt",
        ]

    def get_price(self, obj) -> float:
        return float(obj.price)

    def get_originalPrice(self, obj):
        # Give ~30% of products a discounted original price
        if obj.id % 3 == 0:
            return round(float(obj.price) * 1.25, 2)
        return None

    def get_inStock(self, obj) -> bool:
        return obj.stock > 0

    def get_rating(self, obj) -> float:
        # Realistic rating between 4.0 and 5.0
        return round(4.0 + ((obj.id * 7) % 10) * 0.1, 1)

    def get_reviewCount(self, obj) -> int:
        return 12 + ((obj.id * 23) % 400)

    def get_tags(self, obj) -> list[str]:
        tags = []
        if obj.brand:
            tags.append(obj.brand.lower())
        if obj.category:
            tags.append(obj.category.slug)
        return tags

    def get_isFeatured(self, obj) -> bool:
        return (obj.id % 7 == 0) or (obj.id in [1, 2, 7, 10, 11, 17, 78, 123])

    def get_isTrending(self, obj) -> bool:
        return (obj.id % 4 == 0) or (obj.id in [3, 5, 6, 8, 15, 20, 21, 80, 124])
