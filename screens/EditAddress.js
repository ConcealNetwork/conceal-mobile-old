import React, { useContext, useEffect } from 'react';
import { View, } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
import { useFormInput } from '../helpers/hooks';

const EditAddress = ({ navigation: { goBack, navigate }, route }) => {
  const { actions } = useContext(AppContext);
  const { addContact } = actions;
  const { params } = route;
  const { entryID } = params;

  const { value: label, bind: bindLabel, setValue: setLabel } = useFormInput(params?.label);
  const { value: address, bind: bindAddress, setValue: setAddress } = useFormInput(params?.address);
  const { value: paymentID, bind: bindPaymentID, setValue: setPaymentID } = useFormInput(params?.paymentID);

  const isFormValid = () => label && address;

  useEffect(() => {
    setAddress(params.address || '');
    setPaymentID(params.paymentId || '');
    setLabel(params.label || '');
  }, [params])

  const onScanAddressQRCode = () => {
    navigate('Scanner', { previousScreen: 'EditAddress' });
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement='left'
        containerStyle={styles.appHeader}
        leftComponent={<Icon
          onPress={() => goBack()}
          name='arrow-back-outline'
          type='ionicon'
          color='white'
          size={32}
        />}
        centerComponent={{ text: params?.headerText, style: { color: '#fff', fontSize: 20 } }}
      />
      <View style={styles.addressWrapper}>
        <ConcealTextInput
          {...bindLabel}
          placeholder='Enter Label for the address...'
          containerStyle={styles.addrInput}
        />
        <ConcealTextInput
          {...bindAddress}
          placeholder='Enter the address...'
          containerStyle={styles.addrInput}
        />
        <ConcealTextInput
          {...bindPaymentID}
          placeholder='Enter the Payment id...'
          containerStyle={styles.addrInput}
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!isFormValid()}
          onPress={() => addContact({ label, address, paymentID, entryID }, [goBack])}
          text="SAVE"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => onScanAddressQRCode()}
          text="SCAN QR"
        />
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40'
  },
  buttonsWrapper: {
    position: 'absolute',
    right: '20rem'
  },
  icon: {
    color: 'orange'
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderRadius: '10rem',
    marginBottom: '5rem',
    marginTop: '5rem',
    padding: '20rem',
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: '18rem'
  },
  address: {
    color: '#FFA500'
  },
  data: {
    color: '#AAAAAA'
  },
  buttonContainer: {
    margin: '5rem'
  },
  walletsWrapper: {
    top: '90rem',
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
  footerBtn: {
    flex: 1,
    height: '40rem',
    marginTop: '10rem',
    color: '#FFFFFF',
    borderRadius: 0,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnRight: {
    marginLeft: '5rem',
  },
  footerBtnLeft: {
    marginRight: '5rem',
  },
  overlayWrapper: {
    flex: 1
  },
  addressWrapper: {
    flex: 1,
    padding: '10rem'
  },
  addrInput: {
    marginTop: '20rem'
  },
});

export default EditAddress;
