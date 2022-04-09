import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, } from 'react-native';
import { AppContext } from './ContextProvider';

const ConcealLoader = () => {
  const { state } = useContext(AppContext);
  const { layout, user } = state;
  const { formSubmitted, userLoaded, walletsLoaded } = layout;

  const [isLoading, setIsLoading] = useState(true);

  // set the flag if the content is loading or if we are waiting for form submission
  useEffect(() => {
    console.log(`setting to formSubmitted: ${formSubmitted}, userLoaded: ${userLoaded}, walletsLoaded: ${walletsLoaded}`)
    setIsLoading(formSubmitted);
  }, [formSubmitted]);

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isLoading}
      onRequestClose={() => { }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {isLoading && <ActivityIndicator size="large" color="#FFFFFF" />}
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
