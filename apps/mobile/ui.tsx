import { PropsWithChildren } from "react";
import { Pressable, PressableProps, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { tokens } from "./theme";

export function AppCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

type AppButtonProps = PressableProps & {
  label: string;
  variant?: "primary" | "secondary" | "success";
};

export function AppButton({ label, variant = "primary", style, ...props }: AppButtonProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.buttonPrimary : null,
        variant === "secondary" ? styles.buttonSecondary : null,
        variant === "success" ? styles.buttonSuccess : null,
        pressed ? styles.buttonPressed : null,
        typeof style === "function" ? style({ pressed }) : style
      ]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export function AppInput(props: TextInputProps) {
  return <TextInput placeholderTextColor={tokens.color.textSecondary} style={styles.input} {...props} />;
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.color.bgSurface,
    borderRadius: tokens.radius.container,
    borderWidth: 1,
    borderColor: tokens.color.borderDefault,
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm
  },
  button: {
    minHeight: 44,
    borderRadius: tokens.radius.control,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 10
  },
  buttonPrimary: {
    backgroundColor: tokens.color.brandPrimary
  },
  buttonSecondary: {
    backgroundColor: tokens.color.bgSubtle
  },
  buttonSuccess: {
    backgroundColor: tokens.color.success
  },
  buttonPressed: {
    opacity: 0.9
  },
  buttonLabel: {
    color: tokens.color.textPrimary,
    fontWeight: "600"
  },
  input: {
    minHeight: 44,
    borderRadius: tokens.radius.control,
    borderWidth: 1,
    borderColor: tokens.color.borderDefault,
    backgroundColor: tokens.color.bgSubtle,
    color: tokens.color.textPrimary,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 10
  },
  sectionTitle: {
    color: tokens.color.textPrimary,
    fontWeight: "700"
  }
});
