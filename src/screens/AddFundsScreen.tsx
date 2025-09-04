import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface AddFundsForm {
  amount: string;
  method: "card" | "bank_transfer";
}

const AddFundsScreen: React.FC = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState<AddFundsForm>({
    amount: "",
    method: "card",
  });

  const [errors, setErrors] = useState<Partial<AddFundsForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMethodPicker, setShowMethodPicker] = useState(false);

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

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<AddFundsForm> = {};

    if (!form.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Please enter a valid positive amount";
      } else if (amount < 10) {
        newErrors.amount = "Minimum amount is $10";
      } else if (amount > 10000) {
        newErrors.amount = "Maximum amount is $10,000";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, "");
    const parts = cleanText.split(".");
    if (parts.length > 2) return;

    setForm((prev) => ({ ...prev, amount: cleanText }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleMethodChange = (method: "card" | "bank_transfer") => {
    setForm((prev) => ({ ...prev, method }));
    setShowMethodPicker(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Success!",
        `$${form.amount} has been added to your wallet via ${form.method === "card" ? "Card" : "Bank Transfer"}.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to add funds. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMethodDisplayName = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return "card-outline";
      case "bank_transfer":
        return "business-outline";
      default:
        return "card-outline";
    }
  };

  return (
    <View className="flex-1 bg-wallet-bg">
      <ScrollView
        className="flex-1 px-[18px]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="pt-6 pb-6">
          <Text className="text-wallet-text-primary text-3xl font-bold">
            Add Funds
          </Text>
          <Text className="text-wallet-text-muted text-base mt-2">
            Add money to your wallet using your preferred payment method
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-wallet-text-primary text-lg font-semibold mb-3">
            Amount
          </Text>
          <View className="bg-wallet-card rounded-2xl p-4">
            <View className="flex-row items-center">
              <Text className="text-wallet-text-primary text-xl font-semibold mr-2">
                $
              </Text>
              <TextInput
                value={form.amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor="#9E9FA6"
                keyboardType="decimal-pad"
                className="text-wallet-text-primary text-xl font-semibold flex-1"
              />
            </View>
            {errors.amount && (
              <Text className="text-red-400 text-sm mt-2">{errors.amount}</Text>
            )}
            <Text className="text-wallet-text-muted text-sm mt-2">
              Minimum: $10 • Maximum: $10,000
            </Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-wallet-text-primary text-lg font-semibold mb-3">
            Payment Method
          </Text>
          <TouchableOpacity
            onPress={() => setShowMethodPicker(true)}
            className="bg-wallet-card rounded-2xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-wallet-accent rounded-xl items-center justify-center mr-3">
                <Ionicons
                  name={getMethodIcon(form.method) as any}
                  size={16}
                  color="white"
                />
              </View>
              <View>
                <Text className="text-wallet-text-primary text-lg">
                  {getMethodDisplayName(form.method)}
                </Text>
                <Text className="text-wallet-text-muted text-sm">
                  {form.method === "card"
                    ? "Instant processing"
                    : "1-3 business days"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={20} color="#9E9FA6" />
          </TouchableOpacity>
        </View>

        <View className="bg-wallet-card rounded-2xl p-4 mb-8">
          <Text className="text-wallet-text-primary text-lg font-semibold mb-3">
            Payment Details
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-wallet-text-muted">Amount</Text>
              <Text className="text-wallet-text-primary font-semibold">
                ${form.amount || "0.00"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-wallet-text-muted">Method</Text>
              <Text className="text-wallet-text-primary font-semibold">
                {getMethodDisplayName(form.method)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-wallet-text-muted">Processing Time</Text>
              <Text className="text-wallet-text-primary font-semibold">
                {form.method === "card" ? "Instant" : "1-3 days"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-wallet-text-muted">Fee</Text>
              <Text className="text-wallet-text-primary font-semibold">
                {form.method === "card" ? "$2.50" : "Free"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || !form.amount}
          className={`rounded-3xl py-4 mb-8 ${
            isSubmitting || !form.amount
              ? "bg-wallet-divider"
              : "bg-wallet-accent"
          }`}
        >
          {isSubmitting ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-white font-semibold text-lg ml-2">
                Processing...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Add ${form.amount || "0.00"} to Wallet
            </Text>
          )}
        </TouchableOpacity>

        <View className="bg-wallet-card rounded-2xl p-4 mb-8">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-wallet-accent rounded-xl items-center justify-center mr-3 mt-1">
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color="white"
              />
            </View>
            <View className="flex-1">
              <Text className="text-wallet-text-primary font-semibold mb-2">
                Secure Payment
              </Text>
              <Text className="text-wallet-text-muted text-sm">
                Your payment information is encrypted and secure. We use
                industry-standard security measures to protect your data.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {showMethodPicker && (
        <View className="absolute inset-0 bg-black/50 justify-end">
          <View className="bg-wallet-card rounded-t-wallet-lg p-6">
            <Text className="text-wallet-text-primary text-xl font-bold mb-4">
              Select Payment Method
            </Text>

            <TouchableOpacity
              onPress={() => handleMethodChange("card")}
              className="flex-row items-center justify-between py-4 border-b border-wallet-divider"
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-wallet-accent rounded-xl items-center justify-center mr-3">
                  <Ionicons name="card-outline" size={16} color="white" />
                </View>
                <View>
                  <Text className="text-wallet-text-primary text-lg">
                    Credit/Debit Card
                  </Text>
                  <Text className="text-wallet-text-muted text-sm">
                    Instant processing • $2.50 fee
                  </Text>
                </View>
              </View>
              {form.method === "card" && (
                <Ionicons name="checkmark" size={20} color="#FF2C55" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleMethodChange("bank_transfer")}
              className="flex-row items-center justify-between py-4 border-b border-wallet-divider"
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-wallet-accent rounded-xl items-center justify-center mr-3">
                  <Ionicons name="business-outline" size={16} color="white" />
                </View>
                <View>
                  <Text className="text-wallet-text-primary text-lg">
                    Bank Transfer
                  </Text>
                  <Text className="text-wallet-text-muted text-sm">
                    1-3 business days • Free
                  </Text>
                </View>
              </View>
              {form.method === "bank_transfer" && (
                <Ionicons name="checkmark" size={20} color="#FF2C55" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMethodPicker(false)}
              className="mt-4 py-3"
            >
              <Text className="text-wallet-text-muted text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default AddFundsScreen;
