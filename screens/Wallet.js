import React, { useContext, useState, useEffect } from 'react';
import { Icon, Header } from 'react-native-elements';
import { Text, View, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppColors } from '../constants/Colors';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import GuideNavigation from '../helpers/GuideNav';
import AppStyles from '../components/Style';
import { sprintf } from 'sprintf-js';
import Tips from 'react-native-guide-tips';
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

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('wallet', [
    'overall',
    'messages',
    'wallets',
    'addresses',
    'market',
    'send',
    'receive'
  ]));

  if (currWallet && currWallet.transactions) {
    transactions = currWallet.transactions.slice().reverse();
  }

  // fire on mount
  useEffect(() => {
    if (currWallet) {
      setTimeout(() => {
        setGuideState(guideNavigation.start());
      }, 100);
    }
  }, []);

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        centerComponent={
          <View style={AppStyles.appHeaderWrapper}>
            <Text style={AppStyles.appHeaderText}>
              Selected Wallet
            </Text>
            <Icon
              onPress={() => {
                if (currWallet) {
                  guideNavigation.reset();
                  setGuideState(guideNavigation.start());
                }
              }}
              name='md-help'
              type='ionicon'
              color='white'
              size={26 * getAspectRatio()}
            />
          </View>
        }
        rightComponent={
          <Icon
            onPress={() => {
              NavigationService.navigate('AppMenu');
            }}
            name='md-menu'
            type='ionicon'
            color='white'
            size={32 * getAspectRatio()}
          />
        }
      />
      {currWallet
        ? (<View style={styles.walletWrapper}>
          <View style={styles.accountOverview}>
            <View style={styles.iconsLeft}>
              <View style={[styles.iconWrapper]}>
                <Tips
                  position={'right'}
                  visible={guideState == 'messages'}
                  textStyle={AppStyles.guideTipText}
                  tooltipArrowStyle={AppStyles.guideTipArrowLeft}
                  style={[AppStyles.guideTipContainer, styles.guideTipMessages]}
                  text="Click here to read and send new messages"
                  onRequestClose={() => setGuideState(guideNavigation.next())}
                >
                  <Icon
                    containerStyle={styles.iconGeneral}
                    onPress={() => NavigationService.navigate('Messages')}
                    name='md-mail'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </Tips>
              </View>
              <View style={[styles.iconWrapper]}>
                <Tips
                  position={'right'}
                  visible={guideState == 'wallets'}
                  textStyle={AppStyles.guideTipText}
                  tooltipArrowStyle={AppStyles.guideTipArrowLeft}
                  style={[AppStyles.guideTipContainer, styles.guideTipWallets]}
                  text="Click here to manage and select your wallets"
                  onRequestClose={() => setGuideState(guideNavigation.next())}
                >
                  <Icon
                    containerStyle={styles.iconGeneral}
                    onPress={() => NavigationService.navigate('Wallets')}
                    name='md-wallet'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </Tips>
              </View>
            </View>
            <View style={styles.walletState}>
              <Tips
                position={'top'}
                visible={guideState == 'overall'}
                style={AppStyles.guideTipContainer}
                textStyle={AppStyles.guideTipText}
                tooltipArrowStyle={AppStyles.guideTipArrowBottom}
                text="Here you can see your overall funds current state"
                onRequestClose={() => setGuideState(guideNavigation.next())}
              >
                <View style={styles.walletStateWrapper}>
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
              </Tips>
            </View>
            <View style={styles.iconsRight}>
              <View style={[styles.iconWrapper]}>
                <Tips
                  position={'left'}
                  visible={guideState == 'addresses'}
                  textStyle={AppStyles.guideTipText}
                  tooltipArrowStyle={AppStyles.guideTipArrowRight}
                  style={[AppStyles.guideTipContainer, styles.guideTipAddressBook]}
                  text="Click here to edit and manage your address book"
                  onRequestClose={() => setGuideState(guideNavigation.next())}
                >
                  <Icon
                    containerStyle={styles.iconGeneral}
                    onPress={() => NavigationService.navigate('AddressBook')}
                    name='md-book'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </Tips>
              </View>
              <View style={[styles.iconWrapper]}>
                <Tips
                  position={'left'}
                  visible={guideState == 'market'}
                  textStyle={AppStyles.guideTipText}
                  tooltipArrowStyle={AppStyles.guideTipArrowRight}
                  style={[AppStyles.guideTipContainer, styles.guideTipMarket]}
                  text="Click here to deposit and withdraw your funds"
                  onRequestClose={() => setGuideState(guideNavigation.next())}
                >
                  <Icon
                    containerStyle={styles.iconGeneral}
                    onPress={() => NavigationService.navigate('Deposits')}
                    name='md-cube'
                    type='ionicon'
                    color='#FFFFFF'
                    size={40 * getAspectRatio()}
                  />
                </Tips>
              </View>
            </View>
          </View>
          <View style={styles.txAreaWrapper}>
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
          </View>
          <View style={styles.footer}>
            <View style={[styles.footerBtn, styles.footerBtnLeft]}>
              <Tips
                position={'top'}
                visible={guideState == 'send'}
                textStyle={AppStyles.guideTipText}
                text="Click here to send funds to other people"
                style={[AppStyles.guideTipContainer, styles.guideTipSend]}
                tooltipArrowStyle={[AppStyles.guideTipArrowBottom, styles.guideTipArrowSend]}
                onRequestClose={() => setGuideState(guideNavigation.next())}
              >
                <ConcealButton
                  style={styles.footerBtnInner}
                  onPress={() => {
                    setAppData({
                      sendScreen: {
                        toAmount: '',
                        toAddress: '',
                        toPaymendId: '',
                        toLabel: ''
                      }
                    });
                    NavigationService.navigate('SendPayment')
                  }}
                  disabled={currWallet.balance < 0.0001}
                  text="SEND"
                />
              </Tips>
            </View>
            <View style={[styles.footerBtn, styles.footerBtnRight]}>
              <Tips
                position={'top'}
                visible={guideState == 'receive'}
                textStyle={AppStyles.guideTipText}
                text="Click here to receive funds from other people"
                style={[AppStyles.guideTipContainer, styles.guideTipReceive]}
                tooltipArrowStyle={[AppStyles.guideTipArrowBottom, styles.guideTipArrowReceive]}
                onRequestClose={() => setGuideState(guideNavigation.next())}
              >
                <ConcealButton
                  onPress={() => NavigationService.navigate('Receive')}
                  style={styles.footerBtnInner}
                  text="RECEIVE"
                />
              </Tips>
            </View>
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
    flexDirection: 'row'
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnRight: {
    marginLeft: '5rem',
    width: '100%'
  },
  footerBtnLeft: {
    marginRight: '0rem',
    width: '100%'
  },
  iconGeneral: {
    width: '36rem',
    height: '36rem',
  },
  transactionsWrapper: {
    flexGrow: 1,
    alignSelf: 'stretch'
  },
  txAreaWrapper: {
    flexGrow: 1,
    padding: '10rem',
    alignSelf: 'stretch',
    flexDirection: 'column'
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
    fontSize: '18rem'
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: '15rem',
    paddingBottom: '15rem'
  },
  iconsRight: {
    padding: '10rem',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: '15rem',
    paddingBottom: '15rem'
  },
  walletState: {
    flexGrow: 2,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  walletStateWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  txsList: {
    height: '0rem'
  },
  footerBtnInner: {
    width: '100%'
  },
  guideTipAddressBook: {
    left: '255rem'
  },
  guideTipMarket: {
    left: '255rem'
  },
  guideTipMessages: {
    left: '10rem'
  },
  guideTipWallets: {
    left: '10rem'
  },
  guideTipSend: {
    left: '20rem',
    top: '-5rem'
  },
  guideTipReceive: {
    left: '-60rem',
    top: '-5rem'
  },
  guideTipArrowSend: {
    left: '23%'
  },
  guideTipArrowReceive: {
    left: '72%'
  }
});

export default Wallet;