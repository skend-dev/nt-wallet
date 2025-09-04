import React from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useLogout } from "../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const logoutMutation = useLogout();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutMutation.mutateAsync();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-wallet-bg">
      <View className="pb-6 px-[18px]">
        <Text className="text-wallet-text-primary text-2xl font-bold text-center">
          Settings
        </Text>
      </View>

      <View className="flex-1 px-[18px]">
        <View className="bg-wallet-card rounded-2xl p-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("InfoLimits" as never)}
            className="flex-row items-center py-4"
          >
            <View className="w-12 h-12 bg-wallet-accent rounded-2xl items-center justify-center mr-4">
              <Ionicons name="information-circle" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-wallet-text-primary text-lg font-semibold">
                Info & Limits
              </Text>
              <Text className="text-wallet-text-muted text-sm">
                Fees, limits, and support information
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9FA6" />
          </TouchableOpacity>

          <View className="h-px bg-wallet-divider my-2" />

          <View className="flex-row justify-between items-center py-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-wallet-accent rounded-2xl items-center justify-center mr-4">
                <Ionicons name="notifications" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-wallet-text-primary text-lg font-semibold">
                  Push Notifications
                </Text>
                <Text className="text-wallet-text-muted text-sm">
                  Receive transaction alerts
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#434447", true: "#FF2C55" }}
              thumbColor={notificationsEnabled ? "#fff" : "#9E9FA6"}
            />
          </View>

          <View className="h-px bg-wallet-divider my-2" />

          <View className="flex-row justify-between items-center py-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-wallet-accent rounded-2xl items-center justify-center mr-4">
                <Ionicons name="moon" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-wallet-text-primary text-lg font-semibold">
                  Dark Mode
                </Text>
                <Text className="text-wallet-text-muted text-sm">
                  Always enabled in this app
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              disabled={true}
              trackColor={{ false: "#434447", true: "#FF2C55" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View className="mt-8">
          <TouchableOpacity
            className="bg-wallet-accent py-4 px-6 rounded-2xl"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
