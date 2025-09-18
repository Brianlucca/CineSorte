import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterSidebar from "./components/FilterSidebar";
import MovieDetails from "./components/MovieDetails";
import FilterRouletteView from "./views/FilterRouletteView";
import CustomListView from "./views/CustomListView";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Footer from "./components/Footer";

function App() {
  const [mode, setMode] = useState("filters");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [genres, setGenres] = useState([]);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [customList, setCustomList] = useState([]);
  const [customListError, setCustomListError] = useState("");

  const [activeView, setActiveView] = useState("main");
  const [detailsMovieId, setDetailsMovieId] = useState(null);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };
    fetchGenres();
  }, [apiKey]);

  const fetchMovies = async (filtersToUse) => {
    setIsSidebarOpen(false);
    setIsLoading(true);
    setError("");
    setMovies([]);
    setSelectedMovie(null);

    const baseParams = {
      api_key: apiKey,
      language: "pt-BR",
      sort_by: filtersToUse.sortBy,
      "vote_average.gte": filtersToUse.voteAverageGte,
      "with_runtime.gte": filtersToUse.runtimeGte,
      "with_runtime.lte": filtersToUse.runtimeLte,
      include_adult: false,
      with_watch_monetization_types: "flatrate",
      watch_region: "BR",
    };

    if (filtersToUse.genre) baseParams.with_genres = filtersToUse.genre;
    if (filtersToUse.releaseYear)
      baseParams.primary_release_year = filtersToUse.releaseYear;

    try {
      const pagePromises = [1, 2, 3, 4, 5].map((page) =>
        axios.get("https://api.themoviedb.org/3/discover/movie", {
          params: { ...baseParams, page },
        })
      );
      const responses = await Promise.all(pagePromises);
      const allResults = responses.flatMap((res) => res.data.results);
      const uniqueResults = Array.from(
        new Map(allResults.map((movie) => [movie.id, movie])).values()
      );
      const moviesWithPosters = uniqueResults.filter(
        (movie) => movie.poster_path && movie.overview
      );

      if (moviesWithPosters.length === 0) {
        setError("Nenhum filme encontrado com esta combinação de filtros.");
      } else {
        setMovies(moviesWithPosters);
      }
    } catch (err) {
      setError("Falha ao buscar filmes.");
    } finally {
      setIsLoading(false);
    }
  };

  const addMovieToList = (movie) => {
    setCustomListError("");
    if (customList.length >= 10) {
      setCustomListError("Você pode adicionar no máximo 10 filmes.");
      return;
    }
    if (customList.some((item) => item.id === movie.id)) {
      setCustomListError("Este filme já está na sua lista.");
      return;
    }
    setCustomList((prevList) => [...prevList, movie]);
  };

  const removeMovieFromList = (movieId) => {
    setCustomList((prevList) =>
      prevList.filter((movie) => movie.id !== movieId)
    );
  };

  const handleShowDetails = (movieId) => {
    setDetailsMovieId(movieId);
    setActiveView("details");
  };

  const handleBackToMain = () => {
    setDetailsMovieId(null);
    setActiveView("main");
  };

  const sidebarContent = (
    <FilterSidebar
      onApplyFilters={fetchMovies}
      genresList={genres}
      closeSidebar={() => setIsSidebarOpen(false)}
    />
  );

  if (activeView === "details") {
    return (
      <div className="bg-slate-900 min-h-screen p-4 sm:p-8 md:p-12 flex items-center justify-center">
        <MovieDetails movieId={detailsMovieId} onBack={handleBackToMain} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans">
      <div
        className={
          mode === "filters" ? "md:grid md:grid-cols-4 lg:grid-cols-5" : ""
        }
      >
        {mode === "filters" && (
          <>
            <aside className="hidden md:block md:col-span-1 md:h-screen md:sticky md:top-0 p-6 bg-slate-950/70 backdrop-blur-sm border-r border-slate-800 overflow-y-auto">
              {sidebarContent}
            </aside>
            <div
              className={`fixed top-0 left-0 z-40 w-full h-full bg-black/50 transition-opacity md:hidden ${
                isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside
              className={`fixed top-0 left-0 z-50 w-4/5 max-w-sm h-full p-6 bg-slate-900 border-r border-slate-800 overflow-y-auto transition-transform md:hidden ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {sidebarContent}
            </aside>
          </>
        )}

        <main
          className={`p-4 sm:p-8 md:p-12 ${
            mode === "filters" ? "md:col-span-3 lg:col-span-4" : "col-span-full"
          }`}
        >
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white tracking-tighter">
              Cine<span className="text-cyan-400">sorte</span>
            </h1>
            <p className="text-slate-400 mt-2">
              Sua busca pelo filme perfeito termina aqui.
            </p>
          </header>

          {mode === "filters" && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden fixed top-4 left-4 z-30 p-2 bg-slate-800/80 rounded-md backdrop-blur-sm"
            >
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
          )}

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setMode("filters")}
              className={`px-6 py-2 font-bold rounded-full transition-colors ${
                mode === "filters"
                  ? "bg-cyan-500 text-slate-900"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Roleta com Filtros
            </button>
            <button
              onClick={() => setMode("customList")}
              className={`px-6 py-2 font-bold rounded-full transition-colors ${
                mode === "customList"
                  ? "bg-cyan-500 text-slate-900"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              Minha Lista
            </button>
          </div>

          {mode === "filters" ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <FilterRouletteView
                genres={genres}
                movies={movies}
                isLoading={isLoading}
                error={error}
                setError={setError}
                selectedMovie={selectedMovie}
                setSelectedMovie={setSelectedMovie}
                onShowDetails={handleShowDetails}
              />
            </div>
          ) : (
            <CustomListView
              onShowDetails={handleShowDetails}
              customList={customList}
              onAddMovie={addMovieToList}
              onRemoveMovie={removeMovieFromList}
              error={customListError}
              setError={setCustomListError}
            />
          )}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
