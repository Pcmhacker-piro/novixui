// @ts-nocheck — Storybook stories; typechecked by Storybook, not the app build.
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Foundations/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Launch" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "outline", "destructive", "link", "subtle"] },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};
