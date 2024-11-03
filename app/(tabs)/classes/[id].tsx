import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { YogaClass } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { fetchYogaClass } from "@/firebase/api";
import Toast from "react-native-toast-message";
import { formatDate } from "@/utils/date";
import { useCartStore } from "@/store/useCartStore";

const YogaClassDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [yogaClass, setYogaClass] = useState<YogaClass | null>(null);

  useEffect(() => {
    const getYogaClass = async () => {
      try {
        setLoading(true);
        const yogaClassData = await fetchYogaClass(id as string);
        setYogaClass(yogaClassData);
      } catch (error) {
        console.error("Error fetching yoga class details:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch yoga class details",
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };

    getYogaClass();
  }, [id]);

  const { cart, addToCart } = useCartStore();

  const handleAddToCart = () => {
    const itemExists = cart.some(
      (cartItem: YogaClass) => cartItem.id === yogaClass?.id
    );

    if (itemExists) {
      Toast.show({
        type: "info",
        text1: "Already in cart",
        text2: "This class is already in your cart",
        position: "bottom",
        visibilityTime: 2000,
        autoHide: true,
      });
    } else {
      if (yogaClass) {
        addToCart(yogaClass);
        Toast.show({
          type: "success",
          text1: "Added to cart",
          text2: "Class has been added to your cart",
          position: "bottom",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-indigo-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!yogaClass) {
    return (
      <View className="flex-1 justify-center items-center bg-indigo-50">
        <Text className="text-xl text-gray-600">
          Booking details not available.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Hero Image Section */}
        <View className="relative h-[300px]">
          <Image
            source={{
              uri:
                yogaClass.imageUrl ||
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Content Section */}
        <View className="flex flex-col justify-center gap-4 p-4">
          <View className="flex flex-row justify-between gap-2">
            <Text className="text-2xl font-bold text-gray-800">
              {yogaClass.course?.name}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-lg font-bold text-gray-800">Type: </Text>
              <Text className="text-blue-600 font-medium">
                {yogaClass.course?.type}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Course Description
            </Text>
            <Text className="text-gray-600 leading-6">
              {yogaClass.course?.description}
            </Text>
          </View>

          {/* Teacher Info */}
          <View className="flex flex-row items-center gap-4">
            <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
              <Ionicons name="person" size={28} color="#4B5563" />
            </View>
            <View className="flex-1 flex-col justify-center gap-1">
              <Text className="text-sm text-gray-500">Instructor</Text>
              <Text className="text-base font-medium text-gray-800">
                {yogaClass.teacher}
              </Text>
            </View>
          </View>

          {/* Date Information */}
          <View className="flex flex-col gap-4 bg-gray-50 rounded-2xl p-4">
            <Text className="text-lg font-bold text-gray-800">
              Class Details
            </Text>

            {/* Date */}
            <View className="flex-row justify-between items-center">
              <View className="flex flex-row items-center gap-4">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="calendar" size={20} color="#3B82F6" />
                </View>
                <View className="flex-1 flex-col justify-center gap-1">
                  <Text className="text-sm text-gray-500">Date</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {formatDate(yogaClass.date)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Time and Duration */}
            <View className="flex flex-row justify-between items-center gap-2">
              {/* Time Section */}
              <View className="flex-1 flex flex-row items-center gap-4">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="time" size={20} color="#10B981" />
                </View>
                <View className="flex-col justify-center gap-1">
                  <Text className="text-sm text-gray-500">Time</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {yogaClass.course?.time || ""}
                  </Text>
                </View>
              </View>

              {/* Duration Section */}
              <View className="flex-1 flex flex-row items-center gap-4">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="hourglass" size={20} color="#8B5CF6" />
                </View>
                <View className="flex-col justify-center gap-1">
                  <Text className="text-sm text-gray-500">Duration</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {yogaClass.course?.duration} mins
                  </Text>
                </View>
              </View>
            </View>

            {/* Capacity and Price */}
            <View className="flex flex-row justify-between items-center gap-2">
              {/* Time Section */}
              <View className="flex-1 flex flex-row items-center gap-4">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="people" size={20} color="#10B981" />
                </View>
                <View className="flex-col justify-center gap-1">
                  <Text className="text-sm text-gray-500">Capacity</Text>
                  <Text className="text-base font-medium text-gray-800">
                    {yogaClass.course?.capacity || ""}
                  </Text>
                </View>
              </View>

              {/* Duration Section */}
              <View className="flex-1 flex flex-row items-center gap-4">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="pricetag" size={20} color="#8B5CF6" />
                </View>
                <View className="flex-col justify-center gap-1">
                  <Text className="text-sm text-gray-500">Price</Text>
                  <Text className="text-base font-medium text-gray-800">
                    ${yogaClass.course?.price}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Comments */}
          {yogaClass.comments && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Additional Notes
              </Text>
              <Text className="text-gray-600 leading-6">
                {yogaClass.comments}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View className="p-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="w-full bg-blue-600 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-lg">
            Add to Cart - ${yogaClass.course?.price}
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

export default YogaClassDetails;
