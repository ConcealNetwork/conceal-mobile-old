import React, { useContext, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { useFormInput } from '../helpers/hooks';
import {
  format4Decimals,
  format6Decimals,
  format8Decimals,
  getAspectRatio,
  maskAddress,
  parseLocaleNumber
} from '../helpers/utils';
import SearchAddress from './SearchAddress';

const SendScreen = ({ navigation: { goBack, navigate }, route }) => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { appSettings, user, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];
  const { params } = route;

  const { value: amount, bind: bindAmount, setValue: setAmount } = useFormInput(null);
  const { value: address, bind: bindAddress, setValue: setAddress } = useFormInput(params?.address);
  const { value: label, bind: bindLabel, setValue: setLabel } = useFormInput(params?.label);
  const { value: paymentID, bind: bindPaymentID, setValue: setPaymentID } = useFormInput(params?.paymentID);

  const sendSummaryList = [];

  if (label) {
    sendSummaryList.push({
      value: label,
      title: 'Label',
      icon: 'md-eye'
    });
  }

  if (address) {
    sendSummaryList.push({
      value: maskAddress(address),
      title: 'Address',
      icon: 'md-mail'
    });
  }

  if (paymentID) {
    sendSummaryList.push({
      value: maskAddress(paymentID),
      title: 'Payment ID',
      icon: 'md-key'
    });
  }

  if (amount && parseLocaleNumber(amount) > 0) {
    const totalAmount = parseLocaleNumber(amount) + appSettings.defaultFee;

    sendSummaryList.push({
      value: `${totalAmount.toLocaleString(undefined, format6Decimals)} CCX`,
      title: 'Total Amount',
      icon: 'md-cash'
    });

    sendSummaryList.push({
      value: `${appSettings.defaultFee} CCX`,
      title: 'Transaction Fee',
      icon: 'md-cash'
    });
  }

  useEffect(() => {
    setAddress(params?.address || '');
    setAmount(params?.amount || '');
    setLabel(params?.label || '');
    setPaymentID(params?.paymentId || '');
  }, [params])

  const onScanAddressQRCode = () => {
    setAppData({
      scanCode: {
        scanned: false
      }
    });

    navigate('Scanner', { previousScreen: 'SendPayment' });
  }

  const renderItem = ({ item }) =>
    <ListItem containerStyle={styles.summaryItem} key={item.value} onPress={item.onPress}>
      <Icon name={item.icon} type='ionicon' color='white' size={32 * getAspectRatio()} />
      <ListItem.Content>
        <ListItem.Title style={styles.summaryText}>{item.value}</ListItem.Title>
        <ListItem.Subtitle style={styles.summaryLabel}>{item.title}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>

  const isFormValid = () =>
    address &&
    amount &&
    parseLocaleNumber(amount) > 0 &&
    parseLocaleNumber(amount) < currWallet.balance - appSettings.defaultFee;

  const checkAmount = () => {
    if (amount && parseLocaleNumber(amount) <= 0) return 'Amount must be greater then 0';
    if (parseLocaleNumber(amount) > currWallet.balance - appSettings.defaultFee) return 'The amount exceeds wallet balance';
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement='left'
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => goBack()}
          name='arrow-back-outline'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Send CCX', style: AppStyles.appHeaderText }}
        rightComponent={<Icon
          onPress={() => {
            setAddress('');
            setAmount('');
            setPaymentID('');
            setLabel('');
          }}
          name='md-trash'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      <View style={styles.walletWrapper}>
        <View style={styles.fromWrapper}>
          <Text style={styles.fromAddress}>{maskAddress(currWallet.addr)}</Text>
          <Text style={styles.fromBalance}>{currWallet.balance.toLocaleString(undefined, format4Decimals)} CCX</Text>
          {currWallet.locked
            ? <View style={styles.lockedWrapper}>
                <Icon
                  containerStyle={styles.lockedIcon}
                  name='md-lock-closed'
                  type='ionicon'
                  color='#FF0000'
                  size={16 * getAspectRatio()}
                />
                <Text style={currWallet.locked ? [styles.worthBTC, styles.lockedText] : styles.worthBTC}>
                  {`${currWallet.locked.toLocaleString(undefined, format4Decimals)} CCX`}
                </Text>
              </View>
            : null
          }
        </View>

        <ConcealTextInput
          {...bindAmount}
          label={checkAmount()}
          keyboardType='numeric'
          placeholder='Type in amount to send...'
          containerStyle={styles.sendInput}
          rightIcon={
            <Text style={styles.ccxUnit}>CCX</Text>
          }
        />
        <View style={styles.amountPercentWrapper}>
          <ConcealButton
            style={styles.btnSendPercent}
            onPress={() => setAmount(((currWallet.balance - appSettings.defaultFee) * 0.25).toLocaleString(undefined, format8Decimals))}
            text="25%"
          />
          <ConcealButton
            style={styles.btnSendPercent}
            onPress={() => setAmount(((currWallet.balance - appSettings.defaultFee) * 0.5).toLocaleString(undefined, format8Decimals))}
            text="50%"
          />
          <ConcealButton
            style={styles.btnSendPercent}
            onPress={() => setAmount(((currWallet.balance - appSettings.defaultFee) * 0.75).toLocaleString(undefined, format8Decimals))}
            text="75%"
          />
          <ConcealButton
            style={styles.btnSendPercent}
            onPress={() => setAmount((currWallet.balance - appSettings.defaultFee - appSettings.minValue).toLocaleString(undefined, format8Decimals))}
            text="100%"
          />
        </View>
        <TouchableOpacity onPress={() => setAppData({ searchAddress: { addrListVisible: true } })}>
          <ConcealTextInput
            {...bindAddress}
            editable={false}
            placeholder='Select recipient address...'
            containerStyle={[styles.sendInput, styles.addressInput]}
            rightIcon={
              <Icon
                onPress={() => navigate('EditAddress', { headerText: 'Create Address' })}
                name='md-add'
                type='ionicon'
                color='white'
                size={32 * getAspectRatio()}
              />
            }
          />
        </TouchableOpacity>
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={renderItem}
          keyExtractor={item => item.title}
        />
      </View>
      <SearchAddress
        selectAddress={(item) => setAppData({ searchAddress: { addrListVisible: false }, sendScreen: { toAddress: item.address, toPaymentId: item.paymentID, toLabel: item.label } })}
        closeOverlay={() => setAppData({ searchAddress: { addrListVisible: false } })}
        addressData={user.addressBook}
        currWallet={currWallet}
      />
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!isFormValid()}
          onPress={() => navigate('SendConfirm', { address, amount, paymentID, label })}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => onScanAddressQRCode()}
          text="SCAN QR"
        />
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
    marginTop: '10rem',
    marginBottom: '20rem'
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
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
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
    marginTop: '0rem',
    flexDirection: 'row'
  },
  btnSendPercent: {
    flex: 1,
    margin: '1rem'
  },
  ccxUnit: {
    fontSize: '16rem',
    color: AppColors.concealTextColor
  }
});


export default SendScreen;
