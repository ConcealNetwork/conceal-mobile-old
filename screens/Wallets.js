import React, { useContext } from 'react';
import { Alert, Text, View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import { maskAddress } from '../helpers/utils';
import ConcealFAB from '../components/ccxFAB';


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

  return (
    <View>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => NavigationService.goBack()} />
        <Appbar.Content
          title="Wallets"
        />
        {walletsLoaded && (walletsList.length < appSettings.maxWallets || walletsList.length === 0) &&
          <Appbar.Action icon="add-circle-outline" size={36} onPress={() => createWallet()}/>
        }
      </Appbar.Header>
      <View style={styles.walletsWrapper}>
        <FlatList
          style={styles.flatList}
          data={walletsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.address}
          renderItem={({ item }) =>
            <View style={styles.flatview}>
              <View>
                <Text style={styles.address}>{maskAddress(item.address)}</Text>
                <Text style={styles.balance}>Balance: {item.total} CCX</Text>
                <Text style={styles.data}>Locked: {item.locked} CCX</Text>
                <Text style={styles.data}>{item.status}</Text>
                <View style={styles.buttonsWrapper}>
                  <ConcealFAB onPress={() => {switchWallet(item.address)}} />
                </View>
              </View>
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
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40'
  },
  buttonsWrapper: {
    position: 'absolute',
    right: 20,
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
    borderRadius: 10,
    marginBottom: 5,
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
