import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { default: "surface" },
    a11y: { config: { rules: [{ id: "color-contrast", enabled: true }] } },
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
