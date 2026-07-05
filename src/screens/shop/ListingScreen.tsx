import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Product } from '../../data/products';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../store/api/wooApi';
import ScreenHeader from '../../components/layout/ScreenHeader';
import BottomSheet from '../../components/layout/BottomSheet';
import FsGridCard from '../../components/common/FsGridCard';
import FsChip from '../../components/common/FsChip';
import FsEmpty from '../../components/common/FsEmpty';

const SORTS = ['Popularity', 'Newest', 'Price: Low–High', 'Price: High–Low', 'Rating'];

const PRICE_FILTERS: { value: number | null; label: string }[] = [
  { value: null, label: 'Any price' },
  { value: 5000, label: 'Under ₦5,000' },
  { value: 20000, label: 'Under ₦20,000' },
  { value: 70000, label: 'Under ₦70,000' },
];

export default function ListingScreen({ navigation, route }: { navigation: any; route: any }) {
  const app = useApp();
  const { cartCount } = app;
  const flash = !!route.params?.flash;

  const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const cat = categories.find(c => c.id === route.params?.cat);

  const [sort, setSort] = useState('Popularity');
  const [sortOpen, setSortOpen] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const list = useMemo(() => {
    let l = products.filter(p => (!cat || p.cat === cat.id) && (!flash || p.was));
    if (inStock) l = l.filter(p => p.stock === 'in');
    if (maxPrice) l = l.filter(p => p.price <= maxPrice);
    return [...l].sort((a, b) =>
      sort === 'Price: Low–High' ? a.price - b.price
        : sort === 'Price: High–Low' ? b.price - a.price
        : sort === 'Rating' ? b.rating - a.rating
        : b.reviews - a.reviews,
    );
  }, [products, cat, flash, inStock, maxPrice, sort]);

  const rows: (Product | null)[][] = [];
  for (let i = 0; i < list.length; i += 2) {
    rows.push([list[i], list[i + 1] || null]);
  }

  const title = flash ? 'Flash Deals' : cat ? cat.label : 'All Products';

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader
        title={title}
        subtitle={`${list.length} products`}
        right={
          <Pressable onPress={() => navigation.navigate('Cart')} className="w-9 h-9 items-center justify-center relative">
            <Icon name="ShoppingCart" size={22} color={colors.ink} />
            {cartCount > 0 && (
              <View className="absolute top-0 right-0 bg-red rounded-full min-w-[15px] h-[15px] items-center justify-center px-[3px]">
                <Text className="font-p-bold text-[8.5px] text-white leading-[11px]">{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </Pressable>
        }
      />

      {/* Filter / sort chips */}
      <View className="py-[10px]">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-2 items-center">
          <Pressable onPress={() => setSortOpen(true)} className="flex-row items-center gap-[5px] bg-card border-[1.5px] border-line rounded-lg px-3 py-[6px]">
            <Text className="font-p-medium text-[11px] text-ink">{sort}</Text>
            <Icon name="ChevronDown" size={13} color={colors.sub} />
          </Pressable>
          <FsChip small label="In stock" active={inStock} onPress={() => setInStock(v => !v)} />
          {PRICE_FILTERS.map(f => (
            <FsChip key={f.label} small label={f.label} active={maxPrice === f.value} onPress={() => setMaxPrice(f.value)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 gap-[9px]" showsVerticalScrollIndicator={false}>
        {rows.map((row, i) => (
          <View key={i} className="flex-row gap-[9px]">
            {row.map((p, j) =>
              p ? (
                <FsGridCard key={p.id} p={p} onOpen={() => navigation.navigate('Product', { id: p.id })} onAdd={() => app.addToCart(p)} />
              ) : (
                <View key={`spacer-${j}`} className="flex-1" />
              ),
            )}
          </View>
        ))}
        {isLoading && list.length === 0 && (
          <View className="py-12 items-center">
            <ActivityIndicator color={colors.green} />
            <Text className="font-p-regular text-[12px] text-sub mt-2">Loading products…</Text>
          </View>
        )}
        {isError && products.length === 0 && (
          <FsEmpty
            icon="box"
            title="Couldn't load products"
            sub="We couldn't reach the store. Check your connection and try again."
            action="Retry"
            onAction={() => refetch()}
          />
        )}
        {!isLoading && !isError && list.length === 0 && (
          <FsEmpty
            icon="search"
            title="Nothing matches"
            sub="Try removing some filters."
            action="Reset filters"
            onAction={() => { setInStock(false); setMaxPrice(null); }}
          />
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        {SORTS.map(s => (
          <Pressable
            key={s}
            onPress={() => { setSort(s); setSortOpen(false); }}
            className={cn('flex-row items-center justify-between py-3 px-[11px] rounded-sm', s === sort && 'bg-limeTint')}
          >
            <Text className={cn('text-[13px]', s === sort ? 'font-p-semibold text-green' : 'font-p-regular text-ink')}>{s}</Text>
            {s === sort && <Icon name="Check" size={17} color={colors.green} />}
          </Pressable>
        ))}
        <View style={{ height: 12 }} />
      </BottomSheet>
    </View>
  );
}
