import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import ReduxProvider from "./src/providers/ReduxProvider";
import QueryProvider from "./src/providers/QueryProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import { View, Text, ActivityIndicator } from "react-native";
import { useAppDispatch, useAppSelector } from "./src/store";
import {
  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailure,
} from "./src/store/slices/authSlice";
import { apiService } from "./src/services/api";
import { offlineCacheService } from "./src/services/offlineCache";

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, accessToken } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(checkAuthStart());
      try {
        const token = await apiService.getStoredToken();
        if (token) {
          dispatch(checkAuthSuccess(token));
        } else {
          dispatch(checkAuthFailure());
        }
      } catch (error) {
        dispatch(checkAuthFailure());
      }
    };

    checkAuth();
  }, [dispatch]);

  // Seed cache when user is authenticated
  useEffect(() => {
    const seedCacheOnAuth = async () => {
      if (isAuthenticated && accessToken) {
        try {
          // Try to fetch fresh data and seed cache
          const [balances, transactionsResponse] = await Promise.all([
            apiService.getBalances(),
            apiService.getTransactions(1, 50), // Get up to 50 transactions for seeding
          ]);

          await offlineCacheService.seedCache(
            balances,
            transactionsResponse.transactions
          );
        } catch (error) {
          console.log(
            "Could not seed cache on auth, will use existing cache if available:",
            error
          );
        }
      }
    };

    seedCacheOnAuth();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#222222",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FF2C55" />
        <Text style={{ color: "white", marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  return <RootNavigator />;
}

function RootNavigator() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <QueryProvider>
          <StatusBar style="light" />
          <AppContent />
        </QueryProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
