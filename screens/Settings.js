import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

import { AppContext } from '../components/ContextProvider';
import styles from '../components/Style';


const Settings = () => {
  const { actions, state } = useContext(AppContext);
  const { logoutUser } = actions;
  const { network, user } = state;

  return (
    <View style={styles.viewContainer}>
      <ScrollView style={styles.viewContainer} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>USER SETTINGS</Text>
        <Text style={styles.textRegular}>User Name: {user.name}</Text>
        <Text style={styles.textRegular}>Blockchain Height: {network.blockchainHeight.toLocaleString()}</Text>
        <Button
          onPress={logoutUser}
          title="Log Out"
          accessibilityLabel="Log Out Button"
          buttonStyle={[styles.submitButton, styles.loginButton]}
          titleStyle={styles.buttonTitle}
        />
      </ScrollView>
    </View>
  )
};

export default Settings;
