import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GoogleIcon } from "@/components/auth/google-icon";
import { OAuthConfigDialog } from "@/components/auth/oauth-config-dialog";
import { useAuth, type AuthMode } from "@/context/auth-context";
import { Github, Terminal, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/nova/ui/spinner";
import { IconButton, useTheme } from "@/nova";


interface AuthSearch {
  mode?: AuthMode;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    return {
      mode: search.mode === "signin" ? "signin" : "signup",
    };
  },
  component: ClaudeStyleAuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · Novix UI" },
      {
        name: "description",
        content: "Sign in or create your account to access Novix UI components, weekly challenges, and craft templates.",
      },
    ],
  }),
});

function ClaudeStyleAuthPage() {
  const { resolvedTheme, toggle } = useTheme();
  const { mode: initialMode } = Route.useSearch();
  const {
    isAuthenticated,
    googleClientId,
    githubClientId,
    loginWithGoogle,
    loginWithGitHub,
  } = useAuth();

  const navigate = useNavigate();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configTab, setConfigTab] = useState<"google" | "github">("google");

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  // Real Google Sign-In handler
  const handleGoogleSignIn = async () => {
    const hasGoogleId =
      googleClientId ||
      (import.meta as { env?: { VITE_GOOGLE_CLIENT_ID?: string } }).env?.VITE_GOOGLE_CLIENT_ID;

    if (!hasGoogleId) {
      setConfigTab("google");
      setShowConfigModal(true);
      toast.info("Please enter your Google Client ID to connect real Google Sign-In.");
      return;
    }

    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error("Google login error:", e);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Real GitHub Sign-In handler
  const handleGithubSignIn = async () => {
    const hasGithubId =
      githubClientId ||
      (import.meta as { env?: { VITE_GITHUB_CLIENT_ID?: string } }).env?.VITE_GITHUB_CLIENT_ID;

    if (!hasGithubId) {
      setConfigTab("github");
      setShowConfigModal(true);
      toast.info("Please enter your GitHub OAuth App credentials to connect real GitHub Sign-In.");
      return;
    }

    setIsGithubLoading(true);
    try {
      await loginWithGitHub();
    } catch (e) {
      console.error("GitHub login error:", e);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf9f6] text-zinc-900 dark:bg-[#141413] dark:text-[#e3ded6] font-sans antialiased selection:bg-[#c96442]/20 selection:text-zinc-900 dark:selection:bg-[#c96442]/30 dark:selection:text-white flex flex-col justify-between transition-colors duration-300 overflow-x-hidden">
      {/* Subtle Warm Aura Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gradient-to-tr from-amber-100/40 via-orange-50/50 to-indigo-100/30 blur-3xl dark:from-accent/5 dark:via-purple-900/5 dark:to-transparent" />
      </div>

      {/* Top Navigation Bar with exact Home Page Logo and Theme Toggle */}
      <header className="w-full px-4 py-4 sm:px-10 sm:py-6 flex items-center justify-between border-b border-zinc-200/60 dark:border-white/5 backdrop-blur-xs">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl sm:text-[22px] font-bold tracking-tight text-zinc-900 dark:text-white">
              novix<span className="text-accent">ui</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Night Mode Theme Toggle */}
          <IconButton
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "night"} mode`}
            onClick={toggle}
            variant="ghost"
            icon={
              resolvedTheme === "dark" ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-indigo-600" />
              )
            }
            className="border border-zinc-200/80 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-white shadow-xs"
          />
        </div>
      </header>

      {/* Centered Auth Section */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-[400px]">
          {/* Editorial Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-[44px] font-normal tracking-[-0.015em] text-zinc-900 dark:text-[#f4efe6] leading-[1.18] sm:leading-[1.15]">
            Craft what’s next
          </h1>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-zinc-600 dark:text-[#9c9689] font-normal px-2">
            The animated component library for interfaces with obsessive polish
          </p>

          {/* Auth Box Container */}
          <div className="mt-6 sm:mt-8 rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] text-left dark:border-[#2b2b29] dark:bg-[#1d1d1b] dark:shadow-2xl">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isGithubLoading}
              className="w-full cursor-pointer flex items-center justify-center gap-2.5 sm:gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-3 text-xs sm:text-sm font-medium text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300 hover:text-zinc-950 dark:border-[#353532] dark:bg-[#272724] dark:text-[#ebe5db] dark:hover:bg-[#2e2e2a] transition-all duration-100 active:scale-[0.97] active:duration-40 disabled:opacity-60 shadow-2xs"
            >
              {isGoogleLoading ? (
                <Spinner size="sm" className="text-zinc-900 dark:text-white" />
              ) : (
                <GoogleIcon className="size-4 sm:size-4.5 shrink-0" />
              )}
              <span>Continue with Google</span>
            </button>

            {/* GitHub Button */}
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={isGoogleLoading || isGithubLoading}
              className="mt-2.5 w-full cursor-pointer flex items-center justify-center gap-2.5 sm:gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-3 text-xs sm:text-sm font-medium text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300 hover:text-zinc-950 dark:border-[#353532] dark:bg-[#272724] dark:text-[#ebe5db] dark:hover:bg-[#2e2e2a] transition-all duration-100 active:scale-[0.97] active:duration-40 disabled:opacity-60 shadow-2xs"
            >
              {isGithubLoading ? (
                <Spinner size="sm" className="text-zinc-900 dark:text-white" />
              ) : (
                <Github className="size-4 sm:size-4.5 shrink-0 text-zinc-900 dark:text-white" />
              )}
              <span>Continue with GitHub</span>
            </button>

            {/* Helper Caption */}
            <div className="mt-4 pt-3.5 border-t border-zinc-200/60 dark:border-[#2f2f2b] text-center">
              <p className="text-[11px] text-zinc-500 dark:text-[#787368]">
                Instant single sign-on via verified Google or GitHub profile.
              </p>
            </div>
          </div>

          {/* Bottom Secondary Action */}
          <div className="mt-5 sm:mt-6 flex justify-center">
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-white/90 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 hover:border-zinc-300 shadow-xs dark:border-[#2b2b29] dark:bg-[#1d1d1b] dark:text-[#9c9689] dark:hover:text-[#f4efe6] transition-all"
            >
              <Terminal className="size-3.5 text-accent" />
              <span>Explore Component Primitives</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="w-full px-4 py-4 sm:px-10 sm:py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 dark:text-[#6b675e]">
        <p>© {new Date().getFullYear()} Novix UI</p>
        <div className="flex gap-4">
          <Link to="/docs" className="hover:text-zinc-800 dark:hover:text-[#a39e93] transition-colors">
            Documentation
          </Link>
          <a href="#" className="hover:text-zinc-800 dark:hover:text-[#a39e93] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-zinc-800 dark:hover:text-[#a39e93] transition-colors">
            Terms
          </a>
        </div>
      </footer>

      {/* OAuth Configuration Dialog */}
      <OAuthConfigDialog
        open={showConfigModal}
        onOpenChange={setShowConfigModal}
        defaultTab={configTab}
      />
    </div>
  );
}
