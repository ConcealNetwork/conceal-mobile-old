import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AppContext } from '../components/ContextProvider';
import NavigationService from '../helpers/NavigationService';


const BarcodeScanner = props => {
  const { actions, state } = useContext(AppContext);
  const { updateCameraPermission } = actions;
  const { appSettings, user } = state;
  const { navigation } = props;
  const setAddress = navigation.getParam('setAddress');
  const setPaymentID = navigation.getParam('setPaymentID', () => {});
  const setLabel = navigation.getParam('setLabel', () => {});
  const setAmount = navigation.getParam('setAmount', () => {});
  const setMessage = navigation.getParam('setMessage', () => {});

  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    if (data) {
      setScanned(true);
      const [prefix, ...rest] = data.split(':');
      if (prefix === appSettings.qrCodePrefix) {
        const addressParams = rest.join(':').split('?');
        setAddress(addressParams[0]);
        if (addressParams.length > 1) {
          const params = addressParams[1].split('&');
          params.forEach(p => {
            const param = p.split('=');
            if (param[0] === 'tx_payment_id') setPaymentID(param[1]);
            if (param[0] === 'tx_label') setLabel(param[1]);
            if (param[0] === 'tx_amount') setAmount(param[1]);
            if (param[0] === 'tx_message') setMessage(param[1]);
          })
        }
      }
    }
    NavigationService.goBack();
  };

  const getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    updateCameraPermission(status === 'granted');
  };

  if (!user.hasCameraPermission) {
    getPermissionsAsync();
    return null;
  } else {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }
};

export default BarcodeScanner;
