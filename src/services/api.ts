import type { Artwork } from "../types/artwork";

export interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
  };
}

export const fetchArtworks = async (page: number): Promise<ApiResponse> => {
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch artworks");
  }

  return response.json();
};