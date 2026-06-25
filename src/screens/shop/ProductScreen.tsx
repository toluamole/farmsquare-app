import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import { fsProduct } from '../../data/products';
import { useGetProductQuery } from '../../store/api/wooApi';
import ProductImage from '../../components/common/ProductImage';
import FsBadge from '../../components/common/FsBadge';
import FsButton from '../../components/common/FsButton';
import FsMiniCard from '../../components/common/FsMiniCard';
import FsEmpty from '../../components/common/FsEmpty';
import QtyControl from '../../components/common/QtyControl';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

function Stars({ rating, count }: { rating: number; count: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View className="flex-row items-center gap-[2px]">
      {[0, 1, 2, 3, 4].map(i => (
        <Icon key={i} name={i < full ? 'Star' : i === full && half ? 'StarHalf' : 'Star'} size={13} color={colors.amber} fill={i < full || (i === full && half) ? colors.amber : 'none'} />
      ))}
      <Text className="font-p-semibold text-[11.5px] text-ink ml-1">{rating}</Text>
      <Text className="font-p-regular text-[11px] text-sub">({count})</Text>
    </View>
  );
}

export default function ProductScreen({ navigation, route }: { navigation: any; route: any }) {
  const app = useApp();
  const { cartCount } = app;
  const insets = useSafeAreaInsets();
  const id: string = route.params?.id;
  const { data: p, isLoading } = useGetProductQuery(id);
  const deal = p?.deal ? app.deals.find(d => d.id === p.deal) : null;

  const [qty, setQtyLocal] = useState(1);
  const [descOpen, setDescOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);

  useEffect(() => {
    if (p) app.viewProduct(p.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.id]);

  if (isLoading && !p) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color={colors.green} />
        <Text className="font-p-regular text-[12px] text-sub mt-2">Loading product…</Text>
      </View>
    );
  }

  if (!p) {
    return (
      <View className="flex-1 bg-bg">
        <FsEmpty icon="box" title="Product not found" sub="This item may no longer be available." action="Go back" onAction={() => navigation.goBack()} />
      </View>
    );
  }

  const discount = p.was ? Math.round((1 - p.price / p.was) * 100) : null;
  const also = (p.related || []).map(fsProduct).filter(Boolean) as NonNullable<ReturnType<typeof fsProduct>>[];

  const stockBadge =
    p.stock === 'in' ? <FsBadge tone="green">IN STOCK</FsBadge>
      : p.stock === 'low' ? <FsBadge tone="amber">LOW STOCK</FsBadge>
      : <FsBadge tone="red">OUT OF STOCK</FsBadge>;

  const openDeal = () => {
    if (!p.deal) return;
    try {
      navigation.navigate('DealDetail', { id: p.deal });
    } catch {
      navigation.navigate('GroupBuyTab', { screen: 'DealDetail', params: { id: p.deal } });
    }
  };

  const addToCart = () => app.addToCart(p, qty);
  const buyNow = () => {
    app.addToCart(p, qty, true);
    navigation.navigate('Cart');
  };

  return (
    <View className="flex-1 bg-bg">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image area with overlaid header buttons */}
        <View className="relative">
          <ProductImage productId={p.id} imageUrl={p.img ?? undefined} style={{ height: 250, width: '100%', borderRadius: 0 }} />
          <View className="absolute left-[14px] right-[14px] flex-row justify-between" style={{ top: insets.top + 8 }}>
            <Pressable className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.92)] items-center justify-center" onPress={() => navigation.goBack()}>
              <Icon name="ArrowLeft" size={20} color={colors.ink} />
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.92)] items-center justify-center" onPress={() => app.toast('Share link copied')}>
                <Icon name="Share2" size={18} color={colors.ink} />
              </Pressable>
              <Pressable className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.92)] items-center justify-center" onPress={() => navigation.navigate('Cart')}>
                <Icon name="ShoppingCart" size={19} color={colors.ink} />
                {cartCount > 0 && (
                  <View className="absolute -top-[2px] -right-[2px] bg-red rounded-full min-w-[15px] h-[15px] items-center justify-center px-[3px]">
                    <Text className="font-p-bold text-[8.5px] text-white leading-[11px]">{cartCount > 9 ? '9+' : cartCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-4 pt-[14px]">
          {/* Stock + SKU */}
          <View className="flex-row items-center gap-[7px]">
            {stockBadge}
            <Text className="font-p-regular text-[10px] text-faint">SKU {p.sku}</Text>
          </View>

          <Text className="font-m-bold text-[17.5px] text-ink leading-[23px] mt-2 mb-[5px]">{p.name}</Text>
          <Stars rating={p.rating} count={`${p.reviews} reviews`} />

          {/* Price */}
          <View className="flex-row items-center gap-2 mt-[10px]">
            <Text className="font-m-extrabold text-[26px] text-green">{naira(p.price)}</Text>
            {p.was && <Text className="font-p-regular text-[13px] text-faint line-through">{naira(p.was)}</Text>}
            {discount != null && <FsBadge tone="red">−{discount}%</FsBadge>}
          </View>

          {/* Group Buy callout */}
          {deal && (
            <Pressable className="mt-3 bg-amberTint border-[1.5px] border-amber/30 rounded-md px-[13px] py-[11px] flex-row items-center gap-[11px]" onPress={openDeal}>
              <Icon name="Zap" size={19} color={colors.amberInk} />
              <View className="flex-1">
                <Text className="font-p-semibold text-[12px] text-ink">Buy cheaper in Group Buy</Text>
                <Text className="font-p-regular text-[10.5px] text-sub mt-[1px]">{naira(deal.price)} per {deal.unit} · save {Math.round((1 - deal.price / deal.retail) * 100)}% · {deal.total - deal.reserved} left</Text>
              </View>
              <Icon name="ChevronRight" size={15} color={colors.amberInk} />
            </Pressable>
          )}

          {/* Description */}
          <View className="mt-4">
            <Text className="font-m-bold text-[14px] text-ink mb-[6px]">Description</Text>
            <Text className="font-p-regular text-[12px] text-sub leading-[19px]" numberOfLines={descOpen ? undefined : 3}>{p.desc}</Text>
            <Pressable onPress={() => setDescOpen(o => !o)}>
              <Text className="font-p-semibold text-[11.5px] text-green pt-1">{descOpen ? 'Read less' : 'Read more'}</Text>
            </Pressable>
          </View>

          {/* Specifications */}
          <View className="mt-3 bg-card border border-line rounded-md overflow-hidden">
            <Pressable className="flex-row items-center justify-between px-[14px] py-3" onPress={() => setSpecsOpen(o => !o)}>
              <Text className="font-m-bold text-[13px] text-ink">Specifications</Text>
              <Icon name={specsOpen ? 'ChevronUp' : 'ChevronDown'} size={15} color={colors.sub} />
            </Pressable>
            {specsOpen && (
              <View className="px-[14px] pb-[6px]">
                {p.specs.map(([k, v]) => (
                  <View key={k} className="flex-row justify-between gap-[14px] py-2 border-t border-line">
                    <Text className="font-p-regular text-[11.5px] text-sub">{k}</Text>
                    <Text className="font-p-medium text-[11.5px] text-ink text-right shrink">{v}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Inline add-to-cart block */}
          <View className="mt-4 bg-card border border-line rounded-md p-[14px]">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-p-regular text-[11px] text-sub">Total · {qty} {qty > 1 ? 'items' : 'item'}</Text>
                <Text className="font-m-extrabold text-[20px] text-green">{naira(p.price * qty)}</Text>
              </View>
              <QtyControl value={qty} onChange={setQtyLocal} min={1} max={20} />
            </View>
            <View className="flex-row gap-[10px] mt-[13px]">
              <FsButton kind="outline" label="Add to Cart" style={{ flex: 1 }} onPress={addToCart} />
              <FsButton label="Buy Now" style={{ flex: 1 }} onPress={buyNow} />
            </View>
          </View>

          {/* Related */}
          {also.length > 0 && (
            <View className="mt-4">
              <Text className="font-m-bold text-[14px] text-ink mb-[6px]">You may also need</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-[10px] pb-1">
                {also.map(rp => (
                  <FsMiniCard key={rp.id} p={rp} onOpen={() => navigation.push ? navigation.push('Product', { id: rp.id }) : navigation.navigate('Product', { id: rp.id })} />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 16 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View className="bg-card border-t border-line px-4 pt-[11px] flex-row items-center gap-[10px]" style={{ paddingBottom: Math.max(insets.bottom, 13) }}>
        <QtyControl value={qty} onChange={setQtyLocal} min={1} max={20} small />
        <FsButton kind="outline" label="Add to Cart" style={{ flex: 1 }} onPress={addToCart} />
        <FsButton label="Buy Now" style={{ flex: 1 }} onPress={buyNow} />
      </View>
    </View>
  );
}
