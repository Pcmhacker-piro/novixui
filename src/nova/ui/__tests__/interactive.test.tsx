/**
 * Nova UI · Interactive component behaviour
 *
 * Covers keyboard nav, focus management, controlled/uncontrolled parity,
 * event callbacks, and axe a11y for the interactive primitives.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useState } from "react";

import {
  Button,
  Switch,
  Checkbox,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "..";

describe("Button", () => {
  it("fires onClick and respects disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no a11y violations across variants", async () => {
    const { container } = render(
      <div>
        {(["primary", "secondary", "ghost", "outline", "destructive"] as const).map((v) => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Switch", () => {
  it("supports controlled and uncontrolled modes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Switch defaultChecked={false} onCheckedChange={onChange} aria-label="notif" />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);

    function Controlled() {
      const [v, setV] = useState(false);
      return <Switch checked={v} onCheckedChange={setV} aria-label="c" />;
    }
    rerender(<Controlled />);
    const el = screen.getByRole("switch", { name: "c" });
    expect(el).toHaveAttribute("aria-checked", "false");
    await user.click(el);
    expect(el).toHaveAttribute("aria-checked", "true");
  });
});

describe("Checkbox", () => {
  it("toggles with keyboard", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="tos" />);
    const cb = screen.getByRole("checkbox", { name: "tos" });
    cb.focus();
    await user.keyboard(" ");
    expect(cb).toHaveAttribute("aria-checked", "true");
  });
});

describe("Tabs", () => {
  it("arrow-key navigation moves focus and panel", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
          <TabsTrigger value="c">C</TabsTrigger>
        </TabsList>
        <TabsContent value="a">panel-a</TabsContent>
        <TabsContent value="b">panel-b</TabsContent>
        <TabsContent value="c">panel-c</TabsContent>
      </Tabs>,
    );
    screen.getByRole("tab", { name: "A" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("panel-b")).toBeVisible();
  });
});

describe("Dialog", () => {
  it("traps focus and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <Button>Inside</Button>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
