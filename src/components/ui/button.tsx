import * as React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { TextClassContext } from './text';

// react-native-reusables-style Button: variants via cva, child text styled
// through TextClassContext. Brand variants map to the Farmsquare palette.
const buttonVariants = cva(
  'flex-row items-center justify-center border',
  {
    variants: {
      variant: {
        primary: 'bg-green border-green',
        secondary: 'bg-field border-line',
        outline: 'bg-transparent border-green',
        ghost: 'bg-transparent border-transparent',
        whatsapp: 'bg-whatsapp border-whatsapp',
        lime: 'bg-lime border-lime',
        destructive: 'bg-red border-red',
      },
      size: {
        sm: 'px-[14px] py-2 rounded-sm',
        md: 'px-[18px] py-[11px] rounded-md',
        lg: 'px-[22px] py-[14px] rounded-md',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

const buttonTextVariants = cva('font-p-semibold tracking-[0.1px]', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-ink',
      outline: 'text-green',
      ghost: 'text-green',
      whatsapp: 'text-white',
      lime: 'text-[#0A3D0C]',
      destructive: 'text-white',
    },
    size: {
      sm: 'text-[11.5px]',
      md: 'text-[13px]',
      lg: 'text-[14px]',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

const spinnerColor: Record<string, string> = {
  primary: '#fff',
  secondary: '#1C2118',
  outline: '#046307',
  ghost: '#046307',
  whatsapp: '#fff',
  lime: '#0A3D0C',
  destructive: '#fff',
};

export interface ButtonProps
  extends React.ComponentProps<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
        <Pressable
          ref={ref}
          disabled={disabled || loading}
          className={cn(
            buttonVariants({ variant, size }),
            (disabled || loading) && 'opacity-50',
            className,
          )}
          {...props}
        >
          {loading ? (
            <ActivityIndicator size="small" color={spinnerColor[variant || 'primary']} />
          ) : (
            children
          )}
        </Pressable>
      </TextClassContext.Provider>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants, buttonTextVariants };
