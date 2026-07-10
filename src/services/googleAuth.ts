import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { signInWithGoogleCredential, AuthUser } from './firebase';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

/** True when the Firebase Web OAuth client id is configured. */
export const isGoogleConfigured = !!WEB_CLIENT_ID;

// Configure the native Google Sign-In SDK once. `webClientId` must be the
// Firebase project's *Web* OAuth client so the returned id_token is audienced
// for Firebase. The native Android OAuth client (package + SHA-1) is matched
// automatically by Play Services — it is not passed here.
if (WEB_CLIENT_ID) {
  GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
}

interface UseGoogleAuthOptions {
  /** Called with the signed-in Firebase user after a successful Google sign-in. */
  onSuccess: (user: AuthUser) => void;
  /** Called with a human-readable message if Google sign-in fails. */
  onError?: (message: string) => void;
}

/**
 * Hook that drives Google sign-in via the native Google Sign-In SDK and
 * exchanges the returned id_token for a Firebase credential. Requires a
 * custom dev build (the native module is not available in Expo Go).
 *
 * Usage:
 *   const { promptGoogle, ready } = useGoogleAuth({ onSuccess, onError });
 *   <FsButton onPress={promptGoogle} disabled={!ready} ... />
 */
/**
 * Clear the native Google Sign-In session. Must run on app sign-out —
 * otherwise Credential Manager auto-signs the previous account back in
 * without showing the account chooser on the next sign-in.
 */
export async function signOutGoogle(): Promise<void> {
  if (!isGoogleConfigured) return;
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('signOutGoogle error:', error);
  }
}

export function useGoogleAuth({ onSuccess, onError }: UseGoogleAuthOptions) {
  const promptGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      // User dismissed the account chooser.
      if (!isSuccessResponse(response)) return;

      const idToken = response.data.idToken;
      if (!idToken) {
        onError?.('Google sign-in did not return a token.');
        return;
      }

      const res = await signInWithGoogleCredential(idToken);
      if (res.success && res.user) onSuccess(res.user);
      else onError?.(res.error || 'Google sign-in failed.');
    } catch (e) {
      // Treat an explicit cancel as a silent no-op; surface everything else.
      if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_CANCELLED) return;
      onError?.((e as { message?: string })?.message || 'Google sign-in failed.');
    }
  };

  return {
    /** Opens the native Google account chooser. */
    promptGoogle,
    /** False until Google is configured. */
    ready: isGoogleConfigured,
  };
}
