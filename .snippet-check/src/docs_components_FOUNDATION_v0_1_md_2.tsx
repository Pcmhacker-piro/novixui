import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<IconButton aria-label="Close" icon={<X />} />
<IconButton aria-label="Refresh" loading icon={<RefreshCw />} />
<IconButton aria-label="Star" variant="ghost"><Star /></IconButton>

    </>
  );
}
