
import { GoogleGenAI, Type } from "@google/genai";
import { ColonyData, QuizQuestion } from "../types";
import { COLONIAL_NAME_MAPPING, BRITISH_COLONIES_MODERN_NAMES } from "../constants";

const getAiClient = () => {
  // Fix: Strictly follow guidelines to use process.env.API_KEY directly.
  // The build tool (Vite) replaces this with the actual key string.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchColonyDetails = async (modernCountryName: string): Promise<ColonyData> => {
  const ai = getAiClient();

  const colonialNameHint = COLONIAL_NAME_MAPPING[modernCountryName] 
    ? `(Historisch bekannt als ${COLONIAL_NAME_MAPPING[modernCountryName]})` 
    : "";

  const prompt = `
    Erstelle eine historische Zusammenfassung für das heutige ${modernCountryName} ${colonialNameHint} während seiner Zeit als britische Kolonie oder Protektorat in Afrika.
    
    Falls das Land nie eine britische Kolonie war, gib trotzdem Daten zurück, aber vermerke im Feld "administrationType" explizit "Keine britische Kolonie" und lass die anderen Felder leer oder allgemein.
    
    Bitte berücksichtige folgende Punkte:
    1. Allgemeine Beschreibung der Kolonialzeit.
    2. Der Prozess der Kolonialisierung: Wie kam das Gebiet unter britische Kontrolle? (z.B. Verträge, Kriege, Handelsgesellschaften).
    3. Die wichtigsten Rohstoffe oder Güter, die exportiert wurden.

    Die Antwort MUSS in validem JSON erfolgen, das dem folgenden Schema entspricht.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Der historische Name der Kolonie" },
            germanName: { type: Type.STRING, description: "Der deutsche Name des heutigen Landes" },
            modernName: { type: Type.STRING, description: "Der heutige Name des Landes" },
            period: { type: Type.STRING, description: "Zeitraum der britischen Herrschaft" },
            administrationType: { type: Type.STRING, description: "Art der Verwaltung" },
            description: { type: Type.STRING, description: "Allgemeine Zusammenfassung der Kolonialzeit (ca. 80 Wörter)." },
            colonizationText: { type: Type.STRING, description: "Beschreibung des Prozesses der Inbesitznahme/Kolonialisierung (ca. 80 Wörter)." },
            exportGoods: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Liste der 3-5 wichtigsten Exportgüter."
            },
            importantEvents: {
              type: Type.ARRAY,
              description: "3 bis 5 wichtigste historische Ereignisse.",
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          },
          required: ["name", "germanName", "modernName", "period", "administrationType", "description", "colonizationText", "exportGoods", "importantEvents"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    return JSON.parse(text) as ColonyData;

  } catch (error) {
    console.error("Error fetching colony data:", error);
    throw error;
  }
};

export const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  // Limit to first 10-12 colonies to ensure response fits token limits and isn't overwhelming, 
  // or take a random sample if we wanted. 
  // For "Exactly one question for each", we will pass the list.
  // To prevent token limits on smaller models, let's pick a subset or just try all.
  // Given the prompt size, ~20 items is fine for Gemini Flash.
  const countriesList = BRITISH_COLONIES_MODERN_NAMES.join(", ");

  const prompt = `
    Erstelle ein Quiz über die britischen Kolonien in Afrika.
    
    Ich benötige EXAKT EINE Frage für JEDES der folgenden Länder: ${countriesList}.
    
    Die Frage soll sich spezifisch auf die Kolonialgeschichte dieses Landes beziehen (z.B. Verwaltung, Exportgüter, Unabhängigkeit, historischer Name).
    
    Die Fragen sollen auf Deutsch sein.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              relatedCountry: { type: Type.STRING, description: "Der Name des Landes, auf das sich die Frage bezieht" },
              question: { type: Type.STRING, description: "Die Quizfrage" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 Antwortmöglichkeiten"
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Index der korrekten Antwort (0-3)" },
              explanation: { type: Type.STRING, description: "Kurze Erklärung, warum die Antwort richtig ist." }
            },
            required: ["relatedCountry", "question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No quiz generated");
    return JSON.parse(text) as QuizQuestion[];

  } catch (error) {
    console.error("Error fetching quiz:", error);
    // Fallback question if API fails or key is missing
    return [
      {
        relatedCountry: "Ghana",
        question: "Welches heutige Land war als 'Goldküste' bekannt?",
        options: ["Nigeria", "Ghana", "Kenia", "Sierra Leone"],
        correctAnswerIndex: 1,
        explanation: "Ghana war während der Kolonialzeit als Goldküste bekannt. (Hinweis: API Key fehlt oder Fehler aufgetreten)"
      }
    ];
  }
};