import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopStackParamList } from '../types';
import ShopScreen from '../../screens/shop/ShopScreen';
import ListingScreen from '../../screens/shop/ListingScreen';
import ProductScreen from '../../screens/shop/ProductScreen';
import CartScreen from '../../screens/shop/CartScreen';
import CheckoutStep1Screen from '../../screens/shop/CheckoutStep1Screen';
import CheckoutStep2Screen from '../../screens/shop/CheckoutStep2Screen';
import OrderSuccessScreen from '../../screens/shop/OrderSuccessScreen';
import OrderTrackingScreen from '../../screens/shop/OrderTrackingScreen';
import MyOrdersScreen from '../../screens/shop/MyOrdersScreen';
import SearchScreen from '../../screens/home/SearchScreen';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export default function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Listing" component={ListingScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout1" component={CheckoutStep1Screen} />
      <Stack.Screen name="Checkout2" component={CheckoutStep2Screen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
}
