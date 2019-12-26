import React, { useContext } from 'react';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Icon, Overlay } from 'react-native-elements';

import { AppContext } from '../components/ContextProvider';
import { AppColors } from '../constants/Colors';
import {
  maskAddress,
  getAspectRatio
} from '../helpers/utils';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';


const SearchAddress = props => {
  const { closeOverlay, selectAddress, addressData, currWallet } = props;
  const { actions, state } = useContext(AppContext);
  const { setAppData } = actions;
  let addressList = [];

  addressData.forEach(function (value) {
    let isValidItem = true;

    // check if the text filter is set
    if (state.appData.searchAddress.filterText && (value.label.toLowerCase().search(state.appData.searchAddress.filterText.toLowerCase()) == -1)) {
      isValidItem = false;
    }

    if (isValidItem) {
      addressList.push(value);
    }
  });

  return (
    <Overlay
      isVisible={state.appData.searchAddress.addrListVisible}
      overlayBackgroundColor={AppColors.concealBackground}
      width="100%"
      height="100%"
    >
      <View style={styles.overlayWrapper}>
        <ConcealTextInput
          placeholder='Enter text to search...'
          value={state.appData.searchAddress.filterText}
          containerStyle={styles.searchInput}
          onChangeText={(text) => {
            setAppData({ searchAddress: { filterText: text } });
          }}
          rightIcon={
            <Icon
              onPress={() => setAppData({ searchAddress: { filterText: null } })}
              name='md-trash'
              type='ionicon'
              color='white'
              size={32 * getAspectRatio()}
            />
          }
        />
        <View style={styles.addressWrapper}>
          <FlatList
            data={addressList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              (currWallet.addr !== item.address)
                ? (<TouchableOpacity onPress={() => selectAddress(item)}>
                  <View style={styles.flatview}>
                    <View>
                      <Text style={styles.addressLabel}>{item.label}</Text>
                      <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                      {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                    </View>
                  </View>
                </TouchableOpacity>)
                : null
            }
            keyExtractor={item => item.entryID.toString()}
          />
        </View>
        <View style={styles.footer}>
          <ConcealButton
            style={[styles.footerBtn]}
            onPress={() => closeOverlay()}
            text="CLOSE"
          />
        </View>
      </View>
    </Overlay>
  )
};

const styles = EStyleSheet.create({
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  searchInput: {
    top: '5rem'
  },
  addressWrapper: {
    top: '55rem',
    left: '10rem',
    right: '10rem',
    bottom: '80rem',
    borderRadius: '10rem',
    position: 'absolute'
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: '5rem',
    marginTop: '5rem',
    padding: '20rem',
  },
  addressLabel: {
    color: "#FFFFFF",
    fontSize: '18rem'
  },
  address: {
    color: "#FFA500",
    fontSize: '14rem'
  },
  data: {
    color: "#AAAAAA"
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
  footerBtn: {
    flex: 1
  }
});

export default SearchAddress;
