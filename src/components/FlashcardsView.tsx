import React, { useState } from 'react';
import { 
  Layers, 
  RotateCw, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Trophy, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { StudyMaterial, Flashcard, Language } from '../types';
import { translations } from '../lib/translations';

interface FlashcardsViewProps {
  materials: StudyMaterial[];
  language: Language;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  materials,
  language
}) => {
  const t = translations[language];

  // Gather materials that have flashcard sets
  const materialsWithFlashcards = materials.filter(m => m.flashcardSet && m.flashcardSet.length > 0);

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    materialsWithFlashcards[0]?.id || ''
  );

  const selectedMaterial = materialsWithFlashcards.find(m => m.id === selectedMaterialId);
  const flashcards = selectedMaterial?.flashcardSet || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  const [reviewCards, setReviewCards] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = flashcards[currentIndex];

  const handleResponse = (isKnown: boolean) => {
    if (!currentCard) return;

    if (isKnown) {
      setKnownCards(prev => [...prev, currentCard.id]);
    } else {
      setReviewCards(prev => [...prev, currentCard.id]);
    }

    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setReviewCards([]);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-500" />
            <span>Modo Flashcards Interactivas</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Repasa tarjetas de memoria con repetición espaciada y pon a prueba tu retención.
          </p>
        </div>

        {/* Deck Select Dropdown */}
        {materialsWithFlashcards.length > 0 && (
          <select
            value={selectedMaterialId}
            onChange={(e) => {
              setSelectedMaterialId(e.target.value);
              handleRestart();
            }}
            className="px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold focus:border-teal-500 focus:outline-none"
          >
            {materialsWithFlashcards.map(m => (
              <option key={m.id} value={m.id}>
                📚 {m.title} ({m.flashcardSet?.length} tarjetas)
              </option>
            ))}
          </select>
        )}
      </div>

      {flashcards.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            No hay conjuntos de tarjetas disponibles.
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
            Usa el Generador de IA para crear un mazo automático a partir de tus apuntes.
          </p>
        </div>
      ) : isFinished ? (
        /* Finished Deck Score Screen */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              ¡Mazo Completado con Éxito! 🎉
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Has repasado las {flashcards.length} tarjetas de "{selectedMaterial?.title}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300">
              <span className="text-2xl font-extrabold block">{knownCards.length}</span>
              <span className="text-[11px] font-bold">Dominadas ✓</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-800 dark:text-amber-300">
              <span className="text-2xl font-extrabold block">{reviewCards.length}</span>
              <span className="text-[11px] font-bold">Para Repasar 🔄</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500 transition"
          >
            Repasar Mazo de Nuevo
          </button>
        </div>
      ) : (
        /* Active Card Screen */
        <div className="space-y-6">
          
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Tarjeta {currentIndex + 1} de {flashcards.length}</span>
            <div className="w-48 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 h-full rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Card Component */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[280px] p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 text-white flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl hover:scale-[1.01] transition-all select-none relative group"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold text-teal-400 mb-4 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'RESPUESTA / SOLUCIÓN' : 'PREGUNTA (HAZ CLIC PARA VOLTEAR)'}</span>
            </span>

            <p className="text-lg sm:text-xl font-bold leading-relaxed max-w-xl">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>

            {isFlipped && currentCard.explanation && (
              <p className="text-xs text-slate-300 mt-6 pt-4 border-t border-slate-700 italic max-w-lg">
                💡 {currentCard.explanation}
              </p>
            )}
          </div>

          {/* Action Response Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleResponse(false)}
              className="px-6 py-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-200 transition flex items-center gap-2 border border-rose-200 dark:border-rose-800"
            >
              <XCircle className="w-4 h-4" />
              <span>Necesito Repasar</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              Voltear
            </button>

            <button
              onClick={() => handleResponse(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-200 transition flex items-center gap-2 border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle className="w-4 h-4" />
              <span>¡Se la sé!</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
