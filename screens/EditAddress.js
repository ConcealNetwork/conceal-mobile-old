import React, { useContext } from 'react';
import { Icon, Header, Overlay } from 'react-native-elements';
import { Button } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import { maskAddress } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import {
  Alert,
  Text,
  View,
  FlatList,
  StyleSheet,
  Clipboard
} from 'react-native';

const EditAddress = () => {
  const { actions, state } = useContext(AppContext);
  const { addContact, setAppData } = actions;
  const { layout, user } = state;

  readLabelromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setAppData({
      addressEntry: {
        label: clipboardContent
      }
    });
  };

  readAddressFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setAppData({
      addressEntry: {
        address: clipboardContent
      }
    });
  };

  readPaymentIdFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setAppData({
      addressEntry: {
        paymentId: clipboardContent
      }
    });
  };

  isFormValid = () => {
    return (state.appData.addressEntry.label && state.appData.addressEntry.address);
  }

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={styles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32}
        />}
        centerComponent={{ text: state.appData.addressEntry.headerText, style: { color: '#fff', fontSize: 20 } }}
      />
      <View style={styles.addressWrapper}>
        <ConcealTextInput
          placeholder='Enter Label for the address...'
          containerStyle={styles.addrInput}
          value={state.appData.addressEntry.label}
          onChangeText={(text) => setAppData({ addressEntry: { label: text } })}
          rightIcon={
            <Icon
              onPress={() => this.readLabelromClipboard()}
              name='md-copy'
              type='ionicon'
              color='white'
              size={32}
            />
          }
        />
        <ConcealTextInput
          placeholder='Enter the address...'
          containerStyle={styles.addrInput}
          value={state.appData.addressEntry.address}
          onChangeText={(text) => setAppData({ addressEntry: { address: text } })}
          rightIcon={
            <Icon
              onPress={() => this.readAddressFromClipboard()}
              name='md-copy'
              type='ionicon'
              color='white'
              size={32}
            />
          }
        />
        <ConcealTextInput
          placeholder='Enter the Payment id...'
          containerStyle={styles.addrInput}
          value={state.appData.addressEntry.paymentId}
          onChangeText={(text) => setAppData({ addressEntry: { paymentId: text } })}
          rightIcon={
            <Icon
              onPress={() => this.readPaymentIdFromClipboard()}
              name='md-copy'
              type='ionicon'
              color='white'
              size={32}
            />
          }
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          disabled={!this.isFormValid()}
          onPress={() => {
            addContact({
              label: state.appData.addressEntry.label,
              address: state.appData.addressEntry.address,
              paymentID: state.appData.addressEntry.paymentId,
              entryID: state.appData.addressEntry.entryId,
              edit: state.appData.addressEntry.entryId !== null
            });
            NavigationService.goBack();
          }}
          text="SAVE"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => NavigationService.navigate('Scanner', { path: ["addressEntry", "address"] })}
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
    color: '#FFFFFF',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtn: {
    flex: 1,
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
