import React, { memo } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WalletIcon from "../icons/WalletIcon";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  onAction?: () => void;
}

const EmptyState = memo(function EmptyState({
  title,
  subtitle,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="bg-[#2E2E31] mx-[18px] h-[280px] rounded-3xl items-center justify-center">
      <View className="w-16 h-16 items-center justify-center mb-6">
        <Image
          source={require("../../../assets/money-bag.png")}
          width={50}
          height={50}
          fadeDuration={200}
          resizeMethod="resize"
        />
      </View>

      <Text className="text-white text-[16px] font-medium text-center mb-3">
        {title}
      </Text>

      <Text className="w-[212px] text-[#D7D8DE] text-sm text-center">
        {subtitle}
      </Text>
    </View>
  );
});

export default EmptyState;
