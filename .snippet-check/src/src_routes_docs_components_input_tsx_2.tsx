import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Input
  label="Email"
  type="email"
  leadingIcon={<Mail />}
  placeholder="you@company.com"
/>
<Input placeholder="Search…" leadingIcon={<Search />} />
    </>
  );
}
