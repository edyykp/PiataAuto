import { FontAwesome6 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThreads } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";

export default function TabLayout() {
  const user = useAuthStore((s) => s.user);
  const threads = useThreads(user?.id);
  const unreadCount = (threads.data ?? []).reduce((acc, thread) => acc + (thread.unreadBy?.[user?.id ?? ""] ?? 0), 0);

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#2563eb", tabBarLabelStyle: { fontSize: 12 } }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color }) => <FontAwesome6 name="house" size={18} color={color} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", tabBarIcon: ({ color }) => <FontAwesome6 name="magnifying-glass" size={18} color={color} /> }}
      />
      <Tabs.Screen
        name="post"
        options={{ title: "Post", tabBarIcon: ({ color }) => <FontAwesome6 name="circle-plus" size={18} color={color} /> }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: "Favorites", tabBarIcon: ({ color }) => <FontAwesome6 name="heart" size={18} color={color} /> }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color }) => <FontAwesome6 name="message" size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={18} color={color} /> }}
      />
    </Tabs>
  );
}
