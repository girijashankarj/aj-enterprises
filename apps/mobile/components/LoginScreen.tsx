import { useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { AJ_SITE_BRANDING } from "@aj/shared-types";
import { useAuth } from "../auth/AuthContext";
import { tokens } from "../theme";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginScreen() {
  const { signInWithIdToken, error, clearError } = useAuth();

  const onIdToken = useCallback(
    async (idToken: string) => {
      clearError();
      await signInWithIdToken(idToken);
    },
    [signInWithIdToken, clearError]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{AJ_SITE_BRANDING.name}</Text>
        <Text style={styles.sub}>{AJ_SITE_BRANDING.mobileTagline}</Text>
        <Text style={styles.hint}>
          Sign in with the same Google account your admin uses for the web app. The API must be reachable from this device
          (set EXPO_PUBLIC_API_BASE_URL — e.g. http://10.0.2.2:4000 for Android emulator).
        </Text>
        {error ? (
          <Text style={styles.err} onPress={clearError}>
            {error}
          </Text>
        ) : null}
        <GoogleSignInButton onIdToken={onIdToken} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bgCanvas },
  scroll: { padding: tokens.spacing.lg, gap: tokens.spacing.md },
  title: { fontSize: 22, fontWeight: "700", color: tokens.color.textPrimary },
  sub: { color: tokens.color.textSecondary },
  hint: { color: tokens.color.textSecondary, fontSize: 13, lineHeight: 18 },
  err: { color: tokens.color.warning }
});
