import React from 'react';
import { View } from 'react-native';
import { colors } from '../../theme';

interface FsProgressProps {
  pct: number;
  h?: number;
  color?: string;
}

export default function FsProgress({ pct, h = 8, color = colors.green }: FsProgressProps) {
  const clampedPct = Math.min(100, Math.max(0, pct));
  return (
    <View className="bg-field overflow-hidden" style={{ height: h, borderRadius: h }}>
      <View
        className="min-w-[4px]"
        style={{
          width: `${clampedPct}%`,
          height: h,
          borderRadius: h,
          backgroundColor: clampedPct >= 85 ? colors.amber : color,
        }}
      />
    </View>
  );
}
