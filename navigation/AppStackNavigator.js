import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Wallet from '../screens/Wallet';
import WalletsScreen from '../screens/wallets';
import AddressBookScreen from '../screens/addressBook';
import Send from '../screens/Send';
import Receive from '../screens/Receive';
import Settings from '../screens/Settings';


const AppNavigator = createStackNavigator(
  {
    Wallet: {
      screen: Wallet,
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
      screen: Send,
      navigationOptions: {
        header: null,
      },
    },
    Receive: {
      screen: Receive,
      navigationOptions: {
        header: null,
      },
    },
    Settings: {
      screen: Settings,
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