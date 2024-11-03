import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordInputProps {
  password: string;
  setPassword: (text: string) => void;
  placeholder?: string;
  className?: string;
  placeholderTextColor?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  placeholder = "Password",
  className = "w-full h-12 px-4 pr-10 mb-6 border border-gray-300 rounded-lg text-base",
  placeholderTextColor = "#9CA3AF",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View className="relative w-full">
      <TextInput
        className={className}
        placeholder={placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!isPasswordVisible}
        placeholderTextColor={placeholderTextColor}
      />
      <TouchableOpacity
        className="absolute right-4 top-3"
        onPress={togglePasswordVisibility}
      >
        <Ionicons
          name={isPasswordVisible ? "eye" : "eye-off"}
          size={24}
          color="#9CA3AF"
        />
      </TouchableOpacity>
    </View>
  );
};
