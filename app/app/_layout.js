import { Stack } from "expo-router";
import Colors from "../../constants/colors";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="understand-me"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}