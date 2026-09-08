import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "github" | "email";
  role?: "creator" | "member" | "pro" | "founder";
  joinedAt: string;
  tagline?: string;
  reputation?: number;
  emailVerified?: boolean;
  login?: string;
}

export type AuthMode = "signin" | "signup";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  googleClientId: string;
  setGoogleClientId: (id: string) => void;
  githubClientId: string;
  setGithubClientId: (id: string) => void;
  githubClientSecret: string;
  setGithubClientSecret: (secret: string) => void;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthMode) => void;
  loginWithGoogle: () => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  signupWithGitHub: () => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password?: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "novixui_auth_user";
const GOOGLE_CLIENT_ID_KEY = "novixui_google_client_id";
const GITHUB_CLIENT_ID_KEY = "novixui_github_client_id";
const GITHUB_CLIENT_SECRET_KEY = "novixui_github_client_secret";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>("signup");

  // OAuth Credentials state
  const [googleClientId, setGoogleClientIdState] = useState<string>("");
  const [githubClientId, setGithubClientIdState] = useState<string>("");
  const [githubClientSecret, setGithubClientSecretState] = useState<string>("");

  // Hydrate user and config from localStorage & env
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const envGoogleId = (import.meta as { env?: { VITE_GOOGLE_CLIENT_ID?: string } }).env
          ?.VITE_GOOGLE_CLIENT_ID;
        const storedGoogleId = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
        setGoogleClientIdState(storedGoogleId || envGoogleId || "");

        const envGithubId = (import.meta as { env?: { VITE_GITHUB_CLIENT_ID?: string } }).env
          ?.VITE_GITHUB_CLIENT_ID;
        const storedGithubId = localStorage.getItem(GITHUB_CLIENT_ID_KEY);
        setGithubClientIdState(storedGithubId || envGithubId || "");

        const storedGithubSecret = localStorage.getItem(GITHUB_CLIENT_SECRET_KEY);
        setGithubClientSecretState(storedGithubSecret || "");
      }
    } catch (e) {
      console.error("Failed loading auth session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setGoogleClientId = useCallback((id: string) => {
    setGoogleClientIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem(GOOGLE_CLIENT_ID_KEY, id);
      else localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
    }
  }, []);

  const setGithubClientId = useCallback((id: string) => {
    setGithubClientIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem(GITHUB_CLIENT_ID_KEY, id);
      else localStorage.removeItem(GITHUB_CLIENT_ID_KEY);
    }
  }, []);

  const setGithubClientSecret = useCallback((secret: string) => {
    setGithubClientSecretState(secret);
    if (typeof window !== "undefined") {
      if (secret) localStorage.setItem(GITHUB_CLIENT_SECRET_KEY, secret);
      else localStorage.removeItem(GITHUB_CLIENT_SECRET_KEY);
    }
  }, []);

  const saveUser = useCallback((u: AuthUser) => {
    setUser(u);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      }
    } catch (e) {
      console.error("Failed saving auth session:", e);
    }
  }, []);

  const openAuthModal = useCallback((mode: AuthMode = "signup") => {
    setAuthModalMode(mode);
    if (typeof window !== "undefined") {
      window.location.href = `/auth?mode=${mode}`;
    } else {
      setIsAuthModalOpen(true);
    }
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  function isAllowedOrigin(origin: string): boolean {
  if (typeof window === "undefined") return false;
  if (origin === window.location.origin) return true;
  if (origin.endsWith("novixui.com")) return true;
  if (origin === "http://localhost:3000" || origin === "http://localhost:5173" || origin === "http://localhost:8080") return true;
  return false;
}

// Window postMessage listener for popup OAuth callbacks
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin)) return;

      if (event.data?.type === "NOVIX_OAUTH_SUCCESS" && event.data.user) {
        const authedUser: AuthUser = event.data.user;
        saveUser(authedUser);
        closeAuthModal();
        toast.success(`✨ Signed in successfully as ${authedUser.name}!`);
      } else if (event.data?.type === "NOVIX_OAUTH_ERROR") {
        toast.error(event.data.error || "OAuth Authentication failed");
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const userObj = JSON.parse(event.newValue);
          setUser(userObj);
          closeAuthModal();
        } catch {
          // ignore json parse error
        }
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorage);
    };
  }, [saveUser, closeAuthModal]);

  // Real Google OAuth Flow
  const performGoogleAuth = async (mode: AuthMode): Promise<void> => {
    const activeClientId =
      googleClientId ||
      (import.meta as { env?: { VITE_GOOGLE_CLIENT_ID?: string } }).env?.VITE_GOOGLE_CLIENT_ID;

    if (!activeClientId) {
      const errorMsg =
        "Google Client ID is missing. Please enter your Client ID in the OAuth Settings dialog or add VITE_GOOGLE_CLIENT_ID to .env.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (typeof window === "undefined") return;

    // 1. Try Google Identity Services (GIS) token client if loaded
    const oauth2 = (
      window as unknown as {
        google?: {
          accounts?: {
            oauth2?: {
              initTokenClient: (config: {
                client_id: string;
                scope: string;
                callback: (res: { access_token?: string; error?: string }) => void;
              }) => { requestAccessToken: () => void };
            };
          };
        };
      }
    ).google?.accounts?.oauth2;

    if (oauth2) {
      return new Promise<void>((resolve, reject) => {
        try {
          const tokenClient = oauth2.initTokenClient({
            client_id: activeClientId,
            scope:
              "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
            callback: async (tokenResponse) => {
              if (tokenResponse.error || !tokenResponse.access_token) {
                const err = tokenResponse.error || "Google sign in was cancelled.";
                toast.error(err);
                reject(new Error(err));
                return;
              }

              try {
                const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                if (!infoRes.ok) {
                  throw new Error("Failed fetching Google profile from Google API");
                }

                const data = await infoRes.json();
                const newUser: AuthUser = {
                  id: `usr_g_${data.sub}`,
                  name: data.name || data.given_name || "Google User",
                  email: data.email,
                  avatar: data.picture,
                  provider: "google",
                  role: "creator",
                  joinedAt: new Date().toISOString(),
                  tagline: "Novix UI Creator",
                  reputation: 500,
                  emailVerified: data.email_verified,
                };

                saveUser(newUser);
                closeAuthModal();
                toast.success(
                  mode === "signup"
                    ? `🎉 Welcome to Novix UI Community, ${newUser.name}!`
                    : `✨ Welcome back, ${newUser.name}!`
                );
                resolve();
              } catch (err) {
                console.error("Google user info error:", err);
                toast.error("Failed to read user data from Google API.");
                reject(err);
              }
            },
          });
          tokenClient.requestAccessToken();
        } catch (e) {
          console.error("GIS Token Client error:", e);
          reject(e);
        }
      });
    }

    // 2. Fallback to Google standard OAuth 2.0 popup window
    const redirectUri = `${window.location.origin}/auth/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      activeClientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=openid%20profile%20email&prompt=select_account`;

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      "google_oauth_popup",
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      window.location.href = googleAuthUrl;
      return new Promise(() => {});
    }

    return new Promise<void>((resolve, reject) => {
      let checkClosedInterval: ReturnType<typeof setInterval> | null = null;

      const cleanup = () => {
        window.removeEventListener("message", handleMessage);
        if (checkClosedInterval) clearInterval(checkClosedInterval);
      };

      const handleMessage = (event: MessageEvent) => {
        if (!isAllowedOrigin(event.origin)) return;

        if (event.data?.type === "NOVIX_OAUTH_SUCCESS" && event.data.provider === "google") {
          cleanup();
          resolve();
        } else if (event.data?.type === "NOVIX_OAUTH_ERROR") {
          cleanup();
          reject(new Error(event.data.error || "Google authentication failed"));
        }
      };

      window.addEventListener("message", handleMessage);

      checkClosedInterval = setInterval(() => {
        try {
          if (popup.closed) {
            cleanup();
            setTimeout(() => {
              const stored = localStorage.getItem(STORAGE_KEY);
              if (stored) {
                resolve();
              } else {
                reject(new Error("Google sign-in window was closed"));
              }
            }, 300);
          }
        } catch {
          // ignore
        }
      }, 500);
    });
  };

  // Real GitHub OAuth Flow
  const performGithubAuth = async (_mode: AuthMode): Promise<void> => {
    const activeClientId =
      githubClientId ||
      (import.meta as { env?: { VITE_GITHUB_CLIENT_ID?: string } }).env?.VITE_GITHUB_CLIENT_ID;

    if (!activeClientId) {
      const errorMsg =
        "GitHub Client ID is missing. Please enter your GitHub OAuth App credentials in the OAuth Settings dialog or add VITE_GITHUB_CLIENT_ID to .env.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (typeof window === "undefined") return;

    const redirectUri = `${window.location.origin}/auth/callback`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      activeClientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email`;

    const width = 580;
    const height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      githubAuthUrl,
      "github_oauth_popup",
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
    );

    // Fallback: If browser popup blocker blocked the popup, redirect directly
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      window.location.href = githubAuthUrl;
      return new Promise(() => {});
    }

    return new Promise<void>((resolve, reject) => {
      let checkClosedInterval: ReturnType<typeof setInterval> | null = null;

      const cleanup = () => {
        window.removeEventListener("message", handleMessage);
        if (checkClosedInterval) clearInterval(checkClosedInterval);
      };

      const handleMessage = (event: MessageEvent) => {
        if (!isAllowedOrigin(event.origin)) return;

        if (event.data?.type === "NOVIX_OAUTH_SUCCESS" && event.data.provider === "github") {
          cleanup();
          resolve();
        } else if (event.data?.type === "NOVIX_OAUTH_ERROR") {
          cleanup();
          reject(new Error(event.data.error || "GitHub authentication failed"));
        }
      };

      window.addEventListener("message", handleMessage);

      checkClosedInterval = setInterval(() => {
        try {
          if (popup.closed) {
            cleanup();
            setTimeout(() => {
              const stored = localStorage.getItem(STORAGE_KEY);
              if (stored) {
                resolve();
              } else {
                reject(new Error("GitHub sign-in was closed"));
              }
            }, 300);
          }
        } catch {
          // ignore cross-origin check issues
        }
      }, 500);
    });
  };

  const loginWithGoogle = async () => performGoogleAuth("signin");
  const signupWithGoogle = async () => performGoogleAuth("signup");
  const loginWithGitHub = async () => performGithubAuth("signin");
  const signupWithGitHub = async () => performGithubAuth("signup");

  const loginWithEmail = async (email: string) => {
    const rawName = email.split("@")[0] || "Novix Creator";
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const emailUser: AuthUser = {
      id: `usr_em_${Math.random().toString(36).slice(2, 9)}`,
      name: formattedName,
      email,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(email)}`,
      provider: "email",
      role: "creator",
      joinedAt: new Date().toISOString(),
      tagline: "Novix UI Community Member",
      reputation: 250,
      emailVerified: true,
    };
    saveUser(emailUser);
    closeAuthModal();
    toast.success(`✨ Welcome back, ${formattedName}!`);
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    _password?: string,
    role: string = "creator"
  ) => {
    const emailUser: AuthUser = {
      id: `usr_em_${Math.random().toString(36).slice(2, 9)}`,
      name: name || "Novix Creator",
      email,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(email)}`,
      provider: "email",
      role: (role as "creator" | "member" | "pro" | "founder") || "creator",
      joinedAt: new Date().toISOString(),
      tagline: "Novix UI Pioneer",
      reputation: 150,
      emailVerified: true,
    };
    saveUser(emailUser);
    closeAuthModal();
    toast.success(`🎉 Welcome to Novix UI Community, ${name || "Creator"}!`);
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed clearing auth storage:", e);
    }
    toast.info("Signed out of Novix UI.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        googleClientId,
        setGoogleClientId,
        githubClientId,
        setGithubClientId,
        githubClientSecret,
        setGithubClientSecret,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        loginWithGoogle,
        signupWithGoogle,
        loginWithGitHub,
        signupWithGitHub,
        loginWithEmail,
        signupWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
