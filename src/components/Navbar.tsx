import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Plus,
  SlidersHorizontal,
  Share2,
  MapPin,
  Sun,
  Moon,
  Home,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Trip } from '../types/trip';
import { AuthUser } from '../types/auth';

export type ActiveView = 'home' | 'kanban' | 'timeline' | 'budget' | 'packing' | 'login';

interface NavbarProps {
  currentTrip: Trip | null;
  allTrips: Trip[];
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onSelectTrip: (tripId: string) => void;
  onOpenNewTrip: () => void;
  onOpenTripSettings: () => void;
  onOpenExportModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  authUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTrip,
  allTrips,
  activeView,
  onViewChange,
  onSelectTrip,
  onOpenNewTrip,
  onOpenTripSettings,
  onOpenExportModal,
  isDarkMode,
  onToggleTheme,
  authUser,
  onOpenLogin,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Wordmark & Trip Switcher */}
      <div className="flex items-center gap-4 min-w-0">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onViewChange('home');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm">
            <Compass className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          </div>
          <span className="font-['Plus_Jakarta_Sans',sans-serif]">WanderKanban</span>
        </a>

        {/* Current Trip Switcher (if on planning views) */}
        {currentTrip && activeView !== 'home' && activeView !== 'login' && (
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentTrip.id}
              onChange={(e) => onSelectTrip(e.target.value)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-none cursor-pointer focus:ring-0 focus:outline-none pr-6 py-1 truncate max-w-[200px]"
            >
              {allTrips.map((t) => (
                <option key={t.id} value={t.id} className="dark:bg-slate-900">
                  {t.flag} {t.destination} ({t.numberOfDays}d)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation Links / Segmented Control */}
      <nav aria-label="Views" className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
        <button
          onClick={() => onViewChange('home')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'home'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </button>

        <button
          onClick={() => onViewChange('kanban')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'kanban'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Kanban Board
        </button>

        <button
          onClick={() => onViewChange('timeline')}
          className={`hidden md:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'timeline'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Timeline
        </button>

        <button
          onClick={() => onViewChange('budget')}
          className={`hidden md:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'budget'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Budget
        </button>

        <button
          onClick={() => onViewChange('packing')}
          className={`hidden sm:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'packing'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Packing
        </button>
      </nav>

      {/* Zone 3: Theme Toggle + Auth User / Sign In + Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light mode"
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {currentTrip && activeView !== 'home' && activeView !== 'login' && (
          <>
            <button
              onClick={onOpenExportModal}
              title="Share or Export Itinerary"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onOpenTripSettings}
              title="Trip Settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </>
        )}

        <button
          onClick={onOpenNewTrip}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Trip</span>
        </button>

        {/* AUTH SECTION: User Avatar or Google Sign-In */}
        {authUser ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
            >
              <img
                src={authUser.picture}
                alt={authUser.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/a/default-user=s96-c';
                }}
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden md:inline">
                {authUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={authUser.picture}
                    alt={authUser.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {authUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {authUser.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Google Authenticated</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>User ID:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      #{authUser.id}
                    </span>
                  </div>
                  {authUser.google_id && (
                    <div className="flex justify-between">
                      <span>Google ID:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                        {authUser.google_id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs transition-colors cursor-pointer"
          >
            {/* Google G icon */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
