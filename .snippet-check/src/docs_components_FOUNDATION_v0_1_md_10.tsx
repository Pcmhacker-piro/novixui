import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Kbd>Enter</Kbd>
<KbdSequence keys={["⌘", "K"]} />
<KbdSequence keys={["Ctrl", "Shift", "P"]} separator="+" />

    </>
  );
}
