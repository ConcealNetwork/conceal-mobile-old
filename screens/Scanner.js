import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { showSuccessMessage } from '../helpers/utils';

const BarcodeScanner = ({ navigation: { navigate }, route }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    let scannedCode;
    let paymentId;
    let address;

    if (data.search('conceal:') === 0) {
      scannedCode = data.substring(8);
    } else {
      scannedCode = data;
    }

    if (scannedCode.search(':') > 0) {
      address = scannedCode.substr(0, scannedCode.indexOf(':'));
      paymentId = scannedCode.substring(scannedCode.indexOf(':') + 1);
    } else {
      address = scannedCode;
      paymentId = '';
    }

    setHasScanned(true);
    showSuccessMessage('Successfully scanned the address');
    navigate({
      name: route.params.previousScreen,
      params: { address, paymentId },
      merge: true,
    });
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
