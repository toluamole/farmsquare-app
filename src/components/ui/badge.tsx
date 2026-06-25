import * as React from 'react';
import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Text } from './text';

const badgeVariants = cva('self-start rounded-lg px-2 py-[3px]', {
  variants: {
    variant: {
      green: 'bg-limeTint',
      solid: 'bg-green',
      amber: 'bg-amberTint',
      red: 'bg-[#FCE9E7]',
      gray: 'bg-field',
      blue: 'bg-[#E7EEF8]',
    },
  },
  defaultVariants: { variant: 'green' },
});

const badgeTextVariants = cva('font-p-bold text-[9px] tracking-[0.4px]', {
  variants: {
    variant: {
      green: 'text-green',
      solid: 'text-white',
      amber: 'text-amberInk',
      red: 'text-red',
      gray: 'text-sub',
      blue: 'text-[#33567E]',
    },
  },
  defaultVariants: { variant: 'green' },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      <Text className={badgeTextVariants({ variant })}>{children}</Text>
    </View>
  );
}
