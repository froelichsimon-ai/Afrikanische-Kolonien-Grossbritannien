
import React from 'react';
import { Map as MapIcon, BrainCircuit } from 'lucide-react';

interface HeaderProps {
  onStartQuiz: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartQuiz }) => {
  return (
    <header className="bg-slate-900 text-amber-50 shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold serif tracking-wide hidden sm:block">Britische Kolonien in Afrika</h1>
             <h1 className="text-xl font-bold serif tracking-wide sm:hidden">Kolonien Afrika</h1>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Interaktive Historische Karte</p>
          </div>
        </div>
        
        <button 
          onClick={onStartQuiz}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg font-medium text-sm"
        >
          <BrainCircuit className="w-4 h-4" />
          <span className="hidden sm:inline">Quiz starten</span>
          <span className="sm:hidden">Quiz</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
