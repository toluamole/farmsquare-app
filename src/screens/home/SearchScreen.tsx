import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { useGetProductsQuery } from '../../store/api/wooApi';
import FsGridCard from '../../components/common/FsGridCard';
import FsChip from '../../components/common/FsChip';
import FsEmpty from '../../components/common/FsEmpty';
import Icon from '../../components/common/Icon';
import { useApp } from '../../context/AppContext';

const TRENDING = ['NPK fertilizer', 'Drip irrigation', 'Tomato seeds', 'Knapsack sprayer', 'Maize seeds', 'Herbicide'];
const RECENT_SEARCHES = ['Cobra F1 tomato', 'Urea 50kg', 'Solar pump'];

export default function SearchScreen({ navigation }: { navigation: any }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const app = useApp();
  const { data: products = [] } = useGetProductsQuery();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const results = query.trim().length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.cat.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasQuery = query.trim().length > 0;

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

      {!hasQuery ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Recent searches */}
          {RECENT_SEARCHES.length > 0 && (
            <View className="px-4 pt-4 pb-1">
              <View className="flex-row items-center justify-between mb-[10px]">
                <Text className="font-m-bold text-[14px] text-ink">Recent Searches</Text>
                <Pressable>
                  <Text className="font-p-medium text-[12px] text-green">Clear</Text>
                </Pressable>
              </View>
              {RECENT_SEARCHES.map((s, i) => (
                <Pressable key={i} className="flex-row items-center py-3 border-b border-line gap-3" onPress={() => setQuery(s)}>
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
                <FsChip key={i} label={t} onPress={() => setQuery(t)} small />
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
      ) : results.length === 0 ? (
        <FsEmpty
          icon="search"
          title="No results found"
          sub={`We couldn't find products for "${query}". Try different keywords.`}
          action="Diagnose a farm problem"
          onAction={() => navigation.navigate('Diagnose')}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <FsGridCard
              p={item}
              onOpen={() => navigation.navigate('Product', { id: item.id })}
              onAdd={() => app.addToCart(item)}
            />
          )}
          ListHeaderComponent={
            <Text className="font-p-regular text-[12px] text-sub mb-3">{results.length} result{results.length !== 1 ? 's' : ''}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
