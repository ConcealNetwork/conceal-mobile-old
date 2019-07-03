import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoading';
import Auth from './AuthNavigator';
import App from './AppStackNavigator';


export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth,
    App,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
