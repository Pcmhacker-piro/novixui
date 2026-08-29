import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Label htmlFor="email" required>Email</Label>
<input id="email" />

<Label htmlFor="bio" optional>Bio</Label>
<textarea id="bio" />

    </>
  );
}
