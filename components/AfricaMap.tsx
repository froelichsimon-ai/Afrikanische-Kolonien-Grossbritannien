
import React, { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { GeoJsonCollection, GeoJsonFeature } from '../types';
import { 
  BRITISH_COLONIES_MODERN_NAMES, 
  GEOJSON_URL, 
  MAP_COLOR_BASE, 
  MAP_COLOR_BRITISH, 
  MAP_COLOR_HOVER, 
  MAP_COLOR_SELECTED,
  COUNTRY_NAME_GERMAN 
} from '../constants';

interface AfricaMapProps {
  onSelectCountry: (countryName: string) => void;
  selectedCountry: string | null;
}

const AfricaMap: React.FC<AfricaMapProps> = ({ onSelectCountry, selectedCountry }) => {
  const [geoData, setGeoData] = useState<GeoJsonCollection | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load Map Data
  useEffect(() => {
    const fetchMap = async () => {
      try {
        setLoadingMap(true);
        setError(null);
        const res = await fetch(GEOJSON_URL);
        if (!res.ok) {
          throw new Error(`HTTP Status: ${res.status} (Datei nicht gefunden)`);
        }
        const data = await res.json();
        
        // Basic validation
        if (!data || !data.features) {
          throw new Error("Ungültiges Kartenformat erhalten");
        }
        
        setGeoData(data);
        setLoadingMap(false);
      } catch (e: any) {
        console.error("Failed to load map data", e);
        setError(e.message || "Verbindungsfehler");
        setLoadingMap(false);
      }
    };
    fetchMap();
  }, [retryCount]);

  // Projection Configuration with Safety Checks
  const { pathGenerator, projectionError } = useMemo(() => {
    if (!geoData) return { pathGenerator: null, projectionError: null };

    try {
      // Handle potential D3 import differences (default vs named exports)
      // This safely attempts to get the d3 object from various module structures
      const d3Instance = (d3 as any).default || d3;
      
      if (!d3Instance || !d3Instance.geoMercator || !d3Instance.geoPath) {
         throw new Error("D3 Bibliothek konnte nicht initialisiert werden");
      }

      const width = 600;
      const height = 650;
      
      // Create a projection fitted to the data
      const projection = d3Instance.geoMercator().fitSize([width, height], geoData as any);
      const pathGenerator = d3Instance.geoPath().projection(projection);

      return { pathGenerator, projectionError: null };
    } catch (e: any) {
      console.error("Projection Error", e);
      return { pathGenerator: null, projectionError: e.message };
    }
  }, [geoData]);

  // Loading State
  if (loadingMap) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-50 rounded-xl border border-slate-200 text-slate-400 animate-pulse">
         <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mb-4"></div>
         <span>Lade Karte...</span>
      </div>
    );
  }

  // Error State
  if (error || projectionError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-red-50 rounded-xl border border-red-200 text-red-800 p-6 text-center">
        <p className="font-bold mb-2">Karte konnte nicht geladen werden</p>
        <p className="text-sm font-mono bg-red-100 px-2 py-1 rounded mb-4">{error || projectionError}</p>
        <button 
          onClick={() => setRetryCount(c => c + 1)} 
          className="text-xs bg-white border border-red-200 hover:bg-red-100 px-3 py-2 rounded transition-colors cursor-pointer"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!geoData || !pathGenerator) {
    return <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400">Keine Daten verfügbar</div>;
  }

  // Check if a country was historically British
  const isBritish = (feature: GeoJsonFeature) => {
    // Helper to match loose names if exact match fails
    const name = feature.properties.name;
    if (BRITISH_COLONIES_MODERN_NAMES.includes(name)) return true;
    
    // Fallback: Check if any colony name is part of the feature name (e.g. "United Republic of Tanzania" contains "Tanzania")
    // This handles data discrepancies better
    return BRITISH_COLONIES_MODERN_NAMES.some(colony => name.includes(colony));
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-xl shadow-inner border border-slate-200 p-2 sm:p-4 relative overflow-hidden group">
       {/* Map Background Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
      
      <div className="relative z-10 w-full max-w-[600px]">
        <svg viewBox="0 0 600 650" className="w-full h-auto drop-shadow-xl">
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <g className="map-layer">
            {geoData.features.map((feature, i) => {
              const countryName = feature.properties.name;
              // Try to find a german name mapping, otherwise fallback to original
              const germanName = Object.entries(COUNTRY_NAME_GERMAN).find(([eng, ger]) => countryName.includes(eng))?.[1] || countryName;
              
              const isBrit = isBritish(feature);
              const isSelected = selectedCountry === countryName || (selectedCountry && countryName.includes(selectedCountry));
              const isHovered = hoveredCountry === countryName;

              let fill = MAP_COLOR_BASE;
              let stroke = "#cbd5e1";
              let zIndex = 1;

              if (isBrit) {
                fill = MAP_COLOR_BRITISH;
                stroke = "#fca5a5"; // Softer border for colonies
                zIndex = 10;
              } 
              
              if (isHovered && isBrit) {
                fill = MAP_COLOR_HOVER;
                stroke = "#fff";
              }
              
              if (isSelected) {
                fill = MAP_COLOR_SELECTED;
                stroke = "#fff";
              }

              // Dim non-British countries slightly to make British ones pop
              const opacity = isBrit ? 1 : 0.5;
              
              return (
                <path
                  key={`path-${i}`}
                  d={pathGenerator(feature as any) || ""}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSelected ? "2" : "1"}
                  fillOpacity={opacity}
                  className={`transition-all duration-300 ease-in-out focus:outline-none ${isBrit ? 'cursor-pointer hover:brightness-110' : ''}`}
                  style={{ position: 'relative', zIndex }}
                  onMouseEnter={() => isBrit && setHoveredCountry(countryName)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => {
                    if (isBrit) {
                      // Pass the exact name from our constant list if possible, or the map name
                      const canonicalName = BRITISH_COLONIES_MODERN_NAMES.find(n => countryName.includes(n)) || countryName;
                      onSelectCountry(canonicalName);
                    }
                  }}
                  aria-label={germanName}
                  aria-disabled={!isBrit}
                  role="button"
                >
                  <title>{germanName} {isBrit ? "(Britisch)" : ""}</title>
                </path>
              );
            })}
          </g>
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-lg text-xs text-slate-700 border border-slate-200 pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-red-300 border border-red-400"></span>
                <span className="font-medium">Britische Kolonie</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></span>
                <span>Andere</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AfricaMap;
