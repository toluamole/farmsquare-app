import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GroupBuyStackParamList } from '../types';
import GroupBuyScreen from '../../screens/groupbuy/GroupBuyScreen';
import DealDetailScreen from '../../screens/groupbuy/DealDetailScreen';
import GbConfirmScreen from '../../screens/groupbuy/GbConfirmScreen';
import GbOrderScreen from '../../screens/groupbuy/GbOrderScreen';
import CartScreen from '../../screens/shop/CartScreen';
import CheckoutStep1Screen from '../../screens/shop/CheckoutStep1Screen';
import CheckoutStep2Screen from '../../screens/shop/CheckoutStep2Screen';
import OrderSuccessScreen from '../../screens/shop/OrderSuccessScreen';

const Stack = createNativeStackNavigator<GroupBuyStackParamList>();

export default function GroupBuyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="GroupBuy" component={GroupBuyScreen} />
      <Stack.Screen name="DealDetail" component={DealDetailScreen} />
      <Stack.Screen name="GbConfirm" component={GbConfirmScreen} />
      <Stack.Screen name="GbOrder" component={GbOrderScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout1" component={CheckoutStep1Screen} />
      <Stack.Screen name="Checkout2" component={CheckoutStep2Screen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
}
