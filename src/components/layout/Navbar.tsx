import React, { useState, useRef, useEffect } from 'react';
import '../../css/layout/navbar.css';
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
import { Trip } from '../../types/trip';
import { AuthUser } from '../../types/auth';

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
    <header className="navbar-header">
      {/* Zone 1: Wordmark & Trip Switcher */}
      <div className="navbar-brand-zone">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onViewChange('home');
          }}
          className="navbar-brand"
        >
          <div className="navbar-brand-icon">
            <Compass size={18} />
          </div>
          <span>WanderKanban</span>
        </a>

        {/* Current Trip Switcher (if on planning views) */}
        {currentTrip && activeView !== 'home' && activeView !== 'login' && (
          <div className="navbar-trip-select-wrapper">
            <MapPin size={14} />
            <select
              value={currentTrip.id}
              onChange={(e) => onSelectTrip(e.target.value)}
              className="navbar-trip-select"
            >
              {allTrips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.flag} {t.destination} ({t.numberOfDays}d)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation Links / Segmented Control */}
      <nav aria-label="Views" className="navbar-nav">
        <button
          onClick={() => onViewChange('home')}
          className={`navbar-nav-item ${activeView === 'home' ? 'active' : ''}`}
        >
          <Home size={14} />
          <span>Home</span>
        </button>

        <button
          onClick={() => onViewChange('kanban')}
          className={`navbar-nav-item ${activeView === 'kanban' ? 'active' : ''}`}
        >
          Kanban Board
        </button>

        <button
          onClick={() => onViewChange('timeline')}
          className={`navbar-nav-item hide-mobile ${activeView === 'timeline' ? 'active' : ''}`}
        >
          Timeline
        </button>

        <button
          onClick={() => onViewChange('budget')}
          className={`navbar-nav-item hide-mobile ${activeView === 'budget' ? 'active' : ''}`}
        >
          Budget
        </button>

        <button
          onClick={() => onViewChange('packing')}
          className={`navbar-nav-item hide-mobile ${activeView === 'packing' ? 'active' : ''}`}
        >
          Packing
        </button>
      </nav>

      {/* Zone 3: Theme Toggle + Auth User / Sign In + Actions */}
      <div className="navbar-actions">
        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light mode"
          className="navbar-theme-btn"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {currentTrip && activeView !== 'home' && activeView !== 'login' && (
          <>
            <button
              onClick={onOpenExportModal}
              title="Share or Export Itinerary"
              className="navbar-secondary-btn"
            >
              <Share2 size={14} />
              <span>Export</span>
            </button>
            <button
              onClick={onOpenTripSettings}
              title="Trip Settings"
              className="navbar-secondary-btn"
            >
              <SlidersHorizontal size={14} />
              <span>Settings</span>
            </button>
          </>
        )}

        <button
          onClick={onOpenNewTrip}
          className="navbar-primary-btn"
        >
          <Plus size={14} />
          <span>New Trip</span>
        </button>

        {/* AUTH SECTION: User Avatar or Google Sign-In */}
        {authUser ? (
          <div className="navbar-profile-wrap" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="navbar-avatar-btn"
            >
              <img
                src={authUser.picture}
                alt={authUser.name}
                referrerPolicy="no-referrer"
                className="navbar-avatar-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/a/default-user=s96-c';
                }}
              />
              <span className="navbar-avatar-name">
                {authUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={12} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="navbar-profile-dropdown">
                <div className="navbar-dropdown-header">
                  <img
                    src={authUser.picture}
                    alt={authUser.name}
                    referrerPolicy="no-referrer"
                    className="navbar-dropdown-avatar"
                  />
                  <div className="navbar-dropdown-user-info">
                    <p className="navbar-dropdown-name">
                      {authUser.name}
                    </p>
                    <p className="navbar-dropdown-email">
                      {authUser.email}
                    </p>
                    <div className="navbar-dropdown-badge">
                      <ShieldCheck size={12} />
                      <span>Google Authenticated</span>
                    </div>
                  </div>
                </div>

                <div className="navbar-dropdown-details">
                  <div className="navbar-dropdown-row">
                    <span>User ID:</span>
                    <span>#{authUser.id}</span>
                  </div>
                  {authUser.google_id && (
                    <div className="navbar-dropdown-row">
                      <span>Google ID:</span>
                      <span className="navbar-truncate">{authUser.google_id}</span>
                    </div>
                  )}
                </div>

                <div className="navbar-dropdown-footer">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="navbar-signout-btn"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="navbar-signin-btn"
          >
            {/* Google G icon */}
            <svg className="navbar-google-icon" viewBox="0 0 24 24">
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
