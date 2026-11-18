from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product
from apps.products.pagination import ProductPagination
from apps.products.serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPagination

    def get_queryset(self):
        queryset = (
            Product.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related("images")
        )

        params = self.request.query_params

        # Category filter by slug
        category_slug = params.get("category")
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # Search filter
        search_query = params.get("search")
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query)
                | Q(brand__icontains=search_query)
                | Q(description__icontains=search_query)
            )

        # Price range
        min_price = params.get("minPrice") or params.get("min_price")
        if min_price is not None:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = params.get("maxPrice") or params.get("max_price")
        if max_price is not None:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # In Stock
        in_stock = params.get("inStock") or params.get("in_stock")
        if in_stock in ["true", "True", "1"]:
            queryset = queryset.filter(stock__gt=0)

        # Sorting
        sort_by = params.get("sortBy") or params.get("sort_by")
        if sort_by == "price_asc":
            queryset = queryset.order_by("price")
        elif sort_by == "price_desc":
            queryset = queryset.order_by("-price")
        elif sort_by == "name":
            queryset = queryset.order_by("name")
        else:
            # Default newest
            queryset = queryset.order_by("-created_at", "id")

        # Featured / Trending shortcuts
        if params.get("featured") in ["true", "True", "1"]:
            # Pick a subset of high-ticket or flagship products
            queryset = queryset.filter(
                Q(id__in=[1, 2, 7, 10, 11, 17, 78, 123]) | Q(price__gte=500)
            )[:12]

        if params.get("trending") in ["true", "True", "1"]:
            queryset = queryset.filter(
                Q(id__in=[3, 5, 6, 8, 15, 20, 21, 80, 124]) | Q(stock__gte=50)
            )[:12]

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = (
        Product.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related("images")
    )
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductRelatedView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.select_related("category").get(pk=pk)
        except Product.DoesNotExist:
            return Response([], status=404)

        related = (
            Product.objects.filter(category=product.category, is_active=True)
            .exclude(pk=pk)
            .select_related("category")
            .prefetch_related("images")[:4]
        )
        serializer = ProductSerializer(related, many=True, context={"request": request})
        return Response(serializer.data)
