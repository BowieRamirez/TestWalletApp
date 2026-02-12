import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Button } from "@mybank/ui";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function BiometricScreen() {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");
  const t = useThemeColors();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsSupported(compatible && enrolled);
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access MyBank",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        router.replace("/(tabs)/(home)");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (e) {
      setError("Biometric authentication error.");
    }
  };

  return (
    <View
      className="flex-1 items-center justify-center px-6 gap-6"
      style={{ backgroundColor: t.bg }}
    >
      <View className="items-center gap-2">
        <Text className="text-2xl font-bold" style={{ color: t.textPrimary }}>
          Biometric Login
        </Text>
        <Text className="text-base text-center" style={{ color: t.textSecondary }}>
          {isSupported
            ? "Use your fingerprint or face to sign in"
            : "Biometric authentication is not available on this device"}
        </Text>
      </View>

      {error ? (
        <Text className="text-sm text-red-500">{error}</Text>
      ) : null}

      {isSupported && (
        <Button onPress={handleBiometricAuth} size="lg" fullWidth>
          Authenticate
        </Button>
      )}

      <Button
        variant="ghost"
        onPress={() => router.back()}
      >
        Use Password Instead
      </Button>
    </View>
  );
}
