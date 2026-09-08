import { createFileRoute } from "@tanstack/react-router";
import { Github, Mail } from "lucide-react";
import { Button, Card, Input, Label, Separator } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/login")({
  component: LoginTemplate,
  head: () => ({ meta: [{ title: "Login template · Novix UI" }, { name: "description", content: "Centered login with OAuth and email/password." }] }),
});

function LoginTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Auth"
      title="Login"
      description="A centered login screen with OAuth, a divider, and an email/password form. Autocomplete and password managers just work."
      install={`npx @novix-ui/cli template add login`}
      routes={["src/routes/login.tsx"]}
      includes={["OAuth buttons", "Email + password", "Password manager support", "Forgot password link"]}
      preview={
        <Card className="mx-auto w-full max-w-sm p-6">
          <p className="text-center text-base font-semibold">Sign in</p>
          <div className="mt-4 grid gap-2">
            <Button variant="outline" leadingIcon={<span className="font-bold text-accent">G</span>} asChild>
              <a href="/auth?mode=signin">Continue with Google (Live)</a>
            </Button>
            <Button variant="outline" leadingIcon={<Github className="size-4" />}>Continue with GitHub</Button>
            <Button variant="outline" leadingIcon={<Mail className="size-4" />}>Continue with Email</Button>
          </div>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" /> or <Separator className="flex-1" />
          </div>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label htmlFor="l-email" required>Email</Label>
              <Input id="l-email" type="email" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-pass" required>Password</Label>
              <Input id="l-pass" type="password" autoComplete="current-password" />
            </div>
            <Button className="w-full">Sign in</Button>
          </form>
        </Card>
      }
      source={`// src/routes/login.tsx — see recipes/authentication for the full source`}
    />
  );
}
