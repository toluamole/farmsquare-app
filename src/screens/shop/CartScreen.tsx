import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';
import ProductImage from '../../components/common/ProductImage';
import FsBadge from '../../components/common/FsBadge';
import FsButton from '../../components/common/FsButton';
import FsEmpty from '../../components/common/FsEmpty';
import QtyControl from '../../components/common/QtyControl';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

export default function CartScreen({ navigation }: { navigation: any; route: any }) {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const items = app.cartItems;
  const subtotal = items.reduce((s, it) => s + it.p.price * it.qty, 0);
  const hasGb = items.some(it => it.gb);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-bg">
        <ScreenHeader title="My Cart" />
        <FsEmpty
          icon="cart"
          title="Your cart is empty"
          sub="Browse the store and add inputs for the season."
          action="Start Shopping"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader title={`My Cart (${items.length})`} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        {items.map(it => {
          const { p, qty, key, gb, deal } = it;
          return (
            <View key={key} className={cn('flex-row gap-[11px] bg-card border rounded-md p-[11px] mb-[9px]', gb ? 'border-green/30' : 'border-line')}>
              <ProductImage productId={p.id} style={{ width: 64, height: 64, borderRadius: 10 }} />
              <View className="flex-1 min-w-0">
                {gb && (
                  <View className="mb-1 flex-row">
                    <FsBadge tone="solid">GROUP BUY</FsBadge>
                  </View>
                )}
                <Text className="font-p-medium text-[12px] text-ink leading-4" numberOfLines={2}>{p.name}</Text>
                <Text className="font-p-regular text-[10.5px] text-sub mt-[2px]">{naira(p.price)} each{gb ? ' · wholesale' : ''}</Text>
                <View className="flex-row items-center justify-between mt-2">
                  <QtyControl small value={qty} onChange={v => app.setQty(key, v)} min={gb && deal ? deal.min : 1} max={gb && deal ? deal.max : 20} />
                  <Text className="font-m-bold text-[13.5px] text-ink">{naira(p.price * qty)}</Text>
                </View>
                {gb && (
                  <View className="flex-row gap-[6px] mt-2 items-start">
                    <Icon name="Clock" size={12} color={colors.amberInk} style={{ flexShrink: 0, marginTop: 1 }} />
                    <Text className="flex-1 font-p-regular text-[10px] text-amberInk leading-[14.5px]">Ships after the deal fills — we'll confirm your delivery date.</Text>
                  </View>
                )}
              </View>
              <Pressable className="self-start p-[2px]" onPress={() => app.removeFromCart(key)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="X" size={17} color={colors.faint} />
              </Pressable>
            </View>
          );
        })}
        <View style={{ height: 8 }} />
      </ScrollView>

      {/* Footer */}
      <View className="bg-card border-t border-line px-4 pt-[13px]" style={{ paddingBottom: Math.max(insets.bottom, 15) }}>
        <View className="flex-row justify-between mb-[5px]">
          <Text className="font-p-regular text-[12px] text-sub">Subtotal</Text>
          <Text className="font-p-medium text-[12px] text-ink">{naira(subtotal)}</Text>
        </View>
        <View className="flex-row justify-between mb-[5px]">
          <Text className="font-p-regular text-[12px] text-sub">Delivery</Text>
          <Text className="font-p-regular text-[12px] text-sub">calculated at checkout</Text>
        </View>
        {hasGb && (
          <View className="flex-row gap-2 items-start bg-amberTint rounded-sm px-[11px] py-2 mt-1 mb-[5px]">
            <Icon name="Bell" size={14} color={colors.amberInk} style={{ flexShrink: 0, marginTop: 1 }} />
            <Text className="flex-1 font-p-regular text-[10px] text-amberInk leading-[15px]">Group Buy items ship once the deal fills — we'll reach out to confirm your delivery date and final shipping after checkout.</Text>
          </View>
        )}
        <View className="flex-row justify-between items-baseline mt-1 pt-[9px] border-t border-line border-dashed">
          <Text className="font-p-semibold text-[13px] text-ink">Total</Text>
          <Text className="font-m-extrabold text-[19px] text-green">{naira(subtotal)}</Text>
        </View>
        <FsButton full size="lg" label="Proceed to Checkout" onPress={() => navigation.navigate('Checkout1')} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}
