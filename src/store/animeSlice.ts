import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cancelOngoingRequests, getAnimeById, searchAnime } from "../services/api";
import type { Anime, SearchResponse } from "../types/anime";

interface AnimeState {
  searchResults: Anime[];
  selectedAnime: Anime | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  favorites: Anime[];
  filters: {
    genres: string[];
    year: string;
  };
  sortBy: "popularity" | "rating" | "newest" | null;
}

// Load favorites from localStorage
const loadFavoritesFromStorage = (): Anime[] => {
  try {
    const saved = localStorage.getItem("animeFavorites");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Initial Redux state for anime search
const initialState: AnimeState = {
  searchResults: [],
  selectedAnime: null,
  loading: false,
  detailLoading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  favorites: loadFavoritesFromStorage(),
  filters: {
    genres: [],
    year: "",
  },
  sortBy: null,
};

// Thunk to fetch anime search results
export const fetchAnime = createAsyncThunk(
  "anime/fetchAnime",
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      const response: SearchResponse = await searchAnime(query, page);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message === "Request cancelled") {
        throw error;
      }
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch anime");
    }
  },
);

// Thunk to fetch anime details by ID
export const fetchAnimeDetail = createAsyncThunk("anime/fetchAnimeDetail", async (id: number, { rejectWithValue }) => {
  try {
    const response = await getAnimeById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch anime details");
  }
});

// Main anime Redux slice
const animeSlice = createSlice({
  name: "anime",
  initialState,
  // Synchronous reducers for state updates
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = "";
      state.currentPage = 1;
      state.error = null;
      cancelOngoingRequests();
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAnime: (state) => {
      state.selectedAnime = null;
    },
    toggleFavorite: (state, action: PayloadAction<Anime>) => {
      const index = state.favorites.findIndex((anime) => anime.mal_id === action.payload.mal_id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
      localStorage.setItem("animeFavorites", JSON.stringify(state.favorites));
    },
    setFilters: (state, action: PayloadAction<{ genres?: string[]; year?: string }>) => {
      if (action.payload.genres !== undefined) state.filters.genres = action.payload.genres;
      if (action.payload.year !== undefined) state.filters.year = action.payload.year;
    },
    clearFilters: (state) => {
      state.filters = {
        genres: [],
        year: "",
      };
    },
    setSortBy: (state, action: PayloadAction<"popularity" | "rating" | "newest" | null>) => {
      state.sortBy = action.payload;
    },
  },
  // Async reducers for API calls
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
        state.currentPage = action.payload.pagination.current_page;
        state.totalPages = action.payload.pagination.last_visible_page;
        state.hasNextPage = action.payload.pagination.has_next_page;
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        if (action.error.message !== "Request cancelled") {
          state.loading = false;
          state.error = (action.payload as string) || "Something went wrong";
        }
      })
      .addCase(fetchAnimeDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchAnimeDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedAnime = action.payload;
      })
      .addCase(fetchAnimeDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = (action.payload as string) || "Failed to load anime details";
      });
  },
});

export const {
  setSearchQuery,
  clearSearch,
  clearError,
  clearSelectedAnime,
  toggleFavorite,
  setFilters,
  clearFilters,
  setSortBy,
} = animeSlice.actions;
export default animeSlice.reducer;
