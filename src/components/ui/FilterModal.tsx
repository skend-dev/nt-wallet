import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomModal from "./BottomModal";
import DateTimePicker from "@react-native-community/datetimepicker";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  onClearAll: () => void;
}

interface FilterOptions {
  dateFrom: Date | null;
  dateTo: Date | null;
  status: string[];
  category: string[];
}

const FILTER_STORAGE_KEY = "transaction_filters";

export default function FilterModal({
  visible,
  onClose,
  onApply,
  onClearAll,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: null,
    dateTo: null,
    status: [],
    category: [],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState<"from" | "to" | null>(
    null
  );

  const loadSavedFilters = useCallback(async () => {
    try {
      const savedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);

      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);

        const hasFilters =
          parsedFilters.dateFrom ||
          parsedFilters.dateTo ||
          (parsedFilters.status && parsedFilters.status.length > 0) ||
          (parsedFilters.category && parsedFilters.category.length > 0);

        if (hasFilters) {
          if (parsedFilters.dateFrom) {
            parsedFilters.dateFrom = new Date(parsedFilters.dateFrom);
          }
          if (parsedFilters.dateTo) {
            parsedFilters.dateTo = new Date(parsedFilters.dateTo);
          }
          setFilters(parsedFilters);
        } else {
          setFilters({
            dateFrom: null,
            dateTo: null,
            status: [],
            category: [],
          });
        }
      } else {
        setFilters({
          dateFrom: null,
          dateTo: null,
          status: [],
          category: [],
        });
      }
    } catch (error) {
      console.error("Error loading saved filters:", error);

      setFilters({
        dateFrom: null,
        dateTo: null,
        status: [],
        category: [],
      });
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadSavedFilters();
    }
  }, [visible, loadSavedFilters]);

  const saveFilters = useCallback(async (filterData: FilterOptions) => {
    try {
      await AsyncStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify(filterData)
      );
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  }, []);

  const clearSavedFilters = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FILTER_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing saved filters:", error);
    }
  }, []);

  const statusOptions = useMemo(
    () => ["Completed", "Pending", "Cancelled", "Declined"],
    []
  );
  const categoryOptions = useMemo(
    () => ["Top-up", "Withdrawal", "Transfer", "Payment"],
    []
  );

  const toggleStatus = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  }, []);

  const handleApply = useCallback(async () => {
    await saveFilters(filters);
    onApply(filters);
    onClose();
  }, [filters, saveFilters, onApply, onClose]);

  const handleClearAll = useCallback(async () => {
    const clearedFilters = {
      dateFrom: null,
      dateTo: null,
      status: [],
      category: [],
    };
    setFilters(clearedFilters);
    await clearSavedFilters();
    onClearAll();
  }, [clearSavedFilters, onClearAll]);

  const handleDateChange = useCallback(
    (event: any, selectedDate?: Date) => {
      if (event.type === "set" && selectedDate && activeDateField) {
        if (activeDateField === "from") {
          setFilters((prev) => ({ ...prev, dateFrom: selectedDate }));
        } else if (activeDateField === "to") {
          setFilters((prev) => ({ ...prev, dateTo: selectedDate }));
        }
      }
    },
    [activeDateField]
  );

  const handleDatePickerDone = useCallback(() => {
    setShowDatePicker(false);
    setActiveDateField(null);
  }, []);

  const openDatePicker = useCallback((field: "from" | "to") => {
    setActiveDateField(field);
    setShowDatePicker(true);
  }, []);

  const formatDate = useCallback((date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const renderCheckbox = useCallback(
    (checked: boolean) => (
      <View
        className={`w-5 h-5 border border-gray-400 rounded ${
          checked ? "bg-transparent" : "bg-transparent"
        }`}
      >
        {checked && (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="checkmark" size={16} color="#FF2C55" />
          </View>
        )}
      </View>
    ),
    []
  );

  return (
    <BottomModal visible={visible} onClose={onClose} title="Filter">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-3">
            Date range
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-gray-300 text-sm mb-2">From</Text>
              <TouchableOpacity
                className={`flex-row items-center justify-between border rounded-[16px] px-4 py-3 ${
                  activeDateField === "from"
                    ? "border-white"
                    : "border-gray-400"
                }`}
                onPress={() => openDatePicker("from")}
              >
                <Text
                  className={`${filters.dateFrom ? "text-white" : "text-gray-400"}`}
                >
                  {filters.dateFrom ? formatDate(filters.dateFrom) : "Select"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-gray-300 text-sm mb-2">To</Text>
              <TouchableOpacity
                className={`flex-row items-center justify-between border rounded-[16px] px-4 py-3 ${
                  activeDateField === "to" ? "border-white" : "border-gray-400"
                }`}
                onPress={() => openDatePicker("to")}
              >
                <Text
                  className={`${filters.dateTo ? "text-white" : "text-gray-400"}`}
                >
                  {filters.dateTo ? formatDate(filters.dateTo) : "Select"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={handleDatePickerDone}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-[#434447] rounded-t-[28px] p-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-lg font-semibold">
                    Select {activeDateField === "from" ? "From" : "To"} Date
                  </Text>
                  <TouchableOpacity onPress={handleDatePickerDone}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={
                    activeDateField === "from"
                      ? filters.dateFrom || new Date()
                      : filters.dateTo || new Date()
                  }
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  style={{ backgroundColor: "#434447" }}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                />

                <TouchableOpacity
                  onPress={handleDatePickerDone}
                  className="bg-white rounded-[60px] py-3 mt-4"
                >
                  <Text className="text-[#2E2E31] text-center font-semibold text-lg">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <View className="h-px bg-gray-600 mb-6" />

        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-3">Status</Text>
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              className={`flex-row items-center justify-between py-3 px-2 rounded-lg ${
                filters.status.includes(status) ? "bg-gray-600" : ""
              }`}
              onPress={() => toggleStatus(status)}
            >
              <Text className="text-white text-base">{status}</Text>
              {renderCheckbox(filters.status.includes(status))}
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-px bg-gray-600 mb-6" />

        <View className="mb-6">
          <Text className="text-white text-lg font-semibold mb-3">
            Transaction category
          </Text>
          {categoryOptions.map((category) => (
            <TouchableOpacity
              key={category}
              className={`flex-row items-center justify-between py-3 px-2 rounded-lg ${
                filters.category.includes(category) ? "bg-gray-600" : ""
              }`}
              onPress={() => toggleCategory(category)}
            >
              <Text className="text-white text-base">{category}</Text>
              {renderCheckbox(filters.category.includes(category))}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="bg-[#434447] -mx-6 px-6 pt-10 pb-4 mb-0 rounded-t-2xl mt-6">
        <TouchableOpacity
          onPress={handleApply}
          className="bg-white rounded-[60px] py-3 mb-3 h-[46px]"
        >
          <Text className="text-[#2E2E31] text-center font-semibold text-lg">
            Apply
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClearAll}
          className="border border-gray-400 rounded-full py-2 h-[46px]"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Clear all
          </Text>
        </TouchableOpacity>
      </View>
    </BottomModal>
  );
}
