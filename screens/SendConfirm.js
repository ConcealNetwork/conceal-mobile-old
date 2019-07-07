import { useFormInput, useFormValidation } from '../helpers/hooks';
import { Input, Icon, Overlay, Header } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { maskAddress } from '../helpers/utils';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import ConcealLoader from '../components/ccxLoader';
import { colors } from '../constants/Colors';
import Toast from 'react-native-root-toast';
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
  const { user, userSettings, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');

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
      state.appData.sendScreen.toAmmount,
      twoFACode,
      password,
      function (data) {
        console.log(data);
        if (data.result == "error") {
          let toast = Toast.show(data.message.join(), {
            backgroundColor: colors.concealErrorColor,
            duration: Toast.durations.LONG,
            opacity: 0.9,
            position: 0,
            animation: true,
            hideOnPress: true,
            shadow: true,
            delay: 300
          });
        } else if (data.result == "success") {
          NavigationService.goBack();
          NavigationService.goBack();
        }
      }
    );
  }

  const formValidation = (password !== '' && password.length >= userSettings.minimumPasswordLength);
  const formValid = useFormValidation(formValidation);

  return (
    <View style={styles.pageWrapper}>
      <ConcealLoader loading={state.appData.sendScreen.isSendingPayment} />
      <Header
        placement="left"
        containerStyle={styles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={26}
        />}
        centerComponent={{ text: 'Confirm sending', style: { color: '#fff', fontSize: 20 } }}
      />
      <View style={styles.walletWrapper}>
        <Input
          {...bindPassword}
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
        {userSettings.twoFAEnabled ? (
          <Input
            {...bindTwoFACode}
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
        ) : null}
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
          onPress={() => this.sendPayment()}
          disabled={!formValid}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => this.onGoBack()}
          text="CANCEL"
        />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
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
    backgroundColor: '#212529',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 2,
    marginTop: 2,
    padding: 10,
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
