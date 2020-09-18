import React, { useContext, useState, useEffect } from 'react';
import { Icon, Header } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import ConcealTextInput from '../components/ccxTextInput';
import ConcealButton from '../components/ccxButton';
import { AppContext } from '../components/ContextProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getAspectRatio } from '../helpers/utils';
import GuideNavigation from '../helpers/GuideNav';
import { maskAddress } from '../helpers/utils';
import AppStyles from '../components/Style';
import Tips from 'react-native-guide-tips';
import {
  Text,
  View,
  Alert,
  FlatList,
  Clipboard
} from 'react-native';

let firstVisibleItem = -1;

let readLabelromClipboard = async () => {
  const clipboardContent = await Clipboard.getString();
  setAppData({
    addressEntry: {
      label: clipboardContent
    }
  });
};

let readAddressFromClipboard = async () => {
  const clipboardContent = await Clipboard.getString();
  setAppData({
    addressEntry: {
      address: clipboardContent
    }
  });
};

let readPaymentIdFromClipboard = async () => {
  const clipboardContent = await Clipboard.getString();
  setAppData({
    addressEntry: {
      paymentId: clipboardContent
    }
  });
};

const handleViewableItemsChanged = (info) => {
  if ((info.viewableItems) && (info.viewableItems.length > 0)) {
    firstVisibleItem = info.viewableItems[0].index;
  } else {
    firstVisibleItem = -1;
  }
}

const AddressBook = () => {
  const { actions, state } = useContext(AppContext);
  const { deleteContact, setAppData } = actions;
  const { layout, user } = state;
  let addressList = [];

  // guide navigation state values
  const [guideState, setGuideState] = useState(null);
  const [guideNavigation] = useState(new GuideNavigation('addressBook', [
    'addressSearch',
    'addAddress',
    'deleteAddress',
    'editAddress'
  ]));

  user.addressBook.forEach(function (value, index, array) {
    var isValidItem = true;

    // check if the text filter is set
    if (state.appData.addressBook.filterText && (value.label.toLowerCase().search(state.appData.addressBook.filterText.toLowerCase()) == -1)) {
      isValidItem = false;
    }

    if (isValidItem) {
      addressList.push(value);
    }
  });

  // fire on mount
  useEffect(() => {
    setTimeout(() => {
      setGuideState(guideNavigation.start());
    }, 100);
  }, []);

  return (
    <View style={AppStyles.pageWrapper}>
      <Header
        placement="left"
        statusBarProps={{ translucent: false }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={
          <View style={AppStyles.appHeaderWrapper}>
            <Text style={AppStyles.appHeaderText}>
              Address Book
            </Text>
            <Icon
              onPress={() => {
                guideNavigation.reset();
                setGuideState(guideNavigation.start());
              }}
              name='md-help'
              type='ionicon'
              color='white'
              size={26 * getAspectRatio()}
            />
          </View>
        }
        rightComponent={<Tips
          position={'bottom'}
          visible={guideState == 'addAddress'}
          textStyle={AppStyles.guideTipText}
          style={[AppStyles.guideTipContainer, styles.guideTipAddAddress]}
          tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowAddAddress]}
          text="Click on this button to add an address..."
          onRequestClose={() => setGuideState(guideNavigation.next())}
        >
          <Icon
            onPress={() => {
              setAppData({
                addressEntry: {
                  headerText: "Create Address",
                  label: '',
                  address: '',
                  paymentId: '',
                  entryId: null
                }
              });
              NavigationService.navigate('EditAddress', { callback: null });
            }}
            name='md-add-circle-outline'
            type='ionicon'
            color='white'
            size={42 * getAspectRatio()}
          /></Tips>}
      />
      <Tips
        position={'bottom'}
        visible={guideState == 'addressSearch'}
        textStyle={AppStyles.guideTipText}
        tooltipArrowStyle={AppStyles.guideTipArrowTop}
        style={AppStyles.guideTipContainer}
        text="Here you can search for a specific address by text"
        onRequestClose={() => setGuideState(guideNavigation.next())}
      >
        <ConcealTextInput
          placeholder='Enter text to search...'
          value={state.appData.addressBook.filterText}
          containerStyle={styles.searchInput}
          onChangeText={(text) => {
            setAppData({ addressBook: { filterText: text } });
          }}
          rightIcon={
            <Icon
              onPress={() => setAppData({ addressBook: { filterText: null } })}
              name='md-trash'
              type='ionicon'
              color='white'
              size={32 * getAspectRatio()}
            />
          }
        />
      </Tips>
      <View style={styles.addressListWrapper}>
        {layout.userLoaded && addressList.length === 0
          ? (<View style={styles.emptyAddressBookWrapper}>
            <Text style={styles.emptyAddressBookText}>
              You have no contacts saved in your address book, or search did not find any.
              Add one by clicking on the + button or when you are sending funds.
            </Text>
          </View>)
          : (<FlatList
            data={addressList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.entryID.toString()}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            renderItem={({ item, index }) =>
              <View style={styles.flatview}>
                <View>
                  <Text style={styles.addressLabel}>{item.label}</Text>
                  <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                  {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                </View>
                <View style={styles.addressListFooter}>
                  <View style={styles.btnWrapper}>
                    <Tips
                      position={'bottom'}
                      visible={(guideState == 'deleteAddress') && (index == firstVisibleItem)}
                      textStyle={AppStyles.guideTipText}
                      style={[AppStyles.guideTipContainer, styles.guideTipDeleteAddress]}
                      tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowDeleteAddress]}
                      text="Click on this button to delete the address..."
                      onRequestClose={() => setGuideState(guideNavigation.next())}
                    >
                      <ConcealButton
                        style={[styles.footerBtn, styles.footerBtnLeft]}
                        buttonStyle={styles.btnStyle}
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
                        text="DELETE"
                      />
                    </Tips>
                  </View>
                  <View style={styles.btnWrapper}>
                    <Tips
                      position={'bottom'}
                      visible={(guideState == 'editAddress') && (index == firstVisibleItem)}
                      textStyle={AppStyles.guideTipText}
                      style={[AppStyles.guideTipContainer, styles.guideTipEditAddress]}
                      tooltipArrowStyle={[AppStyles.guideTipArrowTop, styles.guideTipArrowEditAddress]}
                      text="Click on this button to edit the address..."
                      onRequestClose={() => setGuideState(guideNavigation.next())}
                    >
                      <ConcealButton
                        style={[styles.footerBtn, styles.footerBtnRight]}
                        buttonStyle={styles.btnStyle}
                        onPress={() => {
                          setAppData({
                            addressEntry: {
                              headerText: "Edit Address",
                              label: item.label,
                              address: item.address,
                              paymentId: item.paymentID,
                              entryId: item.entryID
                            }
                          });
                          NavigationService.navigate('EditAddress', { callback: null });
                        }}
                        text="EDIT"
                      />
                    </Tips>
                  </View>
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
  buttonsWrapper: {
    position: 'absolute',
    right: 20
  },
  icon: {
    color: 'orange'
  },
  flatview: {
    backgroundColor: '#212529',
    justifyContent: 'center',
    borderRadius: '10rem',
    marginBottom: '5rem',
    marginTop: '5rem',
    padding: '20rem',
  },
  addressLabel: {
    color: '#FFFFFF',
    fontSize: '18rem'
  },
  address: {
    color: '#FFA500',
    fontSize: '14rem'
  },
  data: {
    color: '#AAAAAA',
    fontSize: '12rem'
  },
  buttonContainer: {
    margin: '5rem'
  },
  addressListWrapper: {
    top: '125rem',
    left: '10rem',
    right: '10rem',
    bottom: 0,
    position: 'absolute'
  },
  footer: {
    bottom: '10rem',
    left: '20rem',
    right: '20rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  addressListFooter: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnWrapper: {
    flexGrow: 1,
  },
  footerBtn: {
    height: '40rem',
    marginTop: '10rem',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  btnStyle: {
    borderWidth: 0
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
  emptyAddressBookWrapper: {
    flex: 1,
    padding: '20rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyAddressBookText: {
    fontSize: '18rem',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  guideTipAddAddress: {
    left: '-130rem'
  },
  guideTipArrowAddAddress: {
    left: '97%'
  },
  guideTipDeleteAddress: {
    left: '20rem'
  },
  guideTipArrowDeleteAddress: {
    left: '27%'
  },
  guideTipEditAddress: {
    left: '-50rem'
  },
  guideTipArrowEditAddress: {
    left: '68%'
  }
});

export default AddressBook;
