import React, { useContext } from 'react';
import { Header, Icon } from 'react-native-elements';
import { AppContext } from '../components/ContextProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import NavigationService from '../helpers/NavigationService';
import ConcealButton from '../components/ccxButton';
import QRCode from 'react-native-qrcode-svg';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  shareContent,
  getAspectRatio,
  showErrorToast,
  showSuccessToast
} from '../helpers/utils';
import {
  Text,
  View,
  Share,
  Clipboard,
  ScrollView,
  StyleSheet
} from "react-native";


const Receive = () => {
  const { state } = useContext(AppContext);
  const { appSettings, user, layout, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  onCopyAddress = async (text) => {
    Clipboard.setString(text);
    showSuccessToast('Copied address to the clipboard...');
  }

  // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
  return (
    <View style={styles.pageWrapper}>
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
        centerComponent={{ text: 'Receive CCX', style: AppStyles.appHeaderText }}
      />
      <View style={styles.receiveContainer}>
        <ScrollView contentContainerStyle={AppStyles.contentContainer}>
          <Text style={styles.address}>{currWallet.addr}</Text>
          <View style={styles.qrCodeContainer}>
            <QRCode
              size={200 * getAspectRatio()}
              value={currWallet.addr}
              bgColor='white'
              fgColor='black'
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          onPress={() => this.onCopyAddress(currWallet.addr)}
          text="COPY"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => shareContent("My CCX address is: " + currWallet.addr)}
          text="SHARE"
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
  receiveContainer: {
    flex: 1,
    padding: '20rem'
  },
  qrCodeContainer: {
    padding: '10rem',
    backgroundColor: '#FFFFFF'
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40'
  },
  footer: {
    left: '20rem',
    right: '20rem',
    bottom: '10rem',
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
  address: {
    fontSize: '16rem',
    marginBottom: '20rem',
    color: AppColors.concealOrange
  }
});

export default Receive;
