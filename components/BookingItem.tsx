import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Booking, YogaClass } from "@/types";
import { useRouter } from "expo-router";
import { dateOptions, formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";

interface BookingItemProps {
  item: Booking;
}

const ClassItem = ({ yogaClass }: { yogaClass: YogaClass }) => {
  const classDate = formatDate(yogaClass.date);

  return (
    <View className="flex-row rounded-xl items-center gap-4 mt-2">
      {yogaClass.imageUrl ? (
        <Image
          source={{
            uri: yogaClass.imageUrl
              ? `data:image/jpeg;base64,${yogaClass.imageUrl}`
              : "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
          }}
          className="w-16 h-16 rounded-xl"
        />
      ) : (
        <View className="w-16 h-16 rounded-xl bg-teal-200 justify-center items-center">
          <Text className="text-teal-600 text-2xl">🧘</Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {yogaClass.course?.name || "Yoga Class"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          {classDate} at {yogaClass.course?.time}
        </Text>
        <Text className="text-sm text-teal-600 mt-1">
          {yogaClass.course?.duration} mins • {yogaClass.teacher}
        </Text>
      </View>
    </View>
  );
};

export const BookingItem: React.FC<BookingItemProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const classesToShow = expanded ? item.classes : item.classes.slice(0, 1);
  const hasMoreClasses = item.classes.length > 1;
  const router = useRouter();

  const bookingDate = new Date(item.createdAt).toLocaleString(dateOptions);

  return (
    <View className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
      <View className="flex-row justify-between items-center gap-4 p-4">
        <View className="flex-1 flex-row items-center gap-2">
          <Ionicons name="bookmark" size={24} color="#38B2AC" />
          <Text className="text-xl font-bold text-gray-800">
            Booking #{item.id}
          </Text>
        </View>
      </View>

      <View className="flex justify-center px-4">
        <Text className="text-sm text-gray-500">
          Booked on {`${bookingDate}`}
        </Text>
      </View>

      <View className="flex flex-col px-4 gap-4">
        {classesToShow.map((yogaClass, index) => (
          <ClassItem key={yogaClass.id} yogaClass={yogaClass} />
        ))}

        {hasMoreClasses && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            className="py-3 bg-teal-100 rounded-xl"
          >
            <Text className="text-teal-600 text-base font-semibold text-center">
              {expanded
                ? "Show Less"
                : `Show ${item.classes.length - 1} More Classes`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="p-4 mb-2 flex-row justify-between items-center">
        <Text className="text-base text-gray-600">
          {item.classes.length}{" "}
          {item.classes.length === 1 ? "class" : "classes"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/bookings/${item.id}`)}
          className="flex-row items-center space-x-1"
        >
          <Text className="text-teal-600 font-semibold">View Details</Text>
          <Ionicons name="chevron-forward" size={20} color="#38B2AC" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
