import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { AppButton } from "../ui";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onIdToken: (idToken: string) => void | Promise<void>;
};

export function GoogleSignInButton({ onIdToken }: Props) {
  const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? "";
  const handled = useRef(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim(),
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim()
  });

  const runToken = useCallback(
    async (id: string) => {
      await onIdToken(id);
    },
    [onIdToken]
  );

  useEffect(() => {
    if (response?.type !== "success") return;
    const id = response.params.id_token;
    if (typeof id !== "string" || id.length === 0) return;
    if (handled.current) return;
    handled.current = true;
    void runToken(id).finally(() => {
      handled.current = false;
    });
  }, [response, runToken]);

  if (!webId) {
    return (
      <View>
        <Text style={{ opacity: 0.7 }}>
          Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (Google OAuth Web client) to enable Sign in with Google.
        </Text>
      </View>
    );
  }

  return (
    <AppButton
      label="Sign in with Google"
      disabled={!request}
      onPress={() => {
        handled.current = false;
        void promptAsync();
      }}
    />
  );
}
