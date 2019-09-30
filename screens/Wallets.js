import React, { useContext } from 'react';
import { Icon, Header, CheckBox } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  maskAddress,
  formatOptions,
  getAspectRatio,
  format0Decimals,
  format2Decimals,
  format4Decimals,
  format6Decimals,
  format8Decimals
} from '../helpers/utils';
import {
  Alert,
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';


const Wallets = () => {
  const { actions, state } = useContext(AppContext);
  const { createWallet, deleteWallet, switchWallet, setDefaultWallet, getWalletKeys } = actions;
  const { appSettings, layout, wallets, appData } = state;
  const { walletsLoaded } = layout;

  const walletsList = Object.keys(wallets)
    .reduce((acc, curr) => {
      const wallet = wallets[curr];
      wallet.address = curr;
      acc.push(wallet);
      return acc;
    }, []);

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
        centerComponent={{ text: 'Wallets', style: AppStyles.appHeaderText }}
        rightComponent={walletsLoaded && (walletsList.length < appSettings.maxWallets || walletsList.length === 0) ?
          (< Icon
            onPress={() => createWallet()}
            name='md-add-circle-outline'
            type='ionicon'
            color='white'
            size={32 * getAspectRatio()}
          />) : null}
      />
      <View style={styles.walletsWrapper}>
        {layout.userLoaded && walletsList.length === 0
          ? (<View style={styles.emptyWalletsWrapper}>
            <Text style={styles.emptyWalletsText}>
              You have no wallets currently. Please create a wallet by clicking on the button, to start using Conceal Mobile.
            </Text>
          </View>)
          : (<FlatList
            style={styles.flatList}
            data={walletsList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.address}
            renderItem={({ item }) =>
              <View style={(item.addr === appData.common.selectedWallet) ? [styles.flatview, styles.walletSelected] : styles.flatview}>
                <TouchableOpacity onPress={() => switchWallet(item.address)}>
                  <View>
                    <Text style={styles.address}>{maskAddress(item.address)}</Text>
                    <Text style={styles.balance}>Balance: {item.total.toLocaleString(undefined, format4Decimals)} CCX</Text>
                    <Text style={(item.locked && item.locked > 0) ? [styles.data, styles.lockedText] : styles.data}>Locked: {item.locked.toLocaleString(undefined, format4Decimals)} CCX</Text>
                    <Text style={styles.data}>{item.status}</Text>
                    <View style={styles.selectedWrapper}>
                      <CheckBox
                        center
                        size={36 * getAspectRatio()}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={item.default}
                        onPress={() => setDefaultWallet(item.address)}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.walletFooter}>
                  <ConcealButton
                    style={[!(walletsLoaded && (item.total > 0)) ? styles.footerBtn : styles.footerBtnDisabled, styles.footerBtnLeft]}
                    disabled={(walletsLoaded && (item.total > 0))}
                    buttonStyle={styles.btnStyle}
                    onPress={() => {
                      Alert.alert(
                        'Delete Wallet',
                        'You are about to delete this wallet PERMANENTLY! Do you really wish to proceed?',
                        [
                          { text: 'OK', onPress: () => deleteWallet(item.address) },
                          { text: 'Cancel', style: 'cancel' },
                        ],
                        { cancelable: false },
                      );
                    }}
                    text="DELETE"
                  />

                  <ConcealButton
                    style={[styles.footerBtn, styles.footerBtnRight]}
                    buttonStyle={styles.btnStyle}
                    onPress={() => {
                      Alert.alert(
                        'Export Keys',
                        'You are about to export the keys. Do you really wish to proceed?',
                        [
                          { text: 'OK', onPress: () => getWalletKeys(item.address, true) },
                          { text: 'Cancel', style: 'cancel' },
                        ],
                        { cancelable: false },
                      );
                    }}
                    text="EXPORT"
                  />
                </View>
              </View>
            }
          />)
        }
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  selectedWrapper: {
    position: 'absolute',
    right: 0,
    top: '15rem'
  },
  icon: {
    color: 'orange'
    //color: '#CCC'
  },
  flatList: {
    height: '100%',
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderColor: AppColors.concealBorderColor,
    borderRadius: 10,
    marginBottom: '5rem',
    borderWidth: 1,
    marginTop: '5rem',
    padding: '20rem',
  },
  walletSelected: {
    borderColor: AppColors.concealOrange,
    borderWidth: 2
  },
  address: {
    color: '#FFFFFF',
    fontSize: '18rem'
  },
  balance: {
    color: '#FFA500',
    fontSize: '14rem'
  },
  data: {
    color: '#AAAAAA',
    fontSize: '14rem'
  },
  buttonContainer: {
    margin: '5rem'
  },
  walletsWrapper: {
    flex: 1,
    padding: '10rem'
  },
  walletFooter: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnStyle: {
    borderWidth: 0
  },
  footerBtn: {
    flex: 1,
    height: '40rem',
    marginTop: '10rem',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnDisabled: {
    flex: 1,
    height: '40rem',
    marginTop: '10rem',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnRight: {
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  },
  buttonText: {
    color: '#FFFFFF'
  },
  lockedText: {
    color: '#FF0000',
    fontSize: '14rem'
  },
  emptyWalletsWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyWalletsText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

export default Wallets;
