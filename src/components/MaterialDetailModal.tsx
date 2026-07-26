import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  Star, 
  MessageSquare, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  FileText,
  User,
  Send,
  Download,
  Flame,
  Bot
} from 'lucide-react';
import { StudyMaterial, Comment, Language } from '../types';
import { translations } from '../lib/translations';

interface MaterialDetailModalProps {
  material: StudyMaterial | null;
  comments: Comment[];
  language: Language;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onAddComment: (materialId: string, text: string, rating: number) => void;
  onNavigateToTutorWithPrompt: (prompt: string) => void;
  onGenerateStudyMaterialForNote: (material: StudyMaterial) => void;
}

export const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  material,
  comments,
  language,
  onClose,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onNavigateToTutorWithPrompt,
  onGenerateStudyMaterialForNote
}) => {
  if (!material) return null;

  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'content' | 'flashcards' | 'quiz'>('content');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentFlashcard = material.flashcardSet?.[currentFlashcardIndex];
  const isPdfFile = material.fileUrl?.startsWith('data:application/pdf') || material.fileUrl?.endsWith('.pdf');
  const isImageFile = material.fileUrl?.startsWith('data:image') || material.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#121212] w-full max-w-4xl border border-[#E5E5E1] dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E1] dark:border-neutral-800 flex items-start justify-between gap-4 bg-[#FDFDFB] dark:bg-neutral-900">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#4F46E5] text-white">
                {material.subject}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E5E5E1] text-[#121212] dark:bg-neutral-800 dark:text-neutral-200">
                {material.level}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E5E5E1] text-[#121212] dark:bg-neutral-800 dark:text-neutral-200 capitalize">
                {material.type}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#121212] dark:text-white leading-snug">
              {material.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
              <span>Mis Apuntes Personales</span>
              <span>•</span>
              <span>Guardado el {material.createdAt}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-[#121212] dark:hover:text-white transition shrink-0"
            id="close-material-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Action Bar */}
        <div className="px-5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'content'
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Apunte / Texto</span>
            </button>

            {material.flashcardSet && material.flashcardSet.length > 0 && (
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'flashcards'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards ({material.flashcardSet.length})</span>
              </button>
            )}

            {material.quizSet && material.quizSet.length > 0 && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Quiz Test ({material.quizSet.length})</span>
              </button>
            )}

          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(material.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                material.isSaved
                  ? 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${material.isSaved ? 'fill-teal-500' : ''}`} />
              <span>{material.isSaved ? 'Guardado' : 'Guardar'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: TEXT CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white font-bold block mb-1">Descripción:</strong>
                {material.description}
              </div>

              {/* Main Document Content Area */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {material.contentText}
              </div>

              {/* AI Helper Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-indigo-500/10 dark:from-teal-950/50 dark:to-indigo-950/50 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      ¿Tienes dudas sobre este apunte?
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Pregúntale al Tutor IA o genera flashcards automáticas para estudiar.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToTutorWithPrompt(`Explicame detalladamente el siguiente apunte sobre ${material.title}:\n\n${material.contentText}`)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Bot className="w-4 h-4 text-teal-400 dark:text-teal-600" />
                    <span>Preguntar a IA</span>
                  </button>

                  <button
                    onClick={() => onGenerateStudyMaterialForNote(material)}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Generar Flashcards</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FLASHCARDS */}
          {activeTab === 'flashcards' && material.flashcardSet && (
            <div className="space-y-6 max-w-lg mx-auto text-center">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Tarjeta {currentFlashcardIndex + 1} de {material.flashcardSet.length}</span>
                <span className="capitalize px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  Dificultad: {currentFlashcard?.difficulty || 'Normal'}
                </span>
              </div>

              {/* Card Container */}
              <div
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full min-h-[220px] p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 text-white flex flex-col items-center justify-center text-center cursor-pointer shadow-xl hover:scale-[1.01] transition-transform select-none relative group"
              >
                <span className="text-[10px] uppercase tracking-widest font-bold text-teal-400 mb-3">
                  {showAnswer ? 'RESPUESTA / SOLUCIÓN' : 'PREGUNTA CLAVE (TOCA PARA VOLTEAR)'}
                </span>

                <p className="text-base sm:text-lg font-bold leading-relaxed">
                  {showAnswer ? currentFlashcard?.answer : currentFlashcard?.question}
                </p>

                {showAnswer && currentFlashcard?.explanation && (
                  <p className="text-xs text-slate-300 mt-4 pt-3 border-t border-slate-700 italic">
                    💡 {currentFlashcard.explanation}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  disabled={currentFlashcardIndex === 0}
                  onClick={() => {
                    setCurrentFlashcardIndex(currentFlashcardIndex - 1);
                    setShowAnswer(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  Anterior
                </button>

                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="px-5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  {showAnswer ? 'Ver Pregunta' : 'Ver Respuesta'}
                </button>

                <button
                  disabled={currentFlashcardIndex === (material.flashcardSet?.length || 0) - 1}
                  onClick={() => {
                    setCurrentFlashcardIndex(currentFlashcardIndex + 1);
                    setShowAnswer(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ TEST */}
          {activeTab === 'quiz' && material.quizSet && (
            <div className="space-y-6">
              {(material.quizSet || []).map((q, qIndex) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-3">
                    {qIndex + 1}. {q.question}
                  </h4>

                  <div className="space-y-2">
                    {(q.options || []).map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      const isCorrect = q.correctAnswerIndex === optIdx;
                      
                      let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                      if (quizSubmitted) {
                        if (isCorrect) optionStyle = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                        else if (isSelected && !isCorrect) optionStyle = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200';
                      } else if (isSelected) {
                        optionStyle = 'bg-teal-100 dark:bg-teal-950 border-teal-500 text-teal-900 dark:text-teal-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      💡 <strong>Explicación:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500 transition"
                  >
                    Comprobar Respuestas
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition"
                  >
                    Reiniciar Quiz
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
