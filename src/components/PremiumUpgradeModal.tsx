import React from 'react';
import { X, Crown, Check, Sparkles, Bot, Zap, ShieldCheck } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface PremiumUpgradeModalProps {
  user: UserProfile;
  language: Language;
  onClose: () => void;
  onTogglePlan: (newPlan: 'free' | 'premium') => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  user,
  language,
  onClose,
  onTogglePlan
}) => {
  const isPremium = user.plan === 'premium';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                StudyPrime PRO
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Desbloquea el poder total de la Inteligencia Artificial para tus exámenes.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Comparison Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Free Tier */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Plan Gratuito
            </h3>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              0€ <span className="text-xs font-normal text-slate-400">/ siempre</span>
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Acceso a biblioteca de apuntes</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 5 consultas de IA diarias</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Grupos de estudio</li>
            </ul>
          </div>

          {/* Premium Tier */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-amber-500/10 border-2 border-amber-400/80 space-y-3 relative overflow-hidden">
            <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-extrabold rounded bg-amber-400 text-slate-950 uppercase">
              RECOMENDADO
            </span>
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Plan PRO
            </h3>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              4,99€ <span className="text-xs font-normal text-slate-400">/ mes</span>
            </p>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Consultas IA 24/7 ILIMITADAS</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Escáner de ejercicios ilimitado</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Generador de Flashcards ilimitado</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Insignia PRO en tu perfil</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Sin anuncios ni interrupciones</li>
            </ul>
          </div>

        </div>

        {/* Action Toggle */}
        <div className="pt-2">
          <button
            onClick={() => {
              onTogglePlan(isPremium ? 'free' : 'premium');
              onClose();
            }}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg ${
              isPremium
                ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white hover:opacity-90'
            }`}
          >
            {isPremium ? 'Cambiar a Plan Gratuito' : '⚡ Activar Suscripción StudyPrime PRO Instantáneamente'}
          </button>
        </div>

      </div>
    </div>
  );
};
