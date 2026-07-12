import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  BadgeDollarSign,
  Bell,
  Bird,
  BookOpen,
  BriefcaseMedical,
  Bug,
  Bus,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  ClipboardList,
  Clock,
  CloudRain,
  CloudSun,
  Copy,
  CreditCard,
  Carrot,
  Droplet,
  Droplets,
  Factory,
  FlaskConical,
  Funnel,
  Gift,
  Heart,
  House,
  Info,
  Layers,
  Leaf,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Microscope,
  Minus,
  Package,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sprout,
  Star,
  StarHalf,
  Store,
  Sun,
  Trash2,
  TriangleAlert,
  Truck,
  User,
  Users,
  Wheat,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { colors } from '../../theme';

/**
 * Central icon registry. Keyed by lucide component names (plus a few friendly
 * aliases for icons lucide has since renamed — Home/Filter/AlertTriangle).
 * Add new icons here as screens need them.
 */
export const iconRegistry = {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  BadgeDollarSign,
  Bell,
  Bird,
  BookOpen,
  BriefcaseMedical,
  Bug,
  Bus,
  Calendar,
  Camera,
  Carrot,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  ClipboardList,
  Clock,
  CloudRain,
  CloudSun,
  Copy,
  CreditCard,
  Droplet,
  Droplets,
  Factory,
  FlaskConical,
  Funnel,
  Gift,
  Heart,
  House,
  Info,
  Layers,
  Leaf,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Microscope,
  Minus,
  Package,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sprout,
  Star,
  StarHalf,
  Store,
  Sun,
  Trash2,
  TriangleAlert,
  Truck,
  User,
  Users,
  Wheat,
  Wrench,
  X,
  Zap,
  // Friendly aliases for renamed lucide icons
  Home: House,
  Filter: Funnel,
  AlertTriangle: TriangleAlert,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Pass a color to render the icon filled (e.g. active tab state). */
  fill?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export default function Icon({
  name,
  size = 22,
  color = colors.ink,
  strokeWidth = 2,
  fill = 'none',
  style,
  accessibilityLabel,
}: IconProps) {
  const Cmp = iconRegistry[name];
  if (!Cmp) {
    if (__DEV__) console.warn(`[Icon] Unknown icon "${name}"`);
    return null;
  }
  return (
    <Cmp
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      fill={fill}
      style={style}
      accessibilityLabel={accessibilityLabel ?? name}
    />
  );
}
