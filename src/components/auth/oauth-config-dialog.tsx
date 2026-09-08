import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Key, X, Check, ExternalLink, ShieldCheck, Sparkles, Github } from "lucide-react";
import { GoogleIcon } from "./google-icon";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/nova/ui/button";
import { Input } from "@/nova/ui/input";
import { Label } from "@/nova/ui/label";
import { toast } from "sonner";

export function OAuthConfigDialog({
  open,
  onOpenChange,
  defaultTab = "google",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "google" | "github";
}) {
  const {
    googleClientId,
    setGoogleClientId,
    githubClientId,
    setGithubClientId,
    githubClientSecret,
    setGithubClientSecret,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"google" | "github">(defaultTab);
  const [googleIdInput, setGoogleIdInput] = useState(googleClientId);
  const [ghIdInput, setGhIdInput] = useState(githubClientId);
  const [ghSecretInput, setGhSecretInput] = useState(githubClientSecret);

  const handleSaveGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleClientId(googleIdInput.trim());
    toast.success("Google OAuth Client ID saved!");
    onOpenChange(false);
  };

  const handleSaveGithub = (e: React.FormEvent) => {
    e.preventDefault();
    setGithubClientId(ghIdInput.trim());
    setGithubClientSecret(ghSecretInput.trim());
    toast.success("GitHub OAuth credentials saved!");
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <DialogPrimitive.Content
          aria-describedby="oauth-config-desc"
          className="fixed left-1/2 top-1/2 z-[70] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
                <Key className="size-4.5" />
              </div>
              <div>
                <DialogPrimitive.Title className="text-base font-semibold text-foreground">
                  Configure Live OAuth
                </DialogPrimitive.Title>
                <p id="oauth-config-desc" className="text-xs text-muted-foreground">
                  Connect real Google & GitHub authentication apps
                </p>
              </div>
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="rounded-lg p-1 text-muted-foreground hover:bg-subtle hover:text-foreground"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          {/* Provider Tabs */}
          <div className="mt-4 flex rounded-xl border border-border/70 bg-subtle/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("google")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === "google"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GoogleIcon className="size-3.5" />
              <span>Google OAuth</span>
              {googleClientId && <span className="size-1.5 rounded-full bg-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("github")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === "github"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Github className="size-3.5" />
              <span>GitHub OAuth</span>
              {githubClientId && <span className="size-1.5 rounded-full bg-emerald-400" />}
            </button>
          </div>

          {/* Google Form */}
          {activeTab === "google" && (
            <form onSubmit={handleSaveGoogle} className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-subtle/50 p-3.5 text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Sparkles className="size-3.5 text-accent" />
                  <span>Google Cloud Credentials Setup</span>
                </div>
                <p>
                  1. Visit{" "}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium text-accent underline underline-offset-2"
                  >
                    Google Cloud Console <ExternalLink className="size-2.5" />
                  </a>
                  <br />
                  2. Create an <strong>OAuth Client ID</strong> (Web Application).
                  <br />
                  3. Add to <strong>Authorized JavaScript origins</strong>:
                  <code className="ml-1 rounded bg-background px-1.5 py-0.5 font-mono text-[10.5px] text-foreground">
                    {typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}
                  </code>
                  <br />
                  4. Add to <strong>Authorized redirect URIs</strong>:
                  <code className="ml-1 rounded bg-background px-1.5 py-0.5 font-mono text-[10.5px] text-foreground">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/auth/callback`
                      : "http://localhost:3000/auth/callback"}
                  </code>
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="google-client-id" className="text-xs font-medium">
                  Google Client ID (from Google Cloud)
                </Label>
                <Input
                  id="google-client-id"
                  placeholder="e.g. 10482910482-xxxxxxxxxxxx.apps.googleusercontent.com"
                  value={googleIdInput}
                  onChange={(e) => setGoogleIdInput(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              {googleClientId ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400">
                  <Check className="size-4 shrink-0" />
                  <span>Live Google OAuth is configured and active.</span>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-400">
                  Enter your Google Client ID above or set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> in <code className="font-mono">.env</code>.
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGoogleIdInput("");
                    setGoogleClientId("");
                    toast.info("Google Client ID removed.");
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Clear
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent" size="sm">
                    Save Google Client ID
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* GitHub Form */}
          {activeTab === "github" && (
            <form onSubmit={handleSaveGithub} className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-subtle/50 p-3.5 text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Sparkles className="size-3.5 text-accent" />
                  <span>GitHub OAuth App Setup</span>
                </div>
                <p>
                  1. Go to{" "}
                  <a
                    href="https://github.com/settings/applications/new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium text-accent underline underline-offset-2"
                  >
                    GitHub OAuth Apps <ExternalLink className="size-2.5" />
                  </a>
                  <br />
                  2. Set <strong>Homepage URL</strong>:
                  <code className="ml-1 rounded bg-background px-1.5 py-0.5 font-mono text-[10.5px] text-foreground">
                    {typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}
                  </code>
                  <br />
                  3. Set <strong>Authorization callback URL</strong>:
                  <code className="ml-1 rounded bg-background px-1.5 py-0.5 font-mono text-[10.5px] text-foreground">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/auth/callback`
                      : "http://localhost:3000/auth/callback"}
                  </code>
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gh-client-id" className="text-xs font-medium">
                  GitHub Client ID
                </Label>
                <Input
                  id="gh-client-id"
                  placeholder="e.g. Ov23li9xxxxxxxxxxxx"
                  value={ghIdInput}
                  onChange={(e) => setGhIdInput(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gh-client-secret" className="text-xs font-medium">
                  GitHub Client Secret
                </Label>
                <Input
                  id="gh-client-secret"
                  type="password"
                  placeholder="e.g. 4829xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={ghSecretInput}
                  onChange={(e) => setGhSecretInput(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              {githubClientId && githubClientSecret ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400">
                  <Check className="size-4 shrink-0" />
                  <span>Live GitHub OAuth credentials configured and active.</span>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-400">
                  Enter your GitHub Client ID & Secret above or set them in <code className="font-mono">.env</code>.
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGhIdInput("");
                    setGhSecretInput("");
                    setGithubClientId("");
                    setGithubClientSecret("");
                    toast.info("GitHub credentials cleared.");
                  }}
                  className="text-xs text-muted-foreground"
                >
                  Clear
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent" size="sm">
                    Save GitHub Credentials
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
