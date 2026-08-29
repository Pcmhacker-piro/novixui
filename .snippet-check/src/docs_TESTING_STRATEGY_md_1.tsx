// Button.stories.tsx
export default { title: 'Primitives/Button', component: Button };

export const AllVariants = () => (
  <div className="grid grid-cols-6 gap-4">
    {VARIANTS.map(v => SIZES.map(s => (
      <Button key={`${v}-${s}`} variant={v} size={s}>Label</Button>
    )))}
  </div>
);

export const AllStates = () => null; // default, hover, focus, active, disabled, loading
export const WithIcons = () => null; // leadingIcon, trailingIcon, icon-only
export const DarkTheme = () => null; // wrapped in ThemeProvider theme="dark"
export const RTL = () => null; // wrapped in dir="rtl"

