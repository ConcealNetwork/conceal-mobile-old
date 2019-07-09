import React, { useContext } from 'react';
import { Icon, Header } from 'react-native-elements';
import { IconButton, Colors } from 'react-native-paper';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import Moment from 'moment';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { maskAddress } from '../helpers/utils';


const Wallet = () => {
  const { state } = useContext(AppContext);
  const { appSettings, layout, prices, user, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0 && layout.walletsLoaded
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  const formatOptions = {
    minimumFractionDigits: appSettings.coinDecimals,
    maximumFractionDigits: appSettings.coinDecimals,
  };
  const format4Decimals = { minimumFractionDigits: 4, maximumFractionDigits: 4 };
  const format8Decimals = { minimumFractionDigits: 8, maximumFractionDigits: 8 };
  const transactions = currWallet.transactions.reverse();

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={styles.appHeader}
        centerComponent={{ text: 'Default Wallet', style: { color: '#fff', fontSize: 20 } }}
      />
      {currWallet &&
        <>
          <View style={styles.accountOverview}>
            <Text style={styles.worthDollars}>
              $ {(prices.priceCCXUSD * currWallet.balance).toLocaleString(undefined, format4Decimals)}
            </Text>
            <Text style={styles.amountCCX}>{currWallet.balance.toLocaleString(undefined, formatOptions)} CCX</Text>
            <View style={styles.btcPriceWrapper}>
              <Icon
                containerStyle={styles.btcIcon}
                name='logo-bitcoin'
                type='ionicon'
                color='#FFFFFF'
                size={16}
              />
              <Text style={styles.worthBTC}>
                {(prices.priceCCXBTC * currWallet.balance).toLocaleString(undefined, format8Decimals)}
              </Text>
            </View>
            <IconButton
              size={36}
              icon="settings"
              color={Colors.white}
              style={[styles.iconGeneral, styles.iconSettings]}
              onPress={() => NavigationService.navigate('Settings')}
            />
            <IconButton
              size={36}
              icon="account-balance-wallet"
              color={Colors.white}
              style={[styles.iconGeneral, styles.iconWallets]}
              onPress={() => NavigationService.navigate('Wallets')}
            />
            <IconButton
              size={36}
              icon="library-books"
              color={Colors.white}
              style={[styles.iconGeneral, styles.iconAddressBook]}
              onPress={() => NavigationService.navigate('AddressBook')}
            />
            <IconButton
              size={36}
              icon="show-chart"
              color={Colors.white}
              style={[styles.iconGeneral, styles.iconMarkets]}
            />
          </View>
          <Text style={styles.txsText}>Transactions</Text>
          <View style={styles.transactionsWrapper}>
            <FlatList
              data={transactions}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.hash}
              renderItem={({ item }) =>
                <View style={styles.flatview}>
                  <Text style={styles.dataTimestamp}>
                    {Moment(item.timestamp).format('LLLL')}
                  </Text>
                  <Text style={styles.dataAmount}>
                    {item.amount.toLocaleString(undefined, formatOptions)} CCX (fee: {item.fee})
                  </Text>
                  <Text style={styles.dataAddress}>
                    {maskAddress(item.address)}
                  </Text>

                  <Icon
                    name={item.type === 'received' ? 'md-arrow-down' : 'md-arrow-up'}
                    type='ionicon'
                    size={32}
                    color={item.type === 'received' ? Colors.green500 : Colors.red500}
                    containerStyle={styles.txDirection}
                  />
                </View>
              }
            />
          </View>
          <View style={styles.footer}>
            <ConcealButton
              style={[styles.footerBtn, styles.footerBtnLeft]}
              onPress={() => NavigationService.navigate('Send')}
              text="SEND"
            />
            <ConcealButton
              style={[styles.footerBtn, styles.footerBtnRight]}
              onPress={() => NavigationService.navigate('Receive')}
              text="RECEIVE"
            />
          </View>
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40',
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderColor: '#333333',
    borderRadius: 10,
    marginBottom: 3,
    borderWidth: 1,
    marginTop: 3,
    padding: 20,
  },
  worthDollars: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  amountCCX: {
    color: '#FFA500',
    fontSize: 24,
    margin: 5,
  },
  worthBTC: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  accountOverview: {
    top: 5,
    margin: 10,
    padding: 25,
    height: 125,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212529',
    borderColor: '#333333',
    borderWidth: 1
  },
  footer: {
    bottom: 10,
    left: 10,
    right: 10,
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnRight: {
    marginLeft: 5,
  },
  footerBtnLeft: {
    marginRight: 5,
  },
  Avatar: {
    position: 'absolute',
    right: 10,
  },
  iconGeneral: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
  iconSettings: {
    left: 10,
    top: 10,
  },
  iconWallets: {
    left: 10,
    top: 65,
  },
  iconAddressBook: {
    right: 10,
    top: 10,
  },
  iconMarkets: {
    right: 10,
    top: 65,
  },
  transactionsWrapper: {
    top: 260,
    left: 10,
    right: 10,
    bottom: 70,
    borderRadius: 10,
    position: 'absolute',
  },
  dataTimestamp: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  dataAmount: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  dataAddress: {
    color: '#FFA500',
    fontSize: 14,
  },
  txsText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 5,
    marginLeft: 10,
    paddingLeft: 0
  },
  txDirection: {
    position: 'absolute',
    width: 32,
    height: 32,
    right: 10,
    top: 20,
  },
  sendDialog: {
    backgroundColor: '#212529',
    borderColor: '#495057',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  toAddress: {
    width: '100%',
    color: '#FFA500',
    backgroundColor: '#212529',
  },
  amount: {
    borderTopWidth: 1,
    borderColor: '#212529',
  },
  btcPriceWrapper: {
    height: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  btcIcon: {
    marginRight: 5,
    paddingTop: 2,
  },
});

export default Wallet;