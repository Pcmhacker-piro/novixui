import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Card interactive tabIndex={0} padding="md">
  <CardHeader>
    <CardTitle>Monthly plan</CardTitle>
    <CardDescription>Move your cursor across the card.</CardDescription>
  </CardHeader>
  <div className="mt-3 flex items-baseline gap-1">
    <span className="text-2xl font-semibold">$24</span>
    <span className="text-xs text-muted-foreground">/ month</span>
  </div>
</Card>
    </>
  );
}
