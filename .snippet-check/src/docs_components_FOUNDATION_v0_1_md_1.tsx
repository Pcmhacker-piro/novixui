import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Button>Save</Button>
<Button variant="secondary" leadingIcon={<Sparkles />}>Generate</Button>
<Button loading>Saving</Button>
<Button asChild><a href="/pricing">Pricing</a></Button>

    </>
  );
}
