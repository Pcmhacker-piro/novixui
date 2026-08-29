import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Card interactive tabIndex={0}>
  <CardHeader>
    <CardTitle>Upgrade to Pro</CardTitle>
    <CardDescription>Unlimited workspaces and priority support.</CardDescription>
  </CardHeader>
  <Button className="mt-4" size="sm" trailingIcon={<ArrowRight />}>
    Upgrade
  </Button>
</Card>
    </>
  );
}
