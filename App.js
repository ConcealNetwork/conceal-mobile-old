import React from "react";
import { BottomNavigation, Text } from 'react-native-paper';
import { createStackNavigator, createAppContainer } from "react-navigation";

import SendScreen from "./pages/send.js";
import LoginScreen from "./pages/login.js";
import WalletScreen from "./pages/wallet.js";
import WalletsScreen from "./pages/wallets.js";

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    Wallets: {
      screen: WalletsScreen,
      navigationOptions: {
        header: null
      }
    },
    Wallet: {
      screen: WalletScreen,
      navigationOptions: {
        header: null
      }
    },
    Send: {
      screen: SendScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    headerMode: "screen",
    cardStyle: { backgroundColor: "#282d31" }
  }
);

export default createAppContainer(AppNavigator);