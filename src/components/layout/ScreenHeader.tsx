import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme';
import { cn } from '../../lib/utils';
import Icon from '../common/Icon';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  noBorder?: boolean;
}

export default function ScreenHeader({ title, subtitle, onBack, right, noBorder }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  return (
    <View
      className={cn('bg-bg px-4 pb-[10px]', !noBorder && 'border-b border-line')}
      style={{ paddingTop: insets.top + 6 }}
    >
      <View className="flex-row items-center">
        <Pressable onPress={handleBack} className="w-9 h-9 items-center justify-center" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="ArrowLeft" size={24} color={colors.ink} />
        </Pressable>
        <View className="flex-1 items-center">
          {title && <Text className="font-m-bold text-[16px] text-ink" numberOfLines={1}>{title}</Text>}
          {subtitle && <Text className="font-p-regular text-[11px] text-sub mt-[1px]" numberOfLines={1}>{subtitle}</Text>}
        </View>
        {right ? <View className="w-9 items-end">{right}</View> : <View className="w-9 h-9" />}
      </View>
    </View>
  );
}
