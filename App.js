import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, LogBox, Platform, StatusBar, View, } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FlashMessage from 'react-native-flash-message';
import { WalkthroughProvider } from 'react-native-walkthrough';
import AppContextProvider, { AuthContext } from './components/ContextProvider';
import AppStyles from './components/Style';
import ConcealLoader from './components/ccxLoader';
import useAppState from './components/useAppState';
import ApiHelper from './helpers/ApiHelper';
import AuthHelper from './helpers/AuthHelper';
import { showMessageDialog } from './helpers/utils';
import AddressBook from './screens/AddressBook';
import AppMenu from './screens/AppMenu';
import CreateDeposit from './screens/CreateDeposit';
import CreateDepositConfirm from './screens/CreateDepositConfirm';
import Deposits from './screens/Deposits';
import EditAddress from './screens/EditAddress';
import Login from './screens/Login';
import Market from './screens/Market';
import Messages from './screens/Messages';
import Receive from './screens/Receive';
import Scanner from './screens/Scanner';
import SendPayment from './screens/Send';
import SendConfirm from './screens/SendConfirm';
import SendMessage from './screens/SendMessage';
import SendMessageConfirm from './screens/SendMessageConfirm';
import Settings from './screens/Settings';
import Wallet from './screens/Wallet';
import Wallets from './screens/Wallets';


// add locales for android
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/en-GB');
}

// supress the timer warnings
LogBox.ignoreLogs(['Setting a timer']);

// build only once
EStyleSheet.build({
  $rem: Dimensions.get('window').width / 360
});

// create the stack
const Stack = createNativeStackNavigator();

const App = props => {
  const [state, dispatch, updatedState] = useAppState();
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  let Api;
  let Auth;

  useEffect(() => {
    const bootstrapAsync = async () => {
      Auth = new AuthHelper(state.appSettings.apiURL);
      Api = new ApiHelper({ Auth, state });
      let token;
      try {
        token = await SecureStore.getItemAsync('Conceal.id_token');
        if (token) dispatch({ type: 'USER_LOGGED_IN' });
      } catch (e) {
        // err
      }
    };

    bootstrapAsync();
  }, []);

  const authActions = useMemo(() => ({
    loginUser: async options => {
      options.uuid = Constants.installationId;
      let message;

      dispatch({ type: 'USER_LOGIN_STARTED', value: true });
      dispatch({ type: 'FORM_SUBMITTED', value: true });

      Auth.setRememberme(options.rememberMe ? 'TRUE' : 'FALSE');
      Auth.setUsername(options.email);
      Auth.login(options)
        .then(res => {
          if (res.result === 'success') {
            dispatch({ type: 'USER_LOGGED_IN' });
          } else {
            message = res.message;
            dispatch({ type: 'USER_LOGIN_FAILED' });
            showMessageDialog(message, 'error');
          }
        })
        .catch(err => showMessageDialog(`ERROR ${err}`, 'error'))
        .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
    },
    logoutUser: () => {
      Auth.logout();
      dispatch({ type: 'CLEAR_APP' });
    },
    signUpUser: async options => {
      const { userName, email, password } = options;
      let message;
      let msgType;
      dispatch({ type: 'FORM_SUBMITTED', value: true });
      Api.signUpUser(userName, email, password)
        .then(res => {
          message = res.message;
          if (res.result === 'success') {
            Auth.setUsername(email);
            message = 'Please check your email and follow the instructions to activate your account.';
            msgType = 'info';
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = `ERROR ${err}`; })
        .finally(() => {
          dispatch({ type: 'FORM_SUBMITTED', value: false });
          showMessageDialog(message, msgType);
        });
    },
    resetPassword: async options => {
      const { email } = options;
      let message;
      let msgType;
      Api.resetPassword(email)
        .then(res => {
          message = res.message;
          if (res.result === 'success') {
            message = 'Please check your email and follow instructions to reset password.';
            msgType = 'info';
            Auth.logout();
            dispatch({ type: 'CLEAR_APP' });
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = `ERROR ${err}`; })
        .finally(() => {
          showMessageDialog(message, msgType);
        });
    },
    resetPasswordConfirm: async options => {
      const { password, token } = options;
      let message;
      let msgType;
      dispatch({ type: 'FORM_SUBMITTED', value: true });
      Api.resetPasswordConfirm(password, token)
        .then(res => {

          if (res.result === 'success') {
            message = (<>Password successfully changed.<br />Please log in.</>);
            msgType = 'info';
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = `ERROR ${err}` })
        .finally(() => {
          dispatch({ type: 'FORM_SUBMITTED', value: false });
          showMessageDialog(message, msgType);
        });
    },
  }), []);

  const loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'Lato': require('./assets/fonts/Lato/Lato-Regular.ttf'),
        'Roboto': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
      })
    ]);
  };

  const handleLoadingError = error => console.warn(error);
  const handleFinishLoading = () => setIsLoadingComplete(true);

  return (
    (!isLoadingComplete && !props.skipLoadingScreen)
      ? <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={handleFinishLoading}
        />
      : <AuthContext.Provider value={{ authActions, state }}>
          <NavigationContainer>
            <WalkthroughProvider>
              <AppContextProvider state={state} dispatch={dispatch} updatedState={updatedState}>
                <ConcealLoader />
                <View style={AppStyles.appContainer}>
                  {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
                  <Stack.Navigator screenOptions={{ header: () => {} }}>
                    {!state.user.loggedIn
                      ? (
                          <Stack.Screen name="Login" component={Login} options={{ header: () => {} }} />
                        )
                      : (
                          <>
                            <Stack.Screen name="Wallet" component={Wallet} options={{ header: () => {} }} />
                            <Stack.Screen name="Wallets" component={Wallets} options={{ header: () => {} }} />
                            <Stack.Screen name="AddressBook" component={AddressBook} options={{ header: () => {} }} />
                            <Stack.Screen name="SendPayment" component={SendPayment} options={{ header: () => {} }} />
                            <Stack.Screen name="SendConfirm" component={SendConfirm} options={{ header: () => {} }} />
                            <Stack.Screen name="Receive" component={Receive} options={{ header: () => {} }} />
                            <Stack.Screen name="Settings" component={Settings} options={{ header: () => {} }} />
                            <Stack.Screen name="Market" component={Market} options={{ header: () => {} }} />
                            <Stack.Screen name="Scanner" component={Scanner} options={{ header: () => {} }} />
                            <Stack.Screen name="EditAddress" component={EditAddress} options={{ header: () => {} }} />
                            <Stack.Screen name="Messages" component={Messages} options={{ header: () => {} }} />
                            <Stack.Screen name="SendMessage" component={SendMessage} options={{ header: () => {} }} />
                            <Stack.Screen name="SendMessageConfirm" component={SendMessageConfirm} options={{ header: () => {} }} />
                            <Stack.Screen name="AppMenu" component={AppMenu} options={{ header: () => {} }} />
                            <Stack.Screen name="Deposits" component={Deposits} options={{ header: () => {} }} />
                            <Stack.Screen name="CreateDeposit" component={CreateDeposit} options={{ header: () => {} }} />
                            <Stack.Screen name="CreateDepositConfirm" component={CreateDepositConfirm} options={{ header: () => {} }} />
                          </>
                        )
                    }
                  </Stack.Navigator>
                  <FlashMessage position="top" />
                </View>
              </AppContextProvider>
            </WalkthroughProvider>
          </NavigationContainer>
      </AuthContext.Provider>

  )
};

export default App;
