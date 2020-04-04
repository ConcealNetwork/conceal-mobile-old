import React, { useContext, useState } from "react";
import { AppContext } from '../components/ContextProvider';
import NavigationService from '../helpers/NavigationService';
import { Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
  showErrorMessage,
  showSuccessMessage
} from '../helpers/utils';

const BarcodeScanner = (props) => {
  const params = props.navigation.state.params

  const [hasPermission, setHasPermission] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;


  function constructPayload(codeObject, index, path, data) {
    if (index < (path.length - 1)) {
      codeObject[path[index]] = {};
      constructPayload(codeObject[path[index]], index + 1, path, data);
    } else if (index < path.length) {
      codeObject[path[index]] = data;
      constructPayload(codeObject[path[index]], index + 1, path, data);
    }
  }

  handleBarCodeScanned = ({ type, data }) => {
    var codeObject = {};
    var scannedCode = null;

    if (data.search("conceal:") === 0) {
      scannedCode = data.substring(8);
    } else {
      scannedCode = data;
    }

    constructPayload(codeObject, 0, params.path, scannedCode);
    setAppData(codeObject);
    setHasScanned(true);

    showSuccessMessage("Successfully scanned the address");
    NavigationService.goBack();
  };

  getPermissionsAsync = async () => {
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
