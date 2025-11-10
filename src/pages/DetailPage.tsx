import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { IoMdArrowBack, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ShareButton from "../components/ShareButton";
import { clearSelectedAnime, fetchAnimeDetail, toggleFavorite } from "../store/animeSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAnime, detailLoading, error, favorites } = useAppSelector((state) => state.anime);

  const isFavorite = selectedAnime ? favorites.some((fav) => fav.mal_id === selectedAnime.mal_id) : false;

  const handleToggleFavorite = () => {
    if (selectedAnime) {
      dispatch(toggleFavorite(selectedAnime));
    }
  };

  useEffect(() => {
    AOS.init({
      easing: "ease-out",
      once: false,
    });

    // Validate that ID contains only digits
    if (id && /^\d+$/.test(id)) {
      dispatch(fetchAnimeDetail(parseInt(id, 10)));
    } else if (id) {
      // Invalid ID format - set error message
      dispatch(fetchAnimeDetail(-1));
    }

    return () => {
      dispatch(clearSelectedAnime());
    };
  }, [id, dispatch]);

  if (detailLoading) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-6 text-8xl opacity-40">⚠️</div>
          <h2 className="mb-3 text-3xl font-bold text-white">Something went wrong</h2>
          <p className="mb-8 text-lg text-zinc-400">{error}</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate("/")} className="btn-primary !inline-flex !items-center gap-2">
              <IoMdArrowBack className="text-xl" />
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedAnime) {
    return null;
  }

  return (
    <div className="relative z-10 mx-auto max-w-[1400px] p-8">
      <div className="mb-8">
        <button onClick={() => navigate("/")} className="btn-secondary !inline-flex !items-center gap-2">
          <IoMdArrowBack className="text-xl" />
          Back to Search
        </button>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
        <div className="flex flex-col gap-6" data-aos="fade-right">
          <div className="relative overflow-hidden rounded-3xl bg-dark shadow-xl shadow-black/30">
            <img
              src={selectedAnime.images.jpg.large_image_url}
              alt={selectedAnime.title}
              className="h-auto w-full object-cover"
            />
          </div>
          {selectedAnime.trailer.youtube_id && (
            <a
              href={selectedAnime.trailer.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-trailer"
            >
              ▶ Watch Trailer
            </a>
          )}
        </div>

        <div data-aos="fade-left">
          <div className="mb-4 flex items-start gap-4">
            <h1 className="flex-1 text-5xl font-black leading-tight text-white">{selectedAnime.title}</h1>
          </div>

          {selectedAnime.title_english && selectedAnime.title_english !== selectedAnime.title && (
            <p className="mb-2 text-2xl font-semibold text-zinc-300">{selectedAnime.title_english}</p>
          )}

          {selectedAnime.title_japanese && <p className="mb-6 text-lg text-zinc-400">{selectedAnime.title_japanese}</p>}

          <div className="mb-8 flex items-center gap-3">
            <ShareButton title={selectedAnime.title} url={window.location.href} />
            <button
              onClick={handleToggleFavorite}
              className="flex h-12 w-12 min-w-[3rem] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-dark-light bg-dark-light text-2xl text-zinc-400 transition-all duration-200 hover:scale-110 hover:border-orange hover:bg-orange/20 hover:text-orange"
            >
              {isFavorite ? <IoMdHeart className="text-orange" /> : <IoMdHeartEmpty />}
            </button>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {selectedAnime.score && (
              <div className="card group flex flex-col items-center justify-center p-5 text-center">
                <span className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-400">Score</span>
                <span className="mb-1 text-3xl font-bold text-orange">⭐ {selectedAnime.score.toFixed(1)}</span>
                {selectedAnime.scored_by && (
                  <span className="text-xs font-medium text-zinc-500">
                    {selectedAnime.scored_by.toLocaleString()} users
                  </span>
                )}
              </div>
            )}

            {selectedAnime.rank && (
              <div className="card group flex flex-col items-center justify-center p-5 text-center">
                <span className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-400">Rank</span>
                <span className="text-2xl font-bold text-white">#{selectedAnime.rank}</span>
              </div>
            )}

            {selectedAnime.popularity && (
              <div className="card group flex flex-col items-center justify-center p-5 text-center">
                <span className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-400">Popularity</span>
                <span className="text-2xl font-bold text-white">#{selectedAnime.popularity}</span>
              </div>
            )}

            {selectedAnime.members && (
              <div className="card group flex flex-col items-center justify-center p-5 text-center">
                <span className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-400">Members</span>
                <span className="text-2xl font-bold text-white">{selectedAnime.members.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="glass-card mb-8 rounded-3xl border border-dark-light p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {selectedAnime.type && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Type:</span>
                  <span className="font-bold text-white">{selectedAnime.type}</span>
                </div>
              )}

              {selectedAnime.episodes && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Episodes:</span>
                  <span className="font-bold text-white">{selectedAnime.episodes}</span>
                </div>
              )}

              {selectedAnime.status && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Status:</span>
                  <span className="font-bold text-white">{selectedAnime.status}</span>
                </div>
              )}

              {selectedAnime.aired.string && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Aired:</span>
                  <span className="text-right font-bold text-white">{selectedAnime.aired.string}</span>
                </div>
              )}

              {selectedAnime.season && selectedAnime.year && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Season:</span>
                  <span className="font-bold text-white">
                    {selectedAnime.season.charAt(0).toUpperCase() + selectedAnime.season.slice(1)} {selectedAnime.year}
                  </span>
                </div>
              )}

              {selectedAnime.duration && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Duration:</span>
                  <span className="font-bold text-white">{selectedAnime.duration}</span>
                </div>
              )}

              {selectedAnime.rating && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Rating:</span>
                  <span className="text-right font-bold text-white">{selectedAnime.rating}</span>
                </div>
              )}

              {selectedAnime.source && (
                <div className="flex items-center justify-between border-b border-dark-light py-3">
                  <span className="font-semibold text-zinc-400">Source:</span>
                  <span className="font-bold text-white">{selectedAnime.source}</span>
                </div>
              )}
            </div>
          </div>

          {selectedAnime.synopsis && (
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-white">Synopsis</h3>
              <p className="text-base leading-relaxed text-zinc-300">{selectedAnime.synopsis}</p>
            </div>
          )}

          {selectedAnime.background && (
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-white">Background</h3>
              <p className="text-base leading-relaxed text-zinc-300">{selectedAnime.background}</p>
            </div>
          )}

          {selectedAnime.genres.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-white">Genres</h3>
              <div className="flex flex-wrap gap-3">
                {selectedAnime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="rounded-2xl bg-gradient-to-r from-orange to-orange-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange/30 transition-transform duration-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedAnime.themes.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-white">Themes</h3>
              <div className="flex flex-wrap gap-3">
                {selectedAnime.themes.map((theme) => (
                  <span
                    key={theme.mal_id}
                    className="rounded-2xl border border-dark-light bg-dark-light px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                  >
                    {theme.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedAnime.demographics.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-white">Demographics</h3>
              <div className="flex flex-wrap gap-3">
                {selectedAnime.demographics.map((demo) => (
                  <span
                    key={demo.mal_id}
                    className="rounded-2xl border border-dark-light bg-dark-light px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                  >
                    {demo.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {(selectedAnime.studios.length > 0 || selectedAnime.producers.length > 0) && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {selectedAnime.studios.length > 0 && (
            <div className="glass-card rounded-3xl border border-dark-light p-8">
              <h3 className="mb-5 text-2xl font-bold text-white">Studios</h3>
              <div className="flex flex-wrap gap-3">
                {selectedAnime.studios.map((studio) => (
                  <span
                    key={studio.mal_id}
                    className="rounded-2xl border border-dark-light bg-dark-light px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all duration-200"
                  >
                    {studio.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedAnime.producers.length > 0 && (
            <div className="glass-card rounded-3xl border border-dark-light p-8">
              <h3 className="mb-5 text-2xl font-bold text-white">Producers</h3>
              <div className="flex flex-wrap gap-3">
                {selectedAnime.producers.map((producer) => (
                  <span
                    key={producer.mal_id}
                    className="rounded-2xl border border-dark-light bg-dark-light px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all duration-200"
                  >
                    {producer.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DetailPage;
