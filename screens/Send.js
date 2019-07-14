import { Icon, Overlay, Header } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import React, { useContext } from "react";
import {
  maskAddress,
  formatOptions,
  format0Decimals,
  format2Decimals,
  format4Decimals,
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
  const { user, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  isFormValid = () => {
    if (state.appData.sendScreen.toAddress && state.appData.sendScreen.toAmmount) {
      var ammountAsFloat = parseFloat(state.appData.sendScreen.toAmmount);
      return ((ammountAsFloat > 0) && (ammountAsFloat <= (parseFloat(currWallet.balance) - 0.0001)));
    } else {
      return false;
    }
  }

  clearSend = () => {
    setAppData({
      sendScreen: {
        toAmmount: '',
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

  getAmmountError = () => {
    var ammountAsFloat = parseFloat(state.appData.sendScreen.toAmmount || 0);
    if ((ammountAsFloat <= 0) && (state.appData.sendScreen.toAmmount)) {
      return "Ammount must be greater then 0"
    } else if (ammountAsFloat > (parseFloat(currWallet.balance) - 0.0001)) {
      return "The ammount exceeds wallet balance"
    } else {
      return "";
    }
  }

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
          size={32}
        />}
        centerComponent={{ text: 'Send CCX', style: { color: '#fff', fontSize: 20 } }}
        rightComponent={<Icon
          onPress={() => this.clearSend()}
          name='md-trash'
          type='ionicon'
          color='white'
          size={32}
        />}
      />
      <ScrollView contentContainerStyle={styles.walletWrapper}>
        <View style={styles.fromWrapper}>
          <Text style={styles.fromAddress}>{maskAddress(currWallet.addr)}</Text>
          <Text style={styles.fromBalance}>{currWallet.balance.toLocaleString(undefined, format2Decimals)} CCX</Text>
        </View>

        <ConcealTextInput
          label={this.getAmmountError()}
          keyboardType='numeric'
          placeholder='Select ammount to send...'
          containerStyle={styles.sendInput}
          value={state.appData.sendScreen.toAmmount}
          onChangeText={(text) => {
            setAppData({ sendScreen: { toAmmount: text } });
          }}
          rightIcon={
            <Icon
              onPress={() => setAppData({ sendScreen: { toAmmount: (parseFloat(currWallet.balance) - 0.0001).toLocaleString(undefined, format4Decimals) } })}
              name='md-add'
              type='ionicon'
              color='white'
              size={32}
            />
          }
        />
        <TouchableOpacity onPress={() => setAppData({ sendScreen: { addrListVisible: true } })}>
          <ConcealTextInput
            editable={false}
            placeholder='Select recipient address...'
            containerStyle={styles.sendInput}
            value={state.appData.sendScreen.toAddress}
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
                  NavigationService.navigate('EditAddress');
                }}
                name='md-add'
                type='ionicon'
                color='white'
                size={32}
              />
            }
          />
        </TouchableOpacity>
        <View style={styles.sendSummaryWrapper}>
          {state.appData.sendScreen.toLabel ? (<Text style={styles.sendSummary}><Text style={styles.sendSummaryLabel}>Label:</Text> {state.appData.sendScreen.toLabel}</Text>) : null}
          {state.appData.sendScreen.toAddress ? (<Text style={styles.sendSummary}><Text style={styles.sendSummaryLabel}>Address:</Text> {maskAddress(state.appData.sendScreen.toAddress)}</Text>) : null}
          {state.appData.sendScreen.toPaymendId ? (<Text style={styles.sendSummary}><Text style={styles.sendSummaryLabel}>Payment ID:</Text> {maskAddress(state.appData.sendScreen.toPaymendId)}</Text>) : null}
          {state.appData.sendScreen.toAmmount ? (<Text style={styles.sendSummary}><Text style={styles.sendSummaryLabel}>Send:</Text> {state.appData.sendScreen.toAmmount} CCX</Text>) : null}
        </View>
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
                <TouchableOpacity onPress={() => setAppData({ sendScreen: { addrListVisible: false, toAddress: item.address, toPaymendId: item.paymentID, toLabel: item.label } })}>
                  <View style={styles.flatview}>
                    <View>
                      <Text style={styles.addressLabel}>{item.label}</Text>
                      <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                      {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                    </View>
                  </View>
                </TouchableOpacity>
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
          onPress={() => NavigationService.navigate('Scanner', { path: ["sendScreen", "toAddress"] })}
          text="SCAN QR"
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
  sendSummaryLabel: {
    color: AppColors.concealOrange
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
    marginTop: 5
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


export default SendScreen;
