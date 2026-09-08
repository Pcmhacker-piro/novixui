import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Spinner } from "@/nova/ui/spinner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
  head: () => ({
    meta: [{ title: "Authenticating · Novix UI" }],
  }),
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing authorization...");

  useEffect(() => {
    async function handleAuth() {
      try {
        const hash = window.location.hash;
        const search = window.location.search;

        // 1. Google Token response in hash (#access_token=...)
        if (hash && hash.includes("access_token")) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");

          if (accessToken) {
            setStatus("Fetching Google profile details...");
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();

            const userProfile = {
              id: `usr_g_${data.sub}`,
              name: data.name || data.given_name || "Google User",
              email: data.email,
              avatar: data.picture,
              provider: "google",
              role: "creator",
              joinedAt: new Date().toISOString(),
              emailVerified: data.email_verified,
            };

            // Always save to localStorage so the session is active regardless of opener status
            localStorage.setItem("novixui_auth_user", JSON.stringify(userProfile));

            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(
                { type: "NOVIX_OAUTH_SUCCESS", provider: "google", user: userProfile },
                "*"
              );
              window.close();
              return;
            } else {
              navigate({ to: "/" });
              return;
            }
          }
        }

        // 2. GitHub or OAuth Code response in search (?code=...)
        if (search && search.includes("code=")) {
          const params = new URLSearchParams(search);
          const code = params.get("code");
          const error = params.get("error");
          const errorDesc = params.get("error_description");

          if (error) {
            throw new Error(errorDesc || error);
          }

          if (code) {
            setStatus("Exchanging GitHub authorization token...");
            const storedSecret = localStorage.getItem("novixui_github_client_secret") || "";
            const storedClientId =
              localStorage.getItem("novixui_github_client_id") ||
              (import.meta as { env?: { VITE_GITHUB_CLIENT_ID?: string } }).env?.VITE_GITHUB_CLIENT_ID ||
              "";

            const res = await fetch("/api/auth/github", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code,
                clientId: storedClientId,
                clientSecret: storedSecret,
              }),
            });

            const data = await res.json();
            if (!res.ok || data.error) {
              throw new Error(data.error || "Failed exchanging GitHub token");
            }

            // Always save to localStorage so the session is active regardless of opener status
            localStorage.setItem("novixui_auth_user", JSON.stringify(data));

            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(
                { type: "NOVIX_OAUTH_SUCCESS", provider: "github", user: data },
                "*"
              );
              window.close();
              return;
            } else {
              navigate({ to: "/" });
              return;
            }
          }
        }

        setStatus("No valid authorization tokens detected. Redirecting...");
        setTimeout(() => navigate({ to: "/auth" }), 1500);
      } catch (err) {
        console.error("Auth callback error:", err);
        const errMsg = err instanceof Error ? err.message : "Authentication failed";
        setStatus(`Error: ${errMsg}`);

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: "NOVIX_OAUTH_ERROR", error: errMsg },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        } else {
          setTimeout(() => navigate({ to: "/auth" }), 3000);
        }
      }
    }

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070709] px-4 text-center text-white">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/20 text-accent ring-1 ring-accent/30 shadow-lg mb-6">
        <Sparkles className="size-6" />
      </div>
      <Spinner size="md" className="text-accent mb-4" />
      <h2 className="font-display text-xl font-bold tracking-tight">Authenticating with Provider</h2>
      <p className="mt-2 text-sm text-zinc-400 max-w-sm">{status}</p>
    </div>
  );
}
