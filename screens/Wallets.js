import React, { useContext } from 'react';
import { Icon, Header, CheckBox } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { maskAddress } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
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
  const { appSettings, layout, wallets } = state;
  const { walletsLoaded } = layout;

  const walletsList = Object.keys(wallets)
    .reduce((acc, curr) => {
      const wallet = wallets[curr];
      wallet.address = curr;
      acc.push(wallet);
      return acc;
    }, []);

  return (
    <View>
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
        centerComponent={{ text: 'Wallets', style: { color: '#fff', fontSize: 20 } }}
        rightComponent={walletsLoaded && (walletsList.length < appSettings.maxWallets || walletsList.length === 0) ?
          (< Icon
            onPress={() => createWallet()}
            name='md-add-circle-outline'
            type='ionicon'
            color='white'
            size={32}
          />) : null}
      />
      <View style={styles.walletsWrapper}>
        <FlatList
          style={styles.flatList}
          data={walletsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.address}
          renderItem={({ item }) =>
            <View style={(item.addr === global.selectedWallet) ? [styles.flatview, styles.walletSelected] : styles.flatview}>
              <TouchableOpacity onPress={() => switchWallet(item.address)}>
                <View>
                  <Text style={styles.address}>{maskAddress(item.address)}</Text>
                  <Text style={styles.balance}>Balance: {item.total} CCX</Text>
                  <Text style={(item.locked && item.locked > 0) ? [styles.data, styles.lockedText] : styles.data}>Locked: {item.locked} CCX</Text>
                  <Text style={styles.data}>{item.status}</Text>
                  <View style={styles.selectedWrapper}>
                    <CheckBox
                      center
                      size={36}
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
  selectedWrapper: {
    position: 'absolute',
    right: 0,
    top: 15
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
    marginBottom: 5,
    borderWidth: 1,
    marginTop: 5,
    padding: 20,
  },
  walletSelected: {
    borderColor: AppColors.concealOrange,
    borderWidth: 2
  },
  address: {
    color: '#FFFFFF',
    fontSize: 18
  },
  balance: {
    color: '#FFA500',
  },
  data: {
    color: '#AAAAAA'
  },
  buttonContainer: {
    margin: 5
  },
  walletsWrapper: {
    padding: 10
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
    height: 40,
    marginTop: 10,
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnDisabled: {
    flex: 1,
    height: 40,
    marginTop: 10,
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnRight: {
    marginLeft: 5
  },
  footerBtnLeft: {
    marginRight: 5
  },
  buttonText: {
    color: '#FFFFFF'
  },
  lockedText: {
    color: '#FF0000'
  }
});

export default Wallets;
