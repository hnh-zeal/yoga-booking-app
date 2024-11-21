import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterPress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onFilterPress,
}) => {
  return (
    <View className="flex flex-row items-center mb-4">
      <View className="flex-1 ml-2 relative">
        <TextInput
          className="bg-white border border-gray-300 rounded-full pl-12 pr-4 py-2"
          placeholder="Search by Teacher"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons
          name="search"
          size={20}
          color="gray"
          style={{ position: "absolute", left: 16, top: 10 }}
        />
      </View>
      <IconButton
        mode="contained"
        icon="filter"
        size={24}
        iconColor="#4FD1C5"
        onPress={onFilterPress}
        style={{ marginLeft: 10 }}
      />
    </View>
  );
};
