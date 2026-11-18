from django.urls import path
from apps.products.views import ProductListView, ProductDetailView, ProductRelatedView

app_name = "products"

urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("<int:pk>/related/", ProductRelatedView.as_view(), name="product-related"),
]
