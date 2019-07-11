import React, { useContext } from 'react';
import { Icon, Header, CheckBox } from 'react-native-elements';
import { Button } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import { maskAddress } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import ConcealFAB from '../components/ccxFAB';
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
  const { createWallet, deleteWallet, switchWallet } = actions;
  const { appSettings, layout, wallets } = state;
  const { walletsLoaded } = layout;

  const walletsList = Object.keys(wallets)
    .reduce((acc, curr) => {
      const wallet = wallets[curr];
      wallet.address = curr;
      acc.push(wallet);
      return acc;
    }, []);

  console.log((walletsList.length < appSettings.maxWallets) || walletsList.length === 0);
  console.log(walletsList.length < appSettings.maxWallets);
  console.log(walletsList.length === 0);

  console.log(walletsList.length);
  console.log(appSettings.maxWallets);


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
          size={26}
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
            <View style={styles.flatview}>
              <TouchableOpacity onPress={() => switchWallet(item.address)}>
                <View>
                  <Text style={styles.address}>{maskAddress(item.address)}</Text>
                  <Text style={styles.balance}>Balance: {item.total} CCX</Text>
                  <Text style={styles.data}>Locked: {item.locked} CCX</Text>
                  <Text style={styles.data}>{item.status}</Text>
                  <View style={styles.selectedWrapper}>
                    <CheckBox
                      center
                      size={36}
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checked={item.selected}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.walletFooter}>
                <Button
                  style={[styles.footerBtn, styles.footerBtnLeft]}
                  disabled={!walletsLoaded || item.total !== 0}
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
                >
                  <Text style={styles.buttonText}>DELETE</Text>
                </Button>
                <Button
                  style={[styles.footerBtn, styles.footerBtnRight]}
                >
                  <Text style={styles.buttonText}>EXPORT</Text>
                </Button>
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
    marginBottom: 5,
    borderWidth: 1,
    marginTop: 5,
    padding: 20,
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
  footerBtnRight: {
    marginLeft: 5
  },
  footerBtnLeft: {
    marginRight: 5
  },
  buttonText: {
    color: '#FFFFFF'
  }
});

export default Wallets;
