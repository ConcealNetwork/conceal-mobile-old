import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import AddressBookScreen from '../screens/addressBook';
import WalletsScreen from '../screens/wallets';
import WalletScreen from '../screens/wallet';
import SendScreen from '../screens/Send';
import SettingsScreen from '../screens/Settings';


const AppNavigator = createStackNavigator(
  {
    Wallet: {
      screen: WalletScreen,
      navigationOptions: {
        header: null,
      },
    },
    Wallets: {
      screen: WalletsScreen,
      navigationOptions: {
        header: null,
      },
    },
    AddressBook: {
      screen: AddressBookScreen,
      navigationOptions: {
        header: null,
      },
    },
    Send: {
      screen: SendScreen,
      navigationOptions: {
        header: null,
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#282d31' },
  });

export default createAppContainer(AppNavigator);
