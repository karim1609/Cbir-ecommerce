from rest_framework import serializers

MAX_UPLOAD_MB = 8
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


class ImageSearchRequestSerializer(serializers.Serializer):
    image = serializers.ImageField()
    limit = serializers.IntegerField(required=False, default=10, min_value=1, max_value=50)

    def validate_image(self, file):
        if file.size > MAX_UPLOAD_MB * 1024 * 1024:
            raise serializers.ValidationError(f"Image too large (max {MAX_UPLOAD_MB} MB).")
        image_format = getattr(getattr(file, "image", None), "format", None)
        if image_format not in ALLOWED_FORMATS:
            raise serializers.ValidationError("Unsupported format. Use JPEG, PNG or WebP.")
        return file


class SearchResultSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(source="product.id")
    name = serializers.CharField(source="product.name")
    slug = serializers.CharField(source="product.slug")
    price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2)
    image_url = serializers.SerializerMethodField()
    similarity = serializers.FloatField()

    def get_image_url(self, hit):
        request = self.context.get("request")
        url = hit.matched_image.image.url
        return request.build_absolute_uri(url) if request else url