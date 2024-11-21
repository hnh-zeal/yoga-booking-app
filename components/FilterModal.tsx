import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { daysOfWeek } from "@/constants";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  selectedDate: Date | null;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  handleDateChange: (event: any, date?: Date) => void;
  timeRange: { start: Date | null; end: Date | null };
  handleTimeChange: (
    event: any,
    timeType: "start" | "end",
    time?: Date | null
  ) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedDays,
  toggleDaySelection,
  selectedDate,
  showDatePicker,
  setShowDatePicker,
  handleDateChange,
  timeRange,
  handleTimeChange,
}: FilterModalProps) => {
  const dayPairs = [];
  for (let i = 0; i < daysOfWeek.length; i += 2) {
    dayPairs.push(daysOfWeek.slice(i, i + 2));
  }

  const [activeTimePicker, setActiveTimePicker] = useState<
    "start" | "end" | null
  >(null);

  const showTimePickerFunc = (type: "start" | "end") => {
    setActiveTimePicker(type);
  };

  const renderTimePicker = () => {
    if (activeTimePicker) {
      return (
        <DateTimePicker
          value={timeRange[activeTimePicker] || new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, time) => {
            setActiveTimePicker(null);
            handleTimeChange(event, activeTimePicker, time);
          }}
        />
      );
    }
    return null;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl p-4 h-[55%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Filter Classes</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onClose}
              iconColor="#4F46E5"
              className="bg-gray-100 rounded-full"
            />
          </View>

          <ScrollView className="flex-1 flex flex-col gap-4 space-y-2">
            {/* Date Picker */}
            <View className="flex flex-col gap-1 mb-4">
              <Text className="text-base font-semibold mb-2">
                Specific Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
              >
                <Text className="text-gray-600">
                  {selectedDate ? selectedDate.toDateString() : "Select Date"}
                </Text>
                {selectedDate && (
                  <Pressable
                    onPress={() => handleDateChange(null)}
                    className="ml-2 bg-gray-100 rounded-full"
                  >
                    <Ionicons name="close" size={20} color="#4F46E5" />
                  </Pressable>
                )}
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View className="flex flex-row items-center justify-between gap-3 mb-4">
              {/* Start Time Picker */}
              <View className="flex-1 flex flex-col gap-1 mb-4">
                <Text className="text-base font-semibold mb-2">Start Time</Text>
                <TouchableOpacity
                  onPress={() => showTimePickerFunc("start")}
                  className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
                >
                  <Text className="text-gray-600">
                    {timeRange.start
                      ? timeRange.start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Select Start Time"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* End Time Picker */}
              <View className="flex-1 flex flex-col gap-1 mb-4">
                <Text className="text-base font-semibold mb-2">End Time</Text>
                <TouchableOpacity
                  onPress={() => showTimePickerFunc("end")}
                  className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
                >
                  <Text className="text-gray-600">
                    {timeRange.end
                      ? timeRange.end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Select End Time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {renderTimePicker()}

            {/* Days of the Week */}
            <View className="flex flex-col gap-1">
              <Text className="text-base font-semibold mb-2">
                Days of the Week
              </Text>
              <View className="space-y-1">
                {dayPairs.map((pair, index) => (
                  <View key={index} className="flex-row justify-between">
                    {pair.map((day) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        key={day}
                        className="flex-row items-center p-1 rounded-lg w-[48%]"
                        onPress={() => toggleDaySelection(day)}
                      >
                        <Checkbox
                          status={
                            selectedDays.includes(day) ? "checked" : "unchecked"
                          }
                          color="#4FD1C5"
                        />
                        <Text className="text-sm ml-1">{day}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
