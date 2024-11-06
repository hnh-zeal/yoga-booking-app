import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { YogaClass } from "@/types";
import { AddToCartButton } from "@/components/AddtoCartButton";
import { formatDate } from "@/utils/date";

interface YogaClassCardProps {
  item: YogaClass;
}

export const YogaClassCard: React.FC<YogaClassCardProps> = ({ item }) => {
  const classDate = formatDate(item.date);

  return (
    <View className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-teal-100">
      <View className="flex-row justify-between gap-4 p-4">
        <View className="mr-4 relative">
          <Image
            source={{
              uri: item?.imageUrl
                ? `data:image/jpeg;base64,${item.imageUrl}`
                : "https://via.placeholder.com/100x100",
            }}
            className="w-28 h-28 rounded-full border-4 border-gray-200"
          />
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold mb-1 text-teal-800">
            {item.course?.name}
          </Text>
          <View className="flex-row items-center mb-1">
            <Ionicons name="person" size={16} color="#14B8A6" />
            <Text className="text-sm text-gray-600 ml-2">{item.teacher}</Text>
          </View>
          <View className="flex-row items-center mb-1">
            <Ionicons name="fitness" size={16} color="#14B8A6" />
            <Text className="text-sm text-gray-600 ml-2">
              {item.course?.type}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={16} color="#14B8A6" />
            <Text className="text-gray-600 ml-2 text-sm">{classDate}</Text>
          </View>
        </View>
      </View>
      <View className="px-4 pb-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color="#14B8A6" />
            <Text className="text-gray-600 ml-2 text-sm">
              {item.course?.time}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="hourglass" size={16} color="#14B8A6" />
            <Text className="text-gray-600 ml-2 text-sm">
              {`${item.course?.duration} min`}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-teal-500">
            ${item.course?.price}
          </Text>
          <AddToCartButton item={item} />
        </View>
      </View>
    </View>
  );
};
