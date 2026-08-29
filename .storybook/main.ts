import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/nova/**/*.stories.@(ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-interactions",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  docs: { autodocs: "tag" },
  typescript: { reactDocgen: "react-docgen-typescript" },
};

export default config;
