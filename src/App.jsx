import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const closeGame = () => {
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span className="text-indigo-500">ARCADE</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Popular</a>
            <a href="#" className="hover:text-white transition-colors">New</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hero Section (if no search/filter) */}
        {!searchQuery && activeCategory === 'All' && (
          <div className="mb-12 relative rounded-3xl overflow-hidden aspect-[21/9] group">
            <img 
              src="https://picsum.photos/seed/gaming/1200/600" 
              alt="Featured" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase mb-2">Featured Game</span>
              <h2 className="text-4xl md:text-5xl font-black mb-4">2048 CLASSIC</h2>
              <button 
                onClick={() => handleGameClick(gamesData[0])}
                className="w-fit bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
              >
                Play Now
              </button>
            </div>
          </div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => handleGameClick(game)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/5 mb-3">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Gamepad2 className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-white/10">
                    {game.category}
                  </div>
                </div>
                <h3 className="font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors truncate">
                  {game.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-1">{game.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-300">No games found</h3>
            <p className="text-zinc-500">Try adjusting your search or category filters</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0c]"
          >
            {/* Modal Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <button
                onClick={closeGame}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Arcade</span>
              </button>
              
              <div className="flex flex-col items-center">
                <h2 className="font-bold text-white leading-none mb-1">{selectedGame.title}</h2>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{selectedGame.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  title="Open in new tab"
                  onClick={() => window.open(selectedGame.url, '_blank')}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button 
                  onClick={closeGame}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Game Frame */}
            <div className="flex-1 relative bg-black">
              <iframe
                src={selectedGame.url}
                className="w-full h-full border-none"
                title={selectedGame.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer / Info */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                  <img src={selectedGame.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400 max-w-md line-clamp-1">
                    {selectedGame.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span>Powered by Unblocked Arcade</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight">UNBLOCKED ARCADE</span>
            </div>
            <p className="text-zinc-500 text-sm text-center md:text-left max-w-xs">
              The ultimate destination for high-quality, unblocked web games. Play anywhere, anytime.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Arcade</h4>
              <a href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Popular Games</a>
              <a href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">New Releases</a>
              <a href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Categories</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Support</h4>
              <a href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Terms of Use</a>
              <a href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-zinc-600 text-xs">
          © 2024 Unblocked Arcade. All rights reserved. All games are property of their respective owners.
        </div>
      </footer>
    </div>
  );
}
