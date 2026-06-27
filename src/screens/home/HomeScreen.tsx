import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import { FS_CATEGORIES } from '../../data/products';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../store/api/wooApi';
import { FS_DEALS } from '../../data/deals';
// import FsCarousel from '../../components/common/FsCarousel';
// import AdSlide from '../../components/common/AdSlide';
import FsBadge from '../../components/common/FsBadge';
import FsProgress from '../../components/common/FsProgress';
import FsMiniCard from '../../components/common/FsMiniCard';
import { PromoImage } from '../../components/common/ProductImage';
import FsButton from '../../components/common/FsButton';
import { useCountdown } from '../../components/common/CountdownTimer';
import Icon, { IconName } from '../../components/common/Icon';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const CATEGORY_ICONS: Record<string, IconName> = {
  seeds: 'Sprout',
  fertilizers: 'Droplets',
  agrochemicals: 'FlaskConical',
  irrigation: 'Droplet',
  equipment: 'Wrench',
  livestock: 'Bird',
};

function DealCard({ deal, onPress, t0 }: { deal: typeof FS_DEALS[0]; onPress: () => void; t0: number }) {
  const target = deal.closeOffset ? t0 + deal.closeOffset : 0;
  const { d, h, m, s, done } = useCountdown(target);
  const pct = Math.round((deal.reserved / deal.total) * 100);
  const save = Math.round((1 - deal.price / deal.retail) * 100);

  return (
    <Pressable onPress={onPress} className="w-[290px] bg-card rounded-md border border-line overflow-hidden shrink-0">
      <PromoImage dealId={deal.id} style={{ height: 104, width: '100%' }} />
      <View className="p-3">
        <View className="flex-row gap-[6px] mb-[7px]">
          <FsBadge tone="green">GROUP BUY</FsBadge>
          <FsBadge tone="amber">−{save}%</FsBadge>
        </View>
        <Text className="font-p-medium text-[12.5px] text-ink mb-[6px] leading-[17px]" numberOfLines={2}>{deal.short}</Text>
        <View className="flex-row items-baseline gap-[5px] mb-2">
          <Text className="font-m-bold text-[16px] text-green">{naira(deal.price)}</Text>
          <Text className="font-p-regular text-[11px] text-faint line-through">{naira(deal.retail)}</Text>
          <Text className="font-p-regular text-[11px] text-sub">/{deal.unit}</Text>
        </View>
        <FsProgress pct={pct} h={5} />
        <Text className="font-p-regular text-[10.5px] text-sub mt-[5px] mb-[5px]">{deal.reserved}/{deal.total} bags · {deal.farmers} farmers</Text>
        {!done && target > 0 && (
          <View className="flex-row items-center mb-2">
            <Text className="font-p-regular text-[10.5px] text-sub">Closes in </Text>
            <Text className="font-m-bold text-[11px] text-ink">{d}d {h}h {m}m {s}s</Text>
          </View>
        )}
        <FsButton label="Reserve" size="sm" full onPress={onPress} style={{ marginTop: 4 }} />
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }: { navigation: any }) {
  const app = useApp();
  const { auth, cartCount, cropSetup, t0 } = app;

  const { data: products = [] } = useGetProductsQuery();
  // Live WooCommerce categories; falls back to FS_CATEGORIES via the service layer.
  const { data: categories = FS_CATEGORIES } = useGetCategoriesQuery();
  const activeDeals = FS_DEALS.filter(d => d.status === 'active');
  const flashProducts = products.filter(p => p.was);

//   const heroSlides = [
//     <AdSlide key="s1" eyebrow="WET SEASON READY" title="Seeds & Irrigation for Wet Season" sub="Cobra F1, drip kits and more" cta="Shop Now" icon="CloudRain" onPress={() => navigation.navigate('Search')} />,
//     <AdSlide key="s2" eyebrow="GROUP BUY" badge="OPEN" title="NPK 50kg Truck-load Deal" sub="₦22,500/bag · save 20%" cta="Join Deal" icon="Truck" tint="rgba(52,78,20,0.94)" onPress={() => navigation.getParent()?.navigate('GroupBuyTab', { screen: 'GroupBuy' })} />,
//     <AdSlide key="s3" eyebrow="FREE DELIVERY" title="Free delivery on orders over ₦50,000" sub="Lagos, Ogun, Oyo and 14 more states" cta="Shop Now" icon="Truck" tint="rgba(20,60,90,0.90)" onPress={() => navigation.navigate('Search')} />,
//     <AdSlide key="s4" eyebrow="FLASH DEAL −12%" title="Drip Kits & Solar Pumps" sub="Limited stock — ends Friday" cta="Shop Now" icon="Zap" tint="rgba(90,30,10,0.88)" onPress={() => navigation.navigate('Listing', { flash: true })} />,
//   ];

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View className="flex-row items-start justify-between px-4 pt-2 pb-1">
          <View>
            <View className="flex-row items-center gap-[6px]">
              <Icon name="Sprout" size={20} color={colors.green} strokeWidth={2.25} />
              <Text className="font-m-extrabold text-[20px] text-green tracking-[-0.3px]">Farmsquare</Text>
            </View>
            <Pressable className="mt-[3px] flex-row items-center gap-1">
              <Icon name="MapPin" size={13} color={colors.sub} />
              <Text className="font-p-regular text-[11.5px] text-sub">Ikeja, Lagos</Text>
            </Pressable>
          </View>
          <View className="flex-row gap-[6px] pt-1">
            <Pressable className="w-10 h-10 items-center justify-center relative" onPress={() => navigation.navigate('Cart')}>
              <Icon name="ShoppingCart" size={22} color={colors.ink} />
              {cartCount > 0 && (
                <View className="absolute top-[2px] right-[2px] bg-red rounded-full min-w-[16px] h-4 items-center justify-center px-[3px]">
                  <Text className="font-p-bold text-[9px] text-white leading-[12px]">{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable className="w-10 h-10 items-center justify-center relative" onPress={() => navigation.navigate('Notifications')}>
              <Icon name="Bell" size={22} color={colors.ink} />
              <View className="absolute top-[2px] right-[2px] bg-red rounded-full min-w-[16px] h-4 items-center justify-center px-[3px]">
                <Text className="font-p-bold text-[9px] text-white leading-[12px]">2</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Guest Banner */}
        {auth.guest && (
          <Pressable className="bg-ink mx-4 mb-2 rounded-sm px-4 py-[11px]" onPress={() => navigation.getParent()?.navigate('AuthGate')}>
            <Text className="font-p-medium text-[12px] text-white text-center">Sign in to place orders and join Group Buy deals →</Text>
          </Pressable>
        )}

        {/* Search Bar */}
        <Pressable className="flex-row items-center bg-field mx-4 rounded-sm px-[14px] h-[46px] gap-[10px] mb-4" onPress={() => navigation.navigate('Search')}>
          <Icon name="Search" size={18} color={colors.faint} />
          <Text className="font-p-regular text-[13px] text-faint flex-1">Search seeds, fertilizers, tools…</Text>
        </Pressable>

        {/* Hero Carousel */}
        {/* <View className="mb-6">
          <FsCarousel slides={heroSlides} height={140} />
        </View> */}

        {/* Active Group Buy Deals */}
        {/* <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="font-m-bold text-[15px] text-ink">Active Group Buy Deals</Text>
          <Pressable onPress={() => navigation.getParent()?.navigate('GroupBuyTab', { screen: 'GroupBuy' })}>
            <Text className="font-p-medium text-[12px] text-green">See all →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-3 pb-1 mb-6">
          {activeDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} t0={t0} onPress={() => navigation.getParent()?.navigate('GroupBuyTab', { screen: 'DealDetail', params: { id: deal.id } })} />
          ))}
        </ScrollView> */}

        {/* Today on Your Farm */}
        {/* <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="font-m-bold text-[15px] text-ink">Today on Your Farm</Text>
        </View>
        <View className="px-4 mb-6">
          {cropSetup ? (
            <Pressable className="bg-limeTint rounded-md border border-limeLine p-4" onPress={() => navigation.getParent()?.navigate('AdvisoryTab', { screen: 'MyFarm' })}>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="font-p-semibold text-[9px] text-green tracking-[0.3px] mb-[5px]">TOMATO · WEEK 4 — FLOWERING</Text>
                  <Text className="font-m-bold text-[14px] text-ink mb-2">Stake your tomato plants</Text>
                  <View className="gap-1">
                    <FsProgress pct={38} h={5} />
                    <Text className="font-p-regular text-[10px] text-sub">38% complete</Text>
                  </View>
                </View>
                <View className="items-center gap-1">
                  <Icon name="Sprout" size={30} color={colors.green} />
                  <Icon name="ChevronRight" size={20} color={colors.green} />
                </View>
              </View>
            </Pressable>
          ) : (
            <Pressable className="border-[1.5px] border-limeLine border-dashed rounded-md p-5 flex-row items-center justify-center gap-[10px]" onPress={() => navigation.getParent()?.navigate('AdvisoryTab', { screen: 'MyFarm' })}>
              <Icon name="Sprout" size={22} color={colors.green} />
              <Text className="font-p-medium text-[13.5px] text-green">Set up your first crop →</Text>
            </Pressable>
          )}
        </View> */}

        {/* Shop by Category */}
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="font-m-bold text-[15px] text-ink">Shop by Category</Text>
        </View>
        <View className="flex-row flex-wrap px-4 gap-[10px] mb-6">
          {categories.map(cat => (
            <Pressable key={cat.id} className="w-[30%] items-center bg-card rounded-md py-[14px] border border-line" onPress={() => navigation.navigate('Listing', { cat: cat.id })}>
              <View className="mb-[6px]">
                <Icon name={CATEGORY_ICONS[cat.id] || 'Package'} size={26} color={colors.green} strokeWidth={1.9} />
              </View>
              <Text className="font-p-medium text-[11px] text-ink text-center">{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Flash Deals */}
        <View className="flex-row items-center justify-between px-4 mb-3">
          <View className="flex-row items-center gap-[5px]">
            <Text className="font-m-bold text-[15px] text-ink">Flash Deals</Text>
            <Icon name="Zap" size={15} color={colors.amber} fill={colors.amber} />
          </View>
          <Pressable onPress={() => navigation.navigate('Listing', { flash: true })}>
            <Text className="font-p-medium text-[12px] text-green">See all →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-[10px] pb-1 mb-6">
          {flashProducts.map(p => (
            <FsMiniCard key={p.id} p={p} onOpen={() => navigation.navigate('Product', { id: p.id })} />
          ))}
        </ScrollView>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
