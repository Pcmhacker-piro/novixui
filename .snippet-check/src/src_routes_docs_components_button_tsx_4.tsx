import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Search"><Search /></Button>
    </>
  );
}
