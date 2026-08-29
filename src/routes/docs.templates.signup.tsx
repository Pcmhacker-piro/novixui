import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Input, Label } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/signup")({
  component: SignupTemplate,
  head: () => ({ meta: [{ title: "Signup template · Novix UI" }, { name: "description", content: "Signup with password strength and plan selection." }] }),
});

function SignupTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Auth"
      title="Signup"
      description="A sign-up screen with password strength indicator, plan selection, and a checkbox for terms."
      install={`npx @novix-ui/cli template add signup`}
      routes={["src/routes/signup.tsx"]}
      includes={["Email + password", "Password strength meter", "Plan selection", "Terms acknowledgment"]}
      preview={
        <Card className="mx-auto w-full max-w-sm p-6">
          <p className="text-center text-base font-semibold">Create your account</p>
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label htmlFor="s-name" required>Full name</Label>
              <Input id="s-name" autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-email" required>Work email</Label>
              <Input id="s-email" type="email" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-pass" required>Password</Label>
              <Input id="s-pass" type="password" autoComplete="new-password" hint="At least 8 characters." />
            </div>
            <Button className="w-full">Create account</Button>
            <p className="text-center text-[11px] text-muted-foreground">By continuing you agree to our terms.</p>
          </form>
        </Card>
      }
      source={`// src/routes/signup.tsx
export function Signup() {
  return <SignupForm onSubmit={createAccount} />;
}`}
    />
  );
}
