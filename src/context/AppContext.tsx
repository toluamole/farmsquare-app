/**
 * Backward-compatible `useApp()` hook, now backed by the Redux store.
 * Keeps the exact AppContextValue shape so existing screens work unchanged.
 * New code can use the typed Redux hooks (src/store/hooks) directly instead.
 */
import { fsProduct, Product } from '../data/products';
import { Deal } from '../data/deals';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signIn as signInAction, updateAccount as updateAccountAction, signOut as signOutAction, browseAsGuest as browseAsGuestAction } from '../store/slices/authSlice';
import { signOut as firebaseSignOut } from '../services/firebase';
import { signOutGoogle } from '../services/googleAuth';
import { setProfile as setProfileAction, finishSetup as finishSetupAction } from '../store/slices/profileSlice';
import { addItem, removeItem, setItemQty, clearCart as clearCartAction } from '../store/slices/cartSlice';
import { addOrder } from '../store/slices/ordersSlice';
import { addReservation } from '../store/slices/reservationsSlice';
import { addAddress as addAddressAction } from '../store/slices/addressesSlice';
import { viewProduct as viewProductAction } from '../store/slices/recentSlice';
import { setToast, clearToast as clearToastAction, markDoneToday as markDoneTodayAction } from '../store/slices/uiSlice';
import { CartItem, Order, Reservation, Address, PaymentMethod, UserProfile, AuthState } from '../store/types';

// Re-export domain types so existing `from '../context/AppContext'` imports keep working.
export type { CartItem, Order, Reservation, Address, PaymentMethod, UserProfile, AuthState };

const DEFAULT_PAYMENTS: PaymentMethod[] = [{ id: 'p1', bank: 'Zenith', last4: '4821', type: 'card' }];

export function useApp() {
  const dispatch = useAppDispatch();

  const auth = useAppSelector(s => s.auth);
  const profile = useAppSelector(s => s.profile.profile);
  const cropSetup = useAppSelector(s => s.profile.cropSetup);
  const cartItems = useAppSelector(s => s.cart.items);
  const orders = useAppSelector(s => s.orders.orders);
  const reservations = useAppSelector(s => s.reservations.reservations);
  const addresses = useAppSelector(s => s.addresses.addresses);
  const recent = useAppSelector(s => s.recent.ids);
  const toastMessage = useAppSelector(s => s.ui.toastMessage);
  const doneToday = useAppSelector(s => s.ui.doneToday);
  const t0 = useAppSelector(s => s.ui.t0);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const toast = (msg: string) => {
    dispatch(setToast(msg));
    setTimeout(() => dispatch(clearToastAction()), 3000);
  };

  // Accepts a full Product object (the live path). A bare id is also accepted
  // for backward compatibility but no longer resolves locally (fsProduct is a
  // stub now), so callers should pass the Product object.
  const addToCart = (productOrId: Product | string, qty = 1, _buyNow?: boolean, silent?: boolean) => {
    const product = typeof productOrId === 'string' ? fsProduct(productOrId) : productOrId;
    if (!product) return;
    const item: CartItem = { key: `${product.id}-${Date.now()}`, productId: product.id, p: product, qty };
    dispatch(addItem({ item, mergeQty: true }));
    if (!silent) toast(`${product.name.split(' — ')[0]} added to cart`);
  };

  // Group Buy: caller passes the resolved deal + its product (live-ready, no
  // local lookups). Price is overridden with the wholesale deal price.
  const addDealToCart = (deal: Deal, product: Product, qty: number) => {
    const item: CartItem = {
      key: `deal-${deal.id}-${Date.now()}`,
      productId: product.id,
      p: { ...product, price: deal.price },
      qty,
      gb: true,
      deal,
    };
    dispatch(addItem({ item, mergeQty: false }));
    toast(`${deal.short} added to cart`);
  };

  const placeOrder = (params: { total: number; fee: number; ship?: string; id?: string }): Order => {
    const order: Order = {
      id: params.id || `FS-${Math.floor(20000 + Math.random() * 9999)}`,
      items: cartItems.map(i => ({ p: i.p, qty: i.qty })),
      total: params.total,
      step: 1,
      date: new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
      ship: params.ship,
      hasGb: cartItems.some(i => i.gb),
    };
    dispatch(addOrder(order));
    dispatch(clearCartAction());
    return order;
  };

  const reserve = (dealId: string, qty: number, total: number): Reservation => {
    const res: Reservation = { ref: `GB-${Math.floor(10000 + Math.random() * 89999)}`, dealId, qty, total };
    dispatch(addReservation(res));
    return res;
  };

  return {
    // Auth
    auth: auth as AuthState,
    signIn: (user: { name: string; phone?: string; email?: string; uid?: string; emailVerified?: boolean }) => dispatch(signInAction(user)),
    updateAccount: (update: { name?: string; phone?: string }) => dispatch(updateAccountAction(update)),
    signOut: () => { firebaseSignOut(); signOutGoogle(); dispatch(signOutAction()); dispatch(clearCartAction()); },
    browseAsGuest: () => dispatch(browseAsGuestAction()),

    // Profile
    profile,
    setProfile: (update: Partial<UserProfile>) => dispatch(setProfileAction(update)),
    cropSetup,

    // Cart
    cartItems,
    cartCount,
    addToCart,
    removeFromCart: (key: string) => dispatch(removeItem(key)),
    setQty: (key: string, qty: number) => dispatch(setItemQty({ key, qty })),
    clearCart: () => dispatch(clearCartAction()),
    addDealToCart,

    // Orders
    orders,
    placeOrder,

    // Reservations
    reservations,
    reserve,

    // Deals — no Group Buy backend yet; empty until the Group Buy API lands
    // on the farmsquare-api Worker (tasks.md §5.3).
    deals: [] as Deal[],
    t0,

    // Addresses
    addresses,
    addAddress: (address: Address) => dispatch(addAddressAction(address)),

    // Payments
    payments: DEFAULT_PAYMENTS,

    // Recent
    recent,
    viewProduct: (id: string) => dispatch(viewProductAction(id)),

    // UI
    toast,
    toastMessage,
    clearToast: () => dispatch(clearToastAction()),

    // Setup
    finishSetup: () => dispatch(finishSetupAction()),
    doneToday,
    markDoneToday: () => dispatch(markDoneTodayAction()),
  };
}
