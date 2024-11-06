import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { auth } from "@/firebase";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("user");
      await signOut(auth);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-between">
      <ScrollView className="flex-1 flex-col gap-3 p-2">
        {/* Header Section */}
        <View className="relative">
          {/* Profile Image & Name Section */}
          <View className="items-center p-4">
            <View className="relative items-center">
              {user?.providerData[0].photoURL ? (
                <Image
                  source={{
                    uri: user?.providerData[0].photoURL,
                  }}
                  className="w-32 h-32 rounded-full border-2 border-teal-200"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-gray-300 justify-center items-center border-2 border-gray-200">
                  <Ionicons name="person" size={70} color="#FFFFFF" />
                </View>
              )}
              <Text className="text-2xl font-bold mt-2 text-teal-600">
                {user?.displayName || "User Name"}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex flex-col justify-center p-2">
          {/* Profile Details Section */}
          <View className="bg-gray-200 rounded-2xl p-5 shadow-sm mb-6">
            <Text className="text-xl font-bold text-teal-700 mb-4">
              Profile Details
            </Text>

            <View className="flex flex-col rounded-2xl bg-white">
              <View className="flex flex-row gap-3 items-center p-3">
                <Ionicons name="person" size={24} color="#4FD1C5" />
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">Display Name</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {user?.displayName}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row gap-3 items-center p-3">
                <Ionicons name="mail" size={24} color="#4FD1C5" />
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">Email</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {user?.email}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Account Info Section */}
          <View className="bg-gray-200 rounded-2xl p-5 shadow-sm mb-6">
            <Text className="text-xl font-bold text-teal-700 mb-4">
              Account Information
            </Text>

            <View className="flex flex-col rounded-2xl bg-white">
              <View className="flex flex-row gap-3 items-center p-3">
                <Ionicons name="calendar" size={24} color="#4FD1C5" />
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">Joined Date</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {new Date(
                      parseInt(user?.createdAt as string)
                    ).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row gap-3 items-center p-3">
                <Ionicons name="time" size={24} color="#4FD1C5" />
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">Last Login</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {new Date(
                      parseInt(user?.lastLoginAt as string)
                    ).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Logout Button */}
        </View>
      </ScrollView>

      <TouchableOpacity
        className={`h-12 rounded-lg justify-center items-center ml-4 mr-4 mb-4 ${
          loading ? "bg-teal-400" : "bg-teal-500"
        }`}
        onPress={handleSignOut}
        disabled={loading}
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white text-base font-semibold ml-2">
              Logging out...
            </Text>
          </View>
        ) : (
          <Text className="text-white text-base font-semibold">Log Out</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
