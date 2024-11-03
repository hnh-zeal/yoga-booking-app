import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";
import { PasswordInput } from "@/components/PasswordInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await AsyncStorage.setItem("user", JSON.stringify(user));
      router.replace("/(tabs)/classes");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: `${error.message}`,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
        Welcome Back
      </Text>

      <TextInput
        className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-lg text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9CA3AF"
      />

      <PasswordInput
        password={password}
        setPassword={setPassword}
        placeholder="Enter your password"
      />

      <TouchableOpacity
        className={`w-full h-12 rounded-lg justify-center items-center mb-4 ${
          loading ? "bg-blue-400" : "bg-blue-500"
        }`}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white text-base font-semibold ml-2">
              Signing In...
            </Text>
          </View>
        ) : (
          <Text className="text-white text-base font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/sign-up")}
        className="mt-4"
      >
        <Text className="text-blue-500 text-center text-base">
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}
