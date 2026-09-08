import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Layers,
  Github,
  Key,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ExternalLink,
} from "lucide-react";
import { GoogleIcon } from "./google-icon";
import { OAuthConfigDialog } from "./oauth-config-dialog";
import { useAuth, type AuthMode } from "@/context/auth-context";
import { Button } from "@/nova/ui/button";
import { Input } from "@/nova/ui/input";
import { Label } from "@/nova/ui/label";
import { Separator } from "@/nova/ui/separator";
import { Badge } from "@/nova/ui/badge";
import { Spinner } from "@/nova/ui/spinner";

interface AuthCardProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
  showBenefits?: boolean;
  compact?: boolean;
}

const ROLES = [
  { id: "frontend", label: "Frontend Engineer" },
  { id: "design-engineer", label: "Design Engineer" },
  { id: "product-designer", label: "Product Designer" },
  { id: "founder", label: "Founder / Indie" },
];

export function AuthCard({
  initialMode,
  onSuccess,
  showBenefits = true,
  compact = false,
}: AuthCardProps) {
  const {
    authModalMode,
    setAuthModalMode,
    googleClientId,
    githubClientId,
    loginWithGoogle,
    signupWithGoogle,
    loginWithGitHub,
    signupWithGitHub,
    loginWithEmail,
    signupWithEmail,
  } = useAuth();

  const mode = initialMode || authModalMode;
  const setMode = (m: AuthMode) => setAuthModalMode(m);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("design-engineer");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configDefaultTab, setConfigDefaultTab] = useState<"google" | "github">("google");
  const [error, setError] = useState<string | null>(null);

  // Password analysis
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const getStrengthScore = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumberOrSpecial) score++;
    return score;
  };

  const strengthScore = getStrengthScore();
  const strengthLabels = ["Empty", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-zinc-700",
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-400",
    "bg-teal-400",
  ];

  const handleGoogleAuth = async () => {
    setError(null);

    // If no Google Client ID is configured yet, guide user with configuration dialog
    const hasGoogleId =
      googleClientId ||
      (import.meta as { env?: { VITE_GOOGLE_CLIENT_ID?: string } }).env?.VITE_GOOGLE_CLIENT_ID;

    if (!hasGoogleId) {
      setConfigDefaultTab("google");
      setShowConfigModal(true);
      toast.info("Please configure your Google Cloud Client ID to connect real Google Sign-In.");
      return;
    }

    setIsGoogleLoading(true);
    try {
      if (mode === "signup") {
        await signupWithGoogle();
      } else {
        await loginWithGoogle();
      }
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign in was unsuccessful");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    setError(null);

    const hasGithubId =
      githubClientId ||
      (import.meta as { env?: { VITE_GITHUB_CLIENT_ID?: string } }).env?.VITE_GITHUB_CLIENT_ID;

    if (!hasGithubId) {
      setConfigDefaultTab("github");
      setShowConfigModal(true);
      toast.info("Please configure your GitHub OAuth App credentials to connect real GitHub Sign-In.");
      return;
    }

    setIsGithubLoading(true);
    try {
      if (mode === "signup") {
        await signupWithGitHub();
      } else {
        await loginWithGitHub();
      }
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "GitHub sign in was unsuccessful");
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (mode === "signup" && !name) {
      setError("Please enter your full name.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsEmailLoading(true);
    try {
      if (mode === "signup") {
        await signupWithEmail(name, email, password, selectedRole);
      } else {
        await loginWithEmail(email, password);
      }
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const isOAuthReady = !!googleClientId || !!githubClientId;

  return (
    <>
      <div className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 shadow-2xl backdrop-blur-2xl transition-all sm:p-8">
        {/* Ambient Top Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-56 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent/30 via-fuchsia-500/20 to-transparent blur-3xl"
        />

        {/* Top Bar with Brand & OAuth status trigger */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/30 shadow-sm">
              <Sparkles className="size-3.5" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-foreground">
              novix<span className="text-accent">ui</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setConfigDefaultTab("google");
              setShowConfigModal(true);
            }}
            title="Configure Real Google / GitHub OAuth"
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-subtle/70 px-2.5 py-1 text-[11px] font-mono text-muted-foreground transition-all hover:border-accent/40 hover:text-foreground"
          >
            <span
              className={`size-1.5 rounded-full ${
                isOAuthReady ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span>OAuth {isOAuthReady ? "Ready" : "Config"}</span>
            <Key className="size-3 text-muted-foreground" />
          </button>
        </div>

        {/* Headline */}
        <div className="mt-6 text-left">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {mode === "signup" ? "Join the community" : "Welcome back"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Access 2,000+ UI components, weekly challenges, and bounties."
              : "Sign in to manage your submissions, votes, and starred elements."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="relative mt-6 flex rounded-xl border border-border/70 bg-subtle/60 p-1">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode("signup");
            }}
            className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-colors ${
              mode === "signup"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode === "signup" && (
              <motion.div
                layoutId="auth-tab-pill-premium"
                className="absolute inset-0 rounded-lg bg-background shadow-md ring-1 ring-border/60"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <span>Sign Up</span>
              <span className="rounded-full bg-accent/15 px-1.5 py-0.2 text-[10px] text-accent font-medium">
                Free
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode("signin");
            }}
            className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-colors ${
              mode === "signin"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode === "signin" && (
              <motion.div
                layoutId="auth-tab-pill-premium"
                className="absolute inset-0 rounded-lg bg-background shadow-md ring-1 ring-border/60"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">Sign In</span>
          </button>
        </div>

        {/* OAuth Buttons Section */}
        <div className="mt-6 space-y-2.5">
          {/* Primary Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading || isGithubLoading || isEmailLoading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-border/80 bg-background/95 px-4 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:border-accent/50 hover:bg-subtle hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 transition-opacity group-hover:opacity-100" />
            {isGoogleLoading ? (
              <Spinner size="sm" className="text-foreground" />
            ) : (
              <GoogleIcon className="size-5 shrink-0 transition-transform group-hover:scale-110" />
            )}
            <span className="font-medium tracking-tight">
              {isGoogleLoading
                ? "Opening Google..."
                : mode === "signup"
                  ? "Sign up with Google"
                  : "Sign in with Google"}
            </span>
            <Badge
              variant="outline"
              size="sm"
              className="ml-auto hidden border-accent/40 bg-accent/10 text-[10px] font-medium text-accent sm:inline-flex"
            >
              Google OAuth
            </Badge>
          </button>

          {/* Secondary GitHub Button */}
          <button
            type="button"
            onClick={handleGithubAuth}
            disabled={isGoogleLoading || isGithubLoading || isEmailLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border/60 bg-subtle/50 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-border-strong hover:bg-subtle hover:text-foreground active:scale-[0.99] disabled:opacity-60"
          >
            {isGithubLoading ? (
              <Spinner size="xs" />
            ) : (
              <Github className="size-4 shrink-0 text-foreground" />
            )}
            <span>
              {isGithubLoading
                ? "Opening GitHub..."
                : mode === "signup"
                  ? "Sign up with GitHub"
                  : "Sign in with GitHub"}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          <Separator className="flex-1" />
          <span>or continue with email</span>
          <Separator className="flex-1" />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          <AnimatePresence initial={false} mode="sync">
            {mode === "signup" && (
              <motion.div
                key="signup-name-role"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3.5"
              >
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="auth-name" required className="text-xs font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="auth-name"
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <Label className="text-xs font-medium">Primary Craft / Role</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id)}
                        className={`rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-medium transition-all ${
                          selectedRole === r.id
                            ? "border-accent/60 bg-accent/15 text-foreground ring-1 ring-accent/40"
                            : "border-border/60 bg-subtle/40 text-muted-foreground hover:bg-subtle hover:text-foreground"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="auth-email" required className="text-xs font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="auth-email"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <Label htmlFor="auth-password" required className="text-xs font-medium">
                Password
              </Label>
              {mode === "signin" && (
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Password reset instructions dispatched to your email address.");
                  }}
                  className="text-[11px] text-accent transition-colors hover:underline"
                >
                  Forgot password?
                </a>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="pl-9 pr-9 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>

            {/* Password strength on sign-up */}
            {mode === "signup" && password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex h-1 gap-1">
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        idx <= strengthScore ? strengthColors[strengthScore] : "bg-border/60"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Security Level</span>
                  <span className="font-semibold text-foreground">
                    {strengthLabels[strengthScore]}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-muted-foreground">
                  <span
                    className={`flex items-center gap-1 ${
                      hasMinLength ? "text-emerald-400 font-medium" : ""
                    }`}
                  >
                    <Check className="size-2.5" /> 8+ chars
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      hasUppercase ? "text-emerald-400 font-medium" : ""
                    }`}
                  >
                    <Check className="size-2.5" /> Uppercase
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      hasNumberOrSpecial ? "text-emerald-400 font-medium" : ""
                    }`}
                  >
                    <Check className="size-2.5" /> Number/sym
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="mt-3 w-full rounded-2xl py-3 font-semibold shadow-lg shadow-accent/15 transition-transform active:scale-[0.99]"
            variant="accent"
            disabled={isGoogleLoading || isGithubLoading || isEmailLoading}
            trailingIcon={!isEmailLoading ? <ArrowRight className="size-4" /> : undefined}
          >
            {isEmailLoading ? (
              <Spinner size="sm" />
            ) : mode === "signup" ? (
              "Create Community Account"
            ) : (
              "Sign In to Novix UI"
            )}
          </Button>
        </form>

        {/* Benefits banner */}
        {showBenefits && mode === "signup" && !compact && (
          <div className="mt-6 rounded-2xl border border-border/60 bg-subtle/40 p-4 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="size-3.5 text-accent" />
              <span>Included with Free Community Membership:</span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-400 shrink-0" />
                <span>2,000+ UI Components</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="size-3 text-amber-400 shrink-0" />
                <span>Weekly Challenges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="size-3 text-sky-400 shrink-0" />
                <span>Hall of Craft votes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-fuchsia-400 shrink-0" />
                <span>Free Forever (MIT)</span>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          By signing up, you agree to our{" "}
          <a href="#" className="text-foreground underline underline-offset-2 hover:text-accent">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-foreground underline underline-offset-2 hover:text-accent">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      <OAuthConfigDialog
        open={showConfigModal}
        onOpenChange={setShowConfigModal}
        defaultTab={configDefaultTab}
      />
    </>
  );
}
