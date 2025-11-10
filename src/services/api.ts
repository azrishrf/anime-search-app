import type { CancelTokenSource } from "axios";
import axios from "axios";
import type { AnimeDetailResponse, SearchResponse } from "../types/anime";

// Base URL for Jikan API
const BASE_URL = "https://api.jikan.moe/v4";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Used to cancel ongoing API requests
let cancelTokenSource: CancelTokenSource | null = null;

// Search anime with cancellation support
export const searchAnime = async (query: string, page: number = 1): Promise<SearchResponse> => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel("New search initiated");
  }
  cancelTokenSource = axios.CancelToken.source();
  try {
    const response = await api.get<SearchResponse>("/anime", {
      params: {
        q: query,
        page,
        limit: 24,
        sfw: true,
      },
      cancelToken: cancelTokenSource.token,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error("Request cancelled");
    }
    throw error;
  }
};

// Get anime details by ID
export const getAnimeById = async (id: number): Promise<AnimeDetailResponse> => {
  const response = await api.get<AnimeDetailResponse>(`/anime/${id}`);
  return response.data;
};

// Cancel any ongoing API requests (used on unmount)
export const cancelOngoingRequests = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Component unmounted");
    cancelTokenSource = null;
  }
};
