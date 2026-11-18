from rest_framework import serializers
from apps.categories.models import Category
from apps.products.models import ProductImage


class CategorySerializer(serializers.ModelSerializer):
    productCount = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "productCount", "image"]

    def get_productCount(self, obj) -> int:
        return obj.products.filter(is_active=True).count()

    def get_image(self, obj) -> str:
        # Find first primary image of products in this category
        request = self.context.get("request")
        first_img = (
            ProductImage.objects.filter(product__category=obj, is_primary=True)
            .select_related("product")
            .first()
        )
        if not first_img:
            first_img = ProductImage.objects.filter(product__category=obj).first()

        if first_img and first_img.image:
            if request:
                return request.build_absolute_uri(first_img.image.url)
            return first_img.image.url
        return "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80"
