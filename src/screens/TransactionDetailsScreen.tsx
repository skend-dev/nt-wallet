import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TransactionDisplay } from "../types/wallet";
import { StarIcon } from "../components/icons";

interface TransactionDetailsScreenProps {}

interface RouteParams {
  transaction: TransactionDisplay;
}

const TransactionDetailsScreen: React.FC<
  TransactionDetailsScreenProps
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const transaction = (route.params as RouteParams)?.transaction;

  if (!transaction) {
    return (
      <View className="flex-1 bg-[#222222] justify-center items-center">
        <Text className="text-white text-lg">Transaction not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 px-6 py-3 bg-[#8B5CF6] rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDownloadReceipt = () => {
    Alert.alert(
      "Download Receipt",
      "Receipt download functionality would be implemented here",
      [{ text: "OK" }]
    );
  };

  const handleRepeatPayout = () => {
    Alert.alert(
      "Repeat Payout",
      "Repeat payout functionality would be implemented here",
      [{ text: "OK" }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "successful":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Declined";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "in":
        return "Income";
      case "out":
        return "Expense";
      default:
        return type;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="flex-1 bg-[#222222]">
      <View className="pt-6 pb-6 px-[18px]">
        <Text className="text-white text-[24px] font-bold">
          Transaction details
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-[18px]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="bg-[#2E2E31] rounded-[20px] p-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-[16px] font-medium">
              {getTypeText(transaction.type)}
            </Text>
            <View className="w-8 h-8 bg-gray-600 rounded items-center justify-center">
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#9CA3AF"
              />
            </View>
          </View>
          <Text className="text-white text-[18px] font-bold">
            {transaction.formattedAmount}
          </Text>
        </View>

        <View className="bg-[#2E2E31] rounded-[20px] p-6 mb-6">
          <View className="gap-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-[#D7D8DE] text-sm">Wallet</Text>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-2">
                  {transaction.currency === "EUR" ? (
                    <StarIcon size={20} />
                  ) : (
                    <Text className="text-white text-xs font-bold">
                      {transaction.currency === "USD"
                        ? "$"
                        : transaction.currency === "GBP"
                          ? "£"
                          : transaction.currency.charAt(0)}
                    </Text>
                  )}
                </View>
                <Text className="text-white text-base">
                  {transaction.currency}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#D7D8DE] text-sm">Transaction type</Text>
              <Text className="text-white text-base">
                {getTypeText(transaction.type)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#D7D8DE] text-sm">Payer name</Text>
              <Text className="text-white text-base">Admin</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#D7D8DE] text-sm">Status</Text>
              <Text
                className={`text-base font-semibold ${getStatusColor(transaction.status)}`}
              >
                {getStatusText(transaction.status)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#D7D8DE] text-sm">
                <Text className="text-[#D7D8DE] text-sm">
                  Transaction number
                </Text>
              </Text>
              <Text className="text-white text-base">
                #{transaction.reference}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#D7D8DE] text-sm">Payment date</Text>
              <Text className="text-white text-base">
                {formatDate(transaction.timestamp)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#D7D8DE] text-sm">Current balance</Text>
              <Text className="text-white text-base">
                {transaction.amount.toFixed(2)} {transaction.currency}
              </Text>
            </View>

            <View className="h-px bg-gray-600 my-4" />

            <View>
              <Text className="text-[#D7D8DE] text-sm mb-2">Details</Text>
              <Text className="text-white text-sm font-medium">
                {transaction.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-[18px] pb-8 bg-[#434447] pt-8 rounded-t-[28px]">
        <TouchableOpacity
          onPress={handleRepeatPayout}
          className="bg-wallet-accent rounded-full py-4 mb-4"
        >
          <Text className="text-white text-center font-medium text-base">
            Repeat payout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDownloadReceipt}
          className="border border-white rounded-full py-4"
        >
          <Text className="text-white text-center font-medium text-base">
            Download receipt
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionDetailsScreen;
