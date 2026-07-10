import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  // getReactNativePersistence is exported at runtime but missing from some
  // @firebase/auth type bundles, hence the cast below.
  getAuth,
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAuth from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const a = getFirebaseApp();
    try {
      // Persist the session to AsyncStorage so users stay logged in across
      // app restarts (plain getAuth does NOT persist on React Native).
      const getReactNativePersistence = (
        firebaseAuth as unknown as {
          getReactNativePersistence: (s: unknown) => unknown;
        }
      ).getReactNativePersistence;
      auth = initializeAuth(a, {
        persistence: getReactNativePersistence(AsyncStorage) as never,
      });
    } catch {
      // initializeAuth throws if already initialized (e.g. Fast Refresh).
      auth = getAuth(a);
    }
  }
  return auth;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

type AuthResult = { success: boolean; user?: AuthUser; error?: string };

function mapUser(u: User): AuthUser {
  return { uid: u.uid, email: u.email, displayName: u.displayName };
}

function friendlyError(e: unknown): string {
  const code = (e as { code?: string }).code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return (e as { message?: string }).message || 'Something went wrong. Please try again.';
  }
}

/** Create a new account with email + password and set the display name. */
export async function signUpWithEmail(email: string, password: string, name: string): Promise<AuthResult> {
  try {
    const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    if (name) await updateProfile(cred.user, { displayName: name });
    return { success: true, user: { ...mapUser(cred.user), displayName: name || cred.user.displayName } };
  } catch (e) {
    return { success: false, error: friendlyError(e) };
  }
}

/** Sign in an existing account with email + password. */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    return { success: true, user: mapUser(cred.user) };
  } catch (e) {
    return { success: false, error: friendlyError(e) };
  }
}

/** Send a password-reset email. */
export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
    return { success: true };
  } catch (e) {
    return { success: false, error: friendlyError(e) };
  }
}

/** Sign in to Firebase using a Google OAuth id_token (from the native Google Sign-In SDK). */
export async function signInWithGoogleCredential(idToken: string): Promise<AuthResult> {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const res = await signInWithCredential(getFirebaseAuth(), credential);
    return { success: true, user: mapUser(res.user) };
  } catch (e) {
    return { success: false, error: friendlyError(e) };
  }
}

/**
 * Subscribe to auth-state changes. Fires immediately with the current user
 * (or null) and on every sign-in/out. Returns an unsubscribe function.
 */
export function subscribeToAuth(cb: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(getFirebaseAuth(), u => cb(u ? mapUser(u) : null));
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(getFirebaseAuth());
  } catch (error) {
    console.error('signOut error:', error);
  }
}

// ---------------------------------------------------------------------------
// Phone OTP (dormant). Firebase JS SDK phone auth needs a web-only reCAPTCHA,
// so this path does not work in Expo Go. Kept for a possible future dev-build
// migration to @react-native-firebase/auth. Not used by the current flow.
// ---------------------------------------------------------------------------

let _confirmationResult: ConfirmationResult | null = null;

export async function sendPhoneOTP(
  phoneNumber: string,
): Promise<{ success: boolean; verificationId?: string; error?: string }> {
  try {
    const authInstance = getFirebaseAuth();
    const { RecaptchaVerifier } = await import('firebase/auth');
    const recaptchaVerifier = new RecaptchaVerifier(authInstance, 'recaptcha-container', {
      size: 'invisible',
    });
    _confirmationResult = await signInWithPhoneNumber(authInstance, phoneNumber, recaptchaVerifier);
    return { success: true, verificationId: 'firebase-session' };
  } catch (error: unknown) {
    console.error('sendPhoneOTP error:', error);
    return { success: false, error: friendlyError(error) };
  }
}

export async function confirmPhoneOTP(
  verificationId: string,
  code: string,
): Promise<{ success: boolean; user?: { uid: string; phoneNumber: string | null }; error?: string }> {
  try {
    if (_confirmationResult) {
      const result = await _confirmationResult.confirm(code);
      return { success: true, user: { uid: result.user.uid, phoneNumber: result.user.phoneNumber } };
    }
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const result = await signInWithCredential(getFirebaseAuth(), credential);
    return { success: true, user: { uid: result.user.uid, phoneNumber: result.user.phoneNumber } };
  } catch (error: unknown) {
    return { success: false, error: friendlyError(error) };
  }
}

export { auth };
