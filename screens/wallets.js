import NavigationService from '../helpers/NavigationService';
import { Appbar, Button } from 'react-native-paper';
import { maskAddress } from '../helpers/utils';
import ConcealFAB from '../components/ccxFAB';
import { AppContext } from '../components/ContextProvider';
import React, { useContext } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet
} from "react-native";

const WalletsScreen = () => {
  const { state } = useContext(AppContext);
  const wallets = [];

  Object.keys(state.wallets).forEach(key => {
    var wallet = state.wallets[key];
    wallet.address = key;
    wallets.push(wallet);
  });

  onCreateWallet = () => {

  }

  onDeleteWallet = () => {

  }

  onExportWallet = () => {

  }

  onSelectWallet = (wallet) => {
    const { navigate } = this.props.navigation;
    navigate("Wallet", wallet);
  }

  onGoBack = () => {
    NavigationService.goBack();
  }

  return (
    <View>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => this.onGoBack()} />
        <Appbar.Content
          title="Wallets"
        />
        <Appbar.Action icon="add-circle-outline" size={36} onPress={() => this.onCreateWallet()} />
      </Appbar.Header>
      <View style={styles.walletsWrapper}>
        <FlatList
          data={wallets}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <View style={styles.flatview}>
              <View>
                <Text style={styles.address}>{maskAddress(item.address)}</Text>
                <Text style={styles.balance}>Balance: {item.total} CCX</Text>
                <Text style={styles.data}>Locked: {item.locked} CCX</Text>
                <Text style={styles.data}>{item.status}</Text>
                <View style={styles.buttonsWrapper}>
                  <ConcealFAB
                    onPress={() => this.onSelectWallet(item)}
                  />
                </View>
              </View>
              <View style={styles.walletFooter}>
                <Button style={[styles.footerBtn, styles.footerBtnLeft]} onPress={this.onDeleteWallet()}>
                  <Text style={styles.buttonText}>DELETE</Text>
                </Button>
                <Button style={[styles.footerBtn, styles.footerBtnRight]} onPress={this.onExportWallet()}>
                  <Text style={styles.buttonText}>EXPORT</Text>
                </Button>
              </View>
            </View>
          }
          keyExtractor={item => item.address}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: "#343a40"
  },
  buttonsWrapper: {
    position: 'absolute',
    right: 20,
    top: 15
  },
  icon: {
    color: "orange"
    //color: "#CCC"
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  address: {
    color: "#FFFFFF",
    fontSize: 18
  },
  balance: {
    color: "#FFA500",
  },
  data: {
    color: "#AAAAAA"
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
    color: "#FFFFFF",
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: "#FFA500",
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  footerBtnRight: {
    marginLeft: 5
  },
  footerBtnLeft: {
    marginRight: 5
  },
  buttonText: {
    color: "#FFFFFF"
  }
});

export default WalletsScreen;