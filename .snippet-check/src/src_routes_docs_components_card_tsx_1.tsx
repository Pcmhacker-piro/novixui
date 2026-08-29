import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Card>
  <CardHeader>
    <CardTitle>Workspace</CardTitle>
    <CardDescription>Manage members, invites, and roles.</CardDescription>
  </CardHeader>
  <Separator className="my-4" />
  <p className="text-sm text-muted-foreground">12 seats · 3 pending invites</p>
</Card>
    </>
  );
}
