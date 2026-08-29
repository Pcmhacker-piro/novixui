import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Badge variant="success" dot>Online</Badge>
<Badge variant="warning" dot>Degraded</Badge>
<Badge variant="danger" dot>Down</Badge>
    </>
  );
}
