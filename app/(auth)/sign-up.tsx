import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";

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
      <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
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

      <TextInput
        className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-lg text-base"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        className={`w-full h-12 rounded-lg justify-center items-center mb-4 ${
          loading ? "bg-blue-400" : "bg-blue-500"
        }`}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text className="text-white text-base font-semibold">
          {loading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/sign-in")}
        className="mt-4"
      >
        <Text className="text-blue-500 text-center text-base">
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}
