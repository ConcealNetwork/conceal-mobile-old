import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { YellowBox } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Platform, StatusBar, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import FlashMessage from "react-native-flash-message";
import ConcealLoader from './components/ccxLoader';
import EStyleSheet from 'react-native-extended-stylesheet';
import { WalkthroughProvider } from 'react-native-walkthrough';

import AppContextProvider from './components/ContextProvider';
import AppStyles from './components/Style';
import NavigationService from './helpers/NavigationService';
import AppNavigator from './navigation/AppNavigator';

// add locales for android
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/en-GB');
}

// supress the timer warnings
YellowBox.ignoreWarnings(['Setting a timer']);

// build only once
EStyleSheet.build({
  $rem: Dimensions.get('window').width / 360
});

// create the app container first
const AppContainer = createAppContainer(AppNavigator);

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

  return (
    (!isLoadingComplete && !props.skipLoadingScreen)
      ? <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={handleFinishLoading}
      />
      :
      <WalkthroughProvider>
        <AppContextProvider>
          <ConcealLoader />
          <View style={AppStyles.appContainer}>
            {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
            <AppContainer
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
            <FlashMessage position="top" />
          </View>
        </AppContextProvider>
      </WalkthroughProvider>
  )
};

export default App;