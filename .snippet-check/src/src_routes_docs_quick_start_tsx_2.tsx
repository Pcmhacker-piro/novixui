import { ThemeProvider } from "@novix-ui/react";

export default function App({ children }) {
  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}