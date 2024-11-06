import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PasswordInput } from "@/components/PasswordInput";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      Alert.alert("Success", "Account created successfully!");
      const user = userCredential.user;
      await AsyncStorage.setItem("user", JSON.stringify(user));
      router.replace("/(tabs)/classes");
    } catch (error: any) {
      console.error("Sign Up error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-center text-teal-600 mb-8">
        Create Account
      </Text>

      <TextInput
        className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-lg text-base"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholderTextColor="#9CA3AF"
      />

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
          loading ? "bg-teal-400" : "bg-teal-500"
        }`}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white text-base font-semibold ml-2">
              Creating Account...
            </Text>
          </View>
        ) : (
          <Text className="text-white text-base font-semibold">Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/sign-in")}
        className="mt-4"
      >
        <Text className="text-teal-500 text-center text-base">
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}
