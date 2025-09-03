import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "../store";
import { increment, decrement } from "../store/slices/counterSlice";

export default function HomeScreen() {
  const navigation = useNavigation();
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
        Welcome to NT Wallet
      </Text>

      <View className="bg-blue-50 p-6 rounded-lg mb-6">
        <Text className="text-lg font-semibold text-center mb-4 text-blue-800">
          Counter Example (Redux)
        </Text>
        <Text className="text-3xl font-bold text-center mb-4 text-blue-600">
          {count}
        </Text>
        <View className="flex-row justify-center space-x-4">
          <TouchableOpacity
            onPress={() => dispatch(decrement())}
            className="bg-red-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dispatch(increment())}
            className="bg-green-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Details" as never)}
        className="bg-purple-500 py-4 px-6 rounded-lg"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Go to Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}
