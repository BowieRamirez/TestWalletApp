import React from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Iconify } from "react-native-iconify";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { toast } from "sonner-native";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  colors: ReturnType<typeof useThemeColors>;
}

function SettingsItem({ icon, label, onPress, trailing, colors: t }: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 px-4 py-3.5"
      style={({ pressed }) => pressed ? { backgroundColor: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" } : {}}
    >
      <View
        className="h-9 w-9 rounded-full items-center justify-center"
        style={{ backgroundColor: t.surfaceElevated }}
      >
        {icon}
      </View>
      <Text className="flex-1 text-base" style={{ color: t.textPrimary }}>
        {label}
      </Text>
      {trailing ?? <Iconify icon="mdi:chevron-right" size={18} color={t.iconMuted} />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const toggleColorScheme = useThemeStore((s) => s.toggleColorScheme);
  const logout = useAuthStore((s) => s.logout);
  const userName = useAuthStore((s) => s.user?.name ?? "Alexander Doe");
  const t = useThemeColors();

  const isDark = colorScheme === "dark";

  const handleLogout = () => {
    logout();
    toast("Logged out successfully");
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: t.bg }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-5 pt-4 pb-6">
            <Text className="text-2xl font-bold" style={{ color: t.textPrimary }}>
              Settings
            </Text>
          </View>

          {/* Profile */}
          <View
            className="flex-row items-center gap-4 mx-5 mb-6 p-4 rounded-2xl"
            style={{ backgroundColor: t.surface }}
          >
            <View className="h-14 w-14 rounded-full bg-[#9FE870] items-center justify-center">
              <Text className="text-xl font-bold text-black">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold" style={{ color: t.textPrimary }}>
                {userName}
              </Text>
              <Text className="text-sm" style={{ color: t.textSecondary }}>
                alexander@flux.com
              </Text>
            </View>
            <Iconify icon="mdi:chevron-right" size={18} color={t.iconMuted} />
          </View>

          {/* Account Section */}
          <View className="mx-5 mb-4">
            <Text className="text-sm font-medium mb-2 px-1" style={{ color: t.textSecondary }}>
              ACCOUNT
            </Text>
            <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface }}>
              <SettingsItem
                icon={<Iconify icon="mdi:account-outline" size={18} color="#9FE870" />}
                label="Personal Info"
                colors={t}
              />
              <View className="h-px mx-4" style={{ backgroundColor: t.border }} />
              <SettingsItem
                icon={<Iconify icon="mdi:earth" size={18} color="#60A5FA" />}
                label="Language"
                colors={t}
              />
            </View>
          </View>

          {/* Preferences Section */}
          <View className="mx-5 mb-4">
            <Text className="text-sm font-medium mb-2 px-1" style={{ color: t.textSecondary }}>
              PREFERENCES
            </Text>
            <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface }}>
              <SettingsItem
                icon={<Iconify icon="mdi:bell-outline" size={18} color="#FBBF24" />}
                label="Notifications"
                colors={t}
                trailing={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: t.surfaceElevated, true: "#9FE870" }}
                    thumbColor="#fff"
                  />
                }
              />
              <View className="h-px mx-4" style={{ backgroundColor: t.border }} />
              <SettingsItem
                icon={<Iconify icon="mdi:weather-night" size={18} color="#A78BFA" />}
                label="Dark Mode"
                colors={t}
                trailing={
                  <Switch
                    value={isDark}
                    onValueChange={toggleColorScheme}
                    trackColor={{ false: t.surfaceElevated, true: "#9FE870" }}
                    thumbColor="#fff"
                  />
                }
              />
            </View>
          </View>

          {/* Security Section */}
          <View className="mx-5 mb-6">
            <Text className="text-sm font-medium mb-2 px-1" style={{ color: t.textSecondary }}>
              SECURITY
            </Text>
            <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: t.surface }}>
              <SettingsItem
                icon={<Iconify icon="mdi:shield-outline" size={18} color="#FF6467" />}
                label="Privacy & Security"
                colors={t}
              />
              <View className="h-px mx-4" style={{ backgroundColor: t.border }} />
              <SettingsItem
                icon={<Iconify icon="mdi:help-circle-outline" size={18} color={t.iconMuted} />}
                label="Help & Support"
                colors={t}
              />
            </View>
          </View>

          {/* Log Out */}
          <View className="mx-5">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? (t.isDark ? "#2C2C2E" : "#E5E7EB")
                  : t.surface,
              })}
            >
              <Iconify icon="mdi:logout" size={18} color="#FF6467" />
              <Text className="text-base font-medium text-[#FF6467]">
                Log Out
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
