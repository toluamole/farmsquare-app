import React, { useState } from 'react';
import { View, Text, TextInput, ViewStyle, KeyboardTypeOptions } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '../../theme';

interface FsInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'email' | 'password';
  prefix?: React.ReactNode;
  error?: string | null;
  hint?: string | null;
  style?: ViewStyle;
  autoFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

const keyboardTypeMap: Record<string, KeyboardTypeOptions> = {
  tel: 'phone-pad',
  email: 'email-address',
  text: 'default',
  password: 'default',
};

export default function FsInput({
  label, value, onChangeText, placeholder, type = 'text',
  prefix, error, hint, style, autoFocus, multiline, numberOfLines,
}: FsInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-3" style={style}>
      {label && <Text className="font-p-medium text-[11.5px] text-ink mb-[6px]">{label}</Text>}
      <View
        className={cn(
          'flex-row items-center rounded-sm border-[1.5px] px-[13px] min-h-[48px]',
          focused ? 'bg-card border-green' : 'bg-field border-transparent',
          error && 'border-red',
        )}
      >
        {prefix && <View className="mr-2">{prefix}</View>}
        <TextInput
          className={cn('flex-1 font-p-regular text-[13.5px] text-ink py-[10px]', !!prefix && 'pl-0')}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.faint}
          keyboardType={keyboardTypeMap[type] || 'default'}
          secureTextEntry={type === 'password'}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error && <Text className="font-p-regular text-[11px] text-red mt-1">{error}</Text>}
      {hint && !error && <Text className="font-p-regular text-[11px] text-sub mt-1">{hint}</Text>}
    </View>
  );
}
