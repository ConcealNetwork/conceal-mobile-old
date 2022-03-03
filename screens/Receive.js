import * as Clipboard from 'expo-clipboard';
import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import QRCode from 'react-native-qrcode-svg';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { getAspectRatio, shareContent, showSuccessMessage } from '../helpers/utils';

const Receive = ({ navigation: { goBack } }) => {
  const { state } = useContext(AppContext);
  const { wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  this.onCopyAddress = async (text) => {
    Clipboard.setString(text);
    showSuccessMessage('Copied address to the clipboard...');
  }

  return (
    <View style={AppStyles.pageWrapper}>
      <Header
        placement='left'
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          containerStyle={AppStyles.leftHeaderIcon}
          onPress={() => goBack()}
          name='arrow-back-outline'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={          
          <View style={AppStyles.appHeaderWrapper}>
            <Text style={AppStyles.appHeaderText}>
              Receive CCX
            </Text>
          </View>
        }        
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
