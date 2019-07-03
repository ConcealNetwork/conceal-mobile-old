import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import AuthLoadingScreen from '../screens/AuthLoading';
import AddressBookScreen from '../screens/addressBook';
import SettingsScreen from '../screens/Settings';
import ReceiveScreen from '../screens/Receive';
import WalletsScreen from '../screens/wallets';
import WalletScreen from '../screens/wallet';
import SendScreen from '../screens/Send';
import Login from '../screens/Login';

const AppNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
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
    Wallets: {
      screen: WalletsScreen,
      navigationOptions: {
        header: null
      }
    },
    AddressBook: {
      screen: AddressBookScreen,
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
  });

export default createAppContainer(AppNavigator);