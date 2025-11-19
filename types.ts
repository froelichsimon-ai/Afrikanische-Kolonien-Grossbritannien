export interface HistoricalEvent {
  year: string;
  description: string;
}

export interface ColonyData {
  name: string;
  germanName: string;
  modernName: string;
  period: string;
  administrationType: string;
  description: string;
  colonizationText: string;
  exportGoods: string[];
  importantEvents: HistoricalEvent[];
}

export interface QuizQuestion {
  relatedCountry: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface GeoJsonFeature {
  type: "Feature";
  properties: {
    name: string;
    iso_a2?: string;
    iso_a3?: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

export interface GeoJsonCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}