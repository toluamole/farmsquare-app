import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FsBadge from './FsBadge';
import Icon, { IconName } from './Icon';

interface AdSlideProps {
  eyebrow?: string;
  badge?: string;
  title: string;
  sub?: string;
  cta?: string;
  onPress?: () => void;
  tint?: string;
  icon?: IconName;
}

export default function AdSlide({ eyebrow, badge, title, sub, cta, onPress, tint, icon }: AdSlideProps) {
  return (
    <Pressable onPress={onPress} className="flex-1 mx-4 rounded-md overflow-hidden">
      <LinearGradient
        colors={[tint || 'rgba(4,99,7,0.94)', tint ? tint : 'rgba(4,99,7,0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, flexDirection: 'row', padding: 16, alignItems: 'center' }}
      >
        <View className="flex-1">
          {(eyebrow || badge) && (
            <View className="flex-row items-center gap-2 mb-[6px]">
              {eyebrow && <Text className="font-p-semibold text-[10px] text-[rgba(255,255,255,0.85)] tracking-[0.3px]">{eyebrow}</Text>}
              {badge && <FsBadge tone="solid">{badge}</FsBadge>}
            </View>
          )}
          <Text className="font-m-extrabold text-[16px] text-white leading-5 mb-1" numberOfLines={2}>{title}</Text>
          {sub && <Text className="font-p-regular text-[11px] text-[rgba(255,255,255,0.88)] leading-[15px] mb-[10px]" numberOfLines={2}>{sub}</Text>}
          {cta && (
            <View className="bg-lime rounded-full px-[14px] py-[6px] self-start">
              <Text className="font-p-semibold text-[11px] text-[#0A3D0C]">{cta}</Text>
            </View>
          )}
        </View>
        <View className="w-[60px] items-center justify-center">
          <Icon name={icon || 'Wheat'} size={44} color="rgba(255,255,255,0.92)" strokeWidth={1.75} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}
