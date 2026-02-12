import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function TabIcon({ name }: { name: string }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>{name}</Text>
    </View>
  );
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: 'Dashboard',
          tabBarIcon: () => <TabIcon name="D" />,
        }}
      />
      <Tabs.Screen
        name="(transfers)"
        options={{
          title: 'Transfers',
          tabBarIcon: () => <TabIcon name="T" />,
        }}
      />
      <Tabs.Screen
        name="(history)"
        options={{
          title: 'History',
          tabBarIcon: () => <TabIcon name="H" />,
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings',
          tabBarIcon: () => <TabIcon name="S" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
