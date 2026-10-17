import React, { useState, useEffect, useRef } from 'react';
import '../../css/auth/loginPage.css';
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
import { AuthUser } from '../../types/auth';
import {
  authenticateWithGoogleCredential,
  getBackendApiUrl,
  setBackendApiUrl,
  getGoogleClientId,
  setGoogleClientId,
  DEFAULT_BACKEND_URL,
} from '../../services/authService';
import jaipurImg from '../../assets/images/travel_jaipur_india_1791122087611.jpg';

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
    <div className="auth-container">
      {/* Left Column: Visual Travel Showcase (Hidden on small mobile) */}
      <div className="auth-hero-pane">
        <img
          src={jaipurImg}
          alt="Travel Destination"
          className="auth-hero-bg"
        />
        <div className="auth-hero-overlay" />

        <div className="auth-hero-content">
          {/* Logo in hero */}
          <div className="auth-hero-logo">
            <div className="auth-logo-badge">
              <Compass size={20} />
            </div>
            <span className="auth-hero-brand-name">
              WanderKanban
            </span>
          </div>

          {/* Inspirational quote & value highlights */}
          <div className="auth-hero-body">
            <div className="auth-hero-pill">
              <Sparkles size={14} />
              <span>Smart Travel Itinerary Planner</span>
            </div>
            <h2 className="auth-hero-title">
              Turn your dream destinations into seamless daily adventures.
            </h2>
            <p className="auth-hero-desc">
              Sign in with your Google account to synchronize your trips, customize daily Kanban columns, track expenses in real-time, and get on-demand attraction suggestions.
            </p>

            <div className="auth-value-grid">
              <div className="auth-value-item">
                <Check size={16} />
                <span>Daily Visual Kanban Columns</span>
              </div>
              <div className="auth-value-item">
                <Check size={16} />
                <span>Real-Time Budget Analytics</span>
              </div>
              <div className="auth-value-item">
                <Check size={16} />
                <span>India & World Destinations</span>
              </div>
              <div className="auth-value-item">
                <Check size={16} />
                <span>One-Click Secure Google Login</span>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            Powered by WanderKanban & Google Identity Services
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="auth-form-pane">
        <div className="auth-card-wrapper">
          {/* Top back navigation */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="auth-back-btn"
            >
              <ArrowLeft size={16} />
              <span>Back to Travel Explorer</span>
            </button>
          )}

          {/* Heading */}
          <div className="auth-header">
            <h1 className="auth-title">
              Sign in to WanderKanban
            </h1>
            <p className="auth-subtitle">
              Continue with your verified Google account to manage your trips.
            </p>
          </div>

          {/* Backend Info Pill */}
          <div className="auth-endpoint-bar">
            <div className="auth-endpoint-content">
              <Server size={16} />
              <div className="auth-endpoint-text-wrap">
                <span className="auth-endpoint-label">
                  Auth Backend Endpoint
                </span>
                <span className="auth-endpoint-value">
                  POST {backendUrl}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              title="Configure API Endpoint & Client ID"
              className="auth-icon-btn"
            >
              <Settings2 size={16} />
            </button>
          </div>

          {/* Config Drawer (Expandable) */}
          {showConfig && (
            <form
              onSubmit={handleSaveConfig}
              className="auth-config-drawer"
            >
              <div className="auth-config-header">
                <span className="auth-config-title">
                  Backend & Google OAuth Settings
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBackendUrlState(DEFAULT_BACKEND_URL);
                    setBackendApiUrl(DEFAULT_BACKEND_URL);
                  }}
                  className="auth-reset-btn"
                >
                  Reset Default
                </button>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">
                  Authentication Endpoint URL
                </label>
                <input
                  type="text"
                  required
                  value={backendUrl}
                  onChange={(e) => setBackendUrlState(e.target.value)}
                  placeholder="http://localhost:4000/api/auth/google"
                  className="auth-input"
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">
                  Google Client ID (Optional custom)
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientIdState(e.target.value)}
                  placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                  className="auth-input"
                />
              </div>

              <div className="auth-config-actions">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="auth-btn-cancel"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="auth-btn-save"
                >
                  Save Settings
                </button>
              </div>
            </form>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="auth-alert-error">
              <AlertCircle size={16} className="auth-alert-icon" />
              <div className="auth-alert-body">
                <p className="auth-alert-title">Authentication Error</p>
                <p className="auth-alert-msg">{errorMessage}</p>
                <div className="auth-alert-actions">
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="auth-alert-link"
                  >
                    Open manual token tester
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="auth-alert-dismiss"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert-success">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MAIN GOOGLE LOGIN BUTTON CONTAINER */}
          <div className="auth-main-card">
            <div className="auth-card-title-group">
              <h3 className="auth-card-category">
                Single Sign-On
              </h3>
              <p className="auth-card-instruction">
                Click below to authenticate using Google:
              </p>
            </div>

            {/* Official Google Identity Services Rendered Container */}
            <div className="auth-google-wrapper">
              <div
                ref={googleButtonRef}
                className={`auth-google-button-container ${isLoading ? 'loading' : ''}`}
              />

              {/* Custom Styled Google Button (Always visible fallback & trigger) */}
              {(!gisLoaded || !googleButtonRef.current?.children.length) && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleCustomGoogleClick}
                  className="auth-custom-google-btn"
                >
                  {/* Google Multicolor SVG Icon */}
                  <svg className="auth-google-svg" viewBox="0 0 24 24">
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
                <div className="auth-loading-overlay">
                  <RefreshCw size={16} className="auth-loading-spinner" />
                  <span>Verifying with backend...</span>
                </div>
              )}
            </div>

            <div className="auth-trust-note">
              <ShieldCheck size={14} />
              <span>Direct verification via POST to your API</span>
            </div>
          </div>

          {/* Developer / Manual Token Tester Drawer */}
          <div className="auth-tester-box">
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="auth-tester-toggle"
            >
              <span className="auth-tester-toggle-label">
                <KeyRound size={14} />
                <span>Test Backend with Custom Credential</span>
              </span>
              <span className="auth-tester-toggle-status">
                {showManualInput ? 'Hide' : 'Show'}
              </span>
            </button>

            {showManualInput && (
              <div className="auth-tester-content">
                <p className="auth-tester-desc">
                  You can test sending a custom token or mock token directly to <code>{backendUrl}</code> to verify your backend handler:
                </p>
                <div className="auth-tester-row">
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Enter Google credential or leave blank for demo"
                    className="auth-tester-input"
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleTestBackend}
                    className="auth-tester-btn"
                  >
                    Send POST
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="auth-footer-disclaimer">
            By signing in, you connect your WanderKanban workspace with your server account.
          </p>
        </div>
      </div>
    </div>
  );
};
