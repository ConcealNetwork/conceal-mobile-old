import { Icon, Header } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import SearchAddress from './SearchAddress';
import AppStyles from '../components/Style';
import React, { useContext } from "react";
import {
  maskAddress,
  getAspectRatio
} from '../helpers/utils';
import {
  Text,
  View,
  TextInput,
  Clipboard,
  ScrollView,
  TouchableOpacity
} from "react-native";

const SendMessage = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { user, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  this.onScanSuccess = (data) => {
    setAppData({
      sendMessage: {
        toAddress: data.address
      }
    });
  }

  this.onScanAddressQRCode = () => {
    setAppData({
      scanCode: {
        scanned: false
      }
    });

    NavigationService.navigate('Scanner', { onSuccess: this.onScanSuccess });
  }

  this.isFormValid = () => {
    return (state.appData.sendMessage.toAddress && state.appData.sendMessage.message);
  }

  this.clearSend = () => {
    setAppData({
      sendMessage: {
        toAddress: '',
        message: ''
      }
    });
  }

  this.readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setAppData({
      sendMessage: {
        toAddress: clipboardContent
      }
    });
  };

  this.setAddress = (label, address, paymentID, entryID) => {
    setAppData({
      sendMessage: {
        toAddress: address
      }
    });
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Send Message', style: AppStyles.appHeaderText }}
        rightComponent={<Icon
          onPress={() => this.clearSend()}
          name='md-trash'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      <ScrollView contentContainerStyle={styles.walletWrapper}>
        <TouchableOpacity onPress={() => setAppData({ searchAddress: { addrListVisible: true } })}>
          <ConcealTextInput
            editable={false}
            placeholder='Select recipient address...'
            containerStyle={styles.sendInput}
            value={state.appData.sendMessage.toLabel ? state.appData.sendMessage.toLabel : maskAddress(state.appData.sendMessage.toAddress)}
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
        <View style={styles.messageWrapper}>
          <TextInput
            multiline
            maxLength={280}
            numberOfLines={4}
            style={styles.messageText}
            placeholder="Write your message here..."
            placeholderTextColor={AppColors.placeholderTextColor}
            onChangeText={text => {
              setAppData({
                sendMessage: {
                  message: text
                }
              });
            }}
            value={state.appData.sendMessage.message}
          />
        </View>
        <Text style={styles.messageCharsLeft}>{state.appData.sendMessage.message ? 280 - state.appData.sendMessage.message.length : 280} chars of 280 left</Text>
      </ScrollView>
      <SearchAddress
        selectAddress={(item) => setAppData({ searchAddress: { addrListVisible: false }, sendMessage: { toAddress: item.address, toLabel: item.label } })}
        closeOverlay={() => setAppData({ searchAddress: { addrListVisible: false } })}
        addressData={user.addressBook}
        currWallet={currWallet}
      />
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!this.isFormValid()}
          onPress={() => NavigationService.navigate('SendMessageConfirm')}
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
  sendInput: {
    marginTop: '10rem',
    marginBottom: '20rem'
  },
  toAddress: {
    color: "#FFFFFF",
  },
  fromBalance: {
    textAlign: 'center',
    color: "#AAAAAA",
    fontSize: '24rem'
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
  },
  messageWrapper: {
    borderBottomColor: 'rgb(55, 55, 55)',
    borderBottomWidth: 1,
    margin: '10rem'
  },
  messageText: {
    fontSize: '18rem',
    marginBottom: '10rem',
    color: AppColors.concealTextColor,
  },
  messageCharsLeft: {
    margin: '10rem',
    fontSize: '16rem',
    color: AppColors.concealOrange,
  }
});

export default SendMessage;