
// List of modern countries that were historically significant British colonies/protectorates in Afrika.
// Used for initial map highlighting.
export const BRITISH_COLONIES_MODERN_NAMES = [
  "Egypt", "Sudan", "South Sudan", "Kenya", "Uganda", "Tanzania", 
  "South Africa", "Lesotho", "Eswatini", "Botswana", "Zimbabwe", 
  "Zambia", "Malawi", "Nigeria", "Ghana", "Sierra Leone", "Gambia", 
  "Somalia", "Seychelles", "Mauritius"
];

// Corrected URL for the Africa GeoJSON
export const GEOJSON_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/africa.geojson";

export const MAP_COLOR_BASE = "#e2e8f0"; // Slate 200
export const MAP_COLOR_BRITISH = "#fca5a5"; // Red 300 (Traditional British Imperial Pink)
export const MAP_COLOR_HOVER = "#ef4444"; // Red 500
export const MAP_COLOR_SELECTED = "#991b1b"; // Red 800

// Helper to map modern country names to their likely colonial context for the prompt
export const COLONIAL_NAME_MAPPING: Record<string, string> = {
  "Zimbabwe": "Südrhodesien",
  "Zambia": "Nordrhodesien",
  "Malawi": "Njassaland",
  "Botswana": "Betschuanaland",
  "Lesotho": "Basutoland",
  "Eswatini": "Swasiland",
  "Tanzania": "Tanganjika/Sansibar",
  "Ghana": "Goldküste",
  "Somalia": "Britisch-Somaliland",
};

// Helper to map English GeoJSON names to German for display
export const COUNTRY_NAME_GERMAN: Record<string, string> = {
  "Egypt": "Ägypten",
  "Sudan": "Sudan",
  "South Sudan": "Südsudan",
  "Kenya": "Kenia",
  "Uganda": "Uganda",
  "Tanzania": "Tansania",
  "South Africa": "Südafrika",
  "Lesotho": "Lesotho",
  "Eswatini": "Eswatini",
  "Botswana": "Botswana",
  "Zimbabwe": "Simbabwe",
  "Zambia": "Sambia",
  "Malawi": "Malawi",
  "Nigeria": "Nigeria",
  "Ghana": "Ghana",
  "Sierra Leone": "Sierra Leone",
  "Gambia": "Gambia",
  "Somalia": "Somalia",
  "Seychelles": "Seychellen",
  "Mauritius": "Mauritius",
  "Ethiopia": "Äthiopien",
  "Eritrea": "Eritrea",
  "Djibouti": "Dschibuti",
  "Central African Republic": "Zentralafrikanische Republik",
  "Chad": "Tschad",
  "Niger": "Niger",
  "Cameroon": "Kamerun",
  "Libya": "Libyen",
  "Algeria": "Algerien",
  "Morocco": "Marokko",
  "Tunisia": "Tunesien",
  "Western Sahara": "Westsahara",
  "Mauritania": "Mauretanien",
  "Mali": "Mali",
  "Senegal": "Senegal",
  "Guinea": "Guinea",
  "Guinea-Bissau": "Guinea-Bissau",
  "Liberia": "Liberia",
  "Ivory Coast": "Elfenbeinküste",
  "Burkina Faso": "Burkina Faso",
  "Benin": "Benin",
  "Togo": "Togo",
  "Gabon": "Gabun",
  "Republic of Congo": "Republik Kongo",
  "Democratic Republic of the Congo": "Demokratische Republik Kongo",
  "Angola": "Angola",
  "Namibia": "Namibia",
  "Mozambique": "Mosambik",
  "Madagascar": "Madagaskar",
  "Rwanda": "Ruanda",
  "Burundi": "Burundi",
  "Equatorial Guinea": "Äquatorialguinea"
};
