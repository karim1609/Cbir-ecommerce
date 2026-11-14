import type { SearchResponse } from '../types';
import { mockProducts } from '../utils/mockData';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchByImage(imageFile: File): Promise<SearchResponse> {
  // TODO: Replace with real API call:
  // POST /api/search/image/
  // const formData = new FormData();
  // formData.append('image', imageFile);
  // const response = await apiClient.post('/search/image/', formData, {
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // });
  // return response.data;

  await delay(2000); // Simulate ResNet50 processing

  const scores = [0.947, 0.891, 0.834, 0.776, 0.712, 0.654, 0.598, 0.521];
  const shuffled = [...mockProducts].sort(() => Math.random() - 0.5).slice(0, 8);

  return {
    queryImage: URL.createObjectURL(imageFile),
    results: shuffled.map((product, index) => ({
      product,
      similarityScore: scores[index],
      rank: index + 1,
    })),
    totalFound: 8,
    searchTime: 1.24,
  };
}

export async function searchByText(query: string): Promise<typeof mockProducts> {
  // TODO: Replace with real API call: GET /api/search/?q=query
  await delay(400);
  const q = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );
}
