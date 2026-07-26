import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, RefreshCw, Shield, Cpu, Sparkles, Sliders, Moon, Sun, Save } from 'lucide-react';
import { Language, UserProfile, EducationalLevel, Subject } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  language: Language;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  language,
  darkMode,
  onToggleDarkMode,
  onUpdateUser
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [keyStatus, setKeyStatus] = useState<{ hasKey: boolean; isCustom: boolean; maskedKey: string }>({
    hasKey: true,
    isCustom: false,
    maskedKey: ''
  });

  const [selectedModel, setSelectedModel] = useState('gemini-3.6-flash');
  const [mainSubject, setMainSubject] = useState<Subject>(user.mainSubjects[0] || 'Matemáticas');
  const [eduLevel, setEduLevel] = useState<EducationalLevel>(user.level || 'Bachillerato');

  // Check current API Key status on server
  const fetchKeyStatus = async () => {
    try {
      const res = await fetch('/api/settings/gemini-key');
      if (res.ok) {
        const data = await res.json();
        setKeyStatus(data);
      }
    } catch {
      // Ignore network errors in status check
    }
  };

  useEffect(() => {
    fetchKeyStatus();
  }, []);

  const handleSaveAndVerifyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor introduce una clave de API de Gemini válida.' });
      return;
    }

    setIsVerifying(true);
    setStatusMessage({ type: 'info', text: 'Verificando la clave de API con el servidor de Gemini...' });

    try {
      const res = await fetch('/api/settings/gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'La clave proporcionada no pudo ser verificada.');
      }

      setStatusMessage({
        type: 'success',
        text: '¡Clave de API de Gemini guardada y verificada exitosamente! El backend usará tu clave personalizada.'
      });
      setApiKeyInput('');
      setKeyStatus({
        hasKey: true,
        isCustom: true,
        maskedKey: data.maskedKey || ''
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al validar la clave de API.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetDefaultKey = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/settings/gemini-key', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Se ha restaurado la clave de API por defecto del servidor.' });
        fetchKeyStatus();
      } else {
        throw new Error(data.error || 'Error al restablecer.');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al restablecer la clave.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      level: eduLevel,
      mainSubjects: [mainSubject]
    });
    setStatusMessage({ type: 'success', text: 'Ajustes personales y de estudio actualizados.' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Title Header */}
      <div className="border-b border-[#E5E5E1] dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#4F46E5] text-white flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#121212] dark:text-white">
              Configuración de la Aplicación
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Personaliza tu clave API de Gemini, modelo de IA por defecto y preferencias personales de estudio.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Status Notification */}
      {statusMessage && (
        <div className={`p-4 text-xs font-semibold flex items-center gap-3 border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
            : statusMessage.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
            : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800'
        }`}>
          {statusMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
          {statusMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {statusMessage.type === 'info' && <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 1. GEMINI API KEY MANAGEMENT */}
      <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E1] dark:border-neutral-800 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E5E1] dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[#4F46E5]" />
            <div>
              <h2 className="text-base font-bold text-[#121212] dark:text-white uppercase tracking-wider font-mono">
                Clave de API de Gemini (Google AI)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Cambia la API key directamente para adaptar las llamadas del código al modelo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {keyStatus.isCustom ? (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                Clave Personalizada Activa
              </span>
            ) : (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
                Clave por Defecto (Entorno)
              </span>
            )}
          </div>
        </div>

        {/* Current Key info box */}
        <div className="p-4 bg-[#F5F5F1] dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 text-xs space-y-2 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Estado de la clave API:</span>
            <span className="font-bold text-[#121212] dark:text-white">
              {keyStatus.hasKey ? 'Conectado a Google AI' : 'Sin clave'}
            </span>
          </div>
          {keyStatus.maskedKey && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Clave activa (enmascarada):</span>
              <span className="font-bold text-[#4F46E5]">{keyStatus.maskedKey}</span>
            </div>
          )}
        </div>

        {/* Change key form */}
        <form onSubmit={handleSaveAndVerifyKey} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-neutral-200 mb-2">
              Ingresar Nueva API Key de Gemini:
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 text-xs font-mono bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700 focus:border-[#4F46E5] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 hover:text-[#121212] dark:hover:text-white uppercase"
              >
                {showApiKey ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5">
              Obtén tu API key gratuita en Google AI Studio (aistudio.google.com).
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {keyStatus.isCustom && (
              <button
                type="button"
                onClick={handleResetDefaultKey}
                disabled={isVerifying}
                className="px-4 py-2.5 bg-neutral-200 dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 text-xs font-bold uppercase tracking-wider hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
              >
                Restaurar Clave Original
              </button>
            )}

            <button
              type="submit"
              disabled={isVerifying || !apiKeyInput.trim()}
              className="ml-auto px-6 py-2.5 bg-[#4F46E5] text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {isVerifying && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isVerifying ? 'Verificando...' : 'Guardar y Aplicar Clave'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. AI MODEL CONFIGURATION */}
      <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E1] dark:border-neutral-800 p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E5E5E1] dark:border-neutral-800 pb-4">
          <Cpu className="w-5 h-5 text-[#FF3D00]" />
          <div>
            <h2 className="text-base font-bold text-[#121212] dark:text-white uppercase tracking-wider font-mono">
              Modelo de Inteligencia Artificial
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Selecciona la versión del modelo Gemini que procesará tu Tutor y Escáner.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: 'gemini-3.6-flash',
              name: 'Gemini 3.6 Flash',
              desc: 'Recomendado. Ultra rápido, ideal para tutoría paso a paso y resúmenes al instante.',
              badge: 'Por defecto'
            },
            {
              id: 'gemini-3.1-pro-preview',
              name: 'Gemini 3.1 Pro',
              desc: 'Razonamiento complejo para problemas matemáticos avanzados o universitarios.',
              badge: 'Avanzado'
            },
            {
              id: 'gemini-2.5-flash',
              name: 'Gemini 2.5 Flash',
              desc: 'Ligero y optimizado para respuestas muy directas.',
              badge: 'Rápido'
            }
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`p-4 border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                selectedModel === m.id
                  ? 'border-[#4F46E5] bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-[#E5E5E1] dark:border-neutral-800 hover:border-neutral-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#121212] dark:text-white">{m.name}</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#E5E5E1] dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                    {m.badge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="text-[10px] font-mono text-[#4F46E5] font-bold">
                {selectedModel === m.id ? '✓ SELECCIONADO' : 'Seleccionar'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PERSONAL STUDY ENVIRONMENT */}
      <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E1] dark:border-neutral-800 p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E5E5E1] dark:border-neutral-800 pb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-bold text-[#121212] dark:text-white uppercase tracking-wider font-mono">
              Mi Entorno Personal de Apuntes
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Configura tus preferencias académicas de estudio personal.
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-neutral-200 mb-2">
                Nivel Educativo Principal:
              </label>
              <select
                value={eduLevel}
                onChange={(e) => setEduLevel(e.target.value as EducationalLevel)}
                className="w-full px-3 py-2.5 text-xs bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700"
              >
                <option value="Secundaria">Secundaria</option>
                <option value="Bachillerato">Bachillerato / Preparatoria</option>
                <option value="Universidad">Universidad / Grado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-neutral-200 mb-2">
                Asignatura Principal:
              </label>
              <select
                value={mainSubject}
                onChange={(e) => setMainSubject(e.target.value as Subject)}
                className="w-full px-3 py-2.5 text-xs bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700"
              >
                <option value="Matemáticas">Matemáticas</option>
                <option value="Historia">Historia</option>
                <option value="Biología">Biología</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Lengua y Literatura">Lengua y Literatura</option>
                <option value="Inglés">Inglés</option>
                <option value="Informática">Informática</option>
                <option value="Filosofía">Filosofía</option>
                <option value="Economía">Economía</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F5F5F1] dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800">
            <div>
              <span className="text-xs font-bold text-[#121212] dark:text-white block">
                Tema de Interfaz (Claro / Oscuro)
              </span>
              <span className="text-[11px] text-neutral-500">
                Cambia el estilo visual de la aplicación.
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 bg-[#121212] text-white dark:bg-white dark:text-[#121212] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#121212] text-white dark:bg-white dark:text-[#121212] text-xs font-bold uppercase tracking-wider hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Preferencias de Estudio</span>
            </button>
          </div>
        </form>
      </section>

    </div>
  );
};
