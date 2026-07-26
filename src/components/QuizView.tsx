import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Trophy, 
  XCircle, 
  RotateCw, 
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { StudyMaterial, QuizQuestion, Language } from '../types';

interface QuizViewProps {
  materials: StudyMaterial[];
  language: Language;
}

export const QuizView: React.FC<QuizViewProps> = ({
  materials,
  language
}) => {
  const materialsWithQuizzes = materials.filter(m => m.quizSet && m.quizSet.length > 0);

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    materialsWithQuizzes[0]?.id || ''
  );

  const selectedMaterial = materialsWithQuizzes.find(m => m.id === selectedMaterialId);
  const quizzes = selectedMaterial?.quizSet || [];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    if (isSubmitted || quizzes.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, quizzes]);

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optIndex });
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeft(180);
  };

  const score = calculateScore();
  const percentage = quizzes.length > 0 ? Math.round((score / quizzes.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-teal-500" />
            <span>Modo Cuestionario y Quizzes</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ponte a prueba con tests tipo examen y explicaciones detalladas de cada respuesta.
          </p>
        </div>

        {materialsWithQuizzes.length > 0 && (
          <select
            value={selectedMaterialId}
            onChange={(e) => {
              setSelectedMaterialId(e.target.value);
              handleReset();
            }}
            className="px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold focus:border-teal-500 focus:outline-none"
          >
            {materialsWithQuizzes.map(m => (
              <option key={m.id} value={m.id}>
                🎯 {m.title} ({m.quizSet?.length} preguntas)
              </option>
            ))}
          </select>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            No hay quizzes disponibles para esta asignatura.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Quiz Status Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Tiempo restante: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</span>
            </div>

            <div className="text-xs font-bold text-teal-600 dark:text-teal-400">
              Respondidas {Object.keys(selectedAnswers).length} / {quizzes.length}
            </div>
          </div>

          {/* Score Summary Card if submitted */}
          {isSubmitted && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-teal-950 text-white text-center space-y-4 shadow-xl">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-xl font-extrabold">
                Puntuación Final: {score} de {quizzes.length} ({percentage}%)
              </h2>
              <p className="text-xs text-slate-300">
                {percentage >= 80 ? '🌟 ¡Excelente rendimiento! Has consolidado tus conocimientos.' : '💡 Buen intento. Revisa la explicación de las preguntas falladas.'}
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition"
              >
                Volver a Intentar
              </button>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {quizzes.map((q, qIndex) => (
              <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {qIndex + 1}. {q.question}
                </h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selectedAnswers[q.id] === optIndex;
                    const isCorrect = q.correctAnswerIndex === optIndex;

                    let btnClass = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    
                    if (isSubmitted) {
                      if (isCorrect) btnClass = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      else if (isSelected && !isCorrect) btnClass = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else if (isSelected) {
                      btnClass = 'bg-teal-100 dark:bg-teal-950 border-teal-500 text-teal-900 dark:text-teal-200 font-bold';
                    }

                    return (
                      <button
                        key={optIndex}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    💡 <strong>Explicación:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSubmitted(true)}
                className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500 transition"
              >
                Enviar y Ver Resultados
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
