import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Card className="p-6 space-y-4">
  <div className="flex items-center gap-2">
    <Avatar />
    <span>Ada Lovelace</span>
  </div>
  <p className="text-muted-foreground">Signed in 2 minutes ago</p>
</Card>
    </>
  );
}
