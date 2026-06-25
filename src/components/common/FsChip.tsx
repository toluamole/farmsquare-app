import React from 'react';
import { Pressable, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface FsChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  small?: boolean;
}

export default function FsChip({ label, active, onPress, small }: FsChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'rounded-lg border-[1.5px]',
        small ? 'px-3 py-[6px]' : 'px-4 py-[9px]',
        active ? 'bg-limeTint border-green' : 'bg-card border-line',
      )}
    >
      <Text
        className={cn(
          small ? 'text-[11px]' : 'text-[12.5px]',
          active ? 'font-p-semibold text-green' : 'font-p-medium text-ink',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
