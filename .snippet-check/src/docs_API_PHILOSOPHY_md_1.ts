// Simplified — canonical types live in src/nova/utils/types.ts
export interface NovaBaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  asChild?: boolean;
}

export interface NovaAppearanceProps {
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface NovaStateProps {
  disabled?: boolean;
  loading?: boolean;
}

export interface NovaMotionProps {
  motionPreset?: 'snap' | 'soft' | 'glide' | 'none';
  motionProps?: import('motion/react').MotionProps;
  disableAnimation?: boolean;
}
