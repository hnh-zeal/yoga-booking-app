import { Link, Tabs, useRouter } from "expo-router";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";
import { useCartStore } from "@/store/useCartStore";

export default function TabLayout() {
  const { cart } = useCartStore();
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4CAF50",
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="classes/index"
        options={{
          tabBarLabel: "Classes",
          headerTitle: "Yoga Classes",
          headerRight: () => (
            <Link href="/cart" asChild>
              <TouchableOpacity>
                <View className="mr-4">
                  <Ionicons name="cart" size={24} color="#4F46E5" />
                  {cart.length > 0 && (
                    <View className="absolute -top-1 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                      <Text className="text-white text-xs font-bold">
                        {cart.length}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Link>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="fitness" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classes/[id]"
        options={{
          href: null,
          tabBarLabel: "Yoga Class Details",
          title: "Yoga Class Details",
          headerRight: () => (
            <Link href="/cart" asChild>
              <TouchableOpacity>
                <View className="mr-4">
                  <Ionicons name="cart" size={24} color="#4F46E5" />
                  {cart.length > 0 && (
                    <View className="absolute -top-1 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                      <Text className="text-white text-xs font-bold">
                        {cart.length}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Link>
          ),
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => router.replace("/(tabs)/classes")}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#4F46E5" />
              </TouchableOpacity>
            );
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          href: null,
          headerTitle: "Your Shopping Cart",
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => router.replace("/(tabs)/classes")}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#4F46E5" />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tabs.Screen
        name="bookings/index"
        options={{
          tabBarLabel: "Bookings",
          title: "My Bookings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings/[id]"
        options={{
          href: null,
          title: "Booking Details",
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => router.replace("/(tabs)/bookings")}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color="#4F46E5" />
              </TouchableOpacity>
            );
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
