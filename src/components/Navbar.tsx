import React from 'react';
import { Compass, Plus, SlidersHorizontal, Share2, MapPin, Sun, Moon, Home } from 'lucide-react';
import { Trip } from '../types/trip';

export type ActiveView = 'home' | 'kanban' | 'timeline' | 'budget' | 'packing';

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
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Single text element wordmark + subtle trip selector */}
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
        {currentTrip && activeView !== 'home' && (
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
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
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
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'kanban'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Kanban Board
        </button>

        <button
          onClick={() => onViewChange('timeline')}
          className={`hidden md:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'timeline'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Timeline
        </button>

        <button
          onClick={() => onViewChange('budget')}
          className={`hidden md:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'budget'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Budget
        </button>

        <button
          onClick={() => onViewChange('packing')}
          className={`hidden sm:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeView === 'packing'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Packing
        </button>
      </nav>

      {/* Zone 3: Theme Toggle + Primary Actions */}
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

        {currentTrip && activeView !== 'home' && (
          <>
            <button
              onClick={onOpenExportModal}
              title="Share or Export Itinerary"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onOpenTripSettings}
              title="Trip Settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </>
        )}

        <button
          onClick={onOpenNewTrip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Trip</span>
        </button>
      </div>
    </header>
  );
};
