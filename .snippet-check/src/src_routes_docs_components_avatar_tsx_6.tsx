import * as React from "react";
export default function Demo(): React.ReactNode {
  return (
    <>
<AvatarGroup max={3}>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Katherine Johnson" />
  <Avatar name="Margaret Hamilton" />
  <Avatar name="Radia Perlman" />
</AvatarGroup>
    </>
  );
}
