import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Skeleton className="h-8 w-32" />
<Skeleton shape="pill" className="h-6 w-24" />
<Skeleton shape="circle" className="h-10 w-10" />
<Skeleton shape="text" className="w-40" />
    </>
  );
}
