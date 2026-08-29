import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" role="alert" className="text-danger text-sm">
    Enter a valid email address.
  </p>
)}
    </>
  );
}
