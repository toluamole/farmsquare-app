import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  let ms = Math.max(0, targetMs - now);
  const d = Math.floor(ms / 86400000); ms -= d * 86400000;
  const h = Math.floor(ms / 3600000); ms -= h * 3600000;
  const m = Math.floor(ms / 60000); ms -= m * 60000;
  const s = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s), done: targetMs - now <= 0 };
}

interface CountdownTimerProps {
  target: number;
  small?: boolean;
}

export default function CountdownTimer({ target, small }: CountdownTimerProps) {
  const { d, h, m, s, done } = useCountdown(target);

  if (done) {
    return (
      <View className="flex-row items-center gap-1">
        <Text className={cn('font-p-semibold text-red', small ? 'text-[9px]' : 'text-[11px]')}>CLOSED</Text>
      </View>
    );
  }

  const showDays = parseInt(d, 10) > 0;
  const cells = showDays ? [d, h, m] : [h, m, s];
  const cellLabels = showDays ? ['d', 'h', 'm'] : ['h', 'm', 's'];

  return (
    <View className={cn('flex-row items-center', small ? 'gap-[3px]' : 'gap-1')}>
      {cells.map((val, i) => (
        <React.Fragment key={i}>
          <View className={cn('bg-ink items-center', small ? 'rounded-[5px] px-[5px] py-[2px] min-w-[26px]' : 'rounded-[6px] px-[7px] py-1 min-w-[34px]')}>
            <Text className={cn('font-m-bold text-white', small ? 'text-[11px] leading-[13px]' : 'text-[14px] leading-4')}>{val}</Text>
            <Text className={cn('font-p-medium text-[rgba(255,255,255,0.65)] leading-[10px]', small ? 'text-[7px]' : 'text-[8px]')}>{cellLabels[i]}</Text>
          </View>
          {i < cells.length - 1 && <Text className={cn('font-m-bold text-ink', small ? 'text-[11px]' : 'text-[14px]')}>:</Text>}
        </React.Fragment>
      ))}
    </View>
  );
}
