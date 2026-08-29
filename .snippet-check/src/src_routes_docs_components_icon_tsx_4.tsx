import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Icon icon={CheckCircle2} decorative={false} label="Success" />
<span className="inline-flex items-center gap-2">
  <Icon icon={ArrowRight} /> Continue
</span>
    </>
  );
}
