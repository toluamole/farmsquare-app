import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Product } from '../../data/products';
import ProductImage from './ProductImage';
import { naira } from './FsGridCard';

interface FsMiniCardProps {
  p: Product;
  onOpen: () => void;
  onAdd?: () => void;
}

export default function FsMiniCard({ p, onOpen }: FsMiniCardProps) {
  return (
    <Pressable onPress={onOpen} className="w-[136px] bg-card rounded-md border border-line overflow-hidden shrink-0">
      <ProductImage productId={p.id} imageUrl={p.img ?? undefined} style={{ height: 100, width: '100%' }} />
      <View className="p-[9px]">
        <Text className="font-p-medium text-[11px] text-ink leading-[15px] mb-[5px]" numberOfLines={2}>{p.name}</Text>
        <Text className="font-m-bold text-[13px] text-green">{naira(p.price)}</Text>
        {p.was && <Text className="font-p-regular text-[10px] text-faint line-through">{naira(p.was)}</Text>}
      </View>
    </Pressable>
  );
}
