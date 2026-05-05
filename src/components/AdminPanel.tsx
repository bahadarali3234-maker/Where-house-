import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Trash2, Edit3, Save, 
  ShieldCheck, AlertCircle
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { Project, Category } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

export default function AdminPanel({ isOpen, onClose, projects }: AdminPanelProps) {
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === '0000') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    setIsSaving(true);
    setError(null);

    try {
      if (editingProject.id) {
        await projectService.updateProject(editingProject.id, editingProject);
      } else {
        await projectService.addProject(editingProject as Omit<Project, 'id'>);
      }
      setEditingProject(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-4xl h-full max-h-[800px] glass-darker rounded-[2rem] border border-white/10 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-blue/20">
              <ShieldCheck className="w-5 h-5 text-accent-blue" />
            </div>
            <h2 className="text-xl font-bold tracking-tight uppercase font-mono">System Admin Control</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {!isAuthenticated ? (
            <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <ShieldCheck className="w-8 h-8 text-accent-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Access Restricted</h3>
              <p className="text-white/40 text-sm mb-8 font-mono uppercase tracking-tighter">Enter Auth Key to Access Terminal</p>
              
              <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
                <input 
                  autoFocus
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••"
                  className={`w-full bg-white/5 border ${passwordError ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all`}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs font-mono uppercase">Invalid Security Key. Access Denied.</p>
                )}
                <button 
                  type="submit"
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  Verify Identity
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Toolbar */}
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-xs uppercase tracking-widest text-white/40">Active Deployments ({projects.length})</h3>
                <button 
                  onClick={() => setEditingProject({ 
                    title: '', description: '', category: 'Utility & Web Tools', 
                    techStack: ['Web'], link: '', size: 'small', isFeatured: false 
                  })}
                  className="flex items-center gap-2 px-6 py-3 bg-accent-blue rounded-xl text-sm font-bold hover:bg-accent-blue/80 transition-all shadow-lg shadow-accent-blue/20"
                >
                  <Plus className="w-5 h-5" />
                  Upload
                </button>
              </div>
    
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}
    
              {/* Grid of Projects for Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="p-4 rounded-xl glass border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold flex items-center gap-2">
                        {p.title}
                        {p.isFeatured && <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" title="Featured" />}
                      </span>
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">{p.category}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingProject(p)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Overlay for Add/Edit */}
        <AnimatePresence>
          {editingProject && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-[110] glass-darker p-8 overflow-y-auto"
            >
              <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">{editingProject.id ? 'Edit System Node' : 'Initialize New Node'}</h3>
                  <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-white/10 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-white/40 pl-1 tracking-widest">Application Name</label>
                      <input 
                        required
                        value={editingProject.title}
                        onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                        placeholder="e.g., Cyber Racer 2099"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-white/40 pl-1 tracking-widest">Website Link (Destination URL)</label>
                      <input 
                        required
                        type="url"
                        value={editingProject.link}
                        onChange={e => setEditingProject({...editingProject, link: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-white/40 pl-1 tracking-widest">Operational Description</label>
                      <textarea 
                        required
                        value={editingProject.description}
                        onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                        placeholder="Briefly describe the system modules..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-24 focus:outline-none focus:ring-1 focus:ring-accent-blue resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-white/40 pl-1">Primary Sector</label>
                        <select 
                          value={editingProject.category}
                          onChange={e => setEditingProject({...editingProject, category: e.target.value as Category})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent-blue appearance-none"
                        >
                          <option value="Entertainment & Games">Entertainment & Games</option>
                          <option value="Utility & Web Tools">Utility & Web Tools</option>
                          <option value="Lab & Experiments">Lab & Experiments</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-white/40 pl-1">Grid Footprint</label>
                        <select 
                          value={editingProject.size}
                          onChange={e => setEditingProject({...editingProject, size: e.target.value as any})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent-blue appearance-none"
                        >
                          <option value="small">Small (1x1)</option>
                          <option value="medium">Medium (2x1)</option>
                          <option value="large">Large (2x2)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-white/40 pl-1">Cover Image (URL)</label>
                      <div className="flex gap-4">
                        <input 
                          type="url"
                          value={editingProject.imageUrl || ''}
                          onChange={e => setEditingProject({...editingProject, imageUrl: e.target.value})}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent-blue"
                        />
                        {editingProject.imageUrl && (
                          <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
                            <img 
                              src={editingProject.imageUrl} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-white/40 pl-1">Tech Stack (Comma Separated)</label>
                      <input 
                        value={editingProject.techStack?.join(', ')}
                        onChange={e => setEditingProject({...editingProject, techStack: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                        placeholder="React, Firebase, Tailwind..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={editingProject.isFeatured}
                        onChange={e => setEditingProject({...editingProject, isFeatured: e.target.checked})}
                        className="w-5 h-5 rounded bg-white/5 border border-white/10 checked:bg-accent-blue focus:ring-0"
                      />
                      <span className="text-sm text-white/60 group-hover:text-white transition-colors">Mark as Featured (Hero Section)</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-grow bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? 'Synchronizing...' : (
                        <>
                          <Save className="w-5 h-5" />
                          Publish Deployment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
