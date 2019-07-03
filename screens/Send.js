import { Provider as PaperProvider } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import { Appbar, Button } from 'react-native-paper';
import { maskAddress } from '../helpers/utils';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { Input, Icon } from 'react-native-elements';
import React, { useContext } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";

const SendScreen = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const currWallet = state.wallets.ccx7EeeSSpdRRn7zHni8Rtb5Y3c5UGim333LVWxxD2XCaTkPxWs6DKRXtznxBsofFP8JB32YYBmtwLdoEirjAbYo4DBZjpnEb8;
  const addressBook = state.user.addressBook;

  onGoBack = () => {
    NavigationService.goBack();
  }

  return (
    <PaperProvider>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => this.onGoBack()} />
        <Appbar.Content
          title="Send CCX"
        />
      </Appbar.Header>
      <View style={styles.walletWrapper}>
        <Text style={styles.fromAddress}>{maskAddress("ccx7EeeSSpdRRn7zHni8Rtb5Y3c5UGim333LVWxxD2XCaTkPxWs6DKRXtznxBsofFP8JB32YYBmtwLdoEirjAbYo4DBZjpnEb8")}</Text>
        <Text style={styles.fromBalance}>{currWallet.balance.toFixed(2)} CCX</Text>
        <Input
          placeholder='Select ammount to send...'
          inputStyle={styles.toAddress}
          keyboardType='numeric'
          value={state.appData.sendScreen.toAmmount}
          rightIcon={
            <Icon
              onPress={() => setAppData({ sendScreen: { toAmmount: '5' } })}
              name='md-trash'
              type='ionicon'
              color='white'
              size={24}
            />
          }
        />
        <Input
          placeholder='Select recipient address...'
          inputStyle={styles.toAddress}
          value={state.appData.sendScreen.toText}
          rightIcon={
            <Icon
              onPress={() => setAppData({ sendScreen: { toAddress: null, toText: null } })}
              name='md-trash'
              type='ionicon'
              color='white'
              size={24}
            />
          }
        />
      </View>
      <View style={styles.addressWrapper}>
        <FlatList
          data={addressBook}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <TouchableWithoutFeedback onPress={() => setAppData({ sendScreen: { toAddress: item.address, toText: maskAddress(item.address) } })}>
              <View style={styles.flatview}>
                <View>
                  <Text style={styles.addressLabel}>{item.label}</Text>
                  <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
          keyExtractor={item => item.entryID.toString()}
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton style={[styles.footerBtn, styles.footerBtnLeft]} onPress={() => this.showSendScreen()} text="SEND" />
        <ConcealButton style={[styles.footerBtn, styles.footerBtnRight]} onPress={() => console.log('Pressed')} text="SCAN QR" />
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
  buttonContainer: {
    margin: 5
  },
  walletWrapper: {
    flex: 1,
    margin: 15,
    flexDirection: 'column'
  },
  addressWrapper: {
    top: 260,
    left: 20,
    right: 20,
    bottom: 70,
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
