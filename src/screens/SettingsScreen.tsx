import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
        Settings
      </Text>

      <View className="space-y-4">
        <View className="bg-gray-50 p-4 rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              Push Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </View>

        <View className="bg-gray-50 p-4 rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              Dark Mode
            </Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={darkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </View>

        <TouchableOpacity className="bg-red-500 py-4 px-6 rounded-lg">
          <Text className="text-white text-center font-semibold text-lg">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-gray-500 py-4 px-6 rounded-lg mt-6"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
