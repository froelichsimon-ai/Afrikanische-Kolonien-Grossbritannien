
import React from 'react';
import { ColonyData } from '../types';
import { Scroll, Clock, Gavel, Calendar, Ship, Sword } from 'lucide-react';

interface InfoPanelProps {
  data: ColonyData | null;
  loading: boolean;
  error: string | null;
  selectedCountry: string | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, loading, error, selectedCountry }) => {
  if (!selectedCountry) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-l border-slate-200 bg-white/50 backdrop-blur-sm">
        <Scroll className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-xl font-semibold mb-2 serif text-slate-600">Willkommen</h3>
        <p>Wählen Sie ein rot markiertes Land auf der Karte aus, um die koloniale Geschichte zu erkunden.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border-l border-slate-200 bg-white">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-800 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 animate-pulse">Lade historische Daten...</p>
        <p className="text-xs text-slate-400 mt-2">Gemini AI analysiert die Archive...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border-l border-slate-200 bg-red-50 text-red-800">
        <p className="font-bold mb-2">Ein Fehler ist aufgetreten.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-white border-l border-slate-200 shadow-xl">
      {/* Header Image Placeholder/Style */}
      <div className="bg-slate-800 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h2 className="text-3xl font-bold serif mb-1 relative z-10">{data.name}</h2>
        <p className="text-red-300 text-sm font-medium uppercase tracking-widest mb-4 relative z-10">{data.modernName}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-red-200 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Zeitraum</span>
            </div>
            <p className="text-sm font-semibold">{data.period}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-red-200 mb-1">
              <Gavel className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Verwaltung</span>
            </div>
            <p className="text-sm font-semibold truncate" title={data.administrationType}>{data.administrationType}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Description */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3 serif flex items-center gap-2">
            <span className="w-1 h-6 bg-red-800 rounded-full"></span>
            Überblick
          </h3>
          <p className="text-slate-700 leading-relaxed text-justify">
            {data.description}
          </p>
        </section>

         {/* Colonization Process */}
         {data.colonizationText && (
          <section className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase flex items-center gap-2">
              <Sword className="w-4 h-4 text-slate-600" />
              Kolonialisierungsprozess
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed text-justify">
              {data.colonizationText}
            </p>
          </section>
        )}

        {/* Export Goods */}
        {data.exportGoods && data.exportGoods.length > 0 && (
          <section className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="text-sm font-bold text-amber-900 mb-3 uppercase flex items-center gap-2">
              <Ship className="w-4 h-4" />
              Wichtigste Exportgüter
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.exportGoods.map((good, idx) => (
                <span key={idx} className="bg-white text-amber-900 text-xs font-medium px-2.5 py-1 rounded border border-amber-200 shadow-sm">
                  {good}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        <section>
           <h3 className="text-lg font-bold text-slate-800 mb-4 serif flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-800" />
            Schlüsselereignisse
          </h3>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
            {data.importantEvents.map((event, idx) => (
              <div key={idx} className="relative pl-6 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-slate-200 border-2 border-white rounded-full group-hover:bg-red-500 transition-colors"></div>
                <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded mb-1 group-hover:bg-red-100 group-hover:text-red-800 transition-colors">
                  {event.year}
                </span>
                <p className="text-slate-700 text-sm leading-snug">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoPanel;
