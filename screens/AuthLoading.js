import { View, Text } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../components/ContextProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import AuthHelper from '../helpers/AuthHelper';
import NavigationService from '../helpers/NavigationService';
import { logger } from '../helpers/Logger';
import AppStyles from '../components/Style';


const AuthLoading = () => {
  const { state } = useContext(AppContext);
  const Auth = new AuthHelper(state.appSettings.apiURL);

  useEffect(() => {
    logger.log('CHECKING AUTH...');

    // force logout if biometric
    if (Auth.getIsAltAuth) {
      Auth.logout();
    }

    let loggedIn = Auth.loggedIn();
    loggedIn
      ? (state.layout.userLoaded && state.layout.walletsLoaded) && NavigationService.navigate('App')
      : NavigationService.navigate('Auth', 'LoginAlt')
  }, []);

  return (
    <View style={[AppStyles.appContainer, styles.textWrapper]}>
      <Text style={styles.loadingText}>Loading, please wait...</Text>
    </View>
  )
};

const ForwardRef = React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {context => <AuthLoading context={context} {...props} />}
  </AppContext.Consumer>
));

const styles = EStyleSheet.create({
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: '18rem',
    color: "#FFFFFF"
  }
});

export default ({ navigation }) => (
  <View style={AppStyles.appContainer}>
    <ForwardRef navigation={navigation} />
  </View>
)
