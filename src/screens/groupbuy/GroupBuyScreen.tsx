import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { colors, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Deal } from '../../data/deals';
import FsBadge from '../../components/common/FsBadge';
import FsButton from '../../components/common/FsButton';
import FsChip from '../../components/common/FsChip';
import FsProgress from '../../components/common/FsProgress';
import FsEmpty from '../../components/common/FsEmpty';
import ProductImage from '../../components/common/ProductImage';
import CountdownTimer from '../../components/common/CountdownTimer';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const TABS = ['All', 'Active', 'Upcoming', 'Closed'];

function GbDealCard({ deal, t0, onOpen, onRemind }: { deal: Deal; t0: number; onOpen: () => void; onRemind: () => void }) {
  const pct = Math.round((deal.reserved / deal.total) * 100);
  const save = Math.round((1 - deal.price / deal.retail) * 100);

  const status =
    deal.status === 'upcoming' ? 'UPCOMING'
    : deal.status === 'closed' ? 'CLOSED'
    : pct > 85 ? 'ALMOST FULL'
    : pct > 60 ? 'FILLING FAST'
    : 'OPEN';
  const tone: 'gray' | 'solid' | 'green' = deal.status !== 'active' ? 'gray' : pct > 60 ? 'solid' : 'green';

  return (
    <Pressable
      onPress={deal.status === 'active' ? onOpen : undefined}
      className={cn('bg-card rounded-md border border-line overflow-hidden mb-3', deal.status === 'closed' && 'opacity-[0.72]')}
      style={shadows.card}
    >
      <View>
        <ProductImage productId={deal.product} style={{ height: 120, width: '100%', borderRadius: 0 }} />
        <View className="absolute top-[10px] left-[10px]">
          <FsBadge tone={tone}>{status}</FsBadge>
        </View>
        {deal.status !== 'closed' && (
          <View className="absolute top-[10px] right-[10px]">
            <FsBadge tone="green">Save {save}%</FsBadge>
          </View>
        )}
      </View>

      <View className="px-[14px] pt-3 pb-[14px]">
        <Text className="font-p-semibold text-[13px] text-ink leading-[18px]">{deal.title}</Text>

        <View className="flex-row items-baseline gap-[7px] mt-[5px]">
          <Text className="font-m-extrabold text-[20px] text-green">{naira(deal.price)}</Text>
          <Text className="font-p-regular text-[12px] text-faint line-through">{naira(deal.retail)}</Text>
          <Text className="font-p-regular text-[10.5px] text-sub">per {deal.unit}</Text>
        </View>

        {deal.status !== 'upcoming' && (
          <>
            <View className="mt-[10px]">
              <FsProgress pct={pct} h={8} />
            </View>
            <View className="flex-row justify-between mt-[6px]">
              <Text className="font-p-regular text-[10.5px] text-sub"><Text className="font-p-semibold text-ink">{deal.reserved}/{deal.total}</Text> {deal.unit}s reserved</Text>
              <Text className="font-p-regular text-[10.5px] text-sub">{deal.farmers} farmers</Text>
            </View>
          </>
        )}

        <View className="flex-row items-center justify-between mt-3">
          {deal.status === 'active' && deal.closeOffset != null && <CountdownTimer small target={t0 + deal.closeOffset} />}
          {deal.status === 'upcoming' && <Text className="font-p-regular text-[11px] text-sub flex-1 mr-2">{deal.closeLabel || 'opens soon'} · est. {naira(deal.price)}</Text>}
          {deal.status === 'closed' && <Text className="font-p-regular text-[11px] text-sub">{deal.closedLabel}</Text>}

          {deal.status === 'active' && <FsButton size="sm" label="Buy Your Portion" onPress={onOpen} />}
          {deal.status === 'upcoming' && <FsButton size="sm" kind="outline" label="Remind Me" onPress={onRemind} />}
        </View>
      </View>
    </Pressable>
  );
}

export default function GroupBuyScreen({ navigation }: { navigation: any; route: any }) {
  const app = useApp();
  const { deals, t0, cartCount, toast } = app;
  const [tab, setTab] = useState('All');

  const list = deals.filter(d =>
    tab === 'All' ||
    (tab === 'Active' && d.status === 'active') ||
    (tab === 'Upcoming' && d.status === 'upcoming') ||
    (tab === 'Closed' && d.status === 'closed')
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-m-bold text-[20px] text-ink tracking-[-0.2px]">Group Buy</Text>
          <Pressable className="w-10 h-10 items-center justify-center relative" onPress={() => navigation.navigate('Cart')}>
            <Icon name="ShoppingCart" size={23} color={colors.ink} />
            {cartCount > 0 && (
              <View className="absolute top-[2px] right-[2px] bg-red rounded-full min-w-[16px] h-4 items-center justify-center px-[3px]">
                <Text className="font-p-bold text-[9px] text-white leading-[12px]">{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
        <Text className="font-p-regular text-[11.5px] text-sub mt-[2px]">Wholesale truck-load prices, shared with farmers near you.</Text>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="flex-row gap-[7px] py-[13px]">
          {TABS.map(t => (
            <FsChip key={t} small label={t} active={tab === t} onPress={() => setTab(t)} />
          ))}
        </ScrollView>
      </View>

      {/* Deal list */}
      <ScrollView className="flex-1" contentContainerClassName="px-4" showsVerticalScrollIndicator={false}>
        {list.length ? (
          list.map(deal => (
            <GbDealCard key={deal.id} deal={deal} t0={t0} onOpen={() => navigation.navigate('DealDetail', { id: deal.id })} onRemind={() => toast('You’ll be notified when this deal opens')} />
          ))
        ) : (
          <FsEmpty icon="zap" title="No deals right now" sub="We’ll notify you when the next truck-load deal drops." />
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
