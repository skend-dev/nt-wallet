import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BalanceDisplay } from "../../types/wallet";
import {
  accessibilityLabels,
  accessibilityHints,
  hitSlop,
} from "../../utils/accessibility";
import { PlusIcon, SendIcon, BuildingIcon } from "../icons";

interface BalanceHeaderProps {
  balance: BalanceDisplay;
  onAddFunds: () => void;
  onSend: () => void;
}

export default function BalanceHeader({
  balance,
  onAddFunds,
  onSend,
}: BalanceHeaderProps) {
  return (
    <View
      className="px-6 pb-6 pt-[10px]"
      style={{ backgroundColor: "#222222" }}
    >
      <View className="flex-row items-center justify-center mb-2">
        <Text className="text-[#9E9FA6] text-sm font-normal">
          {balance.currency} balance
        </Text>
        <TouchableOpacity
          className="ml-2"
          accessibilityLabel="Balance information"
          accessibilityRole="button"
          hitSlop={hitSlop.small}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      <Text
        className="text-[#EFF0F4] text-[28px] font-medium text-center mb-[35px]"
        accessibilityLabel={`Balance: ${balance.formatted}`}
      >
        {balance.formatted}
      </Text>

      <View className="flex-row justify-center gap-[30px]">
        <TouchableOpacity
          onPress={onAddFunds}
          className="items-center justify-center"
          accessibilityLabel={accessibilityLabels.addFunds}
          accessibilityRole="button"
          accessibilityHint={accessibilityHints.addFunds}
          hitSlop={hitSlop.medium}
        >
          <View className="w-[48px] h-[48px] bg-[#FF2C55] rounded-[16px] items-center justify-center">
            <PlusIcon width={24} height={24} color="white" />
          </View>
          <Text className="text-[#E3E4E9] text-sm mt-[5px]">Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSend}
          className="items-center justify-center"
          accessibilityLabel={accessibilityLabels.sendMoney}
          accessibilityRole="button"
          accessibilityHint={accessibilityHints.sendMoney}
          hitSlop={hitSlop.medium}
        >
          <View className="w-[48px] h-[48px] bg-[#FF2C55] rounded-[16px] items-center justify-center">
            <SendIcon width={24} height={24} color="white" />
          </View>
          <Text className="text-[#E3E4E9] text-sm mt-[5px]">Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center justify-center"
          accessibilityLabel="View details"
          accessibilityRole="button"
          accessibilityHint="Opens wallet details"
        >
          <View className="w-[48px] h-[48px] bg-[#FF2C55] rounded-[16px] items-center justify-center">
            <BuildingIcon width={24} height={24} color="white" />
          </View>
          <Text className="text-[#E3E4E9] text-sm mt-[5px]">Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
