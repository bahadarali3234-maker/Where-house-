import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Rocket, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface HeroProps {
  projects: Project[];
  isLoading?: boolean;
}

export default function Hero({ projects, isLoading }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (isLoading || projects.length <= 1) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [isLoading, projects.length, nextSlide]);

  if (isLoading) {
    return (
      <section className="relative w-full max-w-7xl mx-auto px-6 py-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-carbon-900/50 h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 gap-12 h-full opacity-50">
            <div className="w-full md:w-1/2 aspect-video rounded-2xl bg-white/5 animate-pulse" />
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="w-32 h-6 bg-white/5 rounded-full animate-pulse" />
              <div className="w-3/4 h-12 bg-white/5 rounded-lg animate-pulse" />
              <div className="w-full h-24 bg-white/5 rounded-lg animate-pulse" />
              <div className="flex gap-4">
                <div className="w-40 h-14 bg-white/5 rounded-xl animate-pulse" />
                <div className="w-40 h-14 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  const project = projects[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12">
      <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-carbon-900 shadow-2xl min-h-[500px]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-blue/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div 
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 gap-12"
          >
            {/* Icon/Image Placeholder */}
            <div className="w-full md:w-1/2 aspect-video rounded-2xl glass-darker relative overflow-hidden group-hover:border-white/20 transition-colors">
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative">
                      <div className="absolute inset-0 blur-3xl bg-accent-blue/40 animate-pulse" />
                      <Rocket className="w-20 h-20 text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                   </div>
                </div>
              )}
              
              {/* Minimal overlays */}
              <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
                Featured Build
              </div>
              <div className="absolute bottom-4 right-4 flex gap-1">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[9px] font-mono text-white/60">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-medium w-fit mb-6">
                <Sparkles className="w-3 h-3" />
                Latest Release
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-white hover:to-white/60 transition-all duration-300">
                {project.title}
              </h1>
              <p className="text-lg text-white/50 mb-8 leading-relaxed max-w-xl">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={project.link}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl bg-white text-black font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors"
                >
                  Launch System
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl glass border border-white/10 font-semibold hover:bg-white/5 transition-colors"
                >
                  View Repository
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {projects.length > 1 && (
          <>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-8 bg-accent-blue' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
