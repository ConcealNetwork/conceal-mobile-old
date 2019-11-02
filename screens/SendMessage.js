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
  getAspectRatio
} from '../helpers/utils';
import {
  Text,
  View,
  FlatList,
  TextInput,
  Clipboard,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

const SendMessage = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { user, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  onScanAddressQRCode = () => {
    setAppData({
      scanCode: {
        scanned: false
      }
    });

    NavigationService.navigate('Scanner', { path: ["sendMessage", "toAddress"] });
  }

  isFormValid = () => {
    return (state.appData.sendMessage.toAddress && state.appData.sendMessage.message);
  }

  clearSend = () => {
    setAppData({
      sendMessage: {
        toAddress: '',
        message: ''
      }
    });
  }

  readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setAppData({
      sendMessage: {
        toAddress: clipboardContent
      }
    });
  };

  setAddress = (label, address, paymentID, entryID) => {
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
        <TouchableOpacity onPress={() => setAppData({ sendMessage: { addrListVisible: true } })}>
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
      <Overlay
        isVisible={state.appData.sendMessage.addrListVisible}
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
                  ? (<TouchableOpacity onPress={() => setAppData({ sendMessage: { addrListVisible: false, toAddress: item.address, toLabel: item.label } })}>
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
              onPress={() => setAppData({ sendMessage: { addrListVisible: false } })}
              text="CLOSE"
            />
          </View>
        </View>
      </Overlay>
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