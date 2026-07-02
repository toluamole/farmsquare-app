import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../store/api/wooApi';
import FsCarousel from '../../components/common/FsCarousel';
import AdSlide from '../../components/common/AdSlide';
import FsMiniCard from '../../components/common/FsMiniCard';
import FsButton from '../../components/common/FsButton';
import FsEmpty from '../../components/common/FsEmpty';
import Icon, { IconName } from '../../components/common/Icon';

const CATEGORY_ICONS: Record<string, IconName> = {
  seeds: 'Sprout', fertilizers: 'Droplets', agrochemicals: 'FlaskConical',
  irrigation: 'Droplet', equipment: 'Wrench', livestock: 'Bird',
};

export default function ShopScreen({ navigation }: { navigation: any }) {
  const app = useApp();
  const { cartCount } = app;

  const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  // Derive the homepage rails from the live catalog (falls back to mock data
  // via the service layer when WC credentials are absent).
  const flashDeals = products.filter(p => p.was);
  const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const newArrivals = products.slice(0, 8);

  // const brandSlides = [
  //   <AdSlide key="b1" eyebrow="BRAND DEAL" title="Notore Fertilizer — Direct from Factory" sub="Certified NPK, Urea & CAN at best prices" cta="Shop Notore" icon="Factory" tint="rgba(52,78,20,0.94)" onPress={() => navigation.navigate('Listing', { brand: 'notore' })} />,
  //   <AdSlide key="b2" eyebrow="NEW STOCK" title="Drip Kits & Irrigation Equipment" sub="Full kits from ¼ acre to 5 acres" cta="Explore" icon="Droplet" tint="rgba(13,71,161,0.88)" onPress={() => navigation.navigate('Listing', { cat: 'irrigation' })} />,
  //   <AdSlide key="b3" eyebrow="AGROCHEMICALS" title="NAFDAC-Certified Pesticides & Herbicides" sub="Ampligo, Force Up, Roundup and more" cta="Shop Now" icon="FlaskConical" tint="rgba(90,20,60,0.88)" onPress={() => navigation.navigate('Listing', { cat: 'agrochemicals' })} />,
  // ];

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-line">
        <Text className="font-m-extrabold text-[20px] text-ink">Shop</Text>
        <Pressable className="w-10 h-10 items-center justify-center relative" onPress={() => navigation.navigate('Cart')}>
          <Icon name="ShoppingCart" size={22} color={colors.ink} />
          {cartCount > 0 && (
            <View className="absolute top-[2px] right-[2px] bg-red rounded-full min-w-[16px] h-4 items-center justify-center px-[3px]">
              <Text className="font-p-bold text-[9px] text-white leading-[12px]">{cartCount > 9 ? '9+' : cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <Pressable className="flex-row items-center bg-field mx-4 mt-4 rounded-sm px-[14px] h-[46px] gap-[10px] mb-4" onPress={() => navigation.navigate('Search')}>
          <Icon name="Search" size={18} color={colors.faint} />
          <Text className="font-p-regular text-[13px] text-faint">Search products…</Text>
        </Pressable>

        {/* Brand Carousel */}
        {/* <View className="mb-6">
          <FsCarousel slides={brandSlides} height={124} />
        </View> */}

        {/* Categories */}
        {categories.length > 0 && (
          <>
            <View className="flex-row items-center justify-between px-4 mb-3">
              <Text className="font-m-bold text-[15px] text-ink">Categories</Text>
            </View>
            <View className="flex-row flex-wrap px-4 gap-[10px] mb-6">
              {categories.map(cat => (
                <Pressable key={cat.id} className="w-[30%] items-center bg-card rounded-md py-[14px] border border-line" onPress={() => navigation.navigate('Listing', { cat: cat.id })}>
                  <View className="mb-[6px]">
                    <Icon name={CATEGORY_ICONS[cat.id] || 'Package'} size={24} color={colors.green} strokeWidth={1.9} />
                  </View>
                  <Text className="font-p-medium text-[11px] text-ink text-center">{cat.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* Loading state for the live catalog */}
        {isLoading && products.length === 0 && (
          <View className="py-10 items-center">
            <ActivityIndicator color={colors.green} />
            <Text className="font-p-regular text-[12px] text-sub mt-2">Loading products…</Text>
          </View>
        )}

        {/* Error state for the live catalog */}
        {isError && products.length === 0 && (
          <FsEmpty
            icon="box"
            title="Couldn't load products"
            sub="We couldn't reach the store. Check your connection and try again."
            action="Retry"
            onAction={() => refetch()}
          />
        )}

        {/* New Arrivals */}
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="font-m-bold text-[15px] text-ink">New Arrivals</Text>
          <Pressable onPress={() => navigation.navigate('Listing', { type: 'new' })}>
            <Text className="font-p-medium text-[12px] text-green">See all →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-[10px] pb-1 mb-6">
          {newArrivals.map(p => (
            <FsMiniCard key={p.id} p={p} onOpen={() => navigation.navigate('Product', { id: p.id })} onAdd={() => app.addToCart(p)} />
          ))}
        </ScrollView>

        {/* Brand Spotlight */}
        {/* <View className="px-4 mb-6">
          <LinearGradient
            colors={[colors.green, colors.greenDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center' }}
          >
            <View className="flex-1">
              <Text className="font-p-semibold text-[9px] text-[rgba(255,255,255,0.75)] tracking-[0.5px] mb-1">BRAND SPOTLIGHT</Text>
              <Text className="font-m-extrabold text-[17px] text-white mb-1">Notore Fertilizer Store</Text>
              <Text className="font-p-regular text-[11.5px] text-[rgba(255,255,255,0.85)] mb-[14px] leading-4">Factory-direct certified fertilizers. Nationwide delivery.</Text>
              <FsButton label="Visit Store" kind="lime" size="sm" onPress={() => navigation.navigate('Listing', { brand: 'notore' })} />
            </View>
            <Icon name="Factory" size={52} color="rgba(255,255,255,0.92)" strokeWidth={1.6} />
          </LinearGradient>
        </View> */}

        {/* Best Sellers */}
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text className="font-m-bold text-[15px] text-ink">Best Sellers</Text>
          <Pressable onPress={() => navigation.navigate('Listing', { type: 'bestsellers' })}>
            <Text className="font-p-medium text-[12px] text-green">See all →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-[10px] pb-1 mb-6">
          {bestSellers.map(p => (
            <FsMiniCard key={p.id} p={p} onOpen={() => navigation.navigate('Product', { id: p.id })} onAdd={() => app.addToCart(p)} />
          ))}
        </ScrollView>

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
          {flashDeals.map(p => (
            <FsMiniCard key={p.id} p={p} onOpen={() => navigation.navigate('Product', { id: p.id })} onAdd={() => app.addToCart(p)} />
          ))}
        </ScrollView>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
