import { NavigatorScreenParams } from '@react-navigation/native';

// Tab Navigator
export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ShopTab: NavigatorScreenParams<ShopStackParamList>;
  GroupBuyTab: NavigatorScreenParams<GroupBuyStackParamList>;
  AdvisoryTab: NavigatorScreenParams<AdvisoryStackParamList>;
  AccountTab: NavigatorScreenParams<AccountStackParamList>;
};

// Home Stack
export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  Search: undefined;
  Listing: { cat?: string; flash?: boolean };
  Product: { id: string };
  Cart: undefined;
  Checkout1: undefined;
  Checkout2: { ship: string | null; shipFee: number; shipName: string | null; gbShip: string | null; addr: number };
  OrderSuccess: { id: string };
  OrderTracking: { id: string };
  DealDetail: { id: string };
};

// Shop Stack
export type ShopStackParamList = {
  Shop: undefined;
  Listing: { cat?: string; flash?: boolean };
  Product: { id: string };
  Cart: undefined;
  Checkout1: undefined;
  Checkout2: { ship: string | null; shipFee: number; shipName: string | null; gbShip: string | null; addr: number };
  OrderSuccess: { id: string };
  OrderTracking: { id: string };
  MyOrders: undefined;
  Search: undefined;
};

// GroupBuy Stack
export type GroupBuyStackParamList = {
  GroupBuy: undefined;
  DealDetail: { id: string };
  GbConfirm: { ref: string };
  Cart: undefined;
  Checkout1: undefined;
  Checkout2: { ship: string | null; shipFee: number; shipName: string | null; gbShip: string | null; addr: number };
  OrderSuccess: { id: string };
  GbOrder: { ref: string };
};

// Advisory Stack
export type AdvisoryStackParamList = {
  MyFarm: undefined;
  Journey: { cropId: string; plantingDate: string };
  Activity: { stageId: string; cropId: string; plantingDate: string };
  ProblemHome: undefined;
  ProblemStep1: undefined;
  ProblemStep2: { crop: string; category: string };
  Analyzing: { crop: string; category: string; description: string };
  Results: { crop: string; category: string };
  Product: { id: string };
};

// Account Stack
export type AccountStackParamList = {
  Account: undefined;
  Addresses: undefined;
  Payments: undefined;
  EditProfile: undefined;
  NotifPrefs: undefined;
  Referral: undefined;
  Support: undefined;
  MyOrders: undefined;
  OrderTracking: { id: string };
  GbOrder: { ref: string };
};

// Root Navigator (auth flow)
export type RootStackParamList = {
  Splash: undefined;
  Slides: undefined;
  AuthGate: undefined;
  EmailAuth: { mode: 'signup' | 'login' };
  VerifyEmail: { email: string };
  ProfileLoc: undefined;
  ProfileCrops: undefined;
  ProfileSize: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
};
