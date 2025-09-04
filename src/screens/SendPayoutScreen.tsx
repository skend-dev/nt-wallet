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
import { useWalletBalances } from "../hooks/useWallet";
import { useCreatePayout } from "../hooks/usePayout";

interface PayoutForm {
  amount: string;
  currency: string;
  destination: string;
  destinationType: "beneficiary" | "custom";
  note: string;
}

interface Beneficiary {
  id: string;
  name: string;
  account: string;
  bank: string;
}

const SendPayoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: balancesData } = useWalletBalances();
  const createPayoutMutation = useCreatePayout();

  const [currentStep, setCurrentStep] = useState<"form" | "review" | "success">(
    "form"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);

  const [form, setForm] = useState<PayoutForm>({
    amount: "",
    currency: "EUR",
    destination: "",
    destinationType: "beneficiary",
    note: "",
  });

  const [errors, setErrors] = useState<Partial<PayoutForm>>({});

  const beneficiaries: Beneficiary[] = [
    { id: "1", name: "John Doe", account: "****1234", bank: "Chase Bank" },
    {
      id: "2",
      name: "Jane Smith",
      account: "****5678",
      bank: "Bank of America",
    },
  ];

  const currencies = ["EUR", "USD", "GBP"];

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
    const newErrors: Partial<PayoutForm> = {};

    if (!form.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Please enter a valid positive amount";
      } else {
        const balance = balancesData?.find(
          (b) => b.currency_id === getCurrencyId(form.currency)
        );
        if (balance && amount > parseFloat(balance.available_balance)) {
          newErrors.amount = "Insufficient balance";
        }
      }
    }

    if (!form.destination) {
      newErrors.destination = "Destination is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, balancesData]);

  const getCurrencyId = (currency: string): number => {
    switch (currency) {
      case "EUR":
        return 1;
      case "USD":
        return 2;
      case "GBP":
        return 3;
      default:
        return 1;
    }
  };

  const getAvailableBalance = (currency: string): number => {
    const balance = balancesData?.find(
      (b) => b.currency_id === getCurrencyId(currency)
    );
    return balance ? parseFloat(balance.available_balance) : 0;
  };

  const handleAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, "");
    const parts = cleanText.split(".");
    if (parts.length > 2) return;

    setForm((prev) => ({ ...prev, amount: cleanText }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleDestinationChange = (
    destination: string,
    type: "beneficiary" | "custom"
  ) => {
    setForm((prev) => ({ ...prev, destination, destinationType: type }));
    setShowDestinationPicker(false);
    if (errors.destination) {
      setErrors((prev) => ({ ...prev, destination: undefined }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep("review");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payoutData = {
        wallet_id: 1,
        provider: "bank",
        amount: parseFloat(form.amount),
        currency_id: getCurrencyId(form.currency),
        bank_id:
          form.destinationType === "beneficiary"
            ? beneficiaries.find((b) => b.name === form.destination)?.id
            : undefined,
      };

      const payoutResponse = await createPayoutMutation.mutateAsync(payoutData);

      setCurrentStep("success");
    } catch (error: any) {
      let errorMessage = "Failed to send payout. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "review") {
      setCurrentStep("form");
    } else {
      navigation.goBack();
    }
  };

  const renderForm = () => (
    <ScrollView
      className="flex-1 px-[18px]"
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-6 pb-6">
        <Text className="text-wallet-text-primary text-3xl font-bold">
          Send Payout
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-wallet-text-primary text-lg font-semibold mb-3">
          Amount
        </Text>
        <View className="bg-wallet-card rounded-2xl p-4">
          <TextInput
            value={form.amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            placeholderTextColor="#9E9FA6"
            keyboardType="decimal-pad"
            className="text-wallet-text-primary text-xl font-semibold"
          />
          {errors.amount && (
            <Text className="text-red-400 text-sm mt-2">{errors.amount}</Text>
          )}
          <Text className="text-wallet-text-muted text-sm mt-2">
            Available: {getAvailableBalance(form.currency).toFixed(2)}{" "}
            {form.currency}
          </Text>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-wallet-text-primary text-lg font-semibold mb-3">
          Currency
        </Text>
        <TouchableOpacity
          onPress={() => setShowCurrencyPicker(true)}
          className="bg-wallet-card rounded-2xl p-4 flex-row items-center justify-between"
        >
          <Text className="text-wallet-text-primary text-lg">
            {form.currency}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9E9FA6" />
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <Text className="text-wallet-text-primary text-lg font-semibold mb-3">
          Destination
        </Text>
        <TouchableOpacity
          onPress={() => setShowDestinationPicker(true)}
          className="bg-wallet-card rounded-2xl p-4 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="text-wallet-text-primary text-lg">
              {form.destination || "Select destination"}
            </Text>
            {form.destinationType === "beneficiary" && form.destination && (
              <Text className="text-wallet-text-muted text-sm mt-1">
                {
                  beneficiaries.find((b) => b.name === form.destination)
                    ?.account
                }
              </Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color="#9E9FA6" />
        </TouchableOpacity>
        {errors.destination && (
          <Text className="text-red-400 text-sm mt-2">
            {errors.destination}
          </Text>
        )}
      </View>

      <View className="mb-8">
        <Text className="text-wallet-text-primary text-lg font-semibold mb-3">
          Note (Optional)
        </Text>
        <View className="bg-wallet-card rounded-2xl p-4">
          <TextInput
            value={form.note}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, note: text }))
            }
            placeholder="Add a note..."
            placeholderTextColor="#9E9FA6"
            multiline
            numberOfLines={3}
            className="text-wallet-text-primary text-base"
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleNext}
        className="bg-wallet-accent rounded-3xl py-4 mb-8"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderReview = () => (
    <ScrollView
      className="flex-1 px-[18px]"
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-6 pb-6">
        <Text className="text-wallet-text-primary text-3xl font-bold">
          Review Payout
        </Text>
      </View>

      <View className="bg-wallet-card rounded-3xl p-6 mb-6">
        <Text className="text-wallet-text-primary text-lg font-semibold mb-4">
          Payout Summary
        </Text>

        <View className="space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-wallet-text-muted">Amount</Text>
            <Text className="text-wallet-text-primary font-semibold">
              {form.amount} {form.currency}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-wallet-text-muted">Destination</Text>
            <View className="items-end">
              <Text className="text-wallet-text-primary font-semibold">
                {form.destination}
              </Text>
              {form.destinationType === "beneficiary" && (
                <Text className="text-wallet-text-muted text-sm">
                  {
                    beneficiaries.find((b) => b.name === form.destination)
                      ?.account
                  }
                </Text>
              )}
            </View>
          </View>

          {form.note && (
            <View className="flex-row justify-between">
              <Text className="text-wallet-text-muted">Note</Text>
              <Text className="text-wallet-text-primary font-semibold">
                {form.note}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className="bg-wallet-accent rounded-3xl py-4 mb-8"
      >
        {isSubmitting ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#fff" />
            <Text className="text-white font-semibold text-lg ml-2">
              Sending...
            </Text>
          </View>
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Send Payout
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSuccess = () => (
    <View className="flex-1 px-[18px] justify-center">
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-6">
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
        <Text className="text-wallet-text-primary text-2xl font-bold mb-2">
          Payout Sent!
        </Text>
        <Text className="text-wallet-text-muted text-center">
          Your payout has been successfully sent
        </Text>
      </View>

      <View className="bg-wallet-card rounded-2xl p-6 mb-8">
        <Text className="text-wallet-text-primary text-lg font-semibold mb-4">
          Transaction Details
        </Text>

        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-wallet-text-muted">Amount</Text>
            <Text className="text-wallet-text-primary font-semibold">
              {form.amount} {form.currency}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-wallet-text-muted">To</Text>
            <Text className="text-wallet-text-primary font-semibold">
              {form.destination}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-wallet-text-muted">Status</Text>
            <Text className="text-green-400 font-semibold">Completed</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-wallet-text-muted">Date</Text>
            <Text className="text-wallet-text-primary font-semibold">
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-wallet-accent rounded-2xl py-4 mb-4"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Done
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentStep("form");
          setForm({
            amount: "",
            currency: "EUR",
            destination: "",
            destinationType: "beneficiary",
            note: "",
          });
        }}
        className="border border-white rounded-2xl py-4"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Send Another
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrencyPicker = () => (
    <View className="absolute inset-0 bg-black/50 justify-end">
      <View className="bg-wallet-card rounded-t-[20px] p-6">
        <Text className="text-wallet-text-primary text-xl font-bold mb-4">
          Select Currency
        </Text>
        {currencies.map((currency) => (
          <TouchableOpacity
            key={currency}
            onPress={() => {
              setForm((prev) => ({ ...prev, currency }));
              setShowCurrencyPicker(false);
            }}
            className="flex-row items-center justify-between py-4 border-b border-wallet-divider"
          >
            <Text className="text-wallet-text-primary text-lg">{currency}</Text>
            {form.currency === currency && (
              <Ionicons name="checkmark" size={20} color="#FF2C55" />
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setShowCurrencyPicker(false)}
          className="mt-4 py-3"
        >
          <Text className="text-wallet-text-muted text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDestinationPicker = () => (
    <View className="absolute inset-0 bg-black/50 justify-end">
      <View className="bg-wallet-card rounded-t-[20px] p-6 max-h-96">
        <Text className="text-wallet-text-primary text-xl font-bold mb-4">
          Select Destination
        </Text>

        <Text className="text-wallet-text-muted text-sm mb-3">
          Saved Beneficiaries
        </Text>
        {beneficiaries.map((beneficiary) => (
          <TouchableOpacity
            key={beneficiary.id}
            onPress={() =>
              handleDestinationChange(beneficiary.name, "beneficiary")
            }
            className="flex-row items-center justify-between py-4 border-b border-wallet-divider"
          >
            <View>
              <Text className="text-wallet-text-primary text-lg">
                {beneficiary.name}
              </Text>
              <Text className="text-wallet-text-muted text-sm">
                {beneficiary.account} • {beneficiary.bank}
              </Text>
            </View>
            {form.destination === beneficiary.name && (
              <Ionicons name="checkmark" size={20} color="#FF2C55" />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => {
            setShowDestinationPicker(false);
            Alert.alert(
              "Custom Destination",
              "Custom destination form would open here"
            );
          }}
          className="flex-row items-center justify-between py-4 border-b border-wallet-divider"
        >
          <View>
            <Text className="text-wallet-text-primary text-lg">
              Custom Destination
            </Text>
            <Text className="text-wallet-text-muted text-sm">
              Enter new recipient details
            </Text>
          </View>
          <Ionicons name="add" size={20} color="#FF2C55" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowDestinationPicker(false)}
          className="mt-4 py-3"
        >
          <Text className="text-wallet-text-muted text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-wallet-bg">
      {currentStep === "form" && renderForm()}
      {currentStep === "review" && renderReview()}
      {currentStep === "success" && renderSuccess()}

      {showCurrencyPicker && renderCurrencyPicker()}
      {showDestinationPicker && renderDestinationPicker()}
    </View>
  );
};

export default SendPayoutScreen;
