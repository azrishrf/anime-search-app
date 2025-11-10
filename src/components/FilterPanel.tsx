import { IoMdClose } from "react-icons/io";
import { clearFilters, setFilters, setSortBy } from "../store/animeSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
];

const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

const SORT_OPTIONS = [
  { value: null, label: "Default" },
  { value: "popularity" as const, label: "Popularity" },
  { value: "rating" as const, label: "Rating" },
  { value: "newest" as const, label: "Newest" },
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const dispatch = useAppDispatch();
  const { filters, sortBy } = useAppSelector((state) => state.anime);

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    dispatch(setFilters({ genres: newGenres }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setSortBy(null));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-[fadeIn_0.3s_ease]"
        onClick={onClose}
      ></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-dark border-l-2 border-dark-light shadow-2xl z-50 overflow-y-auto animate-[slideInRight_0.3s_ease] scrollbar-hide">
        <div className="sticky top-0 bg-dark/95 backdrop-blur-md border-b-2 border-dark-light px-6 py-5 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Filters & Sort</h2>
          <button onClick={onClose} className="btn-close">
            <IoMdClose />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Sort By</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => dispatch(setSortBy(option.value))}
                  className={
                    sortBy === option.value
                      ? "bg-gradient-to-r from-orange to-orange-dark text-white px-4 py-3 rounded-xl font-semibold text-sm shadow-md shadow-orange/30 transition-all duration-200 hover:-translate-y-0.5"
                      : "bg-dark-light text-zinc-400 px-4 py-3 rounded-xl font-semibold text-sm border border-dark-light transition-all duration-200 hover:border-orange/50 hover:text-white"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={
                    filters.genres.includes(genre)
                      ? "bg-gradient-to-r from-orange to-orange-dark text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md shadow-orange/30 transition-all duration-200 hover:-translate-y-0.5"
                      : "bg-dark-light text-zinc-400 px-4 py-2 rounded-2xl text-sm font-semibold border border-dark-light transition-all duration-200 hover:border-orange/50 hover:text-white"
                  }
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Year</h3>
            <select
              value={filters.year}
              onChange={(e) => dispatch(setFilters({ year: e.target.value }))}
              className="w-full bg-dark-light text-white px-4 py-3 rounded-xl border-2 border-dark-light focus:border-orange outline-none font-medium transition-colors duration-200"
            >
              <option value="">All Years</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleClearFilters} className="btn-primary w-full">
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}

export default FilterPanel;
