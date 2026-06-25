import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import FsInput from '../../components/common/FsInput';
import FsButton from '../../components/common/FsButton';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { useApp } from '../../context/AppContext';
import { signUpWithEmail, signInWithEmail, sendPasswordReset } from '../../services/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailAuth'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailAuthScreen({ navigation, route }: Props) {
  const { signIn, cropSetup, toast } = useApp();
  const [mode, setMode] = useState<'signup' | 'login'>(route.params?.mode || 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === 'signup';
  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= 6;
  const nameValid = !isSignup || name.trim().length >= 2;
  const canSubmit = emailValid && passwordValid && nameValid && !loading;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    const result = isSignup
      ? await signUpWithEmail(email, password, name.trim())
      : await signInWithEmail(email, password);
    setLoading(false);

    if (!result.success || !result.user) {
      setError(result.error || 'Something went wrong. Please try again.');
      return;
    }

    signIn({
      name: result.user.displayName || name.trim() || (result.user.email?.split('@')[0] ?? 'Farmer'),
      email: result.user.email || email.trim(),
      uid: result.user.uid,
    });

    // New sign-ups always go through profile setup. Returning users skip it
    // if they've already completed crop setup.
    if (isSignup || !cropSetup) navigation.replace('ProfileLoc');
    else navigation.replace('Main');
  };

  const handleForgot = async () => {
    if (!emailValid) {
      setError('Enter your email above first, then tap Forgot password.');
      return;
    }
    const res = await sendPasswordReset(email);
    if (res.success) toast('Password reset email sent. Check your inbox.');
    else setError(res.error || 'Could not send reset email.');
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-bg" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pt-[10px] pb-7"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-m-extrabold text-[21px] text-ink mb-[6px]">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </Text>
        <Text className="font-p-regular text-[12.5px] text-sub mb-6">
          {isSignup ? 'Sign up with your email to get started.' : 'Log in to continue shopping and tracking orders.'}
        </Text>

        {isSignup && (
          <FsInput
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Adaobi Okafor"
            type="text"
            error={name && !nameValid ? 'Please enter your name' : undefined}
          />
        )}

        <FsInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          type="email"
          error={email && !emailValid ? 'Enter a valid email address' : undefined}
        />

        <FsInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          type="password"
          error={password && !passwordValid ? 'Password must be at least 6 characters' : error}
          hint={!password && isSignup ? 'Use 6 or more characters' : undefined}
        />

        {error && passwordValid && (
          <Text className="font-p-regular text-[11.5px] text-red mb-2 -mt-1">{error}</Text>
        )}

        {!isSignup && (
          <Pressable onPress={handleForgot} className="self-end mb-4">
            <Text className="font-p-semibold text-[12px] text-green">Forgot password?</Text>
          </Pressable>
        )}

        <View className="mt-2">
          <FsButton
            label={isSignup ? 'Create Account' : 'Log In'}
            onPress={submit}
            disabled={!canSubmit}
            loading={loading}
            full
            size="lg"
          />
        </View>

        <View className="flex-row justify-center mt-5">
          <Text className="font-p-regular text-[12.5px] text-sub">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Pressable
            onPress={() => {
              setMode(isSignup ? 'login' : 'signup');
              setError(null);
            }}
          >
            <Text className="font-p-bold text-[12.5px] text-green">{isSignup ? 'Log In' : 'Sign Up'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
