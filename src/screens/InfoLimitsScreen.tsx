import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface InfoBlock {
  id: string;
  title: string;
  icon: string;
  items: {
    label: string;
    value: string;
    description?: string;
  }[];
}

const InfoLimitsScreen: React.FC = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: "none" },
      });

      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            backgroundColor: "#434447",
            borderTopWidth: 0,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            height: 72,
            paddingBottom: 20,
            paddingTop: 10,
          },
        });
      };
    }, [navigation])
  );

  const infoBlocks: InfoBlock[] = [
    {
      id: "fees",
      title: "Fees & Charges",
      icon: "card-outline",
      items: [
        {
          label: "Card Payments",
          value: "$2.50",
          description: "Per transaction",
        },
        {
          label: "Bank Transfers",
          value: "Free",
          description: "No additional charges",
        },
        {
          label: "International Transfers",
          value: "1.5%",
          description: "Of transaction amount",
        },
        {
          label: "Express Processing",
          value: "$5.00",
          description: "Same-day processing",
        },
      ],
    },
    {
      id: "limits",
      title: "Transaction Limits",
      icon: "shield-checkmark-outline",
      items: [
        {
          label: "Daily Limit",
          value: "$10,000",
          description: "Maximum per day",
        },
        {
          label: "Monthly Limit",
          value: "$50,000",
          description: "Maximum per month",
        },
        {
          label: "Minimum Transfer",
          value: "$10",
          description: "Minimum amount",
        },
        {
          label: "Maximum Transfer",
          value: "$25,000",
          description: "Maximum single transaction",
        },
      ],
    },
    {
      id: "processing",
      title: "Processing Times",
      icon: "time-outline",
      items: [
        {
          label: "Card Payments",
          value: "Instant",
          description: "Immediate processing",
        },
        {
          label: "Bank Transfers",
          value: "1-3 days",
          description: "Business days",
        },
        {
          label: "International",
          value: "3-5 days",
          description: "Business days",
        },
        {
          label: "Weekend Processing",
          value: "Delayed",
          description: "Processed next business day",
        },
      ],
    },
    {
      id: "security",
      title: "Security & Protection",
      icon: "lock-closed-outline",
      items: [
        {
          label: "Data Encryption",
          value: "256-bit SSL",
          description: "Bank-level security",
        },
        {
          label: "Fraud Protection",
          value: "24/7",
          description: "Continuous monitoring",
        },
        {
          label: "Insurance Coverage",
          value: "$250,000",
          description: "Per account",
        },
        {
          label: "Two-Factor Auth",
          value: "Required",
          description: "Enhanced security",
        },
      ],
    },
  ];

  const supportInfo = [
    {
      title: "Customer Support",
      icon: "headset-outline",
      contact: "support@walletapp.com",
      hours: "24/7",
    },
    {
      title: "Technical Support",
      icon: "construct-outline",
      contact: "tech@walletapp.com",
      hours: "Mon-Fri 9AM-6PM",
    },
    {
      title: "Business Inquiries",
      icon: "business-outline",
      contact: "business@walletapp.com",
      hours: "Mon-Fri 9AM-5PM",
    },
  ];

  const renderInfoBlock = (block: InfoBlock) => (
    <View key={block.id} className="bg-wallet-card rounded-3xl p-6 mb-6">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-wallet-accent rounded-xl items-center justify-center mr-3">
          <Ionicons name={block.icon as any} size={20} color="white" />
        </View>
        <Text className="text-wallet-text-primary text-xl font-bold">
          {block.title}
        </Text>
      </View>

      <View className="space-y-4">
        {block.items.map((item, index) => (
          <View key={index} className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <Text className="text-wallet-text-primary font-semibold text-base">
                {item.label}
              </Text>
              {item.description && (
                <Text className="text-wallet-text-muted text-sm mt-1">
                  {item.description}
                </Text>
              )}
            </View>
            <Text className="text-wallet-accent font-bold text-base">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSupportBlock = (support: any) => (
    <View key={support.title} className="bg-wallet-card rounded-3xl p-6 mb-6">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-wallet-accent rounded-xl items-center justify-center mr-3">
          <Ionicons name={support.icon as any} size={20} color="white" />
        </View>
        <Text className="text-wallet-text-primary text-xl font-bold">
          {support.title}
        </Text>
      </View>

      <View className="space-y-3">
        <View className="flex-row items-center">
          <Ionicons name="mail-outline" size={16} color="#9E9FA6" />
          <Text className="text-wallet-text-primary ml-2">
            {support.contact}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#9E9FA6" />
          <Text className="text-wallet-text-muted ml-2">{support.hours}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-wallet-bg">
      <View className="pt-6 pb-6 px-[18px]">
        <Text className="text-wallet-text-primary text-3xl font-bold">
          Info & Limits
        </Text>
        <Text className="text-wallet-text-muted text-base mt-2">
          Important information about fees, limits, and support
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-[18px]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {infoBlocks.map(renderInfoBlock)}

        <View className="mb-6">
          <Text className="text-wallet-text-primary text-2xl font-bold mb-4">
            Support
          </Text>
          {supportInfo.map(renderSupportBlock)}
        </View>

        <View className="bg-wallet-card rounded-3xl p-6 mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-wallet-accent rounded-xl items-center justify-center mr-3">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="white"
              />
            </View>
            <Text className="text-wallet-text-primary text-xl font-bold">
              Important Notes
            </Text>
          </View>

          <View className="space-y-3">
            <Text className="text-wallet-text-muted text-sm">
              • All fees are subject to change with 30 days notice
            </Text>
            <Text className="text-wallet-text-muted text-sm">
              • Limits may vary based on account verification level
            </Text>
            <Text className="text-wallet-text-muted text-sm">
              • Processing times may be extended during holidays
            </Text>
            <Text className="text-wallet-text-muted text-sm">
              • Contact support for higher limits or special requests
            </Text>
            <Text className="text-wallet-text-muted text-sm">
              • All transactions are monitored for security purposes
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {}}
          className="bg-wallet-accent rounded-3xl py-4 mb-8"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text className="text-white font-semibold text-lg ml-2">
              Contact Support
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default InfoLimitsScreen;
