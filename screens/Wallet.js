import React, { useContext } from 'react';
import { Icon, Header } from 'react-native-elements';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import Moment from 'moment';
import { AppColors } from '../constants/Colors';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import {
  maskAddress,
  formatOptions,
  format0Decimals,
  format2Decimals,
  format4Decimals,
  format8Decimals
} from '../helpers/utils';


const Wallet = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { appSettings, layout, prices, user, wallets } = state;
  const currWallet = wallets[global.selectedWallet];
  var transactions = [];

  if (currWallet && currWallet.transactions) {
    transactions = currWallet.transactions.reverse();
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={styles.appHeader}
        centerComponent={{ text: 'Selected Wallet', style: { color: '#fff', fontSize: 20 } }}
      />
      {currWallet &&
        <>
          <View style={styles.accountOverview}>
            <Text style={styles.worthDollars}>
              $ {(prices.usd * currWallet.balance).toLocaleString(undefined, format4Decimals)}
            </Text>
            <Text style={styles.amountCCX}>{currWallet.balance.toLocaleString(undefined, format2Decimals)} CCX</Text>
            <View style={styles.btcPriceWrapper}>
              <Icon
                containerStyle={styles.btcIcon}
                name='logo-bitcoin'
                type='ionicon'
                color='#FFFFFF'
                size={16}
              />
              <Text style={styles.worthBTC}>
                {(prices.btc * currWallet.balance).toLocaleString(undefined, format8Decimals)}
              </Text>
            </View>
            <Icon
              containerStyle={[styles.iconGeneral, styles.iconSettings]}
              onPress={() => NavigationService.navigate('Settings')}
              name='md-settings'
              type='ionicon'
              color='#FFFFFF'
              size={36}
            />
            <Icon
              containerStyle={[styles.iconGeneral, styles.iconWallets]}
              onPress={() => NavigationService.navigate('Wallets')}
              name='md-wallet'
              type='ionicon'
              color='#FFFFFF'
              size={36}
            />
            <Icon
              containerStyle={[styles.iconGeneral, styles.iconAddressBook]}
              onPress={() => NavigationService.navigate('AddressBook')}
              name='md-book'
              type='ionicon'
              color='#FFFFFF'
              size={36}
            />
            <Icon
              containerStyle={[styles.iconGeneral, styles.iconMarkets]}
              onPress={() => NavigationService.navigate('Market')}
              name='md-trending-up'
              type='ionicon'
              color='#FFFFFF'
              size={36}
            />
          </View>
          <Text style={styles.txsText}>Transactions</Text>
          <View style={styles.transactionsWrapper}>
            {layout.userLoaded && transactions.length === 0
              ? <Text style={styles.emptyTransactionsText}>
                You have no transactions in this wallet yet.
                To make a transaction either send some funds or receive them.
            </Text>
              : <FlatList
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
                      color={item.type === 'received' ? "green" : "red"}
                      containerStyle={styles.txDirection}
                    />
                  </View>
                }
              />
            }
          </View>
          <View style={styles.footer}>
            <ConcealButton
              style={[styles.footerBtn, styles.footerBtnLeft]}
              onPress={() => {
                setAppData({
                  sendScreen: {
                    toAmmount: '',
                    toAddress: '',
                    toPaymendId: '',
                    toLabel: ''
                  }
                });
                NavigationService.navigate('Send')
              }}
              disabled={currWallet.balance < 0.0001}
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
    justifyContent: 'center',
    borderBottomColor: AppColors.concealBlack,
    borderWidth: 0,
    borderBottomWidth: 1,
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
    borderColor: AppColors.concealBorderColor,
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
    justifyContent: 'space-between'
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
  iconGeneral: {
    position: 'absolute',
    width: 36,
    height: 36,
  },
  iconSettings: {
    left: 15,
    top: 15,
  },
  iconWallets: {
    left: 15,
    top: 70,
  },
  iconAddressBook: {
    right: 15,
    top: 15,
  },
  iconMarkets: {
    right: 15,
    top: 70,
  },
  transactionsWrapper: {
    top: 260,
    left: 10,
    right: 10,
    bottom: 70,
    position: 'absolute'
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
  emptyTransactionsText: {
    fontSize: 16,
    marginTop: 20,
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

export default Wallet;