import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius } from '../../theme';
import {
  PRODUCT_IMAGES,
  CATEGORY_IMAGES,
  DEAL_IMAGES,
  CATEGORY_VISUAL,
} from '../../data/productImages';
import Icon, { IconName } from './Icon';

const DEFAULT_VISUAL = { icon: 'Package' as IconName, bg: colors.field, tint: colors.sub };

interface ProductImageProps {
  productId?: string;
  category?: string;
  label?: string;
  style?: ViewStyle;
  imageUrl?: string;
}

export default function ProductImage({ productId, category, style, imageUrl }: ProductImageProps) {
  // 1) Real photo if one exists (bundled require map or explicit remote url).
  const source =
    (imageUrl && { uri: imageUrl }) ||
    (productId && PRODUCT_IMAGES[productId]) ||
    (category && CATEGORY_IMAGES[category]) ||
    null;

  if (source) {
    return (
      <Image
        source={source}
        style={[styles.container, style] as any}
        contentFit="cover"
        transition={200}
      />
    );
  }

  // 2) Branded icon placeholder, colored by the product's category when known.
  const visual = (category && CATEGORY_VISUAL[category]) || DEFAULT_VISUAL;

  return (
    <View style={[styles.container, { backgroundColor: visual.bg }, style]}>
      <Icon name={visual.icon} size={40} color={visual.tint} strokeWidth={1.6} />
    </View>
  );
}

// For deal/promo images.
export function PromoImage({
  dealId,
  style,
  tint,
  imageUrl,
}: {
  dealId?: string;
  label?: string;
  style?: ViewStyle;
  tint?: string;
  imageUrl?: string;
}) {
  const source = (imageUrl && { uri: imageUrl }) || (dealId && DEAL_IMAGES[dealId]) || null;

  if (source) {
    return (
      <Image source={source} style={[styles.container, style] as any} contentFit="cover" transition={200} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tint || colors.greenDark }, style]}>
      <Icon name="Wheat" size={40} color="rgba(255,255,255,0.92)" strokeWidth={1.6} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radius.md,
  },
});
