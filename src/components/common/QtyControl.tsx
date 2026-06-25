import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

interface QtyControlProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  small?: boolean;
}

export default function QtyControl({ value, onChange, min = 1, max = 99, small }: QtyControlProps) {
  const btn = cn('items-center justify-center rounded-[8px] bg-card', small ? 'w-7 h-7' : 'w-[34px] h-[34px]');
  const icon = cn('text-ink font-p-medium leading-[22px]', small ? 'text-[15px]' : 'text-[18px]');
  return (
    <View className="flex-row items-center bg-field rounded-sm p-[2px] gap-[2px]">
      <Pressable onPress={() => onChange(Math.max(min, value - 1))} className={btn} disabled={value <= min}>
        <Text className={cn(icon, value <= min && 'text-faint')}>−</Text>
      </Pressable>
      <Text className={cn('font-m-bold text-ink text-center', small ? 'text-[12px] min-w-[22px]' : 'text-[14px] min-w-[28px]')}>{value}</Text>
      <Pressable onPress={() => onChange(Math.min(max, value + 1))} className={btn} disabled={value >= max}>
        <Text className={cn(icon, value >= max && 'text-faint')}>+</Text>
      </Pressable>
    </View>
  );
}
