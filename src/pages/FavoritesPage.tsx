import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { IoMdArrowBack, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "../store/animeSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Anime } from "../types/anime";

function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.anime);

  const handleCardClick = (anime: Anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  // Removes an anime from favorites
  const handleRemoveFavorite = (e: React.MouseEvent, anime: Anime) => {
    e.stopPropagation();
    dispatch(toggleFavorite(anime));
  };

  useEffect(() => {
    AOS.init({
      easing: "ease-out",
      offset: 75,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [favorites]);

  return (
    <div className="relative z-10 mx-auto max-w-[1400px] p-8">
      <button onClick={() => navigate("/")} className="btn-secondary mb-6">
        <IoMdArrowBack className="text-xl" />
        Back to Search
      </button>

      <div className="py-8 text-center">
        <div data-aos="fade-down">
          <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-8xl">
            My <span className="text-orange">Favorites</span>
          </h1>
          <p className="mb-4 text-lg font-medium text-zinc-300 md:text-3xl">Your Personal Anime Collection</p>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            All your favorited anime in one place. Build your watchlist and never forget a great series!
          </p>
        </div>
      </div>

      {favorites.length === 0 && (
        <div className="px-8 py-20 text-center">
          <div className="mb-6 text-8xl opacity-40">💔</div>
          <h2 className="mb-3 text-3xl font-bold text-white">No Favorites Yet</h2>
          <p className="mb-8 text-lg text-zinc-400">Start adding anime to your favorites to see them here</p>
          <button onClick={() => navigate("/search")} className="btn-primary">
            Browse Anime
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <>
          <div className="mb-8 text-center text-sm font-medium text-zinc-500">
            {favorites.length} {favorites.length === 1 ? "favorite" : "favorites"}
          </div>
          <div className="mb-12 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {favorites.map((anime) => (
              <div
                key={anime.mal_id}
                className="card group relative cursor-pointer overflow-hidden"
                onClick={() => handleCardClick(anime)}
              >
                <button
                  onClick={(e) => handleRemoveFavorite(e, anime)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-orange bg-dark/80 text-2xl text-orange backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-orange hover:text-white"
                >
                  <IoMdHeart />
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
        </>
      )}
    </div>
  );
}

export default FavoritesPage;
