import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Tile from './components/Tile';
import SearchBar from './components/SearchBar';
import AdminPanel from './components/AdminPanel';
// Remove static data import once we use Firebase
// import { projects as staticProjects } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { projectService } from './services/projectService';
import { Project } from './types';
import { Settings } from 'lucide-react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // 1. Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error.message?.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    // 2. Subscribe to real-time updates
    const unsubscribe = projectService.subscribeToProjects((fetchedProjects) => {
      setProjects(fetchedProjects);
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const featuredProjects = useMemo(() => {
    const featured = projects.filter(p => p.isFeatured);
    return featured.length > 0 ? featured : projects.slice(0, 3);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const query = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack.some(tech => tech.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col selection:bg-accent-blue/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <Header totalApps={projects.length} />

      <main className="flex-grow flex flex-col relative z-10 pb-24">
        {/* Only show Hero when not searching */}
        {!searchQuery && (
          <Hero 
            projects={featuredProjects} 
            isLoading={isInitializing}
          />
        )}

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <section className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold tracking-tight">
              {searchQuery ? `SEARCH RESULTS (${filteredProjects.length})` : 'SYSTEM REPOSITORY'}
            </h2>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/30 font-mono">
              <span className="hidden sm:inline">SORT: RECENT_FIRST</span>
              <span className="hidden sm:inline">VIEW: BENTO_GRID</span>
            </div>
          </div>

          <div className="bento-grid">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <Tile 
                  key={project.id} 
                  project={project} 
                  index={index} 
                  isLoading={isInitializing}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <span className="text-2xl">?</span>
              </div>
              <h3 className="text-lg font-medium text-white/60 mb-2">Node Not Found</h3>
              <p className="text-sm text-white/30 max-w-xs font-mono uppercase tracking-tighter">
                The requested query returned zero matches in the local warehouse index.
              </p>
            </motion.div>
          )}
        </section>
      </main>

      <footer className="w-full py-12 px-6 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs font-mono font-bold tracking-[0.3em] text-accent-blue uppercase mb-2">WAREHOUSE v1.0</span>
            <p className="text-[10px] font-mono text-white/20 uppercase max-w-xs text-center md:text-left">
              &copy; 2026 Personal Vault Infrastructure. All Rights Reserved. Systems fully operational.
            </p>
          </div>
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest text-white/40 items-center">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 hover:text-accent-blue transition-colors group"
            >
              <Settings className="w-3 h-3 group-hover:rotate-90 transition-transform" />
              SYSTEM_ADMIN
            </button>
            <a href="#" className="hover:text-accent-blue transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent-blue transition-colors">Nodes</a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            isOpen={isAdminOpen} 
            onClose={() => setIsAdminOpen(false)} 
            projects={projects}
          />
        )}
      </AnimatePresence>

      {/* Floating Admin Button for Authenticated Admins */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-8 right-8 z-[80] w-14 h-14 bg-accent-blue rounded-full shadow-2xl flex items-center justify-center text-white md:hidden"
      >
        <Settings className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
