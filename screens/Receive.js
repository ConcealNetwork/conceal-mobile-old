import React, { useContext } from 'react';
import { Appbar } from 'react-native-paper';
import { AppContext } from '../components/ContextProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import ConcealButton from '../components/ccxButton';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  Text,
  View,
  ScrollView,
  StyleSheet
} from "react-native";


const Receive = () => {
  const { state } = useContext(AppContext);
  const { appSettings, user, layout, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0 && layout.walletsLoaded
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  return (
    <PaperProvider>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => NavigationService.goBack()} />
        <Appbar.Content
          title="Receive CCX"
        />
      </Appbar.Header>
      <View style={AppStyles.viewContainer}>
        <ScrollView style={AppStyles.viewContainer} contentContainerStyle={AppStyles.contentContainer}>
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
          onPress={() => console.log("pressed")}
          text="COPY"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => console.log("pressed")}
          text="SHARE"
        />
      </View>
    </PaperProvider>
  )
};

const styles = StyleSheet.create({
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
    color: colors.concealOrange
  },
});

export default Receive;
