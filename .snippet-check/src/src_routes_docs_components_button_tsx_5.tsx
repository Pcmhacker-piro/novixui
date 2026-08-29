import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Button loading>Saving</Button>
<Button leadingIcon={<Sparkles />}>Generate</Button>
<Button variant="secondary" trailingIcon={<ArrowRight />}>Continue</Button>
<Button variant="destructive" leadingIcon={<Trash2 />}>Delete workspace</Button>
    </>
  );
}
