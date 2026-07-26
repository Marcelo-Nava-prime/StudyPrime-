import React from 'react';
import { 
  Trophy, 
  Users, 
  Star, 
  Flame, 
  Crown, 
  CheckCircle, 
  BookOpen, 
  Award,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { UserProfile, Language } from '../types';

interface CommunityViewProps {
  users: UserProfile[];
  currentUser: UserProfile;
  language: Language;
  onToggleFollow: (userId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  users,
  currentUser,
  language,
  onToggleFollow
}) => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          <span>Comunidad y Creadores (Knowers)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Descubre los estudiantes y profesores más destacados, sigue a creadores de contenido y revisa la clasificación semanal.
        </p>
      </div>

      {/* Leaderboard Podium Top 3 */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shadow-xl space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 text-center">
          🏆 Top 3 Knowers de la Semana
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(users || []).slice(0, 3).map((knower, index) => (
            <div 
              key={knower.id}
              className={`p-5 rounded-2xl border text-center relative space-y-3 ${
                index === 0
                  ? 'bg-amber-500/10 border-amber-400/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/60 border-slate-700'
              }`}
            >
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                #{index + 1}
              </div>

              <img
                src={knower.avatar}
                alt=""
                className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-teal-500/40"
              />

              <div>
                <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1">
                  <span>{knower.name}</span>
                  {knower.role === 'Knower' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{knower.username}</p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-around text-xs font-bold text-amber-300">
                <span>{knower.points} pts</span>
                <span>•</span>
                <span>{knower.followersCount} seguidores</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Community Knowers Directory */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Directorio de Estudiantes y Creadores
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(users || []).map((knower) => {
            if (knower.id === currentUser.id) return null;

            return (
              <div 
                key={knower.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={knower.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-teal-500/30"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {knower.name}
                      </h4>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {knower.level}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {knower.bio}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mt-2">
                      <span>📚 {knower.itemsPublished} publicaciones</span>
                      <span>•</span>
                      <span>👥 {knower.followersCount} seguidores</span>
                      <span>•</span>
                      <span className="text-teal-600 dark:text-teal-400 font-bold">{knower.points} pts</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFollow(knower.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 ${
                    knower.isFollowing
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      : 'bg-teal-600 text-white hover:bg-teal-500 shadow-xs'
                  }`}
                >
                  {knower.isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Siguiendo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Seguir</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
