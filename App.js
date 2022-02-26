import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import React, { useContext, useState } from 'react';
import { Dimensions, LogBox, Platform, StatusBar, View, } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FlashMessage from 'react-native-flash-message';
import { WalkthroughProvider } from 'react-native-walkthrough';
import AppContextProvider from './components/ContextProvider';
import AppStyles from './components/Style';
import localStorage from './helpers/LocalStorage';
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
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

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

  const userToken = localStorage.get('id_token');
  return (
    (!isLoadingComplete && !props.skipLoadingScreen)
      ? <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={handleFinishLoading}
        />
      : <NavigationContainer>
          <WalkthroughProvider>
            <AppContextProvider>
              {/*<ConcealLoader />*/}
              <View style={AppStyles.appContainer}>
                {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
                <Stack.Navigator screenOptions={{ header: () => {} }}>
                  {!userToken
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

  )
};

export default App;
