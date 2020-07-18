import React, { useContext, useState } from 'react';
import { Icon, Header } from 'react-native-elements';
import { Text, View, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppColors } from '../constants/Colors';
import NavigationService from '../helpers/NavigationService';
import { startWalkthrough, WalkthroughElement } from 'react-native-walkthrough';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import AppStyles from '../components/Style';
import { sprintf } from 'sprintf-js';
import Moment from 'moment';
import {
  maskAddress,
  formatOptions,
  getAspectRatio,
  format4Decimals,
  format8Decimals,
} from '../helpers/utils';

const Wallet = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData, createWallet } = actions;
  const { layout, prices, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];
  var transactions = [];

  if (currWallet && currWallet.transactions) {
    transactions = currWallet.transactions.slice().reverse();
  }

  const makeTooltipContent = text => (
    <View style={styles.tooltipView}>
      <Text style={styles.tooltipText}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        centerComponent={{ text: 'Selected Wallet', style: AppStyles.appHeaderText }}
        rightComponent={<Icon
          onPress={() => {
            //NavigationService.navigate('Settings'); 
            startWalkthrough([{
              id: 'wallet-overall',
              content: makeTooltipContent('This is your overall wallet state'),
            }, {
              id: 'wallet-messages',
              content: makeTooltipContent('Here you can read or send messages'),
            }, {
              id: 'wallet-wallets',
              content: makeTooltipContent('Here you can change or create wallets'),
            }, {
              id: 'wallet-addressbook',
              content: makeTooltipContent('Here you can edit your addresses'),
            }, {
              id: 'wallet-market',
              content: makeTooltipContent('Here you can see markets data'),
            }]);
          }}
          name='md-settings'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      {currWallet
        ? (<View style={styles.walletWrapper}>
          <WalkthroughElement id="wallet-overall">
            <View style={styles.accountOverview}>
              <View style={styles.iconsLeft}>
                <WalkthroughElement id="wallet-messages">
                  <Icon
                    containerStyle={[styles.iconGeneral, styles.iconMessages]}
                    onPress={() => NavigationService.navigate('Messages')}
                    name='md-mail'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </WalkthroughElement>
                <WalkthroughElement id="wallet-wallets">
                  <Icon
                    containerStyle={[styles.iconGeneral, styles.iconWallets]}
                    onPress={() => NavigationService.navigate('Wallets')}
                    name='md-wallet'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </WalkthroughElement>
              </View>
              <View style={styles.walletState}>
                <Text style={styles.worthDollars}>
                  $ {(prices.usd * currWallet.balance).toLocaleString(undefined, format4Decimals)}
                </Text>
                <Text style={styles.amountCCX}>{currWallet.balance.toLocaleString(undefined, format4Decimals)} CCX</Text>
                <View style={styles.btcPriceWrapper}>
                  <Icon
                    containerStyle={styles.btcIcon}
                    name={currWallet.locked ? 'md-lock' : 'logo-bitcoin'}
                    type='ionicon'
                    color={currWallet.locked ? '#FF0000' : '#FFFFFF'}
                    size={16 * getAspectRatio()}
                  />
                  <Text style={currWallet.locked ? [styles.worthBTC, styles.lockedText] : styles.worthBTC}>
                    {
                      currWallet.locked
                        ? sprintf('%s CCX', currWallet.locked.toLocaleString(undefined, format4Decimals))
                        : (prices.btc * currWallet.balance).toLocaleString(undefined, format8Decimals)
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.iconsRight}>
                <WalkthroughElement id="wallet-addressbook">
                  <Icon
                    containerStyle={[styles.iconGeneral, styles.iconAddressBook]}
                    onPress={() => NavigationService.navigate('AddressBook')}
                    name='md-book'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </WalkthroughElement>
                <WalkthroughElement id="wallet-market">
                  <Icon
                    containerStyle={[styles.iconGeneral, styles.iconMarkets]}
                    onPress={() => NavigationService.navigate('Market')}
                    name='md-trending-up'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </WalkthroughElement>
              </View>
            </View>
          </WalkthroughElement>
          <Text style={styles.txsText}>Transactions</Text>
          <View style={styles.transactionsWrapper}>
            {layout.userLoaded && transactions.length === 0
              ? <Text style={styles.emptyTransactionsText}>
                You have no transactions in this wallet yet.
                To make a transaction either send some funds or receive them.
            </Text>
              : <FlatList
                data={transactions}
                style={styles.txsList}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.hash}
                renderItem={({ item }) =>
                  <View style={styles.flatview}>
                    <View style={styles.txData}>
                      <Text style={styles.dataTimestamp}>
                        {Moment(item.timestamp).format('LLLL')}
                      </Text>
                      <Text style={styles.dataAmount}>
                        {item.amount.toLocaleString(undefined, formatOptions)} CCX (fee: {item.fee})
                    </Text>
                      <Text style={styles.dataAddress}>
                        {maskAddress(item.address)}
                      </Text>
                      {(item.status === "pending") ? (<Text style={styles.dataPending}>PENDING</Text>) : null}
                    </View>
                    <Icon
                      name={item.type === 'received' ? 'md-arrow-down' : 'md-arrow-up'}
                      type='ionicon'
                      size={32 * getAspectRatio()}
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
                    toAmount: '',
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
        </View>) :
        (<View style={styles.emptyWalletWrapper}>
          <Text style={styles.emptyWalletText}>
            You have no active wallets. Please create a one to start using Conceal Mobile
          </Text>
          <ConcealButton
            style={styles.crateWalletBtn}
            onPress={() => createWallet()}
            text="CREATE WALLET"
          />
        </View>)
      }
    </View>
  );
};

const styles = EStyleSheet.create({
  pageWrapper: {
    backgroundColor: 'rgb(40, 45, 49)',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  flatview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: AppColors.concealBlack,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: '15rem',
    paddingLeft: '10rem',
    paddingRight: '0rem'
  },
  worthDollars: {
    color: '#FFFFFF',
    fontSize: '14rem',
  },
  amountCCX: {
    color: '#FFA500',
    fontSize: '24rem',
    margin: '5rem',
  },
  worthBTC: {
    color: '#FFFFFF',
    fontSize: '14rem',
  },
  accountOverview: {
    top: '5rem',
    padding: '5rem',
    width: '100%',
    marginBottom: '10rem',
    aspectRatio: 2.5 / 1,
    borderRadius: 10,
    backgroundColor: '#212529',
    borderColor: AppColors.concealBorderColor,
    flexDirection: 'row',
    borderWidth: 1,
  },
  footer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnRight: {
    marginLeft: '5rem',
  },
  footerBtnLeft: {
    marginRight: 5,
  },
  iconGeneral: {
    width: '36rem',
    height: '36rem',
  },
  iconMessages: {
    top: '0rem',
  },
  iconWallets: {
    top: '25rem',
  },
  iconAddressBook: {
    top: '0rem',
  },
  iconMarkets: {
    top: '25rem',
  },
  transactionsWrapper: {
    flexGrow: 1,
    padding: '10rem',
    alignSelf: 'stretch'
  },
  dataTimestamp: {
    color: '#FFFFFF',
    fontSize: '14rem',
  },
  dataAmount: {
    color: '#FFFFFF',
    fontSize: '20rem',
  },
  dataAddress: {
    color: '#FFA500',
    fontSize: '14rem',
  },
  dataPending: {
    color: "#FF0000"
  },
  txsText: {
    color: '#FFFFFF',
    fontSize: '18rem',
    marginTop: '5rem',
    marginLeft: '10rem',
    paddingLeft: 0
  },
  txDirection: {
    width: '32rem',
    height: '32rem',
    right: '10rem',
    top: '20rem'
  },
  btcPriceWrapper: {
    height: '20rem',
    display: 'flex',
    flexDirection: 'row',
  },
  btcIcon: {
    marginRight: '5rem',
    paddingTop: '2rem',
  },
  emptyTransactionsText: {
    fontSize: '18rem',
    marginTop: '20rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  lockedText: {
    color: '#FF0000'
  },
  emptyWalletWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyWalletText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  crateWalletBtn: {
    marginTop: '30rem',
    paddingLeft: '15rem',
    paddingRight: '15rem'
  },
  walletWrapper: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    padding: '10rem',
    flexGrow: 1
  },
  iconsLeft: {
    padding: '10rem',
  },
  iconsRight: {
    padding: '10rem',
  },
  walletState: {
    flexGrow: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txsList: {
    height: '0rem'
  },
  tooltipView: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  tooltipText: {
    color: 'black',
    fontSize: '16rem',
  },
});

export default Wallet;