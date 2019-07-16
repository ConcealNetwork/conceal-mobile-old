import { Input, Icon, Overlay, Header, ListItem } from 'react-native-elements';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import NavigationService from '../helpers/NavigationService';
import { maskAddress } from '../helpers/utils';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import React, { useContext } from "react";
import {
  Text,
  View,
  FlatList,
  Clipboard,
  StyleSheet,
  ScrollView
} from "react-native";

const SendConfirmScreen = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { userSettings, layout, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  console.log("wallets");
  console.log(wallets);

  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');

  const sendSummaryList = [];

  function addSummaryItem(value, title, icon) {
    sendSummaryList.push({
      value: value,
      title: title,
      icon: icon

    });
  }

  addSummaryItem(sprintf('%s CCX', state.appData.sendScreen.toAmmount), 'You are sending', 'md-cash');
  addSummaryItem(maskAddress(currWallet.addr), 'From address', 'md-mail');
  addSummaryItem(maskAddress(state.appData.sendScreen.toAddress), 'To address', 'md-mail');
  if (state.appData.sendScreen.toPaymendId) {
    addSummaryItem(maskAddress(state.appData.sendScreen.toPaymendId), 'Payment ID', 'md-key');
  }
  if (state.appData.sendScreen.toLabel) {
    addSummaryItem(state.appData.sendScreen.toLabel, 'Label', 'md-eye');
  }

  // key extractor for the list
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.value}
      subtitle={item.title}
      titleStyle={styles.summaryText}
      subtitleStyle={styles.summaryLabel}
      containerStyle={styles.summaryItem}
      leftIcon={<Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32}
      />}
    />
  );

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
      password
    );
  }

  const formValidation = (password !== '' && password.length >= userSettings.minimumPasswordLength);
  const formValid = useFormValidation(formValidation);

  return (
    <View style={styles.pageWrapper}>
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
      <ScrollView contentContainerStyle={styles.walletWrapper}>
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
              size={32}
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
                size={32}
              />
            }
          />
        ) : null}
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </ScrollView>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          onPress={() => this.sendPayment()}
          disabled={!formValid}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => NavigationService.goBack()}
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
    marginTop: 10,
    marginBottom: 20
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
    top: 0,
    left: 5,
    right: 5,
    bottom: 50,
    margin: 15,
    position: 'absolute',
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: 10,
    marginTop: 20
  },
  sendSummaryHighlight: {
    color: AppColors.concealOrange
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
  },
  summaryLabel: {
    color: AppColors.concealOrange
  },
  summaryText: {
    color: AppColors.concealTextColor
  },
  summaryList: {
    flex: 1,
    margin: 10,
    backgroundColor: AppColors.concealBackground
  },
  summaryItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground,
  }
});


export default SendConfirmScreen;
