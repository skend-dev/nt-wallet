import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLogin } from "../hooks/useAuth";
import { ENV } from "../config/env";
import { apiService } from "../services/api";

export default function LoginScreen() {
  const loginMutation = useLogin();

  const handleLogin = () => {
    loginMutation.mutate();
  };

  return (
    <View
      className="flex-1 px-[18px] justify-center items-center"
      style={{ backgroundColor: "#222222" }}
    >
      <View className="items-center mb-16">
        <View className="w-20 h-20 bg-[#FF2C55]  rounded-[20px] items-center justify-center mb-6">
          <Ionicons name="wallet" size={40} color="white" />
        </View>
        <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
        <Text className="text-gray-400 text-base text-center">
          Sign in to access your wallet
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loginMutation.isPending}
        className="bg-[#FF2C55] rounded-[16px] py-4 px-8 items-center"
        activeOpacity={0.8}
      >
        {loginMutation.isPending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-white text-lg font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>

      <View className="mt-8 items-center">
        <Text className="text-gray-500 text-sm text-center">
          Using credentials:
        </Text>
        <Text className="text-gray-400 text-xs text-center mt-1">
          user@example.com / password123
        </Text>
      </View>

      {loginMutation.error && (
        <View className="mt-6 px-4 py-3 bg-red-900 rounded-lg">
          <Text className="text-red-200 text-sm text-center">
            {loginMutation.error.message}
          </Text>
        </View>
      )}
    </View>
  );
}
