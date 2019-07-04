import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Wallet from '../screens/Wallet';
import Wallets from '../screens/Wallets';
import AddressBook from '../screens/AddressBook';
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
      screen: Wallets,
      navigationOptions: {
        header: null,
      },
    },
    AddressBook: {
      screen: AddressBook,
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
