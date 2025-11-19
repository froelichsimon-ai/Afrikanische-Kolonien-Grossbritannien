
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AfricaMap from './components/AfricaMap';
import InfoPanel from './components/InfoPanel';
import QuizModal from './components/QuizModal';
import { ColonyData, QuizQuestion } from './types';
import { fetchColonyDetails, fetchQuizQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [colonyData, setColonyData] = useState<ColonyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const handleCountrySelect = useCallback(async (countryName: string) => {
    if (countryName === selectedCountry) return;
    
    setSelectedCountry(countryName);
    setLoading(true);
    setError(null);
    setColonyData(null);

    try {
      const data = await fetchColonyDetails(countryName);
      setColonyData(data);
    } catch (err: any) {
      setError("Daten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  const handleStartQuiz = useCallback(async () => {
    setIsQuizOpen(true);
    // Only fetch if we haven't already to save tokens/time, 
    // or we could fetch every time for new questions. Let's fetch every time for variety.
    setLoadingQuiz(true);
    setQuizQuestions([]); 
    
    try {
        const questions = await fetchQuizQuestions();
        setQuizQuestions(questions);
    } catch (e) {
        console.error("Failed to load quiz", e);
    } finally {
        setLoadingQuiz(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-slate-800 font-sans">
      <Header onStartQuiz={handleStartQuiz} />

      <main className="flex-grow flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Side: Map */}
        <section className="w-full lg:w-3/5 p-4 lg:p-8 flex flex-col h-[50vh] lg:h-full">
          <div className="flex-grow relative w-full h-full">
             <AfricaMap 
               onSelectCountry={handleCountrySelect} 
               selectedCountry={selectedCountry}
             />
          </div>
          <div className="mt-4 text-center text-sm text-slate-500 lg:hidden">
            Scrollen Sie nach unten für Details.
          </div>
        </section>

        {/* Right Side: Info Panel */}
        <aside className="w-full lg:w-2/5 h-[50vh] lg:h-full border-t lg:border-t-0 lg:border-l border-slate-200 shadow-2xl z-20 bg-white">
          <InfoPanel 
            data={colonyData} 
            loading={loading} 
            error={error} 
            selectedCountry={selectedCountry}
          />
        </aside>

      </main>
      
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        questions={quizQuestions}
        loading={loadingQuiz}
      />
    </div>
  );
};

export default App;
