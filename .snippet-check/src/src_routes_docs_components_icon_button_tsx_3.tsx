import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<IconButton aria-label="Search"><Search /></IconButton>
<IconButton variant="primary" aria-label="Settings"><Settings /></IconButton>
<IconButton variant="destructive" aria-label="Delete"><Trash2 /></IconButton>
<IconButton variant="outline" aria-label="Favorite"><Heart /></IconButton>
    </>
  );
}
