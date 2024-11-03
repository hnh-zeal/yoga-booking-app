import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { daysOfWeek } from "@/constants";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  selectedDate: Date | null;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  handleDateChange: (event: any, date?: Date) => void;
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
}) => {
  const dayPairs = [];
  for (let i = 0; i < daysOfWeek.length; i += 2) {
    dayPairs.push(daysOfWeek.slice(i, i + 2));
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl p-4 h-[45%]">
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
            <View className="flex flex-col gap-1 mb-4">
              <Text className="text-base font-semibold mb-2">
                Specific Date
              </Text>
              <View className="px-2">
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
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View className="flex flex-col gap-1">
              <Text className="text-base font-semibold mb-2">
                Days of the Week
              </Text>
              <View className="space-y-1">
                {dayPairs.map((pair, index) => (
                  <View key={index} className="flex-row justify-between">
                    {pair.map((day) => (
                      <TouchableOpacity
                        key={day}
                        className="flex-row items-center p-1 rounded-lg w-[48%]"
                        onPress={() => toggleDaySelection(day)}
                      >
                        <Checkbox
                          status={
                            selectedDays.includes(day) ? "checked" : "unchecked"
                          }
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
