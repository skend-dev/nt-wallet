import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import ReduxProvider from "./src/providers/ReduxProvider";
import QueryProvider from "./src/providers/QueryProvider";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <QueryProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </QueryProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
