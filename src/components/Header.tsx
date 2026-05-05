import { useState, useEffect } from 'react';
import { Clock as ClockIcon, Layers } from 'lucide-react';

interface HeaderProps {
  totalApps: number;
}

export default function Header({ totalApps }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/5 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
          <Layers className="w-5 h-5 text-accent-blue" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-mono font-bold tracking-widest text-accent-blue leading-none">WAREHOUSE v1.0</span>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter leading-none mt-1">Personal System Vault</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-white/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-3 h-3" />
          {time.toLocaleTimeString([], { hour12: false })}
        </div>
        <div className="flex items-center gap-2">
          Total Nodes: <span className="text-white">{totalApps}</span>
        </div>
      </div>

      <div className="md:hidden flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-white/50 border border-white/10 rounded-full px-3 py-1 bg-white/5">
           <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
           {totalApps} Apps
        </div>
      </div>
    </header>
  );
}
