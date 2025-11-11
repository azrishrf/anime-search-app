import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdClose, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FilterPanel from "../components/FilterPanel";
import { useDebounce } from "../hooks/useDebounce";
import { clearError, fetchAnime, setSearchQuery, toggleFavorite } from "../store/animeSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Anime } from "../types/anime";

function SearchPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    searchResults,
    loading,
    error,
    searchQuery,
    currentPage,
    totalPages,
    hasNextPage,
    favorites,
    filters,
    sortBy,
  } = useAppSelector((state) => state.anime);

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useDebounce((query: string, page: number) => {
    if (query.trim()) {
      dispatch(fetchAnime({ query, page }));
    }
  }, 250);

  // Handles input change in search bar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));
    debouncedSearch(value, 1);
  };

  // Handles pagination button click
  const handlePageChange = (page: number) => {
    if (searchQuery.trim()) {
      dispatch(fetchAnime({ query: searchQuery, page }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Navigates to anime detail page
  const handleCardClick = (anime: Anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  // Toggles favorite status for an anime
  const handleToggleFavorite = (e: React.MouseEvent, anime: Anime) => {
    e.stopPropagation();
    dispatch(toggleFavorite(anime));
  };

  // Checks if an anime is in favorites
  const isFavorite = (animeId: number) => {
    return favorites.some((fav) => fav.mal_id === animeId);
  };

  // Returns filtered and sorted anime results
  const filteredAndSortedResults = useMemo(() => {
    let results = [...searchResults];

    if (filters.genres.length > 0) {
      results = results.filter((anime) => filters.genres.some((genre) => anime.genres.some((g) => g.name === genre)));
    }

    if (filters.year) {
      results = results.filter((anime) => anime.year?.toString() === filters.year);
    }

    if (sortBy === "popularity") {
      results.sort((a, b) => (a.popularity || 999999) - (b.popularity || 999999));
    } else if (sortBy === "rating") {
      results.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortBy === "newest") {
      results.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    return results;
  }, [searchResults, filters, sortBy]);

  // Counts the number of active filters and sort options
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.genres.length > 0) count += filters.genres.length;
    if (filters.year) count++;
    if (sortBy) count++;
    return count;
  }, [filters, sortBy]);

  // Initialize AOS animation library on mount
  useEffect(() => {
    AOS.init({
      easing: "ease-out",
      offset: 75,
    });
  }, []);

  // Refresh AOS animations when search results change
  useEffect(() => {
    AOS.refresh();
  }, [searchResults]);

  // Renders pagination controls for search results
  const renderPagination = () => {
    if (!searchResults.length || totalPages <= 1 || !searchQuery.trim()) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="btn-pagination">
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 font-semibold text-zinc-500">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "btn-pagination-active" : "btn-pagination"}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 font-semibold text-zinc-500">
            ...
          </span>,
        );
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="btn-pagination">
          {totalPages}
        </button>,
      );
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-3 py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-pagination font-bold"
        >
          ← Prev
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="btn-pagination font-bold"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="relative z-10 mx-auto max-w-[1400px] p-8">
      <div className="py-8 text-center">
        <div data-aos="fade-down">
          <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-8xl">
            Anime <span className="text-orange">Search</span>
          </h1>
          <p className="mb-4 text-lg font-medium text-zinc-300 md:text-3xl">Discover Your Next Favorite Anime</p>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            Search through thousands of anime titles, explore detailed information, and find your next binge-worthy
            series with our modern platform.
          </p>
          <button onClick={() => navigate("/favorites")} className="btn-secondary inline-flex items-center gap-2">
            <IoMdHeart className="text-xl" />
            My Favorites
            {favorites.length > 0 && (
              <span className="rounded-full bg-gradient-to-r from-orange to-orange-dark px-2 py-0.5 text-xs font-bold text-white">
                {favorites.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative mx-auto mb-12 max-w-3xl" data-aos="zoom-in">
        <div className="glass-card group relative flex items-center rounded-3xl border-2 border-dark-light px-6 py-4 shadow-lg shadow-black/20 transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-orange focus-within:shadow-orange/30 hover:-translate-y-0.5 hover:border-orange/50 hover:shadow-orange/20">
          <CiSearch className="mr-2 flex-shrink-0 text-2xl text-zinc-400 transition-colors duration-300 group-focus-within:text-orange" />
          <input
            type="text"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="min-w-0 flex-1 border-none bg-transparent text-lg font-medium text-white outline-none placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => {
                dispatch(setSearchQuery(""));
                dispatch(clearError());
              }}
              className="ml-2 flex h-8 w-8 min-w-[2rem] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-dark-light text-lg font-semibold text-zinc-400 transition-all duration-200 hover:scale-110 hover:bg-orange/20 hover:text-white"
            >
              <IoMdClose />
            </button>
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="relative flex cursor-pointer items-center gap-2 rounded-xl border-none bg-dark-light px-5 py-3 font-semibold text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange/20 hover:text-white"
          >
            <MdFilterList className="text-xl" />
            Filters & Sort
            {activeFilterCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange to-orange-dark text-xs font-bold text-white shadow-md shadow-orange/40">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {error && (
        <div className="mx-auto mb-8 flex max-w-3xl animate-[slideDown_0.3s_ease] items-center justify-between rounded-2xl border border-orange/30 bg-orange/10 px-6 py-4 text-orange-light backdrop-blur-md">
          <span>⚠️ {error}</span>
          <button onClick={() => dispatch(clearError())} className="btn-close">
            <IoMdClose />
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="shimmer h-[360px] w-full"></div>
              <div className="p-6">
                <div className="shimmer mb-3.5 h-6 w-4/5 rounded-md"></div>
                <div className="shimmer h-4.5 mb-3.5 w-full rounded-md"></div>
                <div className="shimmer h-4.5 w-3/5 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && searchQuery && filteredAndSortedResults.length === 0 && searchResults.length > 0 && (
        <div className="px-8 py-20 text-center">
          <div className="mb-6 text-8xl opacity-40">🔍</div>
          <h2 className="mb-3 text-3xl font-bold text-white">No Results Match Filters</h2>
          <p className="text-lg text-zinc-400">Try adjusting your filters</p>
        </div>
      )}

      {!loading && searchQuery && searchResults.length === 0 && (
        <div className="px-8 py-20 text-center">
          <div className="mb-6 text-8xl opacity-40">🔍</div>
          <h2 className="mb-3 text-3xl font-bold text-white">No Results Found</h2>
          <p className="text-lg text-zinc-400">Try searching for something else</p>
        </div>
      )}

      {!loading && !searchQuery && searchResults.length === 0 && (
        <div className="px-8 py-20 text-center">
          <div className="mb-6 text-8xl opacity-40">🎬</div>
          <h2 className="mb-3 text-3xl font-bold text-white">Start Your Search</h2>
          <p className="text-md text-zinc-400">Type in the search bar to discover amazing anime</p>
        </div>
      )}

      {!loading && filteredAndSortedResults.length > 0 && (
        <>
          <div className="mb-8 text-center text-sm font-medium text-zinc-500">
            Showing {filteredAndSortedResults.length} of {searchResults.length} results on page {currentPage}
          </div>
          <div className="mb-12 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {filteredAndSortedResults.map((anime) => (
              <div
                key={anime.mal_id}
                // data-aos="fade-up"
                // data-aos-delay={index * 30}
                className="card group relative cursor-pointer overflow-hidden"
                onClick={() => handleCardClick(anime)}
              >
                <button
                  onClick={(e) => handleToggleFavorite(e, anime)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-dark-light bg-dark/80 text-2xl text-zinc-400 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-orange hover:bg-orange/80 hover:text-white"
                >
                  {isFavorite(anime.mal_id) ? <IoMdHeart className="text-orange" /> : <IoMdHeartEmpty />}
                </button>
                <div className="relative h-[360px] w-full overflow-hidden bg-dark">
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-dark via-dark/50 to-transparent px-6 pb-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-white">{anime.title}</h3>
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                    {anime.score && (
                      <span className="flex items-center gap-1 font-bold text-orange">⭐ {anime.score.toFixed(1)}</span>
                    )}
                    {anime.type && (
                      <span className="rounded-lg border border-dark-light bg-dark-light px-3 py-1.5 text-xs font-semibold text-zinc-400">
                        {anime.type}
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="rounded-lg border border-dark-light bg-dark-light px-3 py-1.5 text-xs font-semibold text-zinc-400">
                        {anime.episodes} eps
                      </span>
                    )}
                  </div>
                  {anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.slice(0, 3).map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="rounded-2xl bg-gradient-to-r from-orange to-orange-dark px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange/30 transition-transform duration-200 hover:-translate-y-0.5"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}

export default SearchPage;
