import Slider from '@react-native-community/slider';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import Tips from 'react-native-guide-tips';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import GuideNavigation from '../helpers/GuideNav';
import {
  format4Decimals,
  format6Decimals,
  getAspectRatio,
  getDepositInterest,
  maskAddress,
  parseLocaleNumber
} from '../helpers/utils';

const CreateDepositScreen = ({ navigation: { goBack, navigate } }) => {
  const { state } = useContext(AppContext);
  const { appSettings, wallets } = state;
  const currWallet = wallets[Object.keys(wallets).find(i => wallets[i].default)];

  const [amount, setAmount] = useState(null)
  const [duration, setDuration] = useState(1)
  const sendSummaryList = [];

  if (duration) {
    sendSummaryList.push({
      value: `${duration} month${duration > 1 ? 's' : ''}`,
      title: 'Deposit Duration',
      icon: 'timer-outline'
    });
  }

  if (amount) {
    sendSummaryList.push({
      value: `${parseLocaleNumber(amount, true).toLocaleString(undefined, format6Decimals)} CCX`,
      title: 'Deposit Amount',
      icon: 'md-cash'
    });

    sendSummaryList.push({
      value: `${appSettings.defaultFee} CCX`,
      title: 'Transaction Fee',
      icon: 'md-cash'
    });
  }

  if (duration && amount) {
    sendSummaryList.push({
      value: `${getDepositInterest(parseLocaleNumber(amount, true), duration).toLocaleString(undefined, format6Decimals)} CCX`,
      title: 'Interest earned',
      icon: 'md-cash'
    });
  }

  const renderItem = ({ item }) =>
    <ListItem containerStyle={styles.summaryItem} key={item.value} onPress={item.onPress}>
      <Icon name={item.icon} type='ionicon' color='white' size={32 * getAspectRatio()} />
      <ListItem.Content>
        <ListItem.Title style={styles.summaryText}>{item.value}</ListItem.Title>
        <ListItem.Subtitle style={styles.summaryLabel}>{item.title}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>

  const isFormValid = () => {
    if (duration && amount) {
      let amountAsFloat = parseLocaleNumber(amount, true);
      return ((amountAsFloat >= 1) && (amountAsFloat <= (currWallet.balance - appSettings.defaultFee)));
    } else {
      return false;
    }
  }

  const clearSend = () => {
    setAmount(null);
    setDuration(1);
  }

  const getAmountError = () => {
    let amountAsFloat = parseLocaleNumber(amount, true);
    if ((amountAsFloat < 1) && (amount)) {
      return "Amount must be at least 1 CCX"
    } else if (amountAsFloat > (currWallet.balance - state.appSettings.defaultFee)) {
      return "The amount exceeds wallet balance"
    } else {
      return "";
    }
  }

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('createDeposit', [
    'balance', 'amount', 'duration', 'clear', 'create', 'cancel'
  ]));

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
              Create Deposit
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
          visible={guideState === 'clear'}
          textStyle={AppStyles.guideTipText}
          style={[AppStyles.guideTipContainer, styles.guideTipClearDeposit]}
          tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowClearDeposit]}
          text="Click on this button to clear deposit info..."
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <Icon
            onPress={() => clearSend()}
            name='md-trash'
            type='ionicon'
            color='white'
            size={32 * getAspectRatio()}
          /></Tips>}
      />
      <View style={styles.walletWrapper}>
        <Tips
          position={'top'}
          visible={guideState === 'balance'}
          textStyle={AppStyles.guideTipText}
          tooltipArrowStyle={AppStyles.guideTipArrowBottom}
          style={[AppStyles.guideTipContainer, styles.guideTipBalance]}
          text="Here you can see your wallet funds current state"
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <View style={styles.fromWrapper}>
            <Text style={styles.fromAddress}>{maskAddress(currWallet.addr)}</Text>
            <Text style={styles.fromBalance}>{currWallet.balance.toLocaleString(undefined, format4Decimals)} CCX</Text>
            {currWallet.locked
              ? (<View style={styles.lockedWrapper}>
                <Icon
                  containerStyle={styles.lockedIcon}
                  name='md-lock-closed'
                  type='ionicon'
                  color='#FF0000'
                  size={16 * getAspectRatio()}
                />
                <Text style={currWallet.locked ? [styles.worthBTC, styles.lockedText] : styles.worthBTC}>
                  {`${currWallet.locked.toLocaleString(undefined, format4Decimals)} CCX'`}
                </Text>
              </View>)
              : null}
          </View>
        </Tips>

        <Tips
          position={'top'}
          visible={guideState === 'amount'}
          textStyle={AppStyles.guideTipText}
          tooltipArrowStyle={AppStyles.guideTipArrowBottom}
          style={[AppStyles.guideTipContainer, styles.guideTipAmount]}
          text="Here you can enter the amount of CCX to deposit..."
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <View style={styles.amountWrapper}>
            <ConcealTextInput
              label={getAmountError()}
              keyboardType='numeric'
              placeholder='Select amount to deposit...'
              containerStyle={styles.sendInput}
              value={amount}
              onChangeText={(text) => {
                setAmount(text.replace(/[^0-9,.]/g, ''));
              }}
              rightIcon={
                <Text style={styles.ccxUnit}>CCX</Text>
              }
            />
          </View>
        </Tips>
        <View style={styles.amountPercentWrapper}>
          <ConcealButton
            style={styles.btnDepositPercent}
            onPress={() => setAmount(((currWallet.balance - appSettings.defaultFee) * 0.25).toLocaleString(undefined, format6Decimals)) }
            text="25%"
          />
          <ConcealButton
            style={styles.btnDepositPercent}
            onPress={() => setAmount(((currWallet.balance - appSettings.defaultFee) * 0.50).toLocaleString(undefined, format6Decimals)) }
            text="50%"
          />
          <ConcealButton
            style={styles.btnDepositPercent}
            onPress={() => setAmount(((currWallet.balance - appSettings.defaultFee) * 0.75).toLocaleString(undefined, format6Decimals)) }
            text="75%"
          />
          <ConcealButton
            style={styles.btnDepositPercent}
            onPress={() => setAmount((currWallet.balance - appSettings.defaultFee - appSettings.minValue).toLocaleString(undefined, format6Decimals)) }
            text="100%"
          />
        </View>
        <Tips
          position={'top'}
          visible={guideState === 'duration'}
          textStyle={AppStyles.guideTipText}
          style={AppStyles.guideTipContainer}
          tooltipArrowStyle={AppStyles.guideTipArrowBottom}
          text="Here you can set the duration of the deposit..."
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <View style={styles.durationWrapper}>
            <Text style={styles.durationLabel}>Deposit duration: {duration} month{duration > 1 ? 's' : ''}</Text>
            <Slider
              value={duration}
              style={styles.durationSlider}
              step={1}
              minimumValue={1}
              maximumValue={12}
              minimumTrackTintColor={AppColors.concealOrange}
              thumbTintColor={AppColors.concealOrange}
              maximumTrackTintColor="#FFFFFF"
              onSlidingComplete={value => { setDuration(value) }}
            />
          </View>
        </Tips>
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={renderItem}
          keyExtractor={item => item.title}
        />
      </View>
      <View style={styles.footer}>
        <View style={[styles.footerBtn, styles.footerBtnLeft]}>
          <Tips
            position={'top'}
            visible={guideState === 'create'}
            textStyle={AppStyles.guideTipText}
            text="Click here to create the deposit"
            style={[AppStyles.guideTipContainer, styles.guideTipCreate]}
            tooltipArrowStyle={[AppStyles.guideTipArrowBottom, styles.guideTipArrowCreate]}
            onRequestClose={() => setGuideState(guideNavigation.next())}
          >
            <ConcealButton
              style={[styles.footerBtn, styles.footerBtnLeft]}
              disabled={!isFormValid()}
              onPress={() => navigate('CreateDepositConfirm', { amount, duration })}
              text="CREATE"
            />
          </Tips>
        </View>
        <View style={[styles.footerBtn, styles.footerBtnLeft]}>
          <Tips
            position={'top'}
            visible={guideState === 'cancel'}
            textStyle={AppStyles.guideTipText}
            text="Click here to cancel the deposit creation"
            style={[AppStyles.guideTipContainer, styles.guideTipCancel]}
            tooltipArrowStyle={[AppStyles.guideTipArrowBottom, styles.guideTipArrowCancel]}
            onRequestClose={() => setGuideState(guideNavigation.next())}
          >
            <ConcealButton
              style={[styles.footerBtn, styles.footerBtnRight]}
              onPress={() => goBack()}
              text="CANCEL"
            />
          </Tips>
        </View>
      </View>
    </View>
  )
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  icon: {
    color: "orange"
  },
  fromWrapper: {
    width: '100%',
    padding: '15rem',
    aspectRatio: 3 / 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212529',
    borderColor: AppColors.concealBorderColor,
    borderWidth: 1
  },
  sendInput: {
    marginTop: '5rem',
    marginBottom: '10rem'
  },
  addressInput: {
    marginBottom: '5rem'
  },
  fromAddress: {
    fontSize: '18rem',
    color: "#FFA500",
    textAlign: 'center'
  },
  toAddress: {
    color: "#FFFFFF",
  },
  fromBalance: {
    textAlign: 'center',
    color: "#AAAAAA",
    fontSize: '24rem'
  },
  data: {
    color: "#AAAAAA"
  },
  sendSummary: {
    color: "#AAAAAA",
    backgroundColor: '#212529',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: '2rem',
    marginTop: '2rem',
    padding: '10rem',
    fontSize: '16rem'
  },
  sendSummaryLabel: {
    color: AppColors.concealOrange
  },
  buttonContainer: {
    margin: '5rem'
  },
  walletWrapper: {
    flex: 1,
    top: '80rem',
    left: '5rem',
    right: '5rem',
    bottom: '50rem',
    margin: '10rem',
    position: 'absolute',
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: '10rem',
    marginTop: '5rem'
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  addressWrapper: {
    top: '10rem',
    left: '10rem',
    right: '10rem',
    bottom: '80rem',
    borderRadius: '10rem',
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
  footerBtn: {
    flex: 1
  },
  footerBtnRight: {
    marginLeft: '3rem'
  },
  footerBtnLeft: {
    marginRight: '3rem'
  },
  summaryLabel: {
    color: AppColors.concealOrange,
    fontSize: '12rem'
  },
  summaryText: {
    color: AppColors.concealTextColor,
    fontSize: '14rem'
  },
  summaryList: {
    flex: 1,
    margin: '10rem',
    backgroundColor: AppColors.concealBackground
  },
  summaryItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    paddingTop: '5rem',
    paddingBottom: '5rem',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground
  },
  lockedWrapper: {
    height: '20rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lockedIcon: {
    marginRight: '5rem',
    paddingTop: '2rem'
  },
  lockedText: {
    color: '#FF0000'
  },
  amountPercentWrapper: {
    padding: '10rem',
    marginTop: '10rem',
    flexDirection: 'row'
  },
  btnDepositPercent: {
    flex: 1,
    margin: '1rem',
  },
  durationSlider: {
    marginTop: '10rem',
    height: '20rem'
  },
  amountWrapper: {
    flexDirection: 'row'
  },
  durationLabel: {
    color: 'rgb(255, 255, 255)',
    marginLeft: '10rem',
    marginTop: '10rem',
    fontSize: '18rem'
  },
  guideTipClearDeposit: {
    left: '-130rem'
  },
  guideTipArrowClearDeposit: {
    left: '97%'
  },
  guideTipBalance: {
    top: '-50rem'
  },
  guideTipAmount: {
    top: '25rem'
  },
  guideTipCreate: {
    left: '20rem',
    top: '-5rem'
  },
  guideTipCancel: {
    left: '-60rem',
    top: '-5rem'
  },
  guideTipArrowCreate: {
    left: '23%'
  },
  guideTipArrowCancel: {
    left: '72%'
  },
  ccxUnit: {
    fontSize: '16rem',
    color: AppColors.concealTextColor
  }
});


export default CreateDepositScreen;
