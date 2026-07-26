import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle, 
  FileText, 
  RefreshCw, 
  Copy, 
  Check, 
  BookOpen,
  ListOrdered
} from 'lucide-react';
import { UserProfile, Language, Flashcard, QuizQuestion } from '../types';
import { translations } from '../lib/translations';

interface AutoGeneratorViewProps {
  user: UserProfile;
  language: Language;
  onUpdateDailyQueries: () => void;
  onSaveGeneratedMaterial: (data: {
    summaryText: string;
    conceptMap: string;
    flashcards: Flashcard[];
    quizzes: QuizQuestion[];
    topic: string;
  }) => void;
}

export const AutoGeneratorView: React.FC<AutoGeneratorViewProps> = ({
  user,
  language,
  onUpdateDailyQueries,
  onSaveGeneratedMaterial
}) => {
  const t = translations[language];

  const [topic, setTopic] = useState('La Fotosíntesis y la Fase Lumínica');
  const [sourceText, setSourceText] = useState('');
  const [subject, setSubject] = useState('Biología');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    summaryText: string;
    conceptMap: string;
    flashcards: Flashcard[];
    quizzes: QuizQuestion[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'summary' | 'concept' | 'flashcards' | 'quiz'>('summary');

  const handleGenerate = async () => {
    if (!topic.trim() && !sourceText.trim()) return;

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const response = await fetch('/api/ai/generate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText,
          topic,
          subject,
          level: user.level,
          language
        })
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        if (!response.ok) {
          throw new Error(`Servidor no disponible temporalmente (${response.status} ${response.statusText || ''}). Por favor reintenta.`);
        }
        throw new Error('Respuesta del servidor en formato no válido');
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || `Error al generar material (${response.status})`);
      }

      setGeneratedResult(data);
      onUpdateDailyQueries();
    } catch (error: any) {
      console.error('Error generating study material:', error);
      alert(`⚠️ Error: ${error?.message || 'Error de servidor'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-500" />
          <span>{t.generator.title}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.generator.subtitle}
        </p>
      </div>

      {/* Input Box Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Tema Principal de Estudio
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej. Revolución Francesa, Derivadas Parciales, Genética Mendeliana..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
              id="generator-topic-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Asignatura
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent focus:border-teal-500 focus:outline-none font-semibold"
              id="generator-subject-select"
            >
              <option value="Biología">Biología</option>
              <option value="Matemáticas">Matemáticas</option>
              <option value="Historia">Historia</option>
              <option value="Física">Física</option>
              <option value="Química">Química</option>
              <option value="Lengua y Literatura">Lengua y Literatura</option>
              <option value="Inglés">Inglés</option>
              <option value="Filosofía">Filosofía</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            {t.generator.inputTopicLabel}
          </label>
          <textarea
            rows={5}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t.generator.placeholder}
            className="w-full p-3 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
            id="generator-source-text"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!topic.trim() && !sourceText.trim())}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
          id="run-generator-btn"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t.generator.generating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.generator.generateBtn}</span>
            </>
          )}
        </button>

      </div>

      {/* Generated Results Dashboard */}
      {generatedResult && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Materiales Generados con Éxito para "{topic}"</span>
            </h3>

            <button
              onClick={() => onSaveGeneratedMaterial({ ...generatedResult, topic })}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition shadow-sm"
            >
              Guardar en mi biblioteca
            </button>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'summary' ? 'bg-teal-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resumen Ejecutivo</span>
            </button>

            <button
              onClick={() => setActiveTab('concept')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'concept' ? 'bg-teal-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Mapa Conceptual</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'flashcards' ? 'bg-teal-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards ({generatedResult.flashcards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'quiz' ? 'bg-teal-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Cuestionario Quiz ({generatedResult.quizzes.length})</span>
            </button>
          </div>

          {/* Tab Views */}
          {activeTab === 'summary' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {generatedResult.summaryText}
            </div>
          )}

          {activeTab === 'concept' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-teal-800 dark:text-teal-300 leading-relaxed whitespace-pre-wrap">
              {generatedResult.conceptMap}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {generatedResult.flashcards.map((fc, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                    Tarjeta #{i + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {fc.question}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    💡 {fc.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {generatedResult.quizzes.map((qz, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {i + 1}. {qz.question}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {qz.options.map((opt, oIdx) => (
                      <div 
                        key={oIdx}
                        className={`p-2.5 rounded-xl text-xs border ${
                          oIdx === qz.correctAnswerIndex
                            ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-400 font-bold text-emerald-900 dark:text-emerald-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {opt} {oIdx === qz.correctAnswerIndex && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
