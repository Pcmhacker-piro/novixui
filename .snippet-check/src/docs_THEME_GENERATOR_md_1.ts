type ThemeState = {
  name: string;
  mode: "light" | "dark" | "both";
  color: { primary: OKLCH; accent: OKLCH; neutral: OKLCH };
  typography: { sans: FontRef; display: FontRef; mono: FontRef; ratio: number };
  radius: { base: number; curve: "linear" | "geometric"; overrides?: Partial<RadiusScale> };
  spacing: { base: number; ratio: number };
  shadow: { intensity: number; tint: "neutral" | "primary"; enabled: boolean };
  motion: { multiplier: number; ease: EasePreset; reducedMotion: "auto" | "off" };
  density: "comfortable" | "cozy" | "compact";
};
