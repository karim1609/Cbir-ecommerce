from django.urls import path

from .views import ImageSearchView

urlpatterns = [
    path("image/", ImageSearchView.as_view(), name="image-search"),
]