import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../theme';
import { Product } from '../../data/products';
import FsBadge from './FsBadge';
import ProductImage from './ProductImage';
import Icon from './Icon';

interface FsGridCardProps {
  p: Product;
  onOpen: () => void;
  onAdd?: () => void;
}

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

export default function FsGridCard({ p, onOpen, onAdd }: FsGridCardProps) {
  const discount = p.was ? Math.round((1 - p.price / p.was) * 100) : null;

  return (
    <Pressable onPress={onOpen} className="bg-card rounded-md border border-line overflow-hidden flex-1">
      <ProductImage productId={p.id} imageUrl={p.img ?? undefined} style={{ height: 130, width: '100%' }} />
      <View className="p-[10px] flex-1">
        {discount && (
          <View className="mb-[5px]">
            <FsBadge tone="red">−{discount}%</FsBadge>
          </View>
        )}
        <Text className="font-p-medium text-[11.5px] text-ink leading-4 mb-1" numberOfLines={2}>{p.name}</Text>
        <View className="flex-row items-baseline gap-[5px]">
          <Text className="font-m-bold text-[14px] text-green">{naira(p.price)}</Text>
          {p.was && <Text className="font-p-regular text-[10px] text-faint line-through">{naira(p.was)}</Text>}
        </View>
        <View className="flex-row items-center gap-[2px] mt-[3px]">
          <Icon name="Star" size={11} color={colors.amber} fill={colors.amber} />
          <Text className="font-p-medium text-[10px] text-ink">{p.rating}</Text>
          <Text className="font-p-regular text-[10px] text-faint">({p.reviews})</Text>
        </View>
      </View>
      {onAdd && (
        <Pressable onPress={onAdd} className="absolute bottom-[10px] right-[10px] w-7 h-7 rounded-[8px] bg-green items-center justify-center">
          <Text className="text-white text-[18px] leading-[22px] font-p-semibold">+</Text>
        </Pressable>
      )}
    </Pressable>
  );
}
