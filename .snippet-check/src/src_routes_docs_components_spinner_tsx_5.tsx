import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<p className="text-sm inline-flex items-center gap-2">
  <Spinner size="inherit" /> Publishing…
</p>
<Button loading>Saving</Button>
    </>
  );
}
