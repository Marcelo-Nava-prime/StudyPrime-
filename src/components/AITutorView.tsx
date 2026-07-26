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
  Flame,
  History,
  Plus,
  MessageSquare,
  X,
  ChevronRight
} from 'lucide-react';
import { AIChatMessage, UserProfile, Language, EducationalLevel, Subject } from '../types';
import { translations } from '../lib/translations';

interface AITutorViewProps {
  user: UserProfile;
  language: Language;
  initialPrompt?: string;
  onUpdateDailyQueries: () => void;
}

interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  subject: Subject;
  messages: AIChatMessage[];
}

const STORAGE_KEY = 'studyprime_ai_chat_history_v1';

export const AITutorView: React.FC<AITutorViewProps> = ({
  user,
  language,
  initialPrompt,
  onUpdateDailyQueries
}) => {
  const t = translations[language];

  const createDefaultWelcome = (): AIChatMessage => ({
    id: `msg-welcome-${Date.now()}`,
    sender: 'assistant',
    text: `¡Hola ${user.name.split(' ')[0]}! 👋 Soy **StudyPrime AI**, tu tutor de inteligencia artificial disponible 24/7.

¿En qué materia o ejercicio te puedo ayudar hoy? Puedo explicarte teorías de **Física**, resolver ecuaciones paso a paso de **Matemáticas**, resumir acontecimientos de **Historia** o diseñar tu **plan de estudio personal**.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedQuestions: t.tutor.samplePrompts
  });

  // Load conversations from LocalStorage
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading chat history from localStorage', e);
    }
    const initialId = `conv-${Date.now()}`;
    return [{
      id: initialId,
      title: 'Nueva consulta de estudio',
      createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: 'Matemáticas',
      messages: [
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: `¡Hola ${user.name.split(' ')[0]}! 👋 Soy **StudyPrime AI**, tu tutor de inteligencia artificial disponible 24/7.

¿En qué materia o ejercicio te puedo ayudar hoy? Puedo explicarte teorías de **Física**, resolver ecuaciones paso a paso de **Matemáticas**, resumir acontecimientos de **Historia** o diseñar tu **plan de estudio personal**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: t.tutor.samplePrompts
        }
      ]
    }];
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => conversations[0]?.id || `conv-${Date.now()}`);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);

  const activeConversation = conversations.find(c => c.id === activeChatId) || conversations[0];
  const messages = activeConversation?.messages || [];

  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [studyMode, setStudyMode] = useState<'qa' | 'step_by_step' | 'study_plan'>('qa');
  const [levelAdaptation, setLevelAdaptation] = useState<'básico' | 'intermedio' | 'avanzado'>('intermedio');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Matemáticas');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save conversations to LocalStorage whenever they update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversation history', e);
    }
  }, [conversations]);

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

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      title: 'Nueva consulta de estudio',
      createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
      messages: [createDefaultWelcome()]
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveChatId(newId);
    setShowHistoryPanel(false);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowHistoryPanel(false);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    if (updated.length === 0) {
      const freshId = `conv-${Date.now()}`;
      const freshConv: ChatConversation = {
        id: freshId,
        title: 'Nueva consulta de estudio',
        createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject,
        messages: [createDefaultWelcome()]
      };
      setConversations([freshConv]);
      setActiveChatId(freshId);
    } else {
      setConversations(updated);
      if (activeChatId === id) {
        setActiveChatId(updated[0].id);
      }
    }
  };

  const handleClearAllHistory = () => {
    if (confirm('¿Deseas borrar todo el historial de conversaciones recientes con el tutor IA?')) {
      localStorage.removeItem(STORAGE_KEY);
      const freshId = `conv-${Date.now()}`;
      const freshConv: ChatConversation = {
        id: freshId,
        title: 'Nueva consulta de estudio',
        createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject,
        messages: [createDefaultWelcome()]
      };
      setConversations([freshConv]);
      setActiveChatId(freshId);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update conversation state with user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeChatId) {
        const isFirstQuery = conv.title === 'Nueva consulta de estudio' || conv.messages.length <= 1;
        const newTitle = isFirstQuery ? (text.length > 32 ? text.slice(0, 32) + '...' : text) : conv.title;
        return {
          ...conv,
          title: newTitle,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: [...conv.messages, userMsg]
        };
      }
      return conv;
    }));

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

      setConversations(prev => prev.map(conv => {
        if (conv.id === activeChatId) {
          return {
            ...conv,
            messages: [...conv.messages, aiReplyMsg]
          };
        }
        return conv;
      }));

      onUpdateDailyQueries();
    } catch (error: any) {
      console.error('Error in AI Chat:', error);
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Hubo un pequeño inconveniente al conectar con el servidor: ${error?.message || 'Error de red'}. Por favor intenta de nuevo.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeChatId) {
          return {
            ...conv,
            messages: [...conv.messages, errorMsg]
          };
        }
        return conv;
      }));
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
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-[#FDFDFB] dark:bg-[#121212] border border-[#E5E5E1] dark:border-neutral-800 overflow-hidden relative">
      
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

        {/* Mode Selector & History Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition flex items-center gap-1.5 ${
              showHistoryPanel
                ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                : 'bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 border-[#E5E5E1] dark:border-neutral-700 hover:border-[#121212]'
            }`}
            title="Historial de Conversaciones"
          >
            <History className="w-3.5 h-3.5 text-[#FF3D00]" />
            <span>Historial ({conversations.length})</span>
          </button>

          <button
            onClick={handleNewChat}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#121212] text-white dark:bg-white dark:text-[#121212] hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition flex items-center gap-1"
            title="Nueva Conversación"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo Chat</span>
          </button>
          
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

        </div>

      </div>

      {/* History Slide-over Drawer / Panel */}
      {showHistoryPanel && (
        <div className="absolute inset-y-0 right-0 w-80 bg-white dark:bg-neutral-900 border-l border-[#E5E5E1] dark:border-neutral-800 z-30 shadow-xl flex flex-col transition-all">
          <div className="p-4 border-b border-[#E5E5E1] dark:border-neutral-800 flex items-center justify-between bg-[#F5F5F1] dark:bg-neutral-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#FF3D00]" />
              <h3 className="font-serif font-bold text-sm text-[#121212] dark:text-white uppercase tracking-wider">
                Conversaciones Recientes
              </h3>
            </div>
            <button
              onClick={() => setShowHistoryPanel(false)}
              className="p-1 text-neutral-400 hover:text-[#121212] dark:hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full py-2.5 px-3 bg-[#121212] text-white dark:bg-white dark:text-[#121212] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition"
            >
              <Plus className="w-4 h-4" />
              <span>Iniciar Nueva Conversación</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.map((conv) => {
              const isActive = conv.id === activeChatId;
              const msgCount = conv.messages.length;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectChat(conv.id)}
                  className={`p-3 border text-left cursor-pointer transition relative group flex items-start justify-between gap-2 ${
                    isActive
                      ? 'bg-[#F1F1ED] dark:bg-neutral-800 border-[#121212] dark:border-white'
                      : 'bg-white dark:bg-neutral-900 border-[#E5E5E1] dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-neutral-400'}`} />
                      <span className="text-xs font-bold text-[#121212] dark:text-white truncate block">
                        {conv.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-2">
                      <span>{conv.createdAt}</span>
                      <span>•</span>
                      <span>{msgCount} mensajes</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteChat(conv.id, e)}
                    className="p-1 text-neutral-400 hover:text-[#FF3D00] opacity-0 group-hover:opacity-100 transition shrink-0"
                    title="Eliminar este chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#E5E5E1] dark:border-neutral-800 bg-[#F5F5F1] dark:bg-neutral-800">
            <button
              onClick={handleClearAllHistory}
              className="w-full py-2 text-[11px] text-neutral-500 hover:text-[#FF3D00] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar todo el historial</span>
            </button>
          </div>
        </div>
      )}

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
