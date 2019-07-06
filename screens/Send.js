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
  StyleSheet,
  TouchableOpacity
} from "react-native";

const SendScreen = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { user, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  onGoBack = () => {
    NavigationService.goBack();
  }

  isFormValid = () => {
    if (state.appData.sendScreen.toAddress && state.appData.sendScreen.toAmmount) {
      return true;
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

  return (
    <PaperProvider>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => this.onGoBack()} />
        <Appbar.Content
          title="Send CCX"
        />
        <Icon
          onPress={() => this.clearSend()}
          containerStyle={{ marginRight: 5 }}
          name='md-trash'
          type='ionicon'
          color='white'
          size={24}
        />
      </Appbar.Header>
      <View style={styles.walletWrapper}>
        <Text style={styles.fromAddress}>{maskAddress(currWallet.addr)}</Text>
        <Text style={styles.fromBalance}>{currWallet.balance.toFixed(2)} CCX</Text>
        <Input
          placeholder='Select ammount to send...'
          inputStyle={styles.toAddress}
          containerStyle={styles.sendInput}
          keyboardType='numeric'
          value={state.appData.sendScreen.toAmmount}
          onChangeText={(text) => setAppData({ sendScreen: { toAmmount: text } })}
          rightIcon={
            <Icon
              onPress={() => setAppData({ sendScreen: { toAmmount: currWallet.balance.toString() } })}
              name='md-add'
              type='ionicon'
              color='white'
              size={24}
            />
          }
        />
        <TouchableOpacity onPress={() => setAppData({ sendScreen: { addrListVisible: true } })}>
          <Input
            placeholder='Select recipient address...'
            editable={false}
            inputStyle={styles.toAddress}
            containerStyle={styles.sendInput}
            value={state.appData.sendScreen.toAddress}
            rightIcon={
              <Icon
                onPress={() => this.readFromClipboard()}
                name='md-copy'
                type='ionicon'
                color='white'
                size={24}
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
      </View>
      <Overlay
        isVisible={state.appData.sendScreen.addrListVisible}
        overlayBackgroundColor={colors.concealBackground}
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
          onPress={() => console.log('Pressed')}
          text="SCAN QR"
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
  sendSummaryLabel: {
    color: colors.concealOrange
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
