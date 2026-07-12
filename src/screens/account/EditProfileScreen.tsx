import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import ScreenHeader from '../../components/layout/ScreenHeader';
import FsInput from '../../components/common/FsInput';
import FsButton from '../../components/common/FsButton';
import FsChip from '../../components/common/FsChip';
import { updateDisplayName } from '../../services/firebase';

const STATES = [
  'Lagos', 'Ogun', 'Oyo', 'Kano', 'Kaduna', 'Katsina',
  'Rivers', 'Enugu', 'Plateau', 'Benue', 'Niger', 'FCT Abuja',
];

const CROPS: [string, string][] = [
  ['tomato', 'Tomato'], ['maize', 'Maize'], ['pepper', 'Pepper'], ['cassava', 'Cassava'],
  ['rice', 'Rice'], ['soybean', 'Soybean'], ['cucumber', 'Cucumber'], ['onion', 'Onion'],
];

const MAX_CROPS = 5;

export default function EditProfileScreen({ navigation }: { navigation: any; route: any }) {
  const { auth, profile, setProfile, updateAccount, toast } = useApp();

  const [name, setName] = useState(auth.name || '');
  const [phone, setPhone] = useState(auth.phone || '');
  const [state, setState] = useState(profile.state || '');
  const [lga, setLga] = useState(profile.lga || '');
  const [crops, setCrops] = useState<string[]>(profile.crops || []);

  const toggleCrop = (id: string) => {
    setCrops(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= MAX_CROPS) {
        toast(`You can pick up to ${MAX_CROPS} crops`);
        return prev;
      }
      return [...prev, id];
    });
  };

  // Phone is optional (no dummy default anymore) — validate only when entered.
  const valid = name.trim().length > 0 && (!phone.trim() || phone.replace(/\D/g, '').length >= 10);

  const handleSave = () => {
    updateAccount({ name: name.trim(), phone: phone.trim() });
    // Fire-and-forget: local state is already saved; a failed Firebase sync
    // only means the name reverts on the next cold start.
    updateDisplayName(name.trim());
    setProfile({ state, lga: lga.trim(), crops });
    toast('Profile updated');
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['bottom']}>
      <ScreenHeader title="Edit Profile" />
      <ScrollView className="flex-1" contentContainerClassName="p-4 pt-[10px]" showsVerticalScrollIndicator={false}>
        <FsInput label="Full name" value={name} onChangeText={setName} placeholder="Adaobi Okeke" />
        <FsInput label="Phone" value={phone} onChangeText={setPhone} placeholder="+234 803 555 0147" type="tel" />

        <Text className="font-p-medium text-[11.5px] text-ink mt-[6px] mb-[9px]">State</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {STATES.map(s => (
            <FsChip key={s} label={s} small active={state === s} onPress={() => setState(s)} />
          ))}
        </View>

        <FsInput label="LGA" value={lga} onChangeText={setLga} placeholder={state ? `e.g. ${state === 'Lagos' ? 'Ikeja' : 'Central'}` : 'e.g. Ikeja'} />

        <Text className="font-p-medium text-[11.5px] text-ink mt-[6px] mb-[9px]">
          Crops you grow <Text className="font-p-regular text-sub">(up to {MAX_CROPS} — drives your Advisory)</Text>
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {CROPS.map(([id, label]) => (
            <FsChip key={id} label={label} small active={crops.includes(id)} onPress={() => toggleCrop(id)} />
          ))}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>

      <View className="px-4 pt-[10px] pb-4 bg-card border-t border-line rounded-t-sm">
        <FsButton label="Save Changes" full size="lg" disabled={!valid} onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}
