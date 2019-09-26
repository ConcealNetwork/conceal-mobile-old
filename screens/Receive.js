import React, { useContext } from 'react';
import { Header, Icon } from 'react-native-elements';
import { AppContext } from '../components/ContextProvider';
import NavigationService from '../helpers/NavigationService';
import ConcealButton from '../components/ccxButton';
import QRCode from 'react-native-qrcode';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  shareContent,
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
        containerStyle={styles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32}
        />}
        centerComponent={{ text: 'Receive CCX', style: { color: '#fff', fontSize: 20 } }}
      />
      <View style={styles.receiveContainer}>
        <ScrollView contentContainerStyle={AppStyles.contentContainer}>
          <Text style={styles.address}>{currWallet.addr}</Text>
          <QRCode
            style={{ margin: 10 }}
            size={200}
            value={currWallet.addr}
            bgColor='black'
            fgColor='white'
          />
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

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  receiveContainer: {
    flex: 1,
    padding: 20
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40',
  },
  footer: {
    bottom: 10,
    left: 20,
    right: 20,
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  address: {
    fontSize: 16,
    marginBottom: 20,
    color: AppColors.concealOrange
  },
});

export default Receive;
