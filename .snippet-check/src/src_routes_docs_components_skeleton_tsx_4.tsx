import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<div className="nova-card-surface w-80 rounded-xl p-4 space-y-3">
  <div className="flex items-center gap-3">
    <Skeleton shape="circle" className="h-10 w-10" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
  <Skeleton className="h-24 w-full" />
</div>
    </>
  );
}
