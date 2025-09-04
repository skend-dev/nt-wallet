import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TransactionDisplay } from "../../types/wallet";

interface TransactionRowProps {
  transaction: TransactionDisplay;
  onPress?: (transaction: TransactionDisplay) => void;
}

const TransactionRow = memo(function TransactionRow({
  transaction,
  onPress,
}: TransactionRowProps) {
  const getTypeColor = (type: TransactionDisplay["type"]) => {
    switch (type) {
      case "in":
        return "text-white";
      case "out":
        return "text-white";
      case "fee":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusColor = (status: TransactionDisplay["status"]) => {
    switch (status) {
      case "successful":
        return "text-green-400";
      case "pending":
        return "text-gray-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: TransactionDisplay["status"]) => {
    switch (status) {
      case "successful":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Declined";
      default:
        return "Unknown";
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(transaction)}
      className="mx-4 mb-3 p-4 rounded-xl"
      accessibilityLabel={`Transaction: ${transaction.description}, ${transaction.formattedAmount}`}
      accessibilityRole="button"
      accessibilityHint="Tap to view transaction details"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-white font-normal text-base" numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text className="text-[#D7D8DE] text-sm mt-1">
            {transaction.date}
          </Text>
        </View>

        <View className="items-end">
          <Text
            className={`text-lg font-bold ${getTypeColor(transaction.type)}`}
          >
            {transaction.formattedAmount}
          </Text>
          <Text
            className={`text-sm font-medium mt-1 ${getStatusColor(transaction.status)}`}
          >
            {getStatusText(transaction.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default TransactionRow;
