import React, { useContext, useEffect } from 'react';
import { View, } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';
import { AppContext } from '../components/ContextProvider';
import { useFormInput } from '../helpers/hooks';
import AppStyles from '../components/Style';

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
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
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
    backgroundColor: 'rgb(40, 45, 49)',
    flex: 1
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
  footer: {
    margin: '10rem',
    height: '50rem',
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1
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
    flexGrow: 1,
    padding: '10rem',
  },
  addrInput: {
    marginTop: '20rem'
  },
});

export default EditAddress;
