import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';

import auth from './slices/authSlice';
import profile from './slices/profileSlice';
import cart from './slices/cartSlice';
import orders from './slices/ordersSlice';
import reservations from './slices/reservationsSlice';
import addresses from './slices/addressesSlice';
import recent from './slices/recentSlice';
import ui from './slices/uiSlice';
import { wooApi } from './api/wooApi';

const rootReducer = combineReducers({
  auth,
  profile,
  cart,
  orders,
  reservations,
  addresses,
  recent,
  ui,
  [wooApi.reducerPath]: wooApi.reducer,
});

const persistConfig = {
  key: 'farmsquare',
  version: 1,
  storage: AsyncStorage,
  // Persist domain state only — never the API cache or transient UI (toasts).
  whitelist: ['auth', 'profile', 'cart', 'orders', 'reservations', 'addresses', 'recent'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(wooApi.middleware),
  // Attach the Reactotron enhancer in development only — excluded from
  // production bundles via the `__DEV__` guard.
  enhancers: getDefaultEnhancers => {
    if (__DEV__) {
      const reactotron = require('../config/reactotron').default;
      const enhancer = reactotron?.createEnhancer?.();
      if (enhancer) return getDefaultEnhancers().concat(enhancer);
    }
    return getDefaultEnhancers();
  },
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
