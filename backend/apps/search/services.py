from dataclasses import dataclass

from apps.image_processing.extractor import get_extractor
from apps.image_processing.preprocessing import ImagePreprocessor
from apps.image_processing.retrieval import SimilarityRetriever


@dataclass
class SearchHit:
    product: object
    matched_image: object
    similarity: float


class ImageSearchService:
    CANDIDATE_FACTOR = 5

    def __init__(self, preprocessor=None, extractor=None, retriever=None):
        self.preprocessor = preprocessor or ImagePreprocessor()
        self.extractor = extractor or get_extractor()
        self.retriever = retriever or SimilarityRetriever()

    def search(self, uploaded_file, limit=10):
        prepared = self.preprocessor.process(uploaded_file)
        query_vector = self.extractor.extract(prepared)

        candidates = self.retriever.find_similar(
            query_vector, k=limit * self.CANDIDATE_FACTOR
        )

        best_by_product = {}
        for image, similarity in candidates:
            product = image.product
            if not product.is_active:
                continue
            current = best_by_product.get(product.id)
            if current is None or similarity > current.similarity:
                best_by_product[product.id] = SearchHit(product, image, similarity)

        hits = sorted(best_by_product.values(), key=lambda h: h.similarity, reverse=True)
        return hits[:limit]