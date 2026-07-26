import React from 'react';
import { 
  Sparkles, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Bot, 
  Camera, 
  Layers, 
  ArrowRight, 
  Star, 
  Heart, 
  MessageSquare, 
  Share2, 
  Users,
  CheckCircle,
  Crown,
  Trophy
} from 'lucide-react';
import { StudyMaterial, UserProfile, Language } from '../types';
import { translations } from '../lib/translations';

interface FeedViewProps {
  user: UserProfile;
  materials: StudyMaterial[];
  knowers?: UserProfile[];
  language: Language;
  onNavigate?: (view: string) => void;
  onSelectMaterial: (material: StudyMaterial) => void;
  onToggleLike: (materialId: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  user,
  materials,
  knowers = [],
  language,
  onNavigate = (_view: string) => {},
  onSelectMaterial,
  onToggleLike
}) => {
  const t = translations[language];

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Welcome Header - Editorial Banner */}
      <div className="p-8 sm:p-10 bg-[#121212] text-white rounded-none border border-neutral-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#4F46E5] text-white text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF3D00]" />
            <span>Tutor de Inteligencia Artificial Activo 24/7</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif leading-none tracking-tight font-normal mb-3">
            Explorar & Estudiar, {user.name.split(' ')[0]}
          </h1>
          <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-sans max-w-xl">
            {t.home.welcomeSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('tutor')}
              className="px-6 py-3 bg-[#4F46E5] text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition flex items-center gap-2"
              id="hero-ai-chat-btn"
            >
              <Bot className="w-4 h-4 text-[#FF3D00]" />
              <span>Preguntar al Tutor IA</span>
            </button>
            <button
              onClick={() => onNavigate('scanner')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-widest transition flex items-center gap-2 border border-neutral-700"
              id="hero-scanner-btn"
            >
              <Camera className="w-4 h-4" />
              <span>Escanear Ejercicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Study Tools Hub */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E5E1] dark:border-neutral-800">
          <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#121212] dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <span>Herramientas Editorial IA</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div 
            onClick={() => onNavigate('tutor')}
            className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 hover:border-[#121212] transition cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Bot className="w-5 h-5 text-[#4F46E5]" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#FF3D00]">01</span>
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#121212] dark:text-white mb-1">Tutor IA 24/7</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight font-sans">
                Resolución de dudas paso a paso.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('scanner')}
            className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 hover:border-[#121212] transition cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Camera className="w-5 h-5 text-[#4F46E5]" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400">02</span>
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#121212] dark:text-white mb-1">Escáner OCR</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight font-sans">
                Fotografía tus apuntes o libros.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('generator')}
            className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 hover:border-[#121212] transition cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Layers className="w-5 h-5 text-[#4F46E5]" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400">03</span>
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#121212] dark:text-white mb-1">Generador Quizzes</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight font-sans">
                Flashcards y test interactivos.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('groups')}
            className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 hover:border-[#121212] transition cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-[#4F46E5]" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400">04</span>
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#121212] dark:text-white mb-1">Grupos Estudio</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight font-sans">
                Salas colaborativas en vivo.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Featured Notes Section - Editorial Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E5E1] dark:border-neutral-800">
          <div>
            <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#121212] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF3D00]" />
              <span>Tus Apuntes y Materiales</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] hover:underline flex items-center gap-1"
            id="view-all-library-btn"
          >
            <span>Ver biblioteca</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(!materials || materials.length === 0) ? (
          <div className="p-8 bg-white dark:bg-neutral-900 border border-dashed border-[#E5E5E1] dark:border-neutral-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-serif font-bold text-[#121212] dark:text-white">Empiezas con la biblioteca limpia</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto font-sans">
              No tienes ningún apunte creado todavía. Puedes subir tus propios archivos PDF/imágenes o usar el generador IA para crear esquemas y test al instante.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigate('generator')}
                className="px-4 py-2 bg-[#4F46E5] text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 transition"
              >
                Generar con IA
              </button>
              <button
                onClick={() => onNavigate('scanner')}
                className="px-4 py-2 bg-[#121212] text-white dark:bg-white dark:text-[#121212] font-bold text-xs uppercase tracking-wider transition"
              >
                Escanear Documento
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(materials || []).slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 flex flex-col justify-between min-h-[220px] transition hover:border-[#121212] dark:hover:border-neutral-600"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500 font-mono">
                      {item.subject} • {item.level}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#121212] dark:text-white font-serif">
                      <Star className="w-3.5 h-3.5 fill-[#FF3D00] text-[#FF3D00]" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onSelectMaterial(item)}
                    className="font-serif text-xl leading-snug font-normal text-[#121212] dark:text-white mb-3 hover:text-[#4F46E5] cursor-pointer transition"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E5E1] dark:border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#4F46E5]">
                      @{item.authorName.replace(/\s+/g, '')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-neutral-500 font-mono">
                    <button
                      onClick={() => onToggleLike(item.id)}
                      className={`flex items-center gap-1 transition ${
                        item.isLiked ? 'text-[#FF3D00] font-bold' : 'hover:text-[#FF3D00]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-[#FF3D00]' : ''}`} />
                      <span>{item.likesCount}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{item.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personal Progress Section */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E5E1] dark:border-neutral-800">
          <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#121212] dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF3D00]" />
            <span>Estado de Tu Racha &amp; Estudio</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">Racha Actual</div>
            <div className="text-2xl font-serif font-bold text-[#121212] dark:text-white">{user.streakDays} Días</div>
            <p className="text-[11px] text-neutral-500 font-sans">Estudia hoy para iniciar tu racha consecutiva.</p>
          </div>

          <div className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">Apuntes Guardados</div>
            <div className="text-2xl font-serif font-bold text-[#121212] dark:text-white">{materials.length}</div>
            <p className="text-[11px] text-neutral-500 font-sans">Añade o genera material de estudio.</p>
          </div>

          <div className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">Tutoría IA</div>
            <div className="text-2xl font-serif font-bold text-[#4F46E5]">Ilimitada</div>
            <p className="text-[11px] text-neutral-500 font-sans">Sin restricciones de mensajes diarios.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
