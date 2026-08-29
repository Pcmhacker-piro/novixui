import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<KbdSequence keys={["mod", "K"]} />
<KbdSequence keys={["shift", "?"]} />
<KbdSequence keys={["mod", "shift", "P"]} />
    </>
  );
}
