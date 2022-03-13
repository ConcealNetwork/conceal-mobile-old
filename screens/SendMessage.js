import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { getAspectRatio, maskAddress } from '../helpers/utils';
import SearchAddress from './SearchAddress';


const SendMessage = ({ navigation: { goBack, navigate }, route }) => {
  const { state } = useContext(AppContext);
  const { user, wallets } = state;
  const currWallet = wallets[Object.keys(wallets).find(i => wallets[i].default)];

  const [addrListVisible, setAddrListVisible] = useState(false);
  const [address, setAddress] = useState(null);
  const [label, setLabel] = useState(null);
  const [message, setMessage] = useState('');
  const [paymentID, setPaymentID] = useState(null);

  useEffect(() => {
    setAddress(route.params?.address);
    setLabel(route.params?.label);
    setPaymentID(route.params?.paymentId);
  }, [route.params?.address, route.params?.paymentId]);

  const onScanAddressQRCode = () => navigate('Scanner', { previousScreen: 'SendMessage' });

  const isFormValid = () => address && message && message !== '';

  const clearSend = () => {
    setAddress(null);
    setLabel(null);
    setMessage(null);
    setPaymentID(null);
  }

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
        centerComponent={{ text: 'Send Message', style: AppStyles.appHeaderText }}
        rightComponent={<Icon
          onPress={() => clearSend()}
          name='md-trash'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      <ScrollView contentContainerStyle={styles.walletWrapper}>
        <TouchableOpacity onPress={() => setAddrListVisible(true)}>
          <ConcealTextInput
            editable={false}
            placeholder='Select recipient address...'
            containerStyle={styles.sendInput}
            value={label ? label : maskAddress(address)}
            rightIcon={
              <Icon
                onPress={() => {
                  // setLabel(null);
                  // setAddress(null);
                  // setPaymentID(null);
                  navigate('EditAddress', { previousScreen: 'SendMessage' });
                }}
                name='md-add'
                type='ionicon'
                color='white'
                size={32 * getAspectRatio()}
              />
            }
          />
        </TouchableOpacity>
        <View style={styles.messageWrapper}>
          <TextInput
            multiline
            maxLength={280}
            numberOfLines={4}
            style={styles.messageText}
            placeholder="Write your message here..."
            placeholderTextColor={AppColors.placeholderTextColor}
            onChangeText={text => setMessage(text)}
            value={message}
          />
        </View>
        <Text style={styles.messageCharsLeft}>{message ? 280 - message.length : 280} chars of 280 left</Text>
      </ScrollView>
      <SearchAddress
        addrListVisible={addrListVisible}
        selectAddress={i => {
          setAddrListVisible(false);
          setAddress(i.address)
          setLabel(i.label)
        }}
        closeOverlay={() => setAddrListVisible(false)}
        addressData={user.addressBook}
        currWallet={currWallet}
      />
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!isFormValid()}
          onPress={() => navigate('SendMessageConfirm', { address, message, paymentID })}
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
  sendInput: {
    marginTop: '10rem',
    marginBottom: '20rem'
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
    top: 0,
    left: '5rem',
    right: '5rem',
    bottom: '50rem',
    margin: '15rem',
    position: 'absolute',
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: '10rem',
    marginTop: '5rem'
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
  messageWrapper: {
    borderBottomColor: 'rgb(55, 55, 55)',
    borderBottomWidth: 1,
    margin: '10rem'
  },
  messageText: {
    fontSize: '18rem',
    marginBottom: '10rem',
    color: AppColors.concealTextColor,
  },
  messageCharsLeft: {
    margin: '10rem',
    fontSize: '16rem',
    color: AppColors.concealOrange,
  }
});

export default SendMessage;
