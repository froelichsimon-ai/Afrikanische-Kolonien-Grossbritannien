
import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, HelpCircle, Trophy, X, Minus, PlayCircle, Frown } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  loading: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, questions, loading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // New State for "Pausing/Minimizing" the quiz
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowResults(false);
      setIsMinimized(false);
      onClose();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // If Minimized, show a floating button/bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
        <button 
          onClick={toggleMinimize}
          className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 border-2 border-amber-500/50 transition-all transform hover:scale-105"
        >
          <div className="relative">
            <PlayCircle className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold leading-none">Quiz pausiert</span>
            <span className="text-xs text-slate-400">Klicken zum Fortsetzen</span>
          </div>
        </button>
      </div>
    );
  }

  // Helper to render results with pass/fail logic
  const renderResults = () => {
    const threshold = Math.ceil(questions.length * (2 / 3));
    const isPassed = score >= threshold;

    return (
      <div className="text-center py-6">
        <div className={`inline-block p-4 rounded-full mb-4 ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
          {isPassed ? (
            <Trophy className="w-10 h-10 text-green-600" />
          ) : (
            <Frown className="w-10 h-10 text-red-600" />
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">
          {isPassed ? "Herzlichen Glückwunsch!" : "Das hat leider nicht gereicht. Viel Erfolg beim nächsten Mal!"}
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          {isPassed 
            ? "Du hast das Quiz erfolgreich gemeistert." 
            : "Du benötigst zwei Drittel der Punkte, um zu bestehen."}
        </p>
        
        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200 w-full max-w-xs mx-auto">
            <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                <span className="text-slate-600 text-xs font-bold uppercase">Dein Ergebnis</span>
                <span className="text-slate-600 text-xs font-bold uppercase">Benötigt</span>
            </div>
            <div className="flex justify-between items-center">
                 <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{score}</span>
                    <span className="text-slate-400 text-sm">/ {questions.length}</span>
                 </div>
                 <div className="text-slate-500 font-semibold">
                    {threshold}
                 </div>
            </div>
        </div>

        <button 
          onClick={resetQuiz}
          className={`px-6 py-2.5 text-white font-bold rounded-lg transition-colors w-full shadow-md ${isPassed ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700 hover:bg-slate-800'}`}
        >
          {isPassed ? "Schließen" : "Nochmal versuchen"}
        </button>
      </div>
    );
  };

  // Expanded View (Non-blocking overlay)
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-end sm:items-center justify-center sm:justify-end p-4">
      {/* We removed the background blur/black overlay so the map is clickable */}
      
      <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col border border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-300 sm:mr-4">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold serif">Wissens-Quiz</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMinimize} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
              title="Quiz pausieren & Karte nutzen"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-red-900/50 hover:text-red-300 rounded text-slate-400 transition-colors"
              title="Quiz beenden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-grow overflow-y-auto bg-[#fdfbf7]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-800 rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium animate-pulse text-sm">Erstelle Fragen für alle Kolonien...</p>
            </div>
          ) : showResults ? (
            renderResults()
          ) : questions.length > 0 ? (
            <div>
              {/* Progress Bar & Header Info */}
              <div className="mb-4 flex justify-between items-end border-b border-slate-200 pb-2">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Frage {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    {questions[currentQuestionIndex].relatedCountry && (
                         <span className="text-xs font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                            Thema: {questions[currentQuestionIndex].relatedCountry}
                        </span>
                    )}
                </div>
                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    Punkte: {score}
                </span>
              </div>
              
              <h3 className="text-base font-bold text-slate-800 mb-4 leading-relaxed">
                {questions[currentQuestionIndex].question}
              </h3>

              <div className="space-y-2">
                {questions[currentQuestionIndex].options.map((option, idx) => {
                  let optionClass = "w-full text-left p-3 rounded-lg border transition-all relative text-sm ";
                  
                  if (isAnswered) {
                    if (idx === questions[currentQuestionIndex].correctAnswerIndex) {
                        optionClass += "bg-green-100 border-green-500 text-green-900 font-medium";
                    } else if (idx === selectedOption) {
                        optionClass += "bg-red-100 border-red-500 text-red-900";
                    } else {
                        optionClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                    }
                  } else {
                    optionClass += "bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:shadow-md active:scale-[0.98]";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={isAnswered}
                      className={optionClass}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{option}</span>
                        {isAnswered && idx === questions[currentQuestionIndex].correctAnswerIndex && (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                        {isAnswered && idx === selectedOption && idx !== questions[currentQuestionIndex].correctAnswerIndex && (
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered ? (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 mb-3 text-xs text-slate-700">
                        <span className="font-bold text-slate-900 block mb-1">Erklärung:</span>
                        {questions[currentQuestionIndex].explanation}
                    </div>
                    <button 
                        onClick={handleNext}
                        className="w-full py-2.5 bg-red-800 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg transition-transform active:scale-[0.98] text-sm"
                    >
                        {currentQuestionIndex < questions.length - 1 ? "Nächste Frage" : "Ergebnisse anzeigen"}
                    </button>
                </div>
              ) : (
                  <div className="mt-4 pt-2 border-t border-slate-100 text-center">
                      <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          Tipp: Minimiere das Quiz, um auf der Karte nachzuschauen!
                      </p>
                  </div>
              )}
            </div>
          ) : (
             <div className="text-center text-red-500">Keine Fragen verfügbar.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
