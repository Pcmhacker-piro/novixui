import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

function getEnvFallback(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
      if (match && match[1]) {
        return match[1].trim().replace(/^['"]|['"]$/g, "");
      }
    }
  } catch {
    // Ignore file read errors
  }
  return undefined;
}

export const Route = createFileRoute("/api/auth/github")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { code, clientId, clientSecret } = body;

          if (!code) {
            return new Response(JSON.stringify({ error: "Missing authorization code" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const resolvedClientId =
            clientId ||
            process.env.VITE_GITHUB_CLIENT_ID ||
            process.env.GITHUB_CLIENT_ID ||
            (import.meta as { env?: Record<string, string> }).env?.VITE_GITHUB_CLIENT_ID ||
            getEnvFallback("VITE_GITHUB_CLIENT_ID");

          const resolvedClientSecret =
            clientSecret ||
            process.env.GITHUB_CLIENT_SECRET ||
            (import.meta as { env?: Record<string, string> }).env?.GITHUB_CLIENT_SECRET ||
            getEnvFallback("GITHUB_CLIENT_SECRET");

          if (!resolvedClientId || !resolvedClientSecret) {
            return new Response(
              JSON.stringify({
                error:
                  "GitHub OAuth is not fully configured on the server. Please set VITE_GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your environment or enter them in OAuth configuration.",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Exchange authorization code for GitHub access token
          const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              client_id: resolvedClientId,
              client_secret: resolvedClientSecret,
              code,
            }),
          });

          const tokenData = await tokenRes.json();

          if (tokenData.error || !tokenData.access_token) {
            return new Response(
              JSON.stringify({
                error: tokenData.error_description || tokenData.error || "Failed exchanging GitHub token",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Fetch authenticated GitHub user details
          const userRes = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "User-Agent": "NovixUI-App",
              Accept: "application/vnd.github.v3+json",
            },
          });

          if (!userRes.ok) {
            return new Response(JSON.stringify({ error: "Failed to retrieve GitHub profile" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const ghUser = await userRes.json();

          // Fetch primary verified email if not public in profile
          let userEmail = ghUser.email;
          if (!userEmail) {
            try {
              const emailsRes = await fetch("https://api.github.com/user/emails", {
                headers: {
                  Authorization: `Bearer ${tokenData.access_token}`,
                  "User-Agent": "NovixUI-App",
                  Accept: "application/vnd.github.v3+json",
                },
              });
              if (emailsRes.ok) {
                const emails: Array<{ email: string; primary: boolean; verified: boolean }> =
                  await emailsRes.json();
                const primary = emails.find((e) => e.primary && e.verified) || emails[0];
                if (primary) userEmail = primary.email;
              }
            } catch (e) {
              console.warn("Could not fetch user emails from GitHub:", e);
            }
          }

          return new Response(
            JSON.stringify({
              id: `usr_gh_${ghUser.id}`,
              name: ghUser.name || ghUser.login,
              login: ghUser.login,
              email: userEmail || `${ghUser.login}@users.noreply.github.com`,
              avatar: ghUser.avatar_url,
              bio: ghUser.bio,
              provider: "github",
              role: "creator",
              joinedAt: new Date().toISOString(),
              emailVerified: true,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err) {
          console.error("GitHub Auth Error:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Internal auth error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
