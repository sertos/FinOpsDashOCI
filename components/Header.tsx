import React from 'react';
import { format } from 'date-fns';
import { CloudCog, Loader2, BookOpen, FileCheck } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  loading: boolean;
  onOpenGlossary?: () => void;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated, loading, onOpenGlossary }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200 px-6 py-3.5 flex flex-wrap justify-between items-center gap-4 transition-all shadow-xs">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 bg-sky-600 border border-sky-500 rounded-xl flex items-center justify-center shadow-sm text-white">
          <CloudCog className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">Enterprise FinOps</h1>
            <span className="bg-sky-50 text-sky-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-sky-200">FOCUS v1.0</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Oracle Cloud Infrastructure (OCI) Cost Governance</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onOpenGlossary && (
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-2xs hover:text-slate-900"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Diccionario FinOps</span>
          </button>
        )}

        <div className="text-right pl-3 border-l border-slate-200">
          {loading && (
            <div className="flex items-center text-sky-600">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-xs font-medium">Sincronizando...</span>
            </div>
          )}
          {lastUpdated && !loading && (
            <p className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sincronizado: {format(lastUpdated, 'MMM d, HH:mm:ss')}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
