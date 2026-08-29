import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<Avatar src="/ada.jpg" name="Ada Lovelace" status="online" />
<Avatar name="Grace Hopper" ring="accent" />

<AvatarGroup max={3}>
  <Avatar name="A" /><Avatar name="B" /><Avatar name="C" /><Avatar name="D" />
</AvatarGroup>

    </>
  );
}
