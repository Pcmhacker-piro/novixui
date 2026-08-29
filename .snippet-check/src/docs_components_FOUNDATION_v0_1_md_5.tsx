import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Monthly plan</CardTitle>
    <CardDescription>Cancel anytime, keep your data.</CardDescription>
  </CardHeader>
  <CardContent>$24 / month</CardContent>
  <CardFooter><Button>Choose plan</Button></CardFooter>
</Card>

    </>
  );
}
