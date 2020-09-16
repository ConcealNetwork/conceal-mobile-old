import { AnimatedCircularProgress } from 'react-native-circular-progress';
import React, { useContext, useState, useEffect } from 'react';
import { Icon, Header } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import { appSettings } from '../constants/appSettings';
import EStyleSheet from 'react-native-extended-stylesheet';
import GuideNavigation from '../helpers/GuideNav';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import Tips from 'react-native-guide-tips';
import Moment from 'moment';
import {
  Text,
  View,
  FlatList
} from 'react-native';
import {
  maskAddress,
  formatOptions,
  getAspectRatio,
} from '../helpers/utils';

let firstVisibleItem = -1;

const handleViewableItemsChanged = (info) => {
  if ((info.viewableItems) && (info.viewableItems.length > 0)) {
    firstVisibleItem = info.viewableItems[0].index;
  } else {
    firstVisibleItem = -1;
  }
}

const Deposits = () => {
  const { actions, state } = useContext(AppContext);
  const { layout, network, deposits } = state;
  const { userLoaded, walletsLoaded, depositsLoaded } = layout;
  const { setAppData, unlockDeposit } = actions;

  let sortedDeposits = deposits.slice().sort(function (a, b) {
    return parseFloat(a.unlockHeight) - parseFloat(b.unlockHeight);
  });

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('deposits', [
    'createDeposit',
    'depositProgress'
  ]));

  const getUnlockTimestamp = (unlockHeight) => {
    let blocksToGo = unlockHeight - network.blockchainHeight;
    let minutesToGo = (blocksToGo * 2) / 60;
    let currentTS = Moment();
    let unlockTS = Moment(currentTS).add(minutesToGo, 'hours');

    return unlockTS.format('"MMM Do YYYY"');
  }

  const getUnlockPercent = (lockHeight, unlockHeight) => {
    if (lockHeight >= unlockHeight) {
      return 100;
    } else {
      let blocksToGo = unlockHeight - network.blockchainHeight;
      return (100 - Math.round(blocksToGo / (unlockHeight - lockHeight) * 100));
    }
  }

  // fire on mount
  useEffect(() => {
    setTimeout(() => {
      setGuideState(guideNavigation.start());
    }, 100);
  }, []);

  return (
    <View style={AppStyles.pageWrapper}>
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
        centerComponent={
          <View style={AppStyles.appHeaderWrapper}>
            <Text style={AppStyles.appHeaderText}>
              Deposits
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
        rightComponent={<Tips
          position={'bottom'}
          visible={guideState == 'addAddress'}
          textStyle={AppStyles.guideTipText}
          style={[AppStyles.guideTipContainer, styles.guideTipAddAddress]}
          tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowAddAddress]}
          text="Click on this button to add an address..."
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <Icon
            onPress={() => {
              setAppData({
                createDeposit: {
                  amount: '',
                  duration: 1,
                  durationText: `Deposit duration: 1 month`,
                }
              });
              NavigationService.navigate('CreateDeposit');
            }}
            name='md-add-circle-outline'
            type='ionicon'
            color='white'
            size={42 * getAspectRatio()}
          /></Tips>}
      />
      <View style={styles.depositListWrapper}>
        {userLoaded && walletsLoaded && depositsLoaded && sortedDeposits.length === 0
          ? (<View style={styles.emptyDepositsWrapper}>
            <Text style={styles.emptyDepositsText}>
              You have no deposits at this time or they are not loaded yet. To create a new deposit, click on the + button.
            </Text>
          </View>)
          : (<FlatList
            data={sortedDeposits}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.depositId.toString()}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            renderItem={({ item, index }) =>
              <View style={styles.flatViewItemWrapper}>
                <View style={styles.depositItemHeader}>
                  <View style={styles.depositItemWrapper}>
                    <Text style={styles.depositItemLabel}>Unlocks:</Text>
                    <Text style={styles.depositItemValue}>{getUnlockTimestamp(item.unlockHeight)}</Text>
                  </View>
                </View>
                <View style={styles.depositItemData}>
                  <View style={styles.depositData}>
                    <View style={styles.depositItemWrapper}>
                      <Text style={styles.depositItemLabel}>Locked:</Text>
                      <Text style={styles.depositItemValue}>{Moment(item.timestamp).format('"MMM Do YYYY"')}</Text>
                    </View>
                    <View style={styles.depositItemWrapper}>
                      <Text style={styles.depositItemLabel}>Amount:</Text>
                      <Text style={styles.depositItemValue}>{(item.amount / appSettings.coinMetrics).toLocaleString(undefined, formatOptions)} CCX</Text>
                    </View>
                    <View style={styles.depositItemWrapper}>
                      <Text style={styles.depositItemLabel}>Interest:</Text>
                      <Text style={styles.depositItemValue}>{(item.interest / appSettings.coinMetrics).toLocaleString(undefined, formatOptions)} CCX</Text>
                    </View>
                    <Text style={styles.depositItemAddress}>
                      {maskAddress(item.address)}
                    </Text>
                  </View>
                  <View style={styles.depositIcon}>
                    {item.locked ?
                      (
                        <AnimatedCircularProgress
                          size={64 * getAspectRatio()}
                          width={8 * getAspectRatio()}
                          backgroundWidth={12 * getAspectRatio()}
                          backgroundColor={AppColors.concealBackground}
                          tintColor={AppColors.concealOrange}
                          fill={getUnlockPercent(item.height, item.unlockHeight)}
                        >
                          {fill => <Text style={styles.depositPercentText}>{getUnlockPercent(item.height, item.unlockHeight)}</Text>}
                        </AnimatedCircularProgress>
                      ) : (
                        <Icon
                          onPress={() => { unlockDeposit(item.depositId) }}
                          name='md-unlock'
                          type='ionicon'
                          color='white'
                          size={64 * getAspectRatio()}
                        />
                      )}
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
  depositListWrapper: {
    top: '80rem',
    left: '10rem',
    right: '10rem',
    bottom: 0,
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
  addressListFooter: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  btnStyle: {
    borderWidth: 0
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
  emptyDepositsWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyDepositsText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  flatViewItemWrapper: {
    flexDirection: 'column',
    backgroundColor: '#212529',
    borderRadius: '10rem',
    marginBottom: '5rem',
    marginTop: '5rem',
  },
  depositItemHeader: {
    borderBottomWidth: '1rem',
    borderColor: 'orange',
    color: '#FFFFFF',
    padding: '10rem',
    margin: '10rem'
  },
  depositItemData: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '20rem',
    flex: 1
  },
  depositItemWrapper: {
    flexDirection: 'row'
  },
  depositItemLabel: {
    color: '#FFA500',
    fontSize: '16rem',
    marginRight: '10rem'
  },
  depositItemValue: {
    color: '#FFFFFF',
    fontSize: '16rem'
  },
  depositItemAddress: {
    color: '#FFA500',
    fontSize: '14rem',
    marginTop: '10rem'
  },
  depositPercentText: {
    color: '#FFFFFF',
    fontSize: '14rem'
  },
  guideTipAddAddress: {
    left: '-130rem'
  },
  guideTipArrowAddAddress: {
    left: '97%'
  },
  guideTipDeleteAddress: {
    left: '20rem'
  },
  guideTipArrowDeleteAddress: {
    left: '27%'
  },
  guideTipEditAddress: {
    left: '-50rem'
  },
  guideTipArrowEditAddress: {
    left: '68%'
  }
});

export default Deposits;
