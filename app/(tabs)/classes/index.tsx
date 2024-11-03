import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { YogaClass } from "@/types";
import { fetchYogaClasses } from "@/firebase/api";
import { YogaClassCard } from "@/components/YogaClassCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterModal } from "@/components/FilterModal";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function ClassesScreen() {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const fetchedClasses = await fetchYogaClasses();
      setClasses(fetchedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch classes",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((yogaClass) => {
      let matches: Boolean | any = true;

      if (searchQuery) {
        const teacherMatch = yogaClass.teacher
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const timeMatch = yogaClass.course?.time
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        matches = matches && (teacherMatch || timeMatch);
      }

      if (selectedDays.length > 0) {
        const dayMatch = selectedDays.includes(
          yogaClass.course?.dayOfWeek || ""
        );
        matches = matches && dayMatch;
      }

      if (selectedDate) {
        const yogaClassDate = new Date(yogaClass.date.seconds * 1000);

        const dateMatch =
          yogaClassDate.toDateString() === selectedDate.toDateString();
        matches = matches && dateMatch;
      }

      return matches;
    });
  }, [classes, searchQuery, selectedDays, selectedDate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setSearchQuery("");
    setSelectedDays([]);
    setSelectedDate(null);
    await fetchClasses();
    setRefreshing(false);
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleDateChange = (event: any, date?: Date | null) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 p-3">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilterPress={() => setFilterModalVisible(true)}
        />

        {(selectedDays.length > 0 || selectedDate) && (
          <View className="flex flex-row items-center mx-3 mb-5">
            <Text className="text-md font-semibold">
              Filtered:{" "}
              {selectedDays.length > 0 && selectedDate
                ? `Days: ${selectedDays.join(
                    ", "
                  )}, Date: ${selectedDate.toDateString()}`
                : selectedDays.length > 0
                ? `Days: ${selectedDays.join(", ")}`
                : `Date: ${selectedDate?.toDateString()}`}
            </Text>
          </View>
        )}

        <View className="flex-1 px-2">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#4F46E5" />
            </View>
          ) : (
            <FlatList
              data={filteredClasses}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.replace(`/(tabs)/classes/${item.id}`)}
                  activeOpacity={0.6}
                >
                  <YogaClassCard item={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          selectedDays={selectedDays}
          toggleDaySelection={toggleDaySelection}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />

        <Toast />
      </View>
    </View>
  );
}
