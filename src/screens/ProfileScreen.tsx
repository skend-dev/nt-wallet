import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
        Profile Screen
      </Text>

      <View className="bg-green-50 p-6 rounded-lg mb-6">
        <Text className="text-lg font-semibold mb-4 text-green-800">
          User Profile
        </Text>
        <Text className="text-base text-green-700 mb-2">Name: John Doe</Text>
        <Text className="text-base text-green-700 mb-2">
          Email: john.doe@example.com
        </Text>
        <Text className="text-base text-green-700">
          Member since: January 2024
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Settings" as never)}
        className="bg-orange-500 py-4 px-6 rounded-lg"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Go to Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
}
