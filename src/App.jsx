import React, { useState, useEffect } from 'react';
import FilterSidebar from './components/FilterSidebar';
import MovieDetails from './components/MovieDetails';
import FilterRouletteView from './views/FilterRouletteView';
import CustomListView from './views/CustomListView';
import AuthView from './views/AuthView';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAuth } from './context/AuthContext';
import { getGenres } from './services/api';

function App() {
  const [mode, setMode] = useState('filters');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [genres, setGenres] = useState({ movie: [], tv: [] });
  const [mediaType, setMediaType] = useState('movie');
  const [filters, setFilters] = useState({
    sortBy: 'popularity.desc',
    genre: '',
    releaseYear: '',
    voteAverageGte: 7,
    runtimeLte: 180,
    excludeAnimation: true,
    keywords: [],
  });
  
  const [activeView, setActiveView] = useState('main');
  const [detailsItem, setDetailsItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const maxRetries = 5;
    let attempt = 1;

    const fetchInitialData = async () => {
      try {
        const movieGenres = await getGenres('movie');
        const tvGenres = await getGenres('tv');
        setGenres({ movie: movieGenres, tv: tvGenres });
        setIsLoading(false);
        setError(null);
      } catch (error) {
        if (attempt < maxRetries) {
          attempt++;
          setTimeout(fetchInitialData, 3000);
        } else {
          setError("Não foi possível conectar ao servidor. Tente atualizar a página em alguns instantes.");
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();
  }, []);

  const handleShowDetails = (itemId, type) => {
    setDetailsItem({ id: itemId, type: type });
    setActiveView('details');
  };

  const handleBackToMain = () => {
    setDetailsItem(null);
    setActiveView('main');
  };

  const sidebarContent = <FilterSidebar onFilterChange={setFilters} initialFilters={filters} genres={genres[mediaType]} closeSidebar={() => setIsSidebarOpen(false)} onMediaTypeChange={setMediaType} mediaType={mediaType} />;

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center text-amber-500 p-4">
        <div className="bg-amber-950/50 px-8 py-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Ops! Algo deu errado.</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (activeView === 'details') {
    return (
      <div className="bg-slate-900 min-h-screen p-4 sm:p-8 md:p-12 flex items-center justify-center">
        <MovieDetails movieDetails={detailsItem} onBack={handleBackToMain} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans">
      <div className="relative md:flex">
        {mode === 'filters' && (
          <>
            <aside className="hidden md:block flex-shrink-0 md:w-80 lg:w-96 md:h-screen md:sticky md:top-0 p-6 bg-slate-950/70 backdrop-blur-sm border-r border-slate-800 overflow-y-auto">
              {sidebarContent}
            </aside>
            <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`fixed top-0 left-0 z-50 w-4/5 max-w-sm h-full p-6 bg-slate-900 border-r border-slate-800 overflow-y-auto transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>{sidebarContent}</aside>
          </>
        )}
        
        <main className="flex-grow p-4 sm:p-8 md:p-12">
          {currentUser && (
            <div className="absolute top-4 right-4 z-30 flex items-center gap-4">
              <span className="text-sm text-slate-300 hidden sm:block">
                Olá, <span className="font-bold text-white">{currentUser.name || currentUser.email}</span>
              </span>
              <button onClick={logout} className="flex items-center gap-2 text-sm bg-slate-800/80 px-3 py-2 rounded-md backdrop-blur-sm hover:bg-slate-700">
                <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                Sair
              </button>
            </div>
          )}

          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">Cine<span className="text-cyan-400">sorte</span></h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">Sua busca pelo filme ou série perfeita termina aqui.</p>
          </header>

          {mode === 'filters' && (<button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-4 left-4 z-30 p-2 bg-slate-800/80 rounded-md backdrop-blur-sm"><Bars3Icon className="h-6 w-6 text-white"/></button>)}

          <div className="flex justify-center gap-2 md:gap-4 mb-8">
            <button onClick={() => setMode('filters')} className={`px-4 py-2 md:px-6 font-bold rounded-full transition-colors text-sm md:text-base ${mode === 'filters' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}>Roleta com Filtros</button>
            <button onClick={() => setMode('customList')} className={`px-4 py-2 md:px-6 font-bold rounded-full transition-colors text-sm md:text-base ${mode === 'customList' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}>Minha Lista</button>
          </div>

          <div className="pb-24">
            {mode === 'filters' ? (
              <FilterRouletteView genres={genres[mediaType]} onShowDetails={handleShowDetails} mediaType={mediaType} filters={filters} />
            ) : (
              currentUser ? <CustomListView onShowDetails={handleShowDetails} /> : <AuthView />
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
