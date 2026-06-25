import { IconName } from '../components/common/Icon';
import { colors } from '../theme';

/**
 * Local bundled product/category photos. Populated by the Phase 1.5 image
 * fetch (assets/products/*.jpg, assets/categories/*.jpg). Keys are product ids
 * (p1..p12) and category ids. Empty entries fall back to the branded icon
 * placeholder in ProductImage.
 *
 * RN requires static require() calls — add one line per image here.
 */
export const PRODUCT_IMAGES: Record<string, number> = {
  // p1: require('../../assets/products/p1.jpg'),
};

export const CATEGORY_IMAGES: Record<string, number> = {
  // seeds: require('../../assets/categories/seeds.jpg'),
};

export const DEAL_IMAGES: Record<string, number> = {
  // d1: require('../../assets/deals/d1.jpg'),
};

/** Visual config for the icon placeholder shown when no photo exists yet. */
export const CATEGORY_VISUAL: Record<string, { icon: IconName; bg: string; tint: string }> = {
  seeds: { icon: 'Sprout', bg: colors.limeTint, tint: colors.green },
  fertilizers: { icon: 'Droplets', bg: '#FFF8E1', tint: colors.amberInk },
  agrochemicals: { icon: 'FlaskConical', bg: '#FCE4EC', tint: '#880E4F' },
  irrigation: { icon: 'Droplet', bg: '#E3F2FD', tint: '#0D47A1' },
  equipment: { icon: 'Wrench', bg: '#EFEBE9', tint: '#5D4037' },
  livestock: { icon: 'Bird', bg: colors.limeTint, tint: colors.green },
};
