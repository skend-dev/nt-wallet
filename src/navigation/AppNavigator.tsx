import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterIcon, LeftArrowIcon, WalletIconNew } from "../components/icons";
import FilterModal from "../components/ui/FilterModal";

import WalletHomeScreen from "../screens/WalletHomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import SendPayoutScreen from "../screens/SendPayoutScreen";
import AddFundsScreen from "../screens/AddFundsScreen";
import InfoLimitsScreen from "../screens/InfoLimitsScreen";
import Logo from "../components/icons/Logo";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TransactionsScreenWrapper({ navigation }: any) {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [modalKey, setModalKey] = useState(0);

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

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleFilterApply = (filters: any) => {
    setAppliedFilters(filters);
    navigation.setParams({ filters });
  };

  const handleFilterClearAll = async () => {
    setAppliedFilters(null);
    navigation.setParams({ filters: null });
    await AsyncStorage.removeItem("transaction_filters");
    setModalKey((prev) => prev + 1);
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleFilterPress}
          style={{ marginRight: 16 }}
        >
          <FilterIcon size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleFilterPress]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("clearFilters", () => {
      setModalKey((prev) => prev + 1);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <TransactionsScreen />
      <FilterModal
        key={`filter-modal-${modalKey}`}
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterApply}
        onClearAll={handleFilterClearAll}
      />
    </>
  );
}

function WalletStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WalletMain"
        component={WalletHomeScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "#222222",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => <Logo width={32} height={32} color="#FF2C55" />,
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        }}
      />
      <Stack.Screen
        name="Transactions"
        component={TransactionsScreenWrapper}
        options={({ navigation }) => ({
          title: "Transactions",
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            color: "#fff",
            fontWeight: "bold",
          },
          headerStyle: {
            backgroundColor: "#222222",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            color: "#fff",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <LeftArrowIcon size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        })}
      />
      <Stack.Screen
        name="SendPayout"
        component={SendPayoutScreen}
        options={{
          title: "Send Payout",
          headerStyle: {
            backgroundColor: "#222222",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            color: "#fff",
          },
        }}
      />
      <Stack.Screen
        name="AddFunds"
        component={AddFundsScreen}
        options={{
          title: "Add Funds",
          headerStyle: {
            backgroundColor: "#222222",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            color: "#fff",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "#222222",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="InfoLimits"
        component={InfoLimitsScreen}
        options={{
          title: "Info & Limits",
          headerStyle: {
            backgroundColor: "#222222",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            color: "#fff",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: "#222222" }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "WalletTab") {
              return <WalletIconNew size={size} color={color} />;
            } else if (route.name === "SettingsTab") {
              const iconName = focused ? "settings" : "settings-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            } else {
              return <Ionicons name="help-outline" size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: {
            backgroundColor: "#434447",
            borderTopWidth: 0,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            height: 72,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 4,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="WalletTab"
          component={WalletStack}
          options={{ title: "Wallet" }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStack}
          options={{ title: "Settings" }}
        />
      </Tab.Navigator>
    </View>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
        options={({ navigation }) => ({
          title: "",
          headerStyle: {
            backgroundColor: "#222222",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            color: "#fff",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <LeftArrowIcon size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: "#222222" }}>
      <RootNavigator />
    </View>
  );
}
