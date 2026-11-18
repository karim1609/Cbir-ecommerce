from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.categories.models import Category
from apps.categories.serializers import CategorySerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all categories without pagination for the menu/filters
