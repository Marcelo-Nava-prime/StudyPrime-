import React from 'react';
import { 
  Home, 
  BookOpen, 
  Bot, 
  Camera, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Users, 
  Trophy, 
  Crown, 
  ShieldAlert,
  ChevronRight,
  Flame,
  Plus
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../lib/translations';

interface SidebarProps {
  currentView?: string;
  activeTab?: string;
  onNavigate?: (view: string) => void;
  onSelectTab?: (view: string) => void;
  language: Language;
  user: UserProfile;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenUpload: () => void;
  onOpenPremium?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeTab,
  onNavigate,
  onSelectTab,
  language,
  user,
  isOpenMobile = false,
  onCloseMobile,
  onOpenUpload,
  onOpenPremium
}) => {
  const t = translations[language];
  const active = currentView || activeTab || 'feed';

  const menuItems = [
    { id: 'feed', altId: 'home', label: t.nav.home, icon: Home, badge: null },
    { id: 'library', label: t.nav.library, icon: BookOpen, badge: 'General' },
    { id: 'tutor', label: t.nav.aiTutor, icon: Bot, badge: 'IA 24/7' },
    { id: 'scanner', label: t.nav.scanner, icon: Camera, badge: 'OCR' },
    { id: 'generator', label: t.nav.generator, icon: Sparkles, badge: 'IA' },
    { id: 'flashcards', label: t.nav.flashcards, icon: Layers, badge: null },
    { id: 'quiz', altId: 'quizzes', label: t.nav.quizzes, icon: CheckCircle2, badge: null },
    { id: 'groups', label: t.nav.groups, icon: Users, badge: null },
  ];

  if (user.role === 'Admin' || user.role === 'Moderador') {
    menuItems.push({ id: 'admin', label: t.nav.admin, icon: ShieldAlert, badge: 'Mod' });
  }

  const handleSelect = (id: string) => {
    if (id === 'premium' && onOpenPremium) {
      onOpenPremium();
    } else {
      if (onNavigate) onNavigate(id);
      if (onSelectTab) onSelectTab(id as any);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-[#FDFDFB] dark:bg-[#121212] border-r border-[#E5E5E1] dark:border-neutral-800 flex flex-col justify-between p-6 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        id="app-sidebar"
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          
          {/* Main Upload CTA */}
          <button
            onClick={() => {
              onOpenUpload();
              onCloseMobile();
            }}
            className="w-full py-3 px-4 bg-[#121212] text-white dark:bg-white dark:text-[#121212] font-semibold text-xs uppercase tracking-widest hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition flex items-center justify-center gap-2"
            id="sidebar-upload-cta"
          >
            <Plus className="w-4 h-4 text-[#FF3D00]" />
            <span>{t.common.uploadNote}</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <p className="px-1 text-[10px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mb-3 font-mono">
              Navegación
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id || active === item.altId;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition border-b ${
                    isActive
                      ? 'text-[#121212] dark:text-white border-[#4F46E5] font-bold opacity-100 bg-[#F5F5F1]/50 dark:bg-neutral-800/40'
                      : 'text-[#121212]/50 dark:text-neutral-400 border-transparent hover:text-[#121212] dark:hover:text-white hover:border-[#E5E5E1]'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F46E5]' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-none ${
                      item.badge === 'IA 24/7' || item.badge === 'IA'
                        ? 'bg-[#4F46E5] text-white'
                        : item.badge === 'PRO' || item.badge === 'ACTIVO'
                        ? 'bg-[#FF3D00] text-white'
                        : 'bg-[#E5E5E1] text-[#121212] dark:bg-neutral-800 dark:text-neutral-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Streak Card - Editorial Dark Box */}
        <div className="pt-4 border-t border-[#E5E5E1] dark:border-neutral-800">
          <div className="bg-[#121212] text-white p-4 rounded-none border border-neutral-800">
            <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
              Racha de Estudio
            </div>
            <div className="font-serif text-3xl font-bold tracking-tight text-white mb-1">
              {user.streakDays} Días
            </div>
            <div className="text-[11px] text-neutral-300 flex items-center justify-between mt-2 font-mono">
              <span>{user.points} XP acumulados</span>
              <Flame className="w-4 h-4 text-[#FF3D00] fill-[#FF3D00]" />
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
