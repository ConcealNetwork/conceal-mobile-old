import { Provider as PaperProvider } from 'react-native-paper';
import { Input, Icon, Overlay } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { Appbar, Button } from 'react-native-paper';
import { maskAddress } from '../helpers/utils';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { colors } from '../constants/Colors';
import React, { useContext } from "react";
import {
  Text,
  View,
  FlatList,
  Clipboard,
  StyleSheet
} from "react-native";

const SendConfirmScreen = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { user, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  onGoBack = () => {
    NavigationService.goBack();
  }

  toogleSecurePassword = () => {
    setAppData({
      sendScreen: {
        securePasswordEntry: !state.appData.sendScreen.securePasswordEntry
      }
    });
  }

  sendPayment = () => {
    actions.sendPayment(
      currWallet.addr,
      state.appData.sendScreen.toAddress,
      state.appData.sendScreen.toPaymendId,
      state.appData.sendScreen.toAmmount
    );
  }

  isFormValid = () => {
    if (state.appData.sendScreen.toAddress && state.appData.sendScreen.toAmmount) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <PaperProvider>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => this.onGoBack()} />
        <Appbar.Content
          title="Confirm sending"
        />
      </Appbar.Header>
      <View style={styles.walletWrapper}>
        <Input
          placeholder='please enter your password...'
          inputStyle={styles.toAddress}
          containerStyle={styles.sendInput}
          textContentType="password"
          secureTextEntry={state.appData.sendScreen.securePasswordEntry}
          rightIcon={
            <Icon
              onPress={() => this.toogleSecurePassword()}
              name='ios-eye-off'
              type='ionicon'
              color='white'
              size={24}
            />
          }
        />
        <Input
          placeholder='please enter F2A code if enabled...'
          inputStyle={styles.toAddress}
          containerStyle={styles.sendInput}
          keyboardType='numeric'
          rightIcon={
            <Icon
              onPress={() => console.log("pressed")}
              name='md-trash'
              type='ionicon'
              color='white'
              size={24}
            />
          }
        />
        <View style={styles.sendSummaryWrapper}>
          <Text style={styles.sendSummary}>You are sending <Text style={styles.sendSummaryHighlight}>{state.appData.sendScreen.toAmmount} CCX</Text></Text>
          <Text style={styles.sendSummary}>From address: <Text style={styles.sendSummaryHighlight}>{maskAddress(currWallet.addr)}</Text></Text>
          <Text style={styles.sendSummary}>To address: <Text style={styles.sendSummaryHighlight}>{maskAddress(state.appData.sendScreen.toAddress)}</Text></Text>
          {state.appData.sendScreen.toPaymendId ? (<Text style={styles.sendSummary}>Payment ID: <Text style={styles.sendSummaryHighlight}>{maskAddress(state.appData.sendScreen.toPaymendId)}</Text></Text>) : null}
          {state.appData.sendScreen.toLabel ? (<Text style={styles.sendSummary}>Label: <Text style={styles.sendSummaryHighlight}>{state.appData.sendScreen.toLabel}</Text></Text>) : null}
        </View>
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!this.isFormValid()}
          onPress={() => this.sendPayment()}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => this.onGoBack()}
          text="CANCEL"
        />
      </View>
    </PaperProvider>
  )
};

const styles = StyleSheet.create({
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: "#343a40"
  },
  icon: {
    color: "orange"
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  sendInput: {
    marginTop: 20
  },
  addressLabel: {
    color: "#FFFFFF",
    fontSize: 18
  },
  fromAddress: {
    fontSize: 18,
    color: "#FFA500",
    textAlign: 'center'
  },
  toAddress: {
    color: "#FFFFFF",
  },
  fromBalance: {
    textAlign: 'center',
    color: "#AAAAAA",
    fontSize: 24
  },
  address: {
    color: "#FFA500"
  },
  data: {
    color: "#AAAAAA"
  },
  sendSummary: {
    color: "#AAAAAA",
    fontSize: 16
  },
  buttonContainer: {
    margin: 5
  },
  walletWrapper: {
    flex: 1,
    margin: 15,
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: 10,
    marginTop: 20
  },
  sendSummaryHighlight: {
    color: colors.concealOrange
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  addressWrapper: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 80,
    borderRadius: 10,
    position: 'absolute'
  },
  footer: {
    bottom: 10,
    left: 20,
    right: 20,
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1
  },
  footerBtnRight: {
    marginLeft: 5
  },
  footerBtnLeft: {
    marginRight: 5
  }
});


export default SendConfirmScreen;
