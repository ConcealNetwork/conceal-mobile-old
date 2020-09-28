import React, { useState } from "react";
import NavigationService from '../helpers/NavigationService';
import { View, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { showSuccessMessage } from '../helpers/utils';

const BarcodeScanner = (props) => {
  const onSuccess = props.navigation.state.params.onSuccess;

  const [hasPermission, setHasPermission] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  this.handleBarCodeScanned = ({ type, data }) => {
    var scannedCode = null;
    var paymentId = null;
    var address = null;

    if (data.search("conceal:") === 0) {
      scannedCode = data.substring(8);
    } else {
      scannedCode = data;
    }

    if (scannedCode.search(":") > 0) {
      address = scannedCode.substr(0, scannedCode.indexOf(':'));
      paymentId = scannedCode.substring(scannedCode.indexOf(':') + 1);
    } else {
      address = scannedCode;
      paymentId = '';
    }

    setHasScanned(true);
    onSuccess({
      address: address,
      paymentId: paymentId
    });

    showSuccessMessage("Successfully scanned the address");
    NavigationService.goBack();
  };

  this.getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
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
          onBarCodeScanned={hasScanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }
}

export default BarcodeScanner;
