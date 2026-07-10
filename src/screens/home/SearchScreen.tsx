import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { useBrowseProductsInfiniteQuery } from '../../store/api/wooApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addRecentSearch, clearRecentSearches } from '../../store/slices/searchSlice';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import FsGridCard from '../../components/common/FsGridCard';
import FsChip from '../../components/common/FsChip';
import FsEmpty from '../../components/common/FsEmpty';
import Icon from '../../components/common/Icon';
import { useApp } from '../../context/AppContext';

// Curated suggestions until search analytics exist to drive real trending terms.
const TRENDING = ['NPK fertilizer', 'Drip irrigation', 'Tomato seeds', 'Knapsack sprayer', 'Maize seeds', 'Herbicide'];

export default function SearchScreen({ navigation }: { navigation: any }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const app = useApp();
  const dispatch = useAppDispatch();
  const recentSearches = useAppSelector(s => s.search.recent);

  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const hasQuery = debouncedQuery.length > 0;

  // Server-side search over the full catalog (WC `search` param via the Worker).
  const {
    data, isFetching, isError,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useBrowseProductsInfiniteQuery({ search: debouncedQuery }, { skip: !hasQuery });

  const results = data?.pages.flatMap(p => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  // Pad to an even length so a lone item in the last row keeps card width.
  const gridData = results.length % 2 === 1 ? [...results, null] : results;
  const searching = query.trim().length > 0 && (query.trim() !== debouncedQuery || (isFetching && !data));

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const submitSearch = (term: string) => {
    setQuery(term);
    dispatch(addRecentSearch(term));
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Search bar */}
      <View className="flex-row items-center px-4 py-[10px] gap-[10px] border-b border-line">
        <Pressable onPress={() => navigation.goBack()} className="w-9 h-9 items-center justify-center">
          <Icon name="ArrowLeft" size={24} color={colors.ink} />
        </Pressable>
        <View className="flex-1 flex-row items-center bg-field rounded-sm px-3 h-11 gap-2">
          <Icon name="Search" size={18} color={colors.faint} />
          <TextInput
            ref={inputRef}
            className="flex-1 font-p-regular text-[13px] text-ink p-0"
            placeholder="Search seeds, fertilizers, tools…"
            placeholderTextColor={colors.faint}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => query.trim() && dispatch(addRecentSearch(query))}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} className="p-1">
              <Icon name="X" size={16} color={colors.faint} />
            </Pressable>
          )}
        </View>
      </View>

      {!query.trim() ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <View className="px-4 pt-4 pb-1">
              <View className="flex-row items-center justify-between mb-[10px]">
                <Text className="font-m-bold text-[14px] text-ink">Recent Searches</Text>
                <Pressable onPress={() => dispatch(clearRecentSearches())}>
                  <Text className="font-p-medium text-[12px] text-green">Clear</Text>
                </Pressable>
              </View>
              {recentSearches.map((s, i) => (
                <Pressable key={i} className="flex-row items-center py-3 border-b border-line gap-3" onPress={() => submitSearch(s)}>
                  <Icon name="Clock" size={15} color={colors.faint} />
                  <Text className="flex-1 font-p-regular text-[13px] text-ink">{s}</Text>
                  <Icon name="ArrowUpRight" size={15} color={colors.faint} />
                </Pressable>
              ))}
            </View>
          )}

          {/* Trending */}
          <View className="px-4 pt-4 pb-1">
            <Text className="font-m-bold text-[14px] text-ink">Trending Now</Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {TRENDING.map((t, i) => (
                <FsChip key={i} label={t} onPress={() => submitSearch(t)} small />
              ))}
            </View>
          </View>

          {/* Diagnose CTA */}
          <Pressable
            className="flex-row items-center mx-4 mt-6 bg-limeTint rounded-md border border-limeLine p-4 gap-3"
            onPress={() => navigation.navigate('Diagnose')}
          >
            <View className="w-11 h-11 rounded-full bg-card items-center justify-center">
              <Icon name="Microscope" size={22} color={colors.green} />
            </View>
            <View className="flex-1">
              <Text className="font-p-semibold text-[13px] text-ink">Diagnose a farm problem</Text>
              <Text className="font-p-regular text-[11.5px] text-sub mt-[2px]">Describe symptoms and get treatment advice</Text>
            </View>
            <Icon name="ChevronRight" size={20} color={colors.faint} />
          </Pressable>
        </ScrollView>
      ) : searching ? (
        <View className="py-12 items-center">
          <ActivityIndicator color={colors.green} />
          <Text className="font-p-regular text-[12px] text-sub mt-2">Searching…</Text>
        </View>
      ) : isError ? (
        <FsEmpty
          icon="box"
          title="Couldn't search"
          sub="We couldn't reach the store. Check your connection and try again."
        />
      ) : results.length === 0 ? (
        <FsEmpty
          icon="search"
          title="No results found"
          sub={`We couldn't find products for "${debouncedQuery}". Try different keywords.`}
          action="Diagnose a farm problem"
          onAction={() => navigation.navigate('Diagnose')}
        />
      ) : (
        <FlatList
          data={gridData}
          keyExtractor={(item, i) => (item ? item.id : `spacer-${i}`)}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) =>
            item ? (
              <FsGridCard
                p={item}
                onOpen={() => {
                  dispatch(addRecentSearch(query));
                  navigation.navigate('Product', { id: item.id });
                }}
                onAdd={() => app.addToCart(item)}
              />
            ) : (
              <View className="flex-1" />
            )
          }
          ListHeaderComponent={
            <Text className="font-p-regular text-[12px] text-sub mb-3">{total.toLocaleString('en-NG')} result{total !== 1 ? 's' : ''}</Text>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4 items-center">
                <ActivityIndicator color={colors.green} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
