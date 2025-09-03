import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
        Details Screen
      </Text>

      <View className="bg-gray-50 p-6 rounded-lg mb-6">
        <Text className="text-lg text-gray-700 mb-4">
          This is a details screen that demonstrates navigation between screens.
        </Text>
        <Text className="text-base text-gray-600">
          You can navigate back to the home screen using the back button or the
          button below.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-blue-500 py-4 px-6 rounded-lg"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
