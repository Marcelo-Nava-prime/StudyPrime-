import React from 'react';
import { X, Crown, Star, Flame, Trophy, Award, BookOpen, Users } from 'lucide-react';
import { UserProfile, StudyMaterial, Language } from '../types';

interface UserProfileModalProps {
  user: UserProfile;
  userMaterials: StudyMaterial[];
  language: Language;
  onClose: () => void;
  onOpenPremium: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  userMaterials,
  language,
  onClose,
  onOpenPremium
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Cover Header */}
        <div className="h-32 bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-900/40 text-white hover:bg-slate-900/70 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Stats Card */}
        <div className="p-6 relative -mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={user.avatar}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg"
              />
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{user.name}</span>
                  <Crown className="w-4 h-4 text-amber-500" />
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.username}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPremium();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md hover:opacity-90 transition"
            >
              {user.plan === 'premium' ? 'Suscripción PRO Activa ✓' : 'Mejorar a Plan PRO ⭐'}
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {user.bio}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 text-center py-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">{user.points}</span>
              <span className="text-[10px] font-semibold text-slate-400">PUNTOS</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">{user.streakDays}d</span>
              <span className="text-[10px] font-semibold text-slate-400">RACHA</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">{user.followersCount}</span>
              <span className="text-[10px] font-semibold text-slate-400">SEGUIDORES</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">{userMaterials.length}</span>
              <span className="text-[10px] font-semibold text-slate-400">APUNTES</span>
            </div>
          </div>

          {/* Badges Gallery */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Insignias y Logros Desbloqueados</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(user.badges || []).map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">{b.name}</h4>
                    <p className="text-[9px] text-slate-400 line-clamp-1">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
