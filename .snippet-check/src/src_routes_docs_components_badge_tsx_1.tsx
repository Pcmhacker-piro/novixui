import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Badge>Neutral</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
    </>
  );
}
