import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

import { AppContext } from '../components/ContextProvider';
import AuthHelper from '../helpers/AuthHelper';
import NavigationService from '../helpers/NavigationService';
import { logger } from '../helpers/Logger';
import styles from '../components/Style';


const AuthLoading = () => {
  const { state } = useContext(AppContext);
  const Auth = new AuthHelper(state.appSettings.apiURL);

  useEffect(() => {
    logger.log('CHECKING AUTH...');
    Auth.loggedIn().then(loggedIn =>
      loggedIn
        ? (state.layout.userLoaded && state.layout.walletsLoaded) && NavigationService.navigate('App')
        : NavigationService.navigate('Auth')
    );
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    </View>
)
};

const ForwardRef = React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {context => <AuthLoading context={context} {...props} />}
  </AppContext.Consumer>
));

export default ({ navigation }) => (
  <View style={styles.container}>
    <ForwardRef navigation={navigation} />
  </View>
)
