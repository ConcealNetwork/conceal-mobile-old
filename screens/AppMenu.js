import React, { useContext } from 'react';
import { FlatList, View, Text } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AuthContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { getAspectRatio } from '../helpers/utils';


const AppMenu = ({ navigation: { goBack, navigate } }) => {
  const { actions } = useContext(AuthContext);
  const { logoutUser } = actions;

  const settingsList = [
    {
      value: 'Setting',
      title: 'Settings for your profile...',
      icon: 'md-settings',
      onPress: () => navigate('Settings'),
    },
    {
      value: 'Wallets',
      title: 'This is the wallet selection screen...',
      icon: 'md-wallet',
      onPress: () => navigate('Wallets'),
    },
    {
      value: 'Messages',
      title: 'Go to sending and receiving messages...',
      icon: 'md-mail',
      onPress: () => navigate('Messages'),
    },
    {
      value: 'Address Book',
      title: 'This is the address book management screen...',
      icon: 'md-book',
      onPress: () => navigate('AddressBook'),
    },
    {
      value: 'Market Data',
      title: 'This is the current market data...',
      icon: 'md-trending-up',
      onPress: () => navigate('Market'),
    }
  ];

  const renderItem = ({ item }) =>
    <ListItem containerStyle={styles.settingsItem} key={item.value} onPress={item.onPress}>
      <Icon name={item.icon} type='ionicon' color='white' size={32 * getAspectRatio()} />
      <ListItem.Content>
        <ListItem.Title style={styles.settingsText}>{item.value}</ListItem.Title>
        <ListItem.Subtitle style={styles.settingsLabel}>{item.title}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>

  return (
    <View style={AppStyles.pageWrapper}>
      <Header
        placement='left'
        statusBarProps={{ translucent: false, backgroundColor: "#212529" }}
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          containerStyle={AppStyles.leftHeaderIcon}
          onPress={() => goBack()}
          name='arrow-back-outline'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={          
          <View style={AppStyles.appHeaderWrapper}>
            <Text style={AppStyles.appHeaderText}>
            Navigation
            </Text>
          </View>
        }        
        rightComponent={< Icon
          onPress={logoutUser}
          name='md-log-out'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
      />
      <FlatList
        data={settingsList}
        style={styles.settingsList}
        renderItem={renderItem}
        keyExtractor={item => item.title}
      />
    </View>
  )
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40'
  },
  settingsLabel: {
    fontSize: '12rem',
    color: AppColors.concealOrange
  },
  settingsText: {
    fontSize: '14rem',
    color: AppColors.concealTextColor
  },
  settingsList: {
    margin: '10rem',
    backgroundColor: AppColors.concealBackground
  },
  settingsItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground,
  },
  pickerCancelButton: {
    height: '45rem',
    borderWidth: 1,
    borderColor: AppColors.concealOrange,
    backgroundColor: AppColors.concealBackground
  },
  pickerCancelButtonText: {
    color: AppColors.concealTextColor,
    fontSize: '16rem',
    paddingTop: '2rem'
  },
  pickerContainer: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.concealBlack,
    backgroundColor: AppColors.concealBackground
  },
  pickerOptionText: {
    color: AppColors.concealTextColor
  },
  pickerSectionText: {
    color: AppColors.concealOrange
  },
  passwordInput: {
    marginTop: '30rem',
    marginBottom: '50rem'
  }
});

export default AppMenu;
