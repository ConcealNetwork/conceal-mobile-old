import React, { useContext } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import ConcealTextInput from '../components/ccxTextInput';

import { AppContext } from '../components/ContextProvider';
import { AppColors } from '../constants/Colors';
import { useFormInput } from '../helpers/hooks';
import { getAspectRatio, maskAddress } from '../helpers/utils';


const SearchAddress = props => {
  const { addrListVisible, closeOverlay, selectAddress, currWallet } = props;
  const { state } = useContext(AppContext);
  const { user } = state;

  const { value: filterText, bind: bindFilterText, setValue: setFilterText } = useFormInput();

  const addressList = user.addressBook.filter(i => i.label.match(filterText));

  return (
    <Overlay
      isVisible={addrListVisible}
      overlayBackgroundColor={AppColors.concealBackground}
      fullScreen={true}
    >
      <View style={styles.overlayWrapper}>
        <ConcealTextInput
          {...bindFilterText}
          placeholder='Enter text to search...'
          containerStyle={styles.searchInput}
          rightIcon={
            <Icon
              onPress={() => setFilterText('')}
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
                ? <TouchableOpacity onPress={() => selectAddress(item)}>
                    <View style={styles.flatview}>
                      <View>
                        <Text style={styles.addressLabel}>{item.label}</Text>
                        <Text style={styles.address}>Address: {maskAddress(item.address)}</Text>
                        {item.paymentID ? (<Text style={styles.data}>Payment ID: {item.paymentID}</Text>) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
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
    position: 'absolute',
    backgroundColor: AppColors.concealBackground

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
