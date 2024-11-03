import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useCartStore } from "@/store/useCartStore";
import { Ionicons } from "@expo/vector-icons";
import { User, YogaClass } from "@/types";
import { bookClasses } from "@/firebase/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen() {
  const [loading, setLoading] = useState(false);
  const { cart, removeFromCart, clearCart } = useCartStore();

  const [user, setUser] = useState<User>();

  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const renderCartItem = ({ item }: { item: YogaClass }) => {
    const classDate = new Date(item.date.seconds * 1000);
    const formattedDate = classDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return (
      <View className="bg-white rounded-2xl mb-4 p-4 flex-row items-center">
        <Image
          source={{
            uri: item?.imageUrl || "https://via.placeholder.com/100x100",
          }}
          className="w-28 h-28 rounded-full border-4 border-white"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold">{item.course?.name}</Text>
          <Text className="text-gray-600">{item.teacher}</Text>
          <Text className="text-gray-600">{formattedDate}</Text>
          <Text className="text-gray-600">{item.course?.time}</Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-indigo-600 mb-2">
            ${item.course?.price}
          </Text>
          <TouchableOpacity
            onPress={() => removeFromCart(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.course?.price || 0),
    0
  );

  const checkOut = async () => {
    setLoading(true);
    try {
      const response = await bookClasses(
        user?.uid as string,
        user?.email as string,
        cart
      );
      if (response) {
        Toast.show({
          type: "success",
          text1: "Successful Booking",
          text2: "You have successfully booked Yoga Classes.",
          position: "bottom",
          visibilityTime: 3000,
          autoHide: true,
        });
        clearCart();
      }
    } catch (error: any) {
      console.error("Error Booking Classes:", error);
      Toast.show({
        type: "error",
        text1: "Failed to book classes",
        text2: `${error.message}`,
        position: "bottom",
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
          <Text className="text-xl text-gray-500 mt-4">Your cart is empty</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {cart.length > 0 && (
        <View className="p-4 bg-white border-t border-gray-200">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Total:</Text>
            <Text className="text-xl font-bold text-indigo-600">
              ${totalPrice.toFixed(2)}
            </Text>
          </View>

          <View className="w-full flex flex-row justify-between items-center">
            <TouchableOpacity
              className="border border-red-500 bg-transparent py-4 rounded-lg mb-3 flex-1 mr-2"
              onPress={clearCart}
            >
              <Text className="text-red-500 text-center font-semibold">
                Clear Cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`rounded-lg justify-center items-center py-4 mb-3 flex-1 ${
                loading ? "bg-blue-400" : "bg-blue-500"
              }`}
              onPress={checkOut}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white text-base font-semibold ml-2">
                    Checking out...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold">
                  Proceed to Checkout
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Toast />
    </View>
  );
}
