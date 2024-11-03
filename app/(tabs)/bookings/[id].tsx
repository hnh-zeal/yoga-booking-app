import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Booking, YogaClass } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { fetchBookingDetails } from "@/firebase/api";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { dateOptions, formatDate } from "@/utils/date";

const ClassCard = ({ yogaClass }: { yogaClass: YogaClass }) => {
  const classDate = formatDate(yogaClass.date);

  return (
    <View className="bg-white rounded-3xl p-5 mb-5 shadow-lg">
      <View className="flex-row gap-4">
        {yogaClass.imageUrl ? (
          <Image
            source={{ uri: yogaClass.imageUrl }}
            className="w-24 h-24 rounded-2xl"
          />
        ) : (
          <View className="w-24 h-24 rounded-2xl bg-indigo-100 justify-center items-center">
            <Text className="text-4xl">🧘</Text>
          </View>
        )}
        <View className="flex-1 flex flex-col justify-center gap-1">
          <Text className="text-xl font-bold text-gray-800">
            {yogaClass.course?.name || "Yoga Class"}
          </Text>
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="barbell" size={18} color="#4F46E5" />
            <Text className="text-base text-indigo-600 font-semibold">
              {yogaClass.course?.type}
            </Text>
          </View>
          <Text className="text-sm text-gray-600">
            with {yogaClass.teacher}
          </Text>
        </View>
      </View>

      <View className="flex-1 mt-3 gap-1">
        <View className="flex-row items-center gap-3">
          <Ionicons name="calendar" size={18} color="#4F46E5" />
          <Text className="text-base text-gray-700">{classDate}</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Ionicons name="time" size={18} color="#4F46E5" />
          <Text className="text-base text-gray-700">
            {yogaClass.course?.time} • {yogaClass.course?.duration} minutes
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Ionicons name="people" size={18} color="#4F46E5" />
          <Text className="text-base text-gray-700">
            Capacity: {yogaClass.course?.capacity} people
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Ionicons name="pricetag" size={18} color="#4F46E5" />
          <Text className="text-base text-gray-700">
            ${yogaClass.course?.price}
          </Text>
        </View>

        {yogaClass.comments && (
          <View className="flex flex-col gap-2 mt-4 p-4 bg-indigo-50 rounded-xl">
            <Text className="text-md font-bold text-gray-700">Comments</Text>
            <Text className="text-base text-gray-700 italic">
              {yogaClass.comments}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const BookingDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        setLoading(true);
        const bookingData = await fetchBookingDetails(id as string);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch booking details",
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };

    getBookingDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-indigo-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View className="flex-1 justify-center items-center bg-indigo-50">
        <Text className="text-xl text-gray-600">
          Booking details not available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-indigo-50"
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#4F46E5", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-white">
            Booking ID #{booking.id}
          </Text>
        </View>
        <Text className="text-lg text-indigo-100">
          Booked on
          {`${new Date(booking.createdAt).toLocaleString(dateOptions)}`}
        </Text>
        <Text className="text-lg text-indigo-100 mt-2">
          {booking.classes.length}{" "}
          {booking.classes.length === 1 ? "class" : "classes"}
        </Text>
      </LinearGradient>

      <View className="p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Yoga Classes
        </Text>
        <View className="flex flex-col justify-center gap-2">
          {booking.classes.map((yogaClass: YogaClass) => (
            <ClassCard key={yogaClass.id} yogaClass={yogaClass} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default BookingDetails;
