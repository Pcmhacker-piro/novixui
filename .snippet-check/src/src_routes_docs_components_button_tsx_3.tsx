import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Button>Primary</Button>
<Button variant="accent">Accent</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Learn more</Button>
    </>
  );
}
