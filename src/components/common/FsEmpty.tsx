import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme';
import FsButton from './FsButton';
import Icon, { IconName } from './Icon';

type EmptyIcon = 'search' | 'cart' | 'zap' | 'group' | 'box' | 'leaf';

interface FsEmptyProps {
  icon?: EmptyIcon;
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
}

const iconMap: Record<EmptyIcon, IconName> = {
  search: 'Search',
  cart: 'ShoppingCart',
  zap: 'Zap',
  group: 'Users',
  box: 'Package',
  leaf: 'Leaf',
};

export default function FsEmpty({ icon, title, sub, action, onAction }: FsEmptyProps) {
  const iconName: IconName = (icon && iconMap[icon]) || 'Package';
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-[84px] h-[84px] rounded-full bg-field items-center justify-center mb-4">
        <Icon name={iconName} size={36} color={colors.faint} strokeWidth={1.75} />
      </View>
      <Text className="font-m-bold text-[16px] text-ink text-center mb-2">{title}</Text>
      {sub && <Text className="font-p-regular text-[12.5px] text-sub text-center leading-[18px] mb-2">{sub}</Text>}
      {action && onAction && (
        <View className="mt-3">
          <FsButton label={action} onPress={onAction} size="sm" />
        </View>
      )}
    </View>
  );
}
