import React, { useContext } from "react";
import { AppContext } from '../components/ContextProvider';
import NavigationService from '../helpers/NavigationService';
import { Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

const BarcodeScanner = (props) => {
  const params = props.navigation.state.params

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
    constructPayload(codeObject, 0, params.path, data);
    constructPayload(codeObject, 0, ["scanCode", "scanned"], true);
    actions.setAppData(codeObject);
    NavigationService.goBack();
  };

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  if (state.appData.scanCode.hasCameraPermission) {
    getPermissionsAsync();
  } else {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={state.appData.scanCode.scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }
}

export default BarcodeScanner;
