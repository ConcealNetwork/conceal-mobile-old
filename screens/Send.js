import { Icon, Overlay, Header, ListItem } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import React, { useContext } from "react";
import { sprintf } from 'sprintf-js';
import {
  maskAddress,
  formatOptions,
  getAspectRatio,
  format0Decimals,
  format2Decimals,
  format4Decimals,
  format6Decimals,
  format8Decimals
} from '../helpers/utils';
import {
  Text,
  View,
  FlatList,
  Clipboard,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

const SendScreen = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { user, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  const sendSummaryList = [];

  if (state.appData.sendScreen.toLabel) {
    sendSummaryList.push({
      value: state.appData.sendScreen.toLabel,
      title: 'Label',
      icon: 'md-eye'
    });
  }

  if (state.appData.sendScreen.toAddress) {
    sendSummaryList.push({
      value: maskAddress(state.appData.sendScreen.toAddress),
      title: 'Address',
      icon: 'md-mail'
    });
  }

  if (state.appData.sendScreen.toPaymendId) {
    sendSummaryList.push({
      value: maskAddress(state.appData.sendScreen.toPaymendId),
      title: 'Payment ID',
      icon: 'md-key'
    });
  }

  if (state.appData.sendScreen.toAmount) {
    let totalAmount = parseFloat(state.appData.sendScreen.toAmount);
    totalAmount = totalAmount + 0.0001;

    sendSummaryList.push({
      value: sprintf('%s CCX', totalAmount.toLocaleString(undefined, format6Decimals)),
      title: 'Total Amount',
      icon: 'md-cash'
    });

    sendSummaryList.push({
      value: '0.0001 CCX',
      title: 'Transaction Fee',
      icon: 'md-cash'
    });
  }

  onScanAddressQRCode = () => {
    setAppData({
      scanCode: {
        scanned: false
      }
    });

    NavigationService.navigate('Scanner', { path: ["sendScreen", "toAddress"] });
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
        size={32 * getAspectRatio()}
      />}
    />
  );

  isFormValid = () => {
    if (state.appData.sendScreen.toAddress && state.appData.sendScreen.toAmount) {
      var amountAsFloat = parseFloat(state.appData.sendScreen.toAmount);
      return ((amountAsFloat > 0) && (amountAsFloat <= (parseFloat(currWallet.balance) - 0.0001)));
    } else {
      return false;
    }
  }

  clearSend = () => {
    setAppData({
      sendScreen: {
        toAmount: '',
        toAddress: '',
        toPaymendId: '',
        toLabel: ''
      }
    });
  }

  readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setAppData({
      sendScreen: {
        toAddress: clipboardContent,
        toPaymendId: '',
        toLabel: ''
      }
    });
  };

  getAmountError = () => {
    var amountAsFloat = parseFloat(state.appData.sendScreen.toAmount || 0);
    if ((amountAsFloat <= 0) && (state.appData.sendScreen.toAmount)) {
      return "Amount must be greater then 0"
    } else if (amountAsFloat > (parseFloat(currWallet.balance) - 0.0001)) {
      return "The amount exceeds wallet balance"
    } else {
      return "";
    }
  }

  setAddress = (label, address, paymentID, entryID) => {
    setAppData({
      sendScreen: {
        toAddress: address,
        toPaymendId: paymentID
      }
    });
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Send CCX', style: AppStyles.appHeaderText }}
        rightComponent={<Icon
          onPress={() => this.clearSend()}
          name='md-trash'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      <ScrollView contentContainerStyle={styles.walletWrapper}>
        <View style={styles.fromWrapper}>
          <Text style={styles.fromAddress}>{maskAddress(currWallet.addr)}</Text>
          <Text style={styles.fromBalance}>{currWallet.balance.toLocaleString(undefined, format4Decimals)} CCX</Text>
          {currWallet.locked
            ? (<View style={styles.lockedWrapper}>
              <Icon
                containerStyle={styles.lockedIcon}
                name='md-lock'
                type='ionicon'
                color='#FF0000'
                size={16 * getAspectRatio()}
              />
              <Text style={currWallet.locked ? [styles.worthBTC, styles.lockedText] : styles.worthBTC}>
                {sprintf('%s CCX', currWallet.locked.toLocaleString(undefined, format4Decimals))}
              </Text>
            </View>)
            : null}
        </View>

        <ConcealTextInput
          label={this.getAmountError()}
          keyboardType='numeric'
          placeholder='Select amount to send...'
          containerStyle={styles.sendInput}
          value={state.appData.sendScreen.toAmount}
          onChangeText={(text) => {
            setAppData({ sendScreen: { toAmount: text } });
          }}
          rightIcon={
            <Icon
              onPress={() => setAppData({ sendScreen: { toAmount: (parseFloat(currWallet.balance) - 0.0001).toLocaleString(undefined, format8Decimals) } })}
              name='md-add'
              type='ionicon'
              color='white'
              size={32 * getAspectRatio()}
            />
          }
        />
        <TouchableOpacity onPress={() => setAppData({ sendScreen: { addrListVisible: true } })}>
          <ConcealTextInput
            editable={false}
            placeholder='Select recipient address...'
            containerStyle={styles.sendInput}
            value={state.appData.sendScreen.toLabel ? state.appData.sendScreen.toLabel : maskAddress(state.appData.sendScreen.toAddress)}
            rightIcon={
              <Icon
                onPress={() => {
                  setAppData({
                    addressEntry: {
                      headerText: "Create Address",
                      label: '',
                      address: '',
                      paymentId: '',
                      entryId: null
                    }
                  });
                  NavigationService.navigate('EditAddress', { callback: this.setAddress });
                }}
                name='md-add'
                type='ionicon'
                color='white'
                size={32 * getAspectRatio()}
              />
            }
          />
        </TouchableOpacity>
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </ScrollView>
      <Overlay
        isVisible={state.appData.sendScreen.addrListVisible}
        overlayBackgroundColor={AppColors.concealBackground}
        width="100%"
        height="100%"
      >
        <View style={styles.overlayWrapper}>
          <View style={styles.addressWrapper}>
            <FlatList
              data={user.addressBook}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>
                (currWallet.addr !== item.address)
                  ? (<TouchableOpacity onPress={() => setAppData({ sendScreen: { addrListVisible: false, toAddress: item.address, toPaymendId: item.paymentID, toLabel: item.label } })}>
                    <View style={styles.flatview}>
                      <View>
                        <Text style={styles.addressLabel}>{item.label}</Text>
                        <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                        {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                      </View>
                    </View>
                  </TouchableOpacity>)
                  : null
              }
              keyExtractor={item => item.entryID.toString()}
            />
          </View>
          <View style={styles.footer}>
            <ConcealButton
              style={[styles.footerBtn]}
              onPress={() => setAppData({ sendScreen: { addrListVisible: false } })}
              text="CLOSE"
            />
          </View>
        </View>
      </Overlay>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!this.isFormValid()}
          onPress={() => NavigationService.navigate('SendConfirm')}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => onScanAddressQRCode()}
          text="SCAN QR"
        />
      </View>
    </View>
  )
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  icon: {
    color: "orange"
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: '5rem',
    marginTop: '5rem',
    padding: '20rem',
  },
  sendInput: {
    marginTop: '10rem',
    marginBottom: '20rem'
  },
  addressLabel: {
    color: "#FFFFFF",
    fontSize: '18rem'
  },
  fromAddress: {
    fontSize: '18rem',
    color: "#FFA500",
    textAlign: 'center'
  },
  toAddress: {
    color: "#FFFFFF",
  },
  fromBalance: {
    textAlign: 'center',
    color: "#AAAAAA",
    fontSize: '24rem'
  },
  address: {
    color: "#FFA500",
    fontSize: '14rem'
  },
  data: {
    color: "#AAAAAA"
  },
  sendSummary: {
    color: "#AAAAAA",
    backgroundColor: '#212529',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: '2rem',
    marginTop: '2rem',
    padding: '10rem',
    fontSize: '16rem'
  },
  sendSummaryLabel: {
    color: AppColors.concealOrange
  },
  buttonContainer: {
    margin: '5rem'
  },
  walletWrapper: {
    flex: 1,
    top: 0,
    left: '5rem',
    right: '5rem',
    bottom: '50rem',
    margin: '15rem',
    position: 'absolute',
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: '10rem',
    marginTop: '5rem'
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  addressWrapper: {
    top: '10rem',
    left: '10rem',
    right: '10rem',
    bottom: '80rem',
    borderRadius: '10rem',
    position: 'absolute'
  },
  footer: {
    bottom: '10rem',
    left: '20rem',
    right: '20rem',
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
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  },
  summaryLabel: {
    color: AppColors.concealOrange,
    fontSize: '12rem'
  },
  summaryText: {
    color: AppColors.concealTextColor,
    fontSize: '14rem'
  },
  summaryList: {
    flex: 1,
    margin: '10rem',
    backgroundColor: AppColors.concealBackground
  },
  summaryItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    paddingTop: '5rem',
    paddingBottom: '5rem',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground
  },
  lockedWrapper: {
    height: '20rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lockedIcon: {
    marginRight: '5rem',
    paddingTop: '2rem'
  },
  lockedText: {
    color: '#FF0000'
  }

});


export default SendScreen;
