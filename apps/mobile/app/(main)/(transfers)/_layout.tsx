import { Stack } from 'expo-router';

export default function TransfersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="new"
        options={{
          title: 'New Transfer',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
