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

const convertToMinutes = (time: string | Date): number => {
  if (typeof time === "string") {
    const [h, m] = time.split(" ")[0].split(":").map(Number);
    const isPM = time.includes("PM");
    return ((h % 12) + (isPM ? 12 : 0)) * 60 + m;
  }
  return time.getHours() * 60 + time.getMinutes();
};

export default function ClassesScreen() {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeRange, setTimeRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

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

      if (timeRange.start && timeRange.end) {
        const yogaClassTime = convertToMinutes(
          yogaClass.course?.time as string
        );
        const startTime = convertToMinutes(timeRange.start);
        const endTime = convertToMinutes(timeRange.end);

        matches =
          matches && yogaClassTime >= startTime && yogaClassTime <= endTime;
      }

      return matches;
    });
  }, [classes, searchQuery, selectedDays, selectedDate, timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setSearchQuery("");
    setSelectedDays([]);
    setSelectedDate(null);
    setTimeRange({ start: null, end: null });
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

  const handleTimeChange = (
    event: any,
    timeType: "start" | "end",
    time?: Date | null
  ) => {
    if (time) {
      setTimeRange((prevRange) => {
        return {
          ...prevRange,
          [timeType]: time,
        };
      });
    }
  };

  const getFilterText = ({
    selectedDays,
    selectedDate,
    timeRange,
  }: {
    selectedDays: string[];
    selectedDate: Date | null;
    timeRange: { start: Date | null; end: Date | null };
  }) => {
    const dayText =
      selectedDays.length > 0 ? `Days: ${selectedDays.join(", ")}` : "";
    const dateText = selectedDate
      ? `Date: ${selectedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : "";
    const timeText =
      timeRange.start && timeRange.end
        ? `Time: ${timeRange.start.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })} to ${timeRange.end.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "";

    return [dateText, timeText, dayText].filter(Boolean).join(" | ");
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 p-3">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilterPress={() => setFilterModalVisible(true)}
        />

        {(selectedDays.length > 0 ||
          selectedDate ||
          (timeRange?.start && timeRange?.end)) && (
          <View className="flex flex-row items-center mx-3 mb-5">
            <Text className="text-md font-semibold">
              Filtered:{" "}
              {getFilterText({ selectedDays, selectedDate, timeRange })}
            </Text>
          </View>
        )}

        <View className="flex-1 px-2">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#4FD1C5" />
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
          timeRange={timeRange}
          handleTimeChange={handleTimeChange}
        />

        <Toast />
      </View>
    </View>
  );
}
