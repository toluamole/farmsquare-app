import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from '../../components/common/Icon';
import { cn } from '../../lib/utils';
import { useApp, Order } from '../../context/AppContext';
import { fsProduct } from '../../data/products';
import { useGetOrderQuery } from '../../store/api/wooApi';
import ScreenHeader from '../../components/layout/ScreenHeader';
import ProductImage from '../../components/common/ProductImage';
import FsBadge from '../../components/common/FsBadge';
import FsButton from '../../components/common/FsButton';

const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

const STEPS: [string, string][] = [
  ['Confirmed', 'Order received and payment confirmed'],
  ['Packed', 'Items picked and packed at our Lagos warehouse'],
  ['Dispatched', 'With courier on the way to your address'],
  ['Delivered', 'Delivered to your address'],
];

// Maps a WooCommerce order status to a 1-based step in the tracker above.
const STATUS_STEP: Record<string, number> = {
  pending: 1, 'on-hold': 1, processing: 2, packed: 2,
  shipped: 3, 'out-for-delivery': 3, completed: 4, delivered: 4,
};

export default function OrderTrackingScreen({ route }: { navigation: any; route: any }) {
  const app = useApp();

  const fallback: Order = {
    id: route.params?.id || 'FS-20431',
    items: [{ p: fsProduct('p7')!, qty: 1 }],
    total: 19500,
    step: 1,
    date: 'June 10, 2026',
  };
  const order = app.orders.find(o => o.id === route.params?.id) || app.orders[0] || fallback;

  // Pull live status from WooCommerce; fall back to the locally stored step
  // (e.g. offline or when WC credentials are absent).
  const { data: wcOrder } = useGetOrderQuery(order.id, { skip: !order.id });
  const liveStep = wcOrder?.status ? STATUS_STEP[wcOrder.status] : undefined;
  const stepNum = liveStep ?? order.step ?? 1;
  const cur = Math.min(STEPS.length - 1, Math.max(0, stepNum - 1));

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader title={`Order #${order.id}`} subtitle={order.date} />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        {/* Tracking stepper */}
        <View className="bg-card border border-line rounded-md px-[15px] py-4">
          {STEPS.map(([label, sub], i) => {
            const done = i < cur;
            const active = i === cur;
            const reached = i <= cur;
            return (
              <View key={label} className="flex-row gap-[13px]">
                <View className="items-center">
                  <View className={cn('w-[26px] h-[26px] rounded-full items-center justify-center shrink-0', reached ? 'bg-green' : 'bg-field', active && 'border-4 border-limeTint')}>
                    {done ? <Icon name="Check" size={13} color="#fff" /> : active ? <View className="w-2 h-2 rounded-full bg-white" /> : null}
                  </View>
                  {i < STEPS.length - 1 && (
                    <View className={cn('w-[2.5px] flex-1 min-h-[26px] my-[3px]', done ? 'bg-green' : 'bg-line')} />
                  )}
                </View>
                <View className={cn('flex-1 pt-[3px]', i < STEPS.length - 1 && 'pb-[14px]')}>
                  <View className="flex-row items-center gap-2">
                    <Text className={cn('text-[13px]', active ? 'font-p-bold' : 'font-p-medium', reached ? 'text-ink' : 'text-faint')}>{label}</Text>
                    {active && <FsBadge tone="green">CURRENT</FsBadge>}
                  </View>
                  <Text className={cn('font-p-regular text-[11px] mt-[2px] leading-4', reached ? 'text-sub' : 'text-faint')}>{sub}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Order summary */}
        <View className="bg-card border border-line rounded-md px-[14px] py-1 mt-3">
          {(order.items || []).map(({ p, qty }, i) => (
            <View key={`${p.id}-${i}`} className="flex-row items-center gap-[11px] py-[10px] border-b border-line">
              <ProductImage productId={p.id} imageUrl={p.img ?? undefined} style={{ width: 42, height: 42, borderRadius: 8 }} />
              <Text className="flex-1 font-p-regular text-[11.5px] text-ink leading-4">{p.name} <Text className="text-sub">×{qty}</Text></Text>
              <Text className="font-p-semibold text-[11.5px] text-ink">{naira(p.price * qty)}</Text>
            </View>
          ))}
          {order.ship && (
            <View className="flex-row justify-between py-[9px] border-b border-line">
              <Text className="font-p-regular text-[11.5px] text-sub">Shipping method</Text>
              <Text className="font-p-medium text-[11.5px] text-ink">{order.ship}</Text>
            </View>
          )}
          <View className="flex-row justify-between py-[9px] border-b border-line">
            <Text className="font-p-regular text-[11.5px] text-sub">Order date</Text>
            <Text className="font-p-medium text-[11.5px] text-ink">{order.date}</Text>
          </View>
          <View className="flex-row justify-between items-baseline py-[10px]">
            <Text className="font-p-semibold text-[12px] text-ink">Total paid</Text>
            <Text className="font-m-extrabold text-[15px] text-green">{naira(order.total)}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-[9px] mt-3">
          <FsButton
            kind="secondary"
            label="Reorder"
            style={{ flex: 1 }}
            onPress={() => {
              (order.items || []).forEach(({ p, qty }) => app.addToCart(p, qty, false, true));
              app.toast('Items added back to cart');
            }}
          />
          <FsButton kind="secondary" label="Contact Support" style={{ flex: 1 }} onPress={() => app.toast('Opens WhatsApp Business chat')} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
