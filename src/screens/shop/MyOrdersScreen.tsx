import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Icon from '../../components/common/Icon';
import { colors } from '../../theme';
import { useApp, Order } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';
import FsBadge from '../../components/common/FsBadge';
import FsEmpty from '../../components/common/FsEmpty';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const STATUS_LABELS = ['Confirmed', 'Packed', 'Dispatched', 'Delivered'];

function orderStatus(order: Order): { label: string; tone: 'green' | 'amber' | 'solid' } {
  if (order.hasGb && (order.step ?? 1) <= 1) return { label: 'Awaiting deal', tone: 'amber' };
  const idx = Math.min(STATUS_LABELS.length - 1, Math.max(0, (order.step ?? 1) - 1));
  return { label: STATUS_LABELS[idx], tone: idx === STATUS_LABELS.length - 1 ? 'solid' : 'green' };
}

export default function MyOrdersScreen({ navigation }: { navigation: any; route: any }) {
  const app = useApp();
  const orders = app.orders;

  if (orders.length === 0) {
    return (
      <View className="flex-1 bg-bg">
        <ScreenHeader title="My Orders" />
        <FsEmpty
          icon="box"
          title="No orders yet"
          sub="Orders you place in the store will show up here."
          action="Start Shopping"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader title="My Orders" subtitle={`${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-3" showsVerticalScrollIndicator={false}>
        {orders.map(order => {
          const itemCount = order.items.reduce((s, it) => s + it.qty, 0);
          const status = orderStatus(order);
          return (
            <Pressable
              key={order.id}
              className="flex-row items-center gap-2 bg-card border border-line rounded-md px-[14px] py-[13px] mb-[9px]"
              onPress={() => navigation.navigate('OrderTracking', { id: order.id })}
            >
              <View className="flex-1">
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="font-m-bold text-[13.5px] text-ink">#{order.id}</Text>
                  <FsBadge tone={status.tone}>{status.label.toUpperCase()}</FsBadge>
                </View>
                <Text className="font-p-regular text-[11px] text-sub mt-[3px]">{order.date}</Text>
                <View className="flex-row items-baseline justify-between mt-[7px]">
                  <Text className="font-p-regular text-[11.5px] text-sub">{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
                  <Text className="font-m-bold text-[14.5px] text-green">{naira(order.total)}</Text>
                </View>
              </View>
              <Icon name="ChevronRight" size={17} color={colors.faint} />
            </Pressable>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
