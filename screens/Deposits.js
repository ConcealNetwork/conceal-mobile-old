import { AnimatedCircularProgress } from 'react-native-circular-progress';
import React, { useContext, useState, useEffect } from 'react';
import { Icon, Header } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
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

const TestData = [
  {
    id: 1,
    status: "spent",
    amount: 5000,
    interest: 43.20004,
    interestRate: 0.864000,
    unlockHeight: 352241,
    unlockTime: "2019-09-11 15:11",
    createHeight: 291762,
    createTime: "2019-07-19 21:15",
    address: "ccx7ZuCP9NA2KmnxbyBn9QgeLSATHXHRAXVpxgiaNxsH4GwMvQ92SeYhEeF2tJHADHbW4bZMFHvFf8GpucLrRyw49q4Gkc3AXM"
  }, {
    id: 2,
    status: "spent",
    amount: 10000,
    interest: 86.40008,
    interestRate: 0.864000,
    unlockHeight: 312178,
    unlockTime: "2019-06-24 15:11",
    createHeight: 251699,
    createTime: "2019-05-24 21:31",
    address: "ccx7ZuCP9NA2KmnxbyBn9QgeLSATHXHRAXVpxgiaNxsH4GwMvQ92SeYhEeF2tJHADHbW4bZMFHvFf8GpucLrRyw49q4Gkc3AXM"
  }, {
    id: 3,
    status: "locked",
    amount: 30000,
    interest: 962.500032,
    interestRate: 3.208333,
    unlockHeight: 583037,
    unlockTime: "2020-08-30 15:11",
    createHeight: 429738,
    createTime: "2020-01-28 20:43",
    address: "ccx7ZuCP9NA2KmnxbyBn9QgeLSATHXHRAXVpxgiaNxsH4GwMvQ92SeYhEeF2tJHADHbW4bZMFHvFf8GpucLrRyw49q4Gkc3AXM"
  }
]

const Deposits = () => {
  const { actions, state } = useContext(AppContext);
  const { setAppData } = actions;
  const { layout, user } = state;
  let addressList = [];

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('addressBook', [
    'addressSearch',
    'addAddress',
    'deleteAddress',
    'editAddress'
  ]));

  user.addressBook.forEach(function (value, index, array) {
    var isValidItem = true;

    // check if the text filter is set
    if (state.appData.addressBook.filterText && (value.label.toLowerCase().search(state.appData.addressBook.filterText.toLowerCase()) == -1)) {
      isValidItem = false;
    }

    if (isValidItem) {
      addressList.push(value);
    }
  });

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
                addressEntry: {
                  headerText: "Create Address",
                  label: '',
                  address: '',
                  paymentId: '',
                  entryId: null
                }
              });
              NavigationService.navigate('EditAddress', { callback: null });
            }}
            name='md-add-circle-outline'
            type='ionicon'
            color='white'
            size={42 * getAspectRatio()}
          /></Tips>}
      />
      <View style={styles.depositListWrapper}>
        {layout.userLoaded && TestData.length === 0
          ? (<View style={styles.emptyDepositsWrapper}>
            <Text style={styles.emptyDepositsText}>
              You have no deposits at this time. To create a new deposit, click on the + button.
            </Text>
          </View>)
          : (<FlatList
            data={TestData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            renderItem={({ item, index }) =>
              <View style={styles.flatview}>
                <View style={styles.depositData}>
                  <View style={styles.depositItemWrapper}>
                    <Text style={styles.depositItemLabel}>Locked:</Text>
                    <Text style={styles.depositItemValue}>{Moment(item.createTime).format('"MMM Do YYYY"')}</Text>
                  </View>
                  <View style={styles.depositItemWrapper}>
                    <Text style={styles.depositItemLabel}>Unlocks:</Text>
                    <Text style={styles.depositItemValue}>{Moment(item.unlockTime).format('"MMM Do YYYY"')}</Text>
                  </View>
                  <View style={styles.depositItemWrapper}>
                    <Text style={styles.depositItemLabel}>Amount:</Text>
                    <Text style={styles.depositItemValue}>{item.amount.toLocaleString(undefined, formatOptions)} CCX</Text>
                  </View>
                  <View style={styles.depositItemWrapper}>
                    <Text style={styles.depositItemLabel}>Interest:</Text>
                    <Text style={styles.depositItemValue}>{item.interest.toLocaleString(undefined, formatOptions)} CCX</Text>
                  </View>
                  <Text style={styles.depositItemAddress}>
                    {maskAddress(item.address)}
                  </Text>
                </View>
                <View style={styles.depositIcon}>
                  <AnimatedCircularProgress
                    size={64 * getAspectRatio()}
                    width={8 * getAspectRatio()}
                    backgroundWidth={12 * getAspectRatio()}
                    backgroundColor={AppColors.concealBackground}
                    tintColor={AppColors.concealOrange}
                    fill={(item.status === "spent") ? 100 : 75}
                  >
                    {fill => <Text style={styles.depositPercentText}>{(item.status === "spent") ? 100 : 75}</Text>}
                  </AnimatedCircularProgress>
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
  flatview: {
    justifyContent: 'space-between',
    backgroundColor: '#212529',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '10rem',
    marginBottom: '5rem',
    marginTop: '5rem',
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
