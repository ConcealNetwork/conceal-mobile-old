import React, { Component, useContext } from 'react';
import { AppContext } from '../components/ContextProvider';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

const ConcealLoader = props => {
  const { state } = useContext(AppContext);
  const { layout } = state;
  const { formSubmitted } = layout;

  console.log(formSubmitted);

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={formSubmitted}
      onRequestClose={() => { }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size="large"
            animating={formSubmitted}
          />
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