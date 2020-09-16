import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Wallet from '../screens/Wallet';
import Wallets from '../screens/Wallets';
import AddressBook from '../screens/AddressBook';
import EditAddress from '../screens/EditAddress';
import SendMessage from '../screens/SendMessage';
import SendMessageConfirm from '../screens/SendMessageConfirm';
import Messages from '../screens/Messages';
import SendPayment from '../screens/Send';
import SendConfirm from '../screens/SendConfirm';
import AppMenu from '../screens/AppMenu';
import Receive from '../screens/Receive';
import Settings from '../screens/Settings';
import CreateDeposit from '../screens/CreateDeposit';
import CreateDepositConfirm from '../screens/CreateDepositConfirm';
import Deposits from '../screens/Deposits';
import Scanner from '../screens/Scanner';
import Market from '../screens/Market';


const AppNavigator = createStackNavigator(
  {
    Wallet: {
      screen: Wallet,
      navigationOptions: {
        header: null,
      }
    },
    Wallets: {
      screen: Wallets,
      navigationOptions: {
        header: null,
      }
    },
    AddressBook: {
      screen: AddressBook,
      navigationOptions: {
        header: null,
      }
    },
    SendPayment: {
      screen: SendPayment,
      navigationOptions: {
        header: null,
      },
    },
    SendConfirm: {
      screen: SendConfirm,
      navigationOptions: {
        header: null,
      }
    },
    Receive: {
      screen: Receive,
      navigationOptions: {
        header: null,
      }
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        header: null,
      }
    },
    Market: {
      screen: Market,
      navigationOptions: {
        header: null,
      }
    },
    Scanner: {
      screen: Scanner,
      navigationOptions: {
        header: null,
      }
    },
    EditAddress: {
      screen: EditAddress,
      navigationOptions: {
        header: null,
      }
    },
    Messages: {
      screen: Messages,
      navigationOptions: {
        header: null,
      }
    },
    SendMessage: {
      screen: SendMessage,
      navigationOptions: {
        header: null,
      }
    },
    SendMessageConfirm: {
      screen: SendMessageConfirm,
      navigationOptions: {
        header: null,
      }
    },
    AppMenu: {
      screen: AppMenu,
      navigationOptions: {
        header: null,
      }
    },
    Deposits: {
      screen: Deposits,
      navigationOptions: {
        header: null,
      }
    },
    CreateDeposit: {
      screen: CreateDeposit,
      navigationOptions: {
        header: null,
      }
    },
    CreateDepositConfirm: {
      screen: CreateDepositConfirm,
      navigationOptions: {
        header: null,
      }
    }
  },
  {
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#282d31' },
  });

export default createAppContainer(AppNavigator);
