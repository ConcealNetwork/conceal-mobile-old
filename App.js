import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';
import { AppLoading, Font, Icon } from 'expo';
import { Platform, StatusBar, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import ConcealLoader from './components/ccxLoader';

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

// create the app container first
const AppContainer = createAppContainer(AppNavigator);

const App = props => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'Lato': require('./assets/fonts/Lato/Lato-Regular.ttf'),
        'Roboto': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
      }),
      AsyncStorage.getItem('@conceal:id_username').then(res => {
        global.username = res;
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
      : <AppContextProvider>
        <ConcealLoader />
        <View style={AppStyles.appContainer}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </View>
      </AppContextProvider>
  )
};

export default App;