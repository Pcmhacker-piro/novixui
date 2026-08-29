import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Skeleton className="h-8 w-40" />
<Skeleton shape="circle" className="size-10" />
<Skeleton shape="text" lines={3} />

    </>
  );
}
