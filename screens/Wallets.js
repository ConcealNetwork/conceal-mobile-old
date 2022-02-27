import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { CheckBox, Header, Icon } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import Tips from 'react-native-guide-tips';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import GuideNavigation from '../helpers/GuideNav';
import { format4Decimals, getAspectRatio, maskAddress, } from '../helpers/utils';

let firstVisibleItem = -1;

const handleViewableItemsChanged = (info) => {
  if ((info.viewableItems) && (info.viewableItems.length > 0)) {
    firstVisibleItem = info.viewableItems[0].index;
  } else {
    firstVisibleItem = -1;
  }
}

const Wallets = ({ navigation: { goBack, popToTop } }) => {
  const { actions, state } = useContext(AppContext);
  const { createWallet, deleteWallet, switchWallet, setDefaultWallet, getWalletKeys } = actions;
  const { appSettings, layout, wallets, appData } = state;
  const { walletsLoaded } = layout;

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('wallets', [
    'addWallet',
    'deleteWallet',
    'exportWallet'
  ], function (nextState) {
    if ((nextState === 'addWallet') && !(walletsLoaded && (walletsList.length < appSettings.maxWallets || walletsList.length === 0))) {
      setGuideState(guideNavigation.next());
    }
  }));

  const walletsList = Object.keys(wallets)
    .reduce((acc, curr) => {
      const wallet = wallets[curr];
      wallet.address = curr;
      acc.push(wallet);
      return acc;
    }, []);

  // fire on mount
  useEffect(() => {
    setTimeout(() => {
      setGuideState(guideNavigation.start());
    }, 100);
  }, []);

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement='left'
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => goBack()}
          name='arrow-back-outline'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={
          <View style={AppStyles.appHeaderWrapper}>
            <Text style={AppStyles.appHeaderText}>
              Wallets
            </Text>
            <Icon
              onPress={() => {
                guideNavigation.reset();
                setGuideState(guideNavigation.start());
              }}
              name='md-help'
              type='ionicon'
              color='white'
              size={26 * getAspectRatio()}
            />
          </View>
        }
        rightComponent={walletsLoaded && (walletsList.length < appSettings.maxWallets || walletsList.length === 0) ?
          (
            <Tips
              position={'bottom'}
              visible={guideState === 'addWallet'}
              textStyle={AppStyles.guideTipText}
              style={[AppStyles.guideTipContainer, styles.guideTipAddWallet]}
              tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowAddWallet]}
              text="Click on this button to add a new wallet..."
              onRequestClose={() => setGuideState(guideNavigation.next())}
            >
              < Icon
                onPress={() => createWallet()}
                name='md-add-circle-outline'
                type='ionicon'
                color='white'
                size={42 * getAspectRatio()}
              />
            </Tips>) : null}
      />
      <View style={styles.walletsWrapper}>
        {layout.userLoaded && walletsList.length === 0
          ? (<View style={styles.emptyWalletsWrapper}>
            <Text style={styles.emptyWalletsText}>
              You have no wallets currently. Please create a wallet by clicking on the + button, to start using Conceal Mobile.
            </Text>
          </View>)
          : (<FlatList
            data={walletsList}
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.address}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            renderItem={({ item, index }) =>
              <View style={(item.addr === appData.common.selectedWallet) ? [styles.flatview, styles.walletSelected] : styles.flatview}>
                <TouchableOpacity onPress={() => switchWallet(item.address)}>
                  <View>
                    <Text style={styles.address}>{maskAddress(item.address)}</Text>
                    <Text style={styles.balance}>Balance: {item.total ? item.total.toLocaleString(undefined, format4Decimals) : 0} CCX</Text>
                    <Text style={(item.locked && item.locked > 0) ? [styles.data, styles.lockedText] : styles.data}>Locked: {item.locked ? item.locked.toLocaleString(undefined, format4Decimals) : 0} CCX</Text>
                    <Text style={styles.data}>{item.status}</Text>
                    <View style={styles.selectedWrapper}>
                      <CheckBox
                        center
                        size={36 * getAspectRatio()}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={item.default}
                        onPress={() => {
                          setDefaultWallet(item.address);
                          popToTop();
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.walletFooter}>
                  <View style={styles.btnWrapper}>
                    <Tips
                      position={'bottom'}
                      visible={(guideState === 'deleteWallet') && (index === firstVisibleItem)}
                      textStyle={AppStyles.guideTipText}
                      style={[AppStyles.guideTipContainer, styles.guideTipDeleteWallet]}
                      tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowDeleteWallet]}
                      text="Click on this button to delete the wallet..."
                      onRequestClose={() => setGuideState(guideNavigation.next())}
                    >
                      <ConcealButton
                        style={[!(walletsLoaded && (item.total > 0)) ? styles.footerBtn : styles.footerBtnDisabled, styles.footerBtnLeft]}
                        disabled={(walletsLoaded && (item.total > 0))}
                        buttonStyle={styles.btnStyle}
                        onPress={() => {
                          Alert.alert(
                            'Delete Wallet',
                            'You are about to delete this wallet PERMANENTLY! Do you really wish to proceed?',
                            [
                              { text: 'OK', onPress: () => deleteWallet(item.address) },
                              { text: 'Cancel', style: 'cancel' },
                            ],
                            { cancelable: false },
                          );
                        }} I
                        text="DELETE"
                      />
                    </Tips>
                  </View>
                  <View style={styles.btnWrapper}>
                    <Tips
                      position={'bottom'}
                      visible={(guideState === 'exportWallet') && (index === firstVisibleItem)}
                      textStyle={AppStyles.guideTipText}
                      style={[AppStyles.guideTipContainer, styles.guideTipExportWallet]}
                      tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowExportWallet]}
                      text="Click on this button to export the wallet..."
                      onRequestClose={() => setGuideState(guideNavigation.next())}
                    >
                      <ConcealButton
                        style={[styles.footerBtn, styles.footerBtnRight]}
                        buttonStyle={styles.btnStyle}
                        onPress={() => {
                          Alert.alert(
                            'Export Keys',
                            'You are about to export the keys. Do you really wish to proceed?',
                            [
                              { text: 'OK', onPress: () => getWalletKeys(item.address, true) },
                              { text: 'Cancel', style: 'cancel' },
                            ],
                            { cancelable: false },
                          );
                        }}
                        text="EXPORT"
                      />
                    </Tips>
                  </View>
                </View>
              </View>
            }
          />)
        }
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  selectedWrapper: {
    position: 'absolute',
    right: 0,
    top: '15rem'
  },
  icon: {
    color: 'orange'
    //color: '#CCC'
  },
  flatList: {
    height: '100%',
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderColor: AppColors.concealBorderColor,
    borderRadius: 10,
    marginBottom: '5rem',
    borderWidth: 1,
    marginTop: '5rem',
    padding: '20rem',
  },
  walletSelected: {
    borderColor: AppColors.concealOrange,
    borderWidth: 2
  },
  address: {
    color: '#FFFFFF',
    fontSize: '18rem'
  },
  balance: {
    color: '#FFA500',
    fontSize: '14rem'
  },
  data: {
    color: '#AAAAAA',
    fontSize: '14rem'
  },
  buttonContainer: {
    margin: '5rem'
  },
  walletsWrapper: {
    flex: 1,
    padding: '10rem'
  },
  walletFooter: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnStyle: {
    borderWidth: 0
  },
  btnWrapper: {
    flexGrow: 1,
  },
  footerBtn: {
    height: '40rem',
    marginTop: '10rem',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnDisabled: {
    height: '40rem',
    marginTop: '10rem',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnRight: {
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  },
  buttonText: {
    color: '#FFFFFF'
  },
  lockedText: {
    color: '#FF0000',
    fontSize: '14rem'
  },
  emptyWalletsWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyWalletsText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  guideTipAddWallet: {
    left: '-130rem'
  },
  guideTipArrowAddWallet: {
    left: '97%'
  },
  guideTipDeleteWallet: {
    left: '20rem'
  },
  guideTipArrowDeleteWallet: {
    left: '27%'
  },
  guideTipExportWallet: {
    left: '-50rem'
  },
  guideTipArrowExportWallet: {
    left: '68%'
  }
});

export default Wallets;
