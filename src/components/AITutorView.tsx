import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  Lightbulb,
  Copy,
  Check,
  Flame
} from 'lucide-react';
import { AIChatMessage, UserProfile, Language, EducationalLevel, Subject } from '../types';
import { translations } from '../lib/translations';

interface AITutorViewProps {
  user: UserProfile;
  language: Language;
  initialPrompt?: string;
  onUpdateDailyQueries: () => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  user,
  language,
  initialPrompt,
  onUpdateDailyQueries
}) => {
  const t = translations[language];

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `¡Hola ${user.name.split(' ')[0]}! 👋 Soy **StudyPrime AI**, tu tutor de inteligencia artificial disponible 24/7.

¿En qué materia o ejercicio te puedo ayudar hoy? Puedo explicarte teorías de **Física**, resolver ecuaciones paso a paso de **Matemáticas**, resumir acontecimientos de **Historia** o diseñar tu **plan de estudio personal**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: t.tutor.samplePrompts
    }
  ]);

  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [studyMode, setStudyMode] = useState<'qa' | 'step_by_step' | 'study_plan'>('qa');
  const [levelAdaptation, setLevelAdaptation] = useState<'básico' | 'intermedio' | 'avanzado'>('intermedio');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Matemáticas');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      setInputMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    if (user.plan === 'free' && user.dailyQueriesLeft <= 0) {
      alert('Has alcanzado tu límite de 5 consultas gratuitas diarias. ¡Pásate a StudyPrime PRO para usar el tutor sin límites!');
      return;
    }

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          level: user.level,
          subject: selectedSubject,
          studyMode,
          levelAdaptation,
          language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la respuesta del servidor');
      }

      const aiReplyMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          '¿Puedes ponerme un problema práctico para poner a prueba lo aprendido?',
          '¿Cómo se aplicaría esto en un examen de nivel universitario o Selectividad?',
          'Resúmeme esto en 3 puntos clave para mis flashcards.'
        ]
      };

      setMessages(prev => [...prev, aiReplyMsg]);
      onUpdateDailyQueries();
    } catch (error: any) {
      console.error('Error in AI Chat:', error);
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Hubo un pequeño inconveniente al conectar con el servidor: ${error?.message || 'Error de red'}. Por favor intenta de nuevo.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-[#FDFDFB] dark:bg-[#121212] border border-[#E5E5E1] dark:border-neutral-800 overflow-hidden">
      
      {/* Top Header Controls */}
      <div className="p-4 bg-[#F5F5F1] dark:bg-neutral-900 border-b border-[#E5E5E1] dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#121212] text-white dark:bg-white dark:text-[#121212] flex items-center justify-center font-serif text-sm italic font-bold">
            AI
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#4F46E5]">
              • Tutor Online 24/7
            </div>
            <h2 className="text-xl font-serif italic font-bold text-[#121212] dark:text-white leading-tight">
              {t.tutor.title}
            </h2>
          </div>
        </div>

        {/* Mode Selector Options */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center bg-[#F1F1ED] dark:bg-neutral-800 p-1 border border-[#E5E5E1] dark:border-neutral-700 text-xs font-semibold">
            <button
              onClick={() => setStudyMode('qa')}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold transition ${
                studyMode === 'qa' ? 'bg-[#121212] text-white' : 'text-[#121212]/70 dark:text-neutral-300'
              }`}
            >
              💬 Dudas
            </button>
            <button
              onClick={() => setStudyMode('step_by_step')}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold transition ${
                studyMode === 'step_by_step' ? 'bg-[#121212] text-white' : 'text-[#121212]/70 dark:text-neutral-300'
              }`}
            >
              📐 Paso a Paso
            </button>
            <button
              onClick={() => setStudyMode('study_plan')}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold transition ${
                studyMode === 'study_plan' ? 'bg-[#121212] text-white' : 'text-[#121212]/70 dark:text-neutral-300'
              }`}
            >
              📅 Plan
            </button>
          </div>

          <select
            value={levelAdaptation}
            onChange={(e: any) => setLevelAdaptation(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 border border-[#E5E5E1] dark:border-neutral-700 font-semibold uppercase tracking-wider"
          >
            <option value="básico">Profundidad: Básico</option>
            <option value="intermedio">Profundidad: Intermedio</option>
            <option value="avanzado">Profundidad: Avanzado</option>
          </select>

          <button
            onClick={() => setMessages((messages || []).slice(0, 1))}
            className="p-2 text-neutral-400 hover:text-[#FF3D00] transition"
            title="Limpiar Conversación"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Chat Messages Thread */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FDFDFB] dark:bg-[#121212]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 flex items-center justify-center shrink-0 font-serif font-bold text-xs ${
              msg.sender === 'user' 
                ? 'bg-[#121212] text-white dark:bg-white dark:text-[#121212]' 
                : 'bg-[#4F46E5] text-white'
            }`}>
              {msg.sender === 'user' ? user.name.charAt(0) : 'IA'}
            </div>

            <div className={`space-y-2 max-w-2xl ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 text-xs sm:text-sm leading-relaxed border relative group ${
                msg.sender === 'user'
                  ? 'bg-[#4F46E5] text-white border-transparent'
                  : 'bg-white dark:bg-neutral-900 text-[#121212] dark:text-neutral-100 border-[#E5E5E1] dark:border-neutral-800'
              }`}>
                
                {/* Copy Button */}
                <button
                  onClick={() => handleCopyText(msg.id, msg.text)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-[#121212] transition"
                  title="Copiar texto"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#4F46E5]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                <div className={`text-[10px] mt-2 font-mono ${
                  msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-neutral-400'
                }`}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Suggested Follow-up Questions */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggestedQuestions.map((sq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sq)}
                      className="px-3 py-1.5 bg-[#F5F5F1] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 text-[11px] font-semibold border border-[#E5E5E1] dark:border-neutral-700 hover:border-[#121212] transition text-left"
                    >
                      💡 {sq}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#4F46E5] text-white flex items-center justify-center font-bold text-xs font-serif">
              IA
            </div>
            <div className="p-4 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 text-xs text-neutral-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F46E5] animate-pulse" />
              <span>Analizando y generando respuesta editorial...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-[#F5F5F1] dark:bg-neutral-900 border-t border-[#E5E5E1] dark:border-neutral-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.tutor.inputPlaceholder}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white dark:bg-neutral-800 text-[#121212] dark:text-neutral-100 placeholder-neutral-400 border border-[#E5E5E1] dark:border-neutral-700 focus:border-[#4F46E5] focus:outline-none transition font-sans"
            id="ai-tutor-input"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-[#121212] text-white dark:bg-white dark:text-[#121212] font-bold text-xs uppercase tracking-widest hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition disabled:opacity-40 flex items-center gap-2 shrink-0"
            id="ai-tutor-send-btn"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.tutor.send}</span>
          </button>
        </form>
      </div>

    </div>
  );
};
