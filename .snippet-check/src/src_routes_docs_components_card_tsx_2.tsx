import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Card variant="default" padding="sm">default</Card>
<Card variant="elevated" padding="sm">elevated</Card>
<Card variant="outline" padding="sm">outline</Card>
<Card variant="ghost" padding="sm">ghost</Card>
    </>
  );
}
