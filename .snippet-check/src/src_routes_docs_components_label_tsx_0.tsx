import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<div className="w-72 space-y-2">
  <Label htmlFor="email" required>Email</Label>
  <Input id="email" type="email" placeholder="ada@novix.dev" />
</div>
    </>
  );
}
