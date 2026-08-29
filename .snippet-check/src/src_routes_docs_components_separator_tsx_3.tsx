import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<div className="flex h-8 items-center gap-4">
  <span>Home</span>
  <Separator orientation="vertical" />
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Blog</span>
</div>
    </>
  );
}
