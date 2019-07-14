import React, { useContext } from 'react';
import { Header, Icon } from 'react-native-elements';
import { AppContext } from '../components/ContextProvider';
import NavigationService from '../helpers/NavigationService';
import ConcealButton from '../components/ccxButton';
import QRCode from 'react-native-qrcode-svg';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  showErrorToast,
  showSuccessToast
} from '../helpers/utils';
import {
  Text,
  View,
  Share,
  ScrollView,
  StyleSheet
} from "react-native";


const Receive = () => {
  const { state } = useContext(AppContext);
  const { appSettings, user, layout, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0 && layout.walletsLoaded
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  onShare = async (content) => {
    try {
      const result = await Share.share({ message: "My CCX address is: " + content });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  onCopyAddress = async (text) => {
    showSuccessToast(text);
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
          size={26}
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
          onPress={() => this.onCopyAddress("Copied address to the clipboard...")}
          text="COPY"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => this.onShare(currWallet.addr)}
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
