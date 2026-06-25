import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/common/Icon';
import { colors } from '../../theme';
import { useApp } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';
import BottomSheet from '../../components/layout/BottomSheet';
import FsInput from '../../components/common/FsInput';
import FsButton from '../../components/common/FsButton';
import FsBadge from '../../components/common/FsBadge';
import FsEmpty from '../../components/common/FsEmpty';

const BLANK = { name: '', phone: '', street: '', city: '' };

export default function AddressesScreen() {
  const { addresses, addAddress, toast } = useApp();

  const [deleted, setDeleted] = useState<number[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const visible = addresses.map((a, i) => ({ a, i })).filter(({ i }) => !deleted.includes(i));

  const setField = (key: keyof typeof BLANK) => (v: string) => {
    setForm(prev => ({ ...prev, [key]: v }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleSave = () => {
    const next: Record<string, string | null> = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone number';
    if (!form.street.trim()) next.street = 'Street address is required';
    if (!form.city.trim()) next.city = 'City & state is required';
    if (Object.keys(next).length) { setErrors(next); return; }
    addAddress({ name: form.name.trim(), phone: form.phone.trim(), street: form.street.trim(), city: form.city.trim() });
    setSheetOpen(false);
    setForm(BLANK);
    setErrors({});
    toast('Address saved');
  };

  const handleDelete = (index: number) => {
    setDeleted(prev => [...prev, index]);
    toast('Address removed');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={[]}>
      <ScreenHeader title="Saved Addresses" />
      <ScrollView className="flex-1" contentContainerClassName="p-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        {visible.length === 0 && (
          <FsEmpty icon="box" title="No saved addresses" sub="Add a delivery address to speed up checkout." />
        )}
        {visible.map(({ a, i }, pos) => (
          <View key={i} className="bg-card border border-line rounded-md p-[13px] mb-[9px]">
            <View className="flex-row items-center gap-2">
              <Icon name="MapPin" size={16} color={colors.green} />
              <Text className="font-p-semibold text-[12.5px] text-ink flex-1">{a.name}</Text>
              {pos === 0 && <FsBadge tone="green">DEFAULT</FsBadge>}
            </View>
            <Text className="font-p-regular text-[11.5px] text-sub mt-[6px] leading-[17px]">{a.street}, {a.city}</Text>
            <Text className="font-p-regular text-[11.5px] text-sub mt-[1px]">{a.phone}</Text>
            <View className="flex-row items-center mt-[10px]">
              <Pressable onPress={() => toast('Address editing coming soon')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Text className="font-p-semibold text-[11.5px] text-green">Edit</Text>
              </Pressable>
              {visible.length > 1 && (
                <Pressable onPress={() => handleDelete(i)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} className="ml-auto">
                  <Text className="font-p-semibold text-[11.5px] text-red">Delete</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}

        <Pressable className="flex-row items-center justify-center gap-2 border-[1.5px] border-limeLine border-dashed rounded-md py-[14px] mt-1" onPress={() => { setForm(BLANK); setErrors({}); setSheetOpen(true); }}>
          <Icon name="Plus" size={17} color={colors.green} />
          <Text className="font-p-semibold text-[12.5px] text-green">Add New Address</Text>
        </Pressable>
        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="New address">
        <FsInput label="Full name" value={form.name} onChangeText={setField('name')} placeholder="Adaobi Okeke" error={errors.name} />
        <FsInput label="Phone" value={form.phone} onChangeText={setField('phone')} placeholder="+234 803 555 0147" type="tel" error={errors.phone} />
        <FsInput label="Street address" value={form.street} onChangeText={setField('street')} placeholder="14 Unity Road" error={errors.street} />
        <FsInput label="City & State" value={form.city} onChangeText={setField('city')} placeholder="Ikeja, Lagos" error={errors.city} />
        <FsButton label="Save Address" full size="lg" onPress={handleSave} style={{ marginTop: 4 }} />
        <View style={{ height: 12 }} />
      </BottomSheet>
    </SafeAreaView>
  );
}
