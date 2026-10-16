import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Server,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Check,
} from 'lucide-react';
import { AuthUser } from '../types/auth';
import {
  authenticateWithGoogleCredential,
  getBackendApiUrl,
  setBackendApiUrl,
  getGoogleClientId,
  setGoogleClientId,
  DEFAULT_BACKEND_URL,
} from '../utils/auth';
import jaipurImg from '../assets/images/travel_jaipur_india_1791122087611.jpg';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser, token: string) => void;
  onCancel?: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement | null,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              width?: number | string;
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
            }
          ) => void;
          prompt: (notification?: (notification: any) => void) => void;
        };
      };
    };
  }
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [backendUrl, setBackendUrlState] = useState<string>(getBackendApiUrl());
  const [clientId, setClientIdState] = useState<string>(getGoogleClientId());
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manual token test input for developer convenience
  const [manualToken, setManualToken] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [gisLoaded, setGisLoaded] = useState<boolean>(false);

  // Handle successful credential received from Google
  const handleGoogleCredential = async (credential: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await authenticateWithGoogleCredential(credential, backendUrl);
      setSuccessMessage(`Signed in successfully as ${result.user.name}`);
      setTimeout(() => {
        onLoginSuccess(result.user, result.token);
      }, 700);
    } catch (err: any) {
      console.error('Google Auth backend error:', err);
      let message = err.message || 'Failed to authenticate with backend server.';
      if (
        message.includes('Failed to fetch') ||
        message.includes('NetworkError') ||
        message.includes('ERR_CONNECTION_REFUSED')
      ) {
        message = `Cannot reach backend at ${backendUrl}. Ensure your server is running on port 4000 and CORS is enabled (e.g., app.use(cors())).`;
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const initGis = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: { credential: string }) => {
              if (response.credential) {
                handleGoogleCredential(response.credential);
              }
            },
          });

          // Clear previous buttons and render fresh button
          googleButtonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });

          setGisLoaded(true);
        } catch (e) {
          console.warn('GIS initialization error:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGis();
    } else {
      checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGis();
          clearInterval(checkInterval);
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId, backendUrl]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setBackendApiUrl(backendUrl);
    setGoogleClientId(clientId);
    setShowConfig(false);
    setErrorMessage(null);
  };

  // Quick fallback prompt if user clicks the custom styled Google button
  const handleCustomGoogleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap is blocked or skipped, focus user on rendered button or manual option
          setShowManualInput(true);
        }
      });
    } else {
      setShowManualInput(true);
    }
  };

  // Quick test demo credentials against user's backend
  const handleTestBackend = () => {
    const demoToken = manualToken.trim() || 'demo_google_id_token_xyz123';
    handleGoogleCredential(demoToken);
  };

  return (
    <div className="flex-1 min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Left Column: Visual Travel Showcase (Hidden on small mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden select-none">
        <img
          src={jaipurImg}
          alt="Travel Destination"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo in hero */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              WanderKanban
            </span>
          </div>

          {/* Inspirational quote & value highlights */}
          <div className="space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Travel Itinerary Planner</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Turn your dream destinations into seamless daily adventures.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sign in with your Google account to synchronize your trips, customize daily Kanban columns, track expenses in real-time, and get on-demand attraction suggestions.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Daily Visual Kanban Columns</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Budget Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>India & World Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>One-Click Secure Google Login</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Powered by WanderKanban & Google Identity Services
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Top back navigation */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Travel Explorer</span>
            </button>
          )}

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                WanderKanban
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign in to WanderKanban
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Continue with your verified Google account to manage your trips.
            </p>
          </div>

          {/* Backend Info Pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Server className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Auth Backend Endpoint
                </span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold truncate block">
                  POST {backendUrl}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              title="Configure API Endpoint & Client ID"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          {/* Config Drawer (Expandable) */}
          {showConfig && (
            <form
              onSubmit={handleSaveConfig}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">
                  Backend & Google OAuth Settings
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBackendUrlState(DEFAULT_BACKEND_URL);
                    setBackendApiUrl(DEFAULT_BACKEND_URL);
                  }}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Reset Default
                </button>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Authentication Endpoint URL
                </label>
                <input
                  type="text"
                  required
                  value={backendUrl}
                  onChange={(e) => setBackendUrlState(e.target.value)}
                  placeholder="http://localhost:4000/api/auth/google"
                  className="w-full px-3 py-1.5 font-mono text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Your backend should accept POST with JSON body: &#123; "credential": "token_id" &#125;
                </span>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Google Client ID (Optional custom)
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientIdState(e.target.value)}
                  placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                  className="w-full px-3 py-1.5 font-mono text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
                >
                  Save Settings
                </button>
              </div>
            </form>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold">Authentication Error</p>
                <p className="text-[11px] leading-relaxed text-rose-600 dark:text-rose-400">{errorMessage}</p>
                <div className="pt-1.5 flex items-center gap-2 text-[11px]">
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="underline font-semibold hover:text-rose-900 dark:hover:text-rose-200 cursor-pointer"
                  >
                    Open manual token tester
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="hover:underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* MAIN GOOGLE LOGIN BUTTON CONTAINER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Single Sign-On
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Click below to authenticate using Google:
              </p>
            </div>

            {/* Official Google Identity Services Rendered Container */}
            <div className="flex flex-col items-center justify-center min-h-[48px] relative">
              <div
                ref={googleButtonRef}
                className={`transition-opacity duration-200 ${isLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
              />

              {/* Custom Styled Google Button (Always visible fallback & trigger) */}
              {(!gisLoaded || !googleButtonRef.current?.children.length) && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleCustomGoogleClick}
                  className="w-full max-w-[320px] flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {/* Google Multicolor SVG Icon */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span>Sign in with Google</span>
                </button>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 rounded-lg backdrop-blur-2xs gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Verifying with backend...
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct verification via POST to your API</span>
            </div>
          </div>

          {/* Developer / Manual Token Tester Drawer */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 p-4 text-xs space-y-3">
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="w-full flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Test Backend with Custom Credential</span>
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                {showManualInput ? 'Hide' : 'Show'}
              </span>
            </button>

            {showManualInput && (
              <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  You can test sending a custom token or mock token directly to <code className="font-mono">{backendUrl}</code> to verify your backend handler:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Enter Google credential or leave blank for demo"
                    className="flex-1 px-3 py-1.5 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleTestBackend}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Send POST
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
            By signing in, you connect your WanderKanban workspace with your server account.
          </p>
        </div>
      </div>
    </div>
  );
};
