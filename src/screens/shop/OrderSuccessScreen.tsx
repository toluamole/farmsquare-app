import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { useApp } from '../../context/AppContext';
import FsButton from '../../components/common/FsButton';

export default function OrderSuccessScreen({ navigation, route }: { navigation: any; route: any }) {
  const app = useApp();
  const order = app.orders.find(o => o.id === route.params?.id) || app.orders[0];
  const orderId = order ? order.id : route.params?.id || 'FS-20456';

  const expected = new Date(Date.now() + 3 * 24 * 3600e3)
    .toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center px-[26px]">
        {/* Big green check */}
        <View className="w-[88px] h-[88px] rounded-full bg-limeTint items-center justify-center">
          <View className="w-[60px] h-[60px] rounded-full bg-green items-center justify-center">
            <Icon name="Check" size={32} color="#fff" />
          </View>
        </View>

        <Text className="font-m-extrabold text-[22px] text-ink mt-5">Order Placed!</Text>

        {order && order.hasGb ? (
          <Text className="font-p-regular text-[12.5px] text-sub text-center leading-5 mt-2">
            Order <Text className="font-p-semibold text-ink">#{orderId}</Text> is confirmed.{'\n'}
            Your Group Buy share is reserved — we'll reach out with your delivery date once the deal fills and shipping is available.
          </Text>
        ) : (
          <Text className="font-p-regular text-[12.5px] text-sub text-center leading-5 mt-2">
            Order <Text className="font-p-semibold text-ink">#{orderId}</Text> is confirmed.{'\n'}
            Expected delivery: <Text className="font-p-semibold text-ink">{expected}</Text>
          </Text>
        )}

        <View className="mt-7 self-stretch gap-[10px]">
          <FsButton full size="lg" label="Track Order" onPress={() => navigation.replace('OrderTracking', { id: orderId })} />
          <FsButton full kind="ghost" label="Continue Shopping" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
