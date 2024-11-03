import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Booking } from "@/types";
import { fetchBooking } from "@/firebase/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookingItem } from "@/components/BookingItem";
import { useFocusEffect } from "expo-router";

export default function BookingScreen() {
  const [booking, setBooking] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const getBooking = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.uid) {
          const fetchedBooking = await fetchBooking(user.uid);
          setBooking(fetchedBooking);
        } else {
          console.warn("User UID is not available");
        }
      } else {
        console.warn("User data not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch bookings",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooking();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getBooking();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await getBooking();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 p-3 mt-2">
        <View className="flex-1 px-2">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#4F46E5" />
            </View>
          ) : (
            <FlatList
              data={booking}
              renderItem={({ item }) => <BookingItem item={item} />}
              keyExtractor={(item) => item.id.toString()}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        <Toast />
      </View>
    </View>
  );
}
