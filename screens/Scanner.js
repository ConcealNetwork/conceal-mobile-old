import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppContext } from '../components/ContextProvider';
import { showSuccessMessage } from '../helpers/utils';

const BarcodeScanner = ({ navigation: { navigate }, route }) => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const [hasPermission, setHasPermission] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    if (data) {
      let amount, address, paymentId, label, message;
      const [prefix, ...rest] = data.split(':');
      if (prefix === appSettings.qrCodePrefix) {
        const addressParams = rest.join(':').split('?');
        address = addressParams[0];
        if (addressParams.length > 1) {
          const params = addressParams[1].split('&');
          params.forEach(p => {
            const param = p.split('=');
            if (param[0] === 'tx_amount') amount = param[1];
            if (param[0] === 'tx_payment_id') paymentId = param[1];
            if (param[0] === 'tx_message') message = param[1];
            if (param[0] === 'tx_label') label = param[1];
          });
        }
      }
      showSuccessMessage('Successfully scanned the address');
      navigate({
        name: route.params.previousScreen,
        params: { address, amount, label, message, paymentId },
        merge: true,
      });
    }
    setHasScanned(true);
  };

  const getPermissionsAsync = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  if (!hasPermission) {
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
          onBarCodeScanned={hasScanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }
}

export default BarcodeScanner;
