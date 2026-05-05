import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Gamepad2, Wrench, FlaskConical, ArrowUpRight } from 'lucide-react';
import { Project, Category } from '../types';

interface TileProps {
  project: Project;
  index: number;
  key?: React.Key;
  isLoading?: boolean;
}

const categoryIcons: Record<Category, any> = {
  'Entertainment & Games': Gamepad2,
  'Utility & Web Tools': Wrench,
  'Lab & Experiments': FlaskConical,
};

export default function Tile({ project, index, isLoading }: TileProps) {
  if (isLoading) {
    const sizeClass = {
      small: 'tile-small',
      medium: 'tile-medium',
      large: 'tile-large',
    }[project.size || 'small'];

    return (
      <div className={`${sizeClass} relative rounded-[1.5rem] glass border border-white/5 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        <div className="p-6 h-full flex flex-col gap-4 opacity-50">
          <div className="w-12 h-12 rounded-2xl bg-white/5 animate-pulse" />
          <div className="mt-auto flex flex-col gap-2">
            <div className="w-1/3 h-3 bg-white/5 rounded-full animate-pulse" />
            <div className="w-3/4 h-6 bg-white/5 rounded-lg animate-pulse" />
            <div className="w-full h-12 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[project.category] || Wrench;
  
  const sizeClass = {
    small: 'tile-small',
    medium: 'tile-medium',
    large: 'tile-large',
  }[project.size || 'small'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: index * 0.05,
        type: 'spring',
        stiffness: 260,
        damping: 20 
      }}
      className={`${sizeClass} relative group p-6 rounded-[1.5rem] glass border border-white/5 overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer`}
      onClick={() => window.open(project.link, '_blank')}
    >
      {/* Background Image/Accent */}
      {project.imageUrl ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/80 to-transparent" />
        </div>
      ) : (
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:opacity-20 pointer-events-none">
          <Icon className="w-24 h-24 rotate-[-15deg]" />
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-blue/20 group-hover:border-accent-blue/30 transition-colors">
            <Icon className="w-6 h-6 text-white group-hover:text-accent-blue transition-colors" />
          </div>
          <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
              {project.category}
            </span>
          </div>
          
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
            {project.title}
          </h3>
          
          <p className="text-sm text-white/40 line-clamp-2 mb-4 group-hover:text-white/60 transition-colors">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.techStack.slice(0, 3).map(tech => (
              <span key={tech} className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[9px] font-mono text-white/40 group-hover:border-accent-blue/20 group-hover:text-white/60 transition-colors">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[9px] font-mono text-white/40">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle Glow Effect On Active/Hover */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}
