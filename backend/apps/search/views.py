from django.shortcuts import render
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.image_processing.exceptions import InvalidImageError

from .serializers import ImageSearchRequestSerializer, SearchResultSerializer
from .services import ImageSearchService


class ImageSearchView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ImageSearchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            hits = ImageSearchService().search(
                serializer.validated_data["image"],
                limit=serializer.validated_data["limit"],
            )
        except InvalidImageError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        results = SearchResultSerializer(hits, many=True, context={"request": request})
        return Response({"count": len(hits), "results": results.data})