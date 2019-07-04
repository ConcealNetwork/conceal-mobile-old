import React, { useContext } from 'react';
import { Alert, Text, View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import { maskAddress } from '../helpers/utils';


const AddressBook = () => {
  const { actions, state } = useContext(AppContext);
  const { deleteContact } = actions;
  const { layout, user } = state;

  return (
    <View>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => NavigationService.goBack()} />
        <Appbar.Content
          title="Address Book"
        />
        <Appbar.Action icon="add-circle-outline" size={36} onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.walletsWrapper}>
        {layout.userLoaded && user.addressBook.length === 0
          ? <Text>
              You have no contacts saved in your address book.
              Add one by clicking on the button or when you are sending funds.
            </Text>
          : <FlatList
              data={user.addressBook}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.entryID.toString()}
              renderItem={({ item }) =>
                <View style={styles.flatview}>
                  <View>
                    <Text style={styles.addressLabel}>{item.label}</Text>
                    <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                    {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                  </View>
                  <View style={styles.walletFooter}>
                    <Button
                      style={[styles.footerBtn, styles.footerBtnLeft]}
                      onPress={() => {
                        Alert.alert(
                          'Delete Contact',
                          'You are about to delete this contact! Do you really wish to proceed?',
                          [
                            { text: 'OK', onPress: () => deleteContact(item) },
                            { text: 'Cancel', style: 'cancel' },
                          ],
                          { cancelable: false },
                        );
                      }}
                    >
                      <Text style={styles.buttonText}>DELETE</Text>
                    </Button>
                    <Button style={[styles.footerBtn, styles.footerBtnRight]} onPress={() => {}}>
                      <Text style={styles.buttonText}>COPY</Text>
                    </Button>
                  </View>
                </View>
              }
            />
        }
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
    right: 20
  },
  icon: {
    color: 'orange'
    //color: '#CCC'
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: 18
  },
  address: {
    color: '#FFA500'
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

export default AddressBook;
