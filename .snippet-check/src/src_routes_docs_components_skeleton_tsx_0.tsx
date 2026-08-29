import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<div className="w-72 space-y-3">
  <Skeleton shape="circle" className="h-10 w-10" />
  <Skeleton shape="text" className="h-4 w-40" />
  <Skeleton shape="text" className="h-3 w-52" />
</div>
    </>
  );
}
