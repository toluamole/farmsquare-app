import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import { useBrowseProductsInfiniteQuery, useGetCategoriesQuery, ProductFilters, SortKey } from '../../store/api/wooApi';
import ScreenHeader from '../../components/layout/ScreenHeader';
import BottomSheet from '../../components/layout/BottomSheet';
import FsGridCard from '../../components/common/FsGridCard';
import FsChip from '../../components/common/FsChip';
import FsEmpty from '../../components/common/FsEmpty';

const SORTS: SortKey[] = ['Popularity', 'Newest', 'Price: Low–High', 'Price: High–Low', 'Rating'];

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
  const type = route.params?.type as 'new' | 'bestsellers' | undefined;

  const { data: categories = [] } = useGetCategoriesQuery();
  const cat = categories.find(c => c.id === route.params?.cat);

  const [sort, setSort] = useState<SortKey>(type === 'new' ? 'Newest' : 'Popularity');
  const [sortOpen, setSortOpen] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // All filtering/sorting is server-side (WC query params via the Worker).
  const filters = useMemo<ProductFilters>(() => ({
    category: cat?.wcId,
    onSale: flash || undefined,
    inStock: inStock || undefined,
    maxPrice: maxPrice ?? undefined,
    sort,
  }), [cat?.wcId, flash, inStock, maxPrice, sort]);

  const {
    data, isLoading, isError, refetch,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useBrowseProductsInfiniteQuery(filters, {
    // A category listing must wait for the slug → WC id lookup, or the first
    // fetch would return the whole unfiltered catalog.
    skip: !!route.params?.cat && !cat,
  });

  const list = data?.pages.flatMap(p => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  // Pad to an even length so a lone item in the last row keeps card width.
  const gridData = list.length % 2 === 1 ? [...list, null] : list;

  const title = flash ? 'Flash Deals' : type === 'new' ? 'New Arrivals' : type === 'bestsellers' ? 'Best Sellers' : cat ? cat.label : 'All Products';

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader
        title={title}
        subtitle={`${total.toLocaleString('en-NG')} products`}
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

      <FlatList
        data={gridData}
        keyExtractor={(p, i) => (p ? p.id : `spacer-${i}`)}
        numColumns={2}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 9, paddingBottom: 24 }}
        columnWrapperStyle={{ gap: 9 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        renderItem={({ item: p }) =>
          p ? (
            <FsGridCard p={p} onOpen={() => navigation.navigate('Product', { id: p.id })} onAdd={() => app.addToCart(p)} />
          ) : (
            <View className="flex-1" />
          )
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="py-12 items-center">
              <ActivityIndicator color={colors.green} />
              <Text className="font-p-regular text-[12px] text-sub mt-2">Loading products…</Text>
            </View>
          ) : isError ? (
            <FsEmpty
              icon="box"
              title="Couldn't load products"
              sub="We couldn't reach the store. Check your connection and try again."
              action="Retry"
              onAction={() => refetch()}
            />
          ) : (
            <FsEmpty
              icon="search"
              title="Nothing matches"
              sub="Try removing some filters."
              action="Reset filters"
              onAction={() => { setInStock(false); setMaxPrice(null); }}
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator color={colors.green} />
            </View>
          ) : null
        }
      />

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
