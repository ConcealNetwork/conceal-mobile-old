import React, { useContext } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import WAValidator from 'multicoin-address-validator';
import NavigationService from '../helpers/NavigationService';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import { useClipboard, useFormInput, useFormValidation } from '../helpers/hooks';


const EditAddress = props => {
  const { actions } = useContext(AppContext);
  const { addContact } = actions;
  const { navigation } = props;
  const currentAddress = navigation.getParam('item', {});

  const { value: label, bind: bindLabel, setValue: setLabel } = useFormInput(currentAddress.label || '');
  const { value: address, bind: bindAddress, setValue: setAddress } = useFormInput(currentAddress.address || '');
  const { value: paymentID, bind: bindPaymentID, setValue: setPaymentID } = useFormInput(currentAddress.paymentID || '');

  const [clipboard, setClipboard] = useClipboard();

  const formValidation = currentAddress.address
    ? (
      label.length > 0 &&
      WAValidator.validate(address, 'CCX') &&
      (paymentID === '' || paymentID.length === 64) &&
      !(label === currentAddress.label && address === currentAddress.address && paymentID === currentAddress.paymentID)
    )
    : (
      label.length > 0 &&
      WAValidator.validate(address, 'CCX') &&
      (paymentID === '' || paymentID.length === 64)
    );
  const formValid = useFormValidation(formValidation);

  return (
    <View style={styles.pageWrapper}>
      <Header
        containerStyle={styles.appHeader}
        leftComponent={
          <Icon
            onPress={() => NavigationService.goBack()}
            name={Platform.OS === 'android' ? 'md-arrow-round-back' : 'ios-arrow-back'}
            type="ionicon"
            color="white"
            underlayColor="transparent"
            size={32}
          />
        }
        centerComponent={{
          text: currentAddress.address ? 'Edit Contact' : 'Add Contact',
          style: { color: '#fff', fontSize: 20 },
        }}
      />
      <View style={styles.addressWrapper}>
        <ConcealTextInput
          {...bindLabel}
          placeholder='Contact Label'
          containerStyle={styles.addrInput}
          minLength={1}
          rightIcon={
            <Icon
              onPress={() => setLabel(clipboard)}
              name={Platform.OS === 'android' ? 'md-copy' : 'ios-copy'}
              type="ionicon"
              color="white"
              underlayColor="transparent"
              size={32}
            />
          }
        />
        <ConcealTextInput
          {...bindAddress}
          placeholder='Address'
          containerStyle={styles.addrInput}
          minLength={98}
          maxLength={98}
          rightIcon={
            <Icon
              onPress={() => setAddress(clipboard)}
              name={Platform.OS === 'android' ? 'md-copy' : 'ios-copy'}
              type="ionicon"
              color="white"
              underlayColor="transparent"
              size={32}
            />
          }
        />
        <ConcealTextInput
          {...bindPaymentID}
          placeholder='Payment ID'
          containerStyle={styles.addrInput}
          maxLength={64}
          rightIcon={
            <Icon
              onPress={() => setPaymentID(clipboard)}
              name={Platform.OS === 'android' ? 'md-copy' : 'ios-copy'}
              type="ionicon"
              color="white"
              underlayColor="transparent"
              size={32}
            />
          }
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!formValid}
          onPress={() => {
            addContact({
              label,
              address,
              paymentID,
              entryID: currentAddress.entryID || null,
              edit: !!(Object.keys(currentAddress).length > 0),
            });
            NavigationService.goBack();
          }}
          text="SAVE"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() =>
            NavigationService.navigate('Scanner', { setLabel, setAddress, setPaymentID })
          }
          text="SCAN QR"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    right: 20
  },
  icon: {
    color: 'orange'
    //color: '#CCC'
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: 18
  },
  address: {
    color: '#FFA500'
  },
  data: {
    color: '#AAAAAA'
  },
  buttonContainer: {
    margin: 5
  },
  walletsWrapper: {
    top: 90,
    left: 10,
    right: 10,
    bottom: 0,
    position: 'absolute'
  },
  footer: {
    bottom: 10,
    left: 20,
    right: 20,
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1,
    height: 40,
    marginTop: 10,
    borderWidth: 0,
    borderRadius: 0,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnRight: {
    marginLeft: 5,
  },
  footerBtnLeft: {
    marginRight: 5,
  },
  overlayWrapper: {
    flex: 1
  },
  addressWrapper: {
    flex: 1,
    padding: 10
  },
  addrInput: {
    marginTop: 20
  },
});

export default EditAddress;
