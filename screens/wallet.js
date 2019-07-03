import { Appbar, Dialog, Portal, Avatar, IconButton, Colors } from 'react-native-paper';
import { Provider as PaperProvider } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { maskAddress } from '../helpers/utils';
import { Icon } from 'react-native-elements';
import { Formik } from 'formik';
import Moment from "moment";
import React, { useContext } from "react";
import {
  Text,
  View,
  Alert,
  Picker,
  FlatList,
  StyleSheet
} from "react-native";

const dialogTheme = {
  colors: {
    primary: "#FFA500"
  }
};

const WalletScreen = () => {
  const { state } = useContext(AppContext);
  const currWallet = state.wallets.ccx7EeeSSpdRRn7zHni8Rtb5Y3c5UGim333LVWxxD2XCaTkPxWs6DKRXtznxBsofFP8JB32YYBmtwLdoEirjAbYo4DBZjpnEb8;

  onGoBack = () => {
    const { goBack } = this.props.navigation;
    goBack();
  }

  onShowSettings = () => {
    NavigationService.navigate('Settings');
  }

  onShowWallets = () => {
    NavigationService.navigate('Wallets');
  }

  onShowAddressBook = () => {
    NavigationService.navigate('AddressBook');
  }

  onShowMarkets = () => {

  }

  showSendScreen = () => {
    NavigationService.navigate('Send');
  }

  getAddressItem = () => {

  };

  return (
    <PaperProvider>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.Content
          title="Default Wallet"
        />
        <Avatar.Image style={styles.Avatar} size={36} source={require('../assets/images/taegus.png')} />
      </Appbar.Header>
      <View style={styles.accountOverview}>
        <Text style={styles.worthDollars}>$ {(state.prices.priceCCXUSD * currWallet.balance.toFixed(2)).toFixed(2)}</Text>
        <Text style={styles.ammountCCX}>{currWallet.balance.toFixed(2)} CCX</Text>
        <View style={styles.btcPriceWrapper}>
          <Icon
            containerStyle={styles.btcIcon}
            name='logo-bitcoin'
            type='ionicon'
            color='#FFFFFF'
            size={16}
          />
          <Text style={styles.worthBTC}>{(state.prices.priceCCXBTC * currWallet.balance.toFixed(2)).toFixed(8)}</Text>
        </View>
        <IconButton
          size={36}
          icon="settings"
          color={Colors.white}
          style={[styles.iconGeneral, styles.iconSettings]}
          onPress={() => this.onShowSettings()}
        />
        <IconButton
          size={36}
          icon="account-balance-wallet"
          color={Colors.white}
          style={[styles.iconGeneral, styles.iconWallets]}
          onPress={() => this.onShowWallets()}
        />
        <IconButton
          size={36}
          icon="library-books"
          color={Colors.white}
          style={[styles.iconGeneral, styles.iconAddressBook]}
          onPress={() => this.onShowAddressBook()}
        />
        <IconButton
          size={36}
          icon="show-chart"
          color={Colors.white}
          style={[styles.iconGeneral, styles.iconMarkets]}
          onPress={() => this.onShowMarkets()}
        />
      </View>
      <Text style={styles.txsText}>Transactions</Text>
      <View style={styles.transactionsWrapper}>
        <FlatList
          data={currWallet.transactions}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <View style={styles.flatview}>
              <Text style={styles.dataTimestamp}>{Moment(item.timestamp).format('LLLL')}</Text>
              <Text style={styles.dataAmmount}>{item.amount.toFixed(2)} CCX (fee: {item.fee})</Text>
              <Text style={styles.dataAddress}>{maskAddress(item.address)}</Text>

              <Icon
                name={item.type === 'received' ? "md-arrow-down" : "md-arrow-up"}
                type='ionicon'
                size={32}
                color={item.type === 'received' ? Colors.green500 : Colors.red500}
                containerStyle={styles.txDirection}
                onPress={() => console.log('Pressed')}
              />
            </View>
          }
          keyExtractor={item => item.hash}
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton style={[styles.footerBtn, styles.footerBtnLeft]} onPress={() => this.showSendScreen()} text="SEND" />
        <ConcealButton style={[styles.footerBtn, styles.footerBtnRight]} onPress={() => console.log('Pressed')} text="RECEIVE" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: "#343a40"
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  worthDollars: {
    color: "#FFFFFF",
    fontSize: 14
  },
  ammountCCX: {
    color: "#FFA500",
    fontSize: 24,
    margin: 5
  },
  worthBTC: {
    color: "#FFFFFF",
    fontSize: 14
  },
  accountOverview: {
    top: 5,
    margin: 10,
    padding: 25,
    height: 125,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212529"
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
  Avatar: {
    position: 'absolute',
    right: 10
  },
  iconGeneral: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
  iconSettings: {
    left: 10,
    top: 10
  },
  iconWallets: {
    left: 10,
    top: 65
  },
  iconAddressBook: {
    right: 10,
    top: 10
  },
  iconMarkets: {
    right: 10,
    top: 65
  },
  transactionsWrapper: {
    top: 260,
    left: 20,
    right: 20,
    bottom: 70,
    borderRadius: 10,
    position: 'absolute'
  },
  dataTimestamp: {
    color: "#FFFFFF",
    fontSize: 14
  },
  dataAmmount: {
    color: "#FFFFFF",
    fontSize: 20
  },
  dataAddress: {
    color: "#FFA500",
    fontSize: 14
  },
  txsText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 5,
    marginLeft: 20,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderColor: "#FFA500"
  },
  txDirection: {
    position: 'absolute',
    width: 32,
    height: 32,
    right: 10,
    top: 20
  },
  sendDialog: {
    backgroundColor: "#212529",
    borderColor: "#495057",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10
  },
  toAddress: {
    width: "100%",
    color: "#FFA500",
    backgroundColor: "#212529",
  },
  ammount: {
    borderTopWidth: 1,
    borderColor: "#212529"
  },
  btcPriceWrapper: {
    height: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  btcIcon: {
    marginRight: 5,
    paddingTop: 2
  }
});

export default WalletScreen;