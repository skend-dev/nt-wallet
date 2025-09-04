import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../store";
import { useAuthSelectors, usePrimaryBalance } from "../hooks/useAppSelectors";
import {
  useWalletBalances,
  useWalletTransactions,
  useRefreshWallet,
  useWalletFilters,
} from "../hooks/useWallet";
import { clearTransactions } from "../store/slices/walletSlice";
import BalanceHeader from "../components/ui/BalanceHeader";
import TransactionRow from "../components/ui/TransactionRow";
import EmptyState from "../components/ui/EmptyState";
import PromotionalCard from "../components/ui/PromotionalCard";
import { Transaction, TransactionDisplay } from "../types/wallet";
import { processTransactions } from "../utils/transactionUtils";

export default function WalletHomeScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { filters, updateFilters } = useWalletFilters();
  const { isAuthenticated } = useAuthSelectors();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-[#222222] justify-center items-center">
        <Text className="text-white text-lg">
          Please log in to view your wallet
        </Text>
      </View>
    );
  }

  const {
    data: balancesData,
    isLoading: balancesLoading,
    error: balancesError,
  } = useWalletBalances();

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
    error: transactionsError,
  } = useWalletTransactions(1, {});

  const refreshMutation = useRefreshWallet();
  const primaryBalance = usePrimaryBalance();

  const recentTransactions = useMemo(() => {
    if (!transactionsData || !transactionsData.transactions) return [];

    const transactions = transactionsData.transactions;
    const convertedTransactions = processTransactions(transactions);
    return convertedTransactions.slice(-3);
  }, [transactionsData]);

  const handleRefresh = useCallback(async () => {
    dispatch(clearTransactions());
    await refreshMutation.mutateAsync();
  }, [dispatch, refreshMutation]);

  const handleTransactionPress = useCallback(
    (transaction: TransactionDisplay) => {
      (navigation as any)
        .getParent()
        ?.navigate("TransactionDetails", { transaction });
    },
    [navigation]
  );

  const handleAddFunds = useCallback(() => {
    navigation.navigate("AddFunds" as never);
  }, [navigation]);

  const handleSend = useCallback(() => {
    navigation.navigate("SendPayout" as never);
  }, [navigation]);

  const handleOrderCard = useCallback(() => {
    Alert.alert(
      "Order Card",
      "Order card functionality will be implemented here"
    );
  }, []);

  const handleSeeAll = useCallback(() => {
    navigation.navigate("Transactions" as never);
  }, [navigation]);

  const renderTransactionItem = useCallback(
    ({ item }: { item: TransactionDisplay }) => (
      <TransactionRow transaction={item} onPress={handleTransactionPress} />
    ),
    [handleTransactionPress]
  );

  const renderFooter = useCallback(() => {
    if (!transactionsData || transactionsData.transactions.length <= 3)
      return null;

    return (
      <View className="items-center">
        <TouchableOpacity
          onPress={handleSeeAll}
          className="px-6"
          activeOpacity={0.8}
        >
          <Text
            className="text-white text-base font-medium"
            style={{ fontWeight: "500", fontSize: 16 }}
          >
            See all
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [transactionsData, handleSeeAll]);

  const renderEmptyState = useCallback(() => {
    if (transactionsLoading) return null;

    if (!transactionsData || transactionsData.transactions.length > 0)
      return null;

    return (
      <EmptyState
        title="There's nothing here yet"
        subtitle="Make your first transaction by adding money to your wallet."
        onAction={handleAddFunds}
      />
    );
  }, [transactionsLoading, transactionsData, handleAddFunds]);

  if (balancesError || transactionsError) {
    const errorMessage =
      balancesError?.message ||
      transactionsError?.message ||
      "An error occurred";
    return (
      <View className="flex-1 bg-[#222222] justify-center items-center px-4">
        <Text className="text-red-400 text-lg font-semibold mb-4">Error</Text>
        <Text className="text-gray-400 text-center mb-6">{errorMessage}</Text>
        <Text
          className="text-red-400 font-medium"
          onPress={handleRefresh}
          accessibilityRole="button"
          accessibilityLabel="Retry loading wallet data"
        >
          Try Again
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: "#222222" }}>
      <BalanceHeader
        balance={primaryBalance}
        onAddFunds={handleAddFunds}
        onSend={handleSend}
      />

      <PromotionalCard onPress={handleOrderCard} />

      <View className="flex-1 bg-[#2E2E31] mx-[18px] rounded-[20px]">
        <FlatList
          data={recentTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={
                balancesLoading ||
                transactionsLoading ||
                refreshMutation.isPending
              }
              onRefresh={handleRefresh}
              tintColor="#EF4444"
              colors={["#EF4444"]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: recentTransactions.length === 0 ? 1 : 0,
          }}
          accessibilityLabel="Transactions list"
          accessibilityRole="list"
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={5}
          windowSize={10}
        />
      </View>
    </View>
  );
}
