import NavigationService from '../helpers/NavigationService';
import { Appbar, Button } from 'react-native-paper';
import { maskAddress } from '../helpers/utils';
import { AppContext } from '../components/ContextProvider';
import React, { useContext } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet
} from "react-native";

const AddressBookScreen = () => {
  const { state } = useContext(AppContext);
  const addressBook = state.user.addressBook;

  onCreateAddress = () => {

  }

  onDeleteAddress = () => {

  }

  onCopyAddress = () => {

  }

  onGoBack = () => {
    NavigationService.goBack();
  }

  return (
    <View>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => this.onGoBack()} />
        <Appbar.Content
          title="Address Book"
        />
        <Appbar.Action icon="add-circle-outline" size={36} onPress={() => this.onCreateAddress()} />
      </Appbar.Header>
      <View style={styles.walletsWrapper}>
        <FlatList
          data={addressBook}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <View style={styles.flatview}>
              <View>
                <Text style={styles.addressLabel}>{item.label}</Text>
                <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                {item.status ? (<Text style={styles.data}>{item.status}</Text>) : null}
              </View>
              <View style={styles.walletFooter}>
                <Button style={[styles.footerBtn, styles.footerBtnLeft]} onPress={this.onDeleteAddress()}>
                  <Text style={styles.buttonText}>DELETE</Text>
                </Button>
                <Button style={[styles.footerBtn, styles.footerBtnRight]} onPress={this.onCopyAddress()}>
                  <Text style={styles.buttonText}>COPY</Text>
                </Button>
              </View>
            </View>
          }
          keyExtractor={item => item.entryID.toString()}
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
    right: 20
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
  addressLabel: {
    color: "#FFFFFF",
    fontSize: 18
  },
  address: {
    color: "#FFA500"
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

export default AddressBookScreen;