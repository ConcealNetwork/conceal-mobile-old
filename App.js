import React, { useState } from 'react';
import { AppLoading, Font, Icon } from 'expo';
import { Platform, StatusBar, View } from 'react-native';
import { createAppContainer } from 'react-navigation';

import AppContextProvider from './components/ContextProvider';
import styles from './components/Style';
import NavigationService from './helpers/NavigationService';
import AppNavigator from './navigation/AppNavigator';


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
        <View style={styles.appContainer}>
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