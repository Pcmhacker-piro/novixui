/**
 * Nova UI · Foundation component tests
 *
 * These tests describe behavior, not implementation. They are written for
 * Vitest + @testing-library/react + jest-dom + axe-core.
 *
 * To run:
 *   bun add -d vitest @testing-library/react @testing-library/user-event \
 *              @testing-library/jest-dom jsdom jest-axe @types/jest-axe
 *   bunx vitest run
 *
 * Every test in this file is deterministic and framework-agnostic beyond
 * those four packages.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck — tests run under Vitest; typechecked separately.

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/vitest";

import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardTitle,
  IconButton,
  Kbd,
  KbdSequence,
  Label,
  Progress,
  Separator,
  Skeleton,
  Spinner,
  getInitials,
} from "..";

expect.extend(toHaveNoViolations);

/* ------------------------- Button --------------------------- */

describe("Button", () => {
  it("renders as <button type='button'> by default", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("becomes busy and disabled when loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("polymorphs via asChild", () => {
    render(
      <Button asChild>
        <a href="/pricing">Pricing</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
  });

  it("has no axe violations across variants", async () => {
    const { container } = render(
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ------------------------ IconButton ------------------------ */

describe("IconButton", () => {
  it("exposes its aria-label as the accessible name", () => {
    render(<IconButton aria-label="Close" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("respects loading state", () => {
    render(<IconButton aria-label="Refresh" loading icon={<svg />} />);
    const btn = screen.getByRole("button", { name: "Refresh" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });
});

/* --------------------------- Label -------------------------- */

describe("Label", () => {
  it("associates with a control via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("announces required state to screen readers", () => {
    render(
      <Label htmlFor="pw" required>
        Password
      </Label>,
    );
    expect(screen.getByText("(required)")).toHaveClass("sr-only");
  });
});

/* --------------------------- Badge -------------------------- */

describe("Badge", () => {
  it("renders content", () => {
    render(<Badge>Live</Badge>);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });
});

/* -------------------------- Card ---------------------------- */

describe("Card", () => {
  it("renders a semantic heading via CardTitle", () => {
    render(
      <Card>
        <CardTitle>Plan</CardTitle>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
  });
});

/* ------------------------- Separator ------------------------ */

describe("Separator", () => {
  it("exposes an accessible separator when non-decorative", () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

/* -------------------------- Avatar -------------------------- */

describe("Avatar", () => {
  it("derives 1–2 char initials from a name", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
    expect(getInitials("Nova")).toBe("NO");
    expect(getInitials("nova@labs.dev")).toBe("NO");
    expect(getInitials(undefined)).toBe("");
  });

  it("renders a status indicator with an accessible label", () => {
    render(<Avatar name="Ada Lovelace" status="online" />);
    expect(screen.getByRole("status", { name: "Online" })).toBeInTheDocument();
  });

  it("collapses overflow into a +N chip in AvatarGroup", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="One" />
        <Avatar name="Two" />
        <Avatar name="Three" />
        <Avatar name="Four" />
      </AvatarGroup>,
    );
    expect(screen.getByLabelText("2 more")).toBeInTheDocument();
  });
});

/* ------------------------- Skeleton ------------------------- */

describe("Skeleton", () => {
  it("is announced as busy", () => {
    render(<Skeleton />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-busy", "true");
  });

  it("renders N lines for text shape", () => {
    render(<Skeleton shape="text" lines={3} data-testid="s" />);
    const lines = screen.getByTestId("s").querySelectorAll('[data-slot="line"]');
    expect(lines).toHaveLength(3);
  });
});

/* -------------------------- Spinner ------------------------- */

describe("Spinner", () => {
  it("is decorative by default", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("announces label when provided", () => {
    render(<Spinner label="Loading dashboard" />);
    expect(
      screen.getByRole("status", { name: "Loading dashboard" }),
    ).toBeInTheDocument();
  });
});

/* ---------------------------- Kbd --------------------------- */

describe("Kbd", () => {
  it("renders semantic <kbd>", () => {
    const { container } = render(<Kbd>Enter</Kbd>);
    expect(container.querySelector("kbd")).toHaveTextContent("Enter");
  });

  it("renders each key in a sequence", () => {
    const { container } = render(<KbdSequence keys={["⌘", "K"]} />);
    expect(container.querySelectorAll("kbd")).toHaveLength(2);
  });
});

/* ------------------------- Progress ------------------------- */

describe("Progress", () => {
  it("renders with proper progressbar role and aria values", () => {
    render(<Progress value={45} aria-label="Uploading file" />);
    const bar = screen.getByRole("progressbar", { name: "Uploading file" });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "45");
  });

  it("clamps out-of-bounds values safely between 0 and 100", () => {
    const { rerender } = render(<Progress value={150} aria-label="Progress test" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");

    rerender(<Progress value={-30} aria-label="Progress test" />);
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("supports indeterminate mode without numeric aria-valuenow", () => {
    render(<Progress indeterminate aria-label="Processing" />);
    const bar = screen.getByRole("progressbar", { name: "Processing" });
    expect(bar).toBeInTheDocument();
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Progress value={60} aria-label="Syncing" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

