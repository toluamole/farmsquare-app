import React from 'react';
import { ViewStyle } from 'react-native';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

type ButtonKind = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'lime';
type ButtonSize = 'sm' | 'md' | 'lg';

interface FsButtonProps {
  label: string;
  onPress?: () => void;
  kind?: ButtonKind;
  size?: ButtonSize;
  full?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function FsButton({
  label, onPress, kind = 'primary', size = 'md', full, disabled, loading, style,
}: FsButtonProps) {
  return (
    <Button
      variant={kind}
      size={size}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      className={full ? 'self-stretch' : 'self-start'}
      style={style}
    >
      <Text>{label}</Text>
    </Button>
  );
}
