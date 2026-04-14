import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Redirect, Stack } from "expo-router";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../global.css";
import { CenterLoader } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";

function AppGate() {
  const { user, isBootstrapping } = useAuthStore();
  if (isBootstrapping) return <CenterLoader />;
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)" />;
}

export default function RootLayout() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 24 * 60 * 60 * 1000,
            retry: 1,
          },
        },
      }),
    [],
  );
  const persister = useMemo(
    () =>
      createAsyncStoragePersister({
        storage: AsyncStorage,
        key: "PIATAAUTO_QUERY_CACHE",
      }),
    [],
  );
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="listings/[id]" options={{ headerShown: true, title: "Car details" }} />
        <Stack.Screen name="listings/edit/[id]" options={{ headerShown: true, title: "Edit listing" }} />
        <Stack.Screen name="messages/[id]" options={{ headerShown: true, title: "Conversation" }} />
        <Stack.Screen name="my-listings" options={{ headerShown: true, title: "My listings" }} />
      </Stack>
      <Toast />
    </PersistQueryClientProvider>
  );
}

export { AppGate };
