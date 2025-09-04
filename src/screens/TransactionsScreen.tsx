import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWalletTransactions } from "../hooks/useWallet";
import {
  Transaction,
  TransactionDisplay,
  TransactionFilters,
} from "../types/wallet";
import {
  processTransactions,
  groupTransactionsByMonth,
} from "../utils/transactionUtils";

interface GroupedTransaction {
  month: string;
  monthKey: string;
  transactions: TransactionDisplay[];
}
import TransactionRow from "../components/ui/TransactionRow";

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [filters, setFilters] = useState<TransactionFilters>({});

  const routeFilters = (route.params as any)
    ?.filters as TransactionFilters | null;

  const activeFilters = routeFilters || filters;

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
    error: transactionsError,
  } = useWalletTransactions(1, activeFilters);

  const groupedTransactions = useMemo(() => {
    if (!transactionsData || !transactionsData.transactions) return [];

    const transactions = transactionsData.transactions;
    const convertedTransactions = processTransactions(transactions);
    return groupTransactionsByMonth(convertedTransactions);
  }, [transactionsData, routeFilters]);

  const handleRefresh = useCallback(async () => {
    await refetchTransactions();
  }, [refetchTransactions]);

  const handleTransactionPress = useCallback(
    (transaction: TransactionDisplay) => {
      (navigation as any)
        .getParent()
        ?.navigate("TransactionDetails", { transaction });
    },
    [navigation]
  );

  const renderMonthHeader = useCallback(
    ({ item }: { item: GroupedTransaction }) => (
      <View className="px-4 py-3">
        <Text className="text-white font-bold text-lg mb-2">{item.month}</Text>
        <View className="h-px bg-gray-700" />
      </View>
    ),
    []
  );

  const renderTransactionItem = useCallback(
    ({ item }: { item: TransactionDisplay }) => (
      <TransactionRow transaction={item} onPress={handleTransactionPress} />
    ),
    [handleTransactionPress]
  );

  const renderMonthSection = useCallback(
    ({ item }: { item: GroupedTransaction }) => (
      <View>
        {renderMonthHeader({ item })}
        {item.transactions.map((transaction) => (
          <View key={transaction.id}>
            {renderTransactionItem({ item: transaction })}
          </View>
        ))}
      </View>
    ),
    [renderMonthHeader, renderTransactionItem]
  );

  if (transactionsLoading && !transactionsData) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "#222222" }}
      >
        <ActivityIndicator size="large" color="#FF2C55" />
        <Text className="text-gray-400 text-lg mt-4">
          Loading transactions...
        </Text>
      </View>
    );
  }

  if (transactionsError) {
    return (
      <View
        className="flex-1 justify-center items-center px-4"
        style={{ backgroundColor: "#222222" }}
      >
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-red-400 text-xl font-semibold mb-4 mt-4">
          Oops!
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          We couldn't load your transactions. Please check your connection and
          try again.
        </Text>
        <TouchableOpacity
          onPress={handleRefresh}
          className="bg-[#FF2C55] px-8 py-4 rounded-lg"
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderEmptyState = () => {
    const filters = (route.params as any)?.filters;
    const hasFilters =
      filters &&
      (filters.dateFrom ||
        filters.dateTo ||
        (filters.status && filters.status.length > 0) ||
        (filters.category && filters.category.length > 0));

    return (
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons
          name={hasFilters ? "search-outline" : "receipt-outline"}
          size={64}
          color="#9CA3AF"
        />
        <Text className="text-white text-xl font-semibold mb-2 mt-6">
          {hasFilters ? "No matching transactions" : "No transactions yet"}
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          {hasFilters
            ? "Try adjusting your filters to see more results."
            : "Your transaction history will appear here once you start using your wallet."}
        </Text>
        {hasFilters && (
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("transaction_filters");
              (navigation as any).setParams({ filters: null });
              (navigation as any).emit("clearFilters");
            }}
            className="bg-[#FF2C55] px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#222222" }}>
      <View className="flex-1 bg-[#2E2E31] mx-[18px] rounded-[20px] mt-3">
        {groupedTransactions.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={groupedTransactions}
            renderItem={renderMonthSection}
            keyExtractor={(item) => item.monthKey}
            refreshControl={
              <RefreshControl
                refreshing={transactionsLoading}
                onRefresh={handleRefresh}
                tintColor="#EF4444"
                colors={["#EF4444"]}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingTop: 10,
            }}
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="automatic"
            accessibilityLabel="Transactions list grouped by month"
            accessibilityRole="list"
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={100}
            initialNumToRender={3}
            windowSize={5}
          />
        )}
      </View>
    </View>
  );
}
