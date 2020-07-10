import React, { Component, useContext } from 'react';
import { AppContext } from '../components/ContextProvider';
import { Bars } from 'react-native-loader';
import {
  View,
  Modal,
  StyleSheet,
} from 'react-native';

const ConcealLoader = props => {
  const { state } = useContext(AppContext);
  const { layout } = state;
  const { formSubmitted } = layout;

  // set the flag if the content is loading or if we are waiting for form submission
  const isLoading = formSubmitted || (state.user.loggedIn && (!state.layout.userLoaded || !state.layout.walletsLoaded));

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={isLoading}
      onRequestClose={() => { }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {isLoading && <Bars size={20} color="#FFFFFF" />}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default ConcealLoader;