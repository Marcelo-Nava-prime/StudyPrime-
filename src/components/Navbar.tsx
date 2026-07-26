import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Flame, 
  Sparkles, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  Crown, 
  Check, 
  X,
  PlusCircle,
  Menu
} from 'lucide-react';
import { UserProfile, NotificationItem, Language } from '../types';
import { translations } from '../lib/translations';

interface NavbarProps {
  user: UserProfile;
  notifications?: NotificationItem[];
  language: Language;
  setLanguage?: (lang: Language) => void;
  onLanguageChange?: (lang: Language) => void;
  isDarkMode?: boolean;
  darkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  onToggleDarkMode?: () => void;
  searchQuery: string;
  setSearchQuery?: (query: string) => void;
  onSearchChange?: (query: string) => void;
  onOpenUpload: () => void;
  onOpenProfile: () => void;
  onOpenPremium: () => void;
  onOpenAdmin?: () => void;
  onNavigate?: (view: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications = [],
  language,
  setLanguage,
  onLanguageChange,
  isDarkMode,
  darkMode,
  setIsDarkMode,
  onToggleDarkMode,
  searchQuery,
  setSearchQuery,
  onSearchChange,
  onOpenUpload,
  onOpenProfile,
  onOpenPremium,
  onOpenAdmin,
  onNavigate,
  onToggleMobileSidebar
}) => {
  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter(n => !n.read).length;
  const isDark = isDarkMode ?? darkMode ?? false;

  const handleLanguageToggle = () => {
    const nextLang = language === 'es' ? 'en' : 'es';
    if (setLanguage) {
      setLanguage(nextLang);
    }
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };

  const handleDarkModeToggle = () => {
    if (setIsDarkMode) {
      setIsDarkMode(!isDark);
    }
    if (onToggleDarkMode) {
      onToggleDarkMode();
    }
  };

  const handleSearchChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
    }
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDFDFB] dark:bg-[#121212] border-b border-[#E5E5E1] dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Toggle & Editorial Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-[#121212] dark:text-white hover:bg-[#F5F5F1] dark:hover:bg-neutral-800 rounded-sm transition"
            aria-label="Toggle Menu"
            id="mobile-menu-btn"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="w-8 h-8 rounded-sm bg-[#121212] dark:bg-white text-white dark:text-[#121212] flex items-center justify-center font-serif text-base italic font-bold">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-serif font-bold italic tracking-tight text-[#121212] dark:text-white">
                  StudyPrime
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#4F46E5] text-white rounded-none">
                  IA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Editorial Pill Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t.common.search}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-100 placeholder-neutral-400 border border-transparent focus:border-[#4F46E5] focus:bg-white dark:focus:bg-neutral-900 focus:outline-none transition font-sans"
              id="global-search-input"
            />
          </div>
        </div>

        {/* Right: Quick Controls, Streak, Plan & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none bg-[#121212] text-white dark:bg-white dark:text-[#121212] hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition"
            id="upload-note-header-btn"
          >
            <PlusCircle className="w-4 h-4 text-[#FF3D00]" />
            <span>{t.common.uploadNote}</span>
          </button>

          {/* Streak Counter */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] text-white text-xs font-mono font-bold tracking-wider"
            title={`${user.streakDays} ${t.common.streak}`}
            id="streak-counter"
          >
            <Flame className="w-3.5 h-3.5 text-[#FF3D00] fill-[#FF3D00]" />
            <span>{user.streakDays}D</span>
          </div>

          {/* Plan Badge - Free & Unlimited */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#4F46E5] text-white"
            id="plan-badge-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF3D00]" />
            <span className="hidden sm:inline">IA Ilimitada</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            className="p-2 text-[#121212] dark:text-neutral-300 hover:bg-[#F1F1ED] dark:hover:bg-neutral-800 transition text-xs font-bold tracking-widest uppercase flex items-center gap-1"
            title="Cambiar Idioma / Switch Language"
            id="language-switch-btn"
          >
            <Globe className="w-4 h-4" />
            <span>{language}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleDarkModeToggle}
            className="p-2 text-[#121212] dark:text-neutral-300 hover:bg-[#F1F1ED] dark:hover:bg-neutral-800 transition"
            aria-label="Toggle Theme"
            id="dark-mode-btn"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#121212]" />}
          </button>

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-[#121212] dark:text-neutral-300 hover:bg-[#F1F1ED] dark:hover:bg-neutral-800 transition relative"
              aria-label="Notifications"
              id="notifications-btn"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF3D00]" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#FDFDFB] dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 p-4 z-50 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white font-serif">Notificaciones</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-neutral-400 hover:text-[#121212] dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {safeNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 text-xs border ${
                        notif.read 
                          ? 'bg-[#F5F5F1] dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400 border-[#E5E5E1] dark:border-neutral-800' 
                          : 'bg-white dark:bg-neutral-900 text-[#121212] dark:text-neutral-100 font-medium border-[#4F46E5]'
                      }`}
                    >
                      <div className="font-bold text-[#4F46E5] uppercase tracking-wider text-[10px] mb-0.5">{notif.title}</div>
                      <div>{notif.message}</div>
                      <div className="text-[10px] text-neutral-400 mt-1 font-mono">{notif.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center cursor-pointer border border-[#E5E5E1] dark:border-neutral-700 hover:border-[#121212] transition ml-1 p-0.5"
            id="user-avatar-btn"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 object-cover rounded-none"
            />
          </div>

        </div>

      </div>
    </header>
  );
};
