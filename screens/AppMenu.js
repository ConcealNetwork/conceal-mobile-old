import React, { useContext } from 'react';
import { Icon, Header, ListItem } from 'react-native-elements';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import { View, FlatList } from 'react-native';


const AppMenu = () => {
  const { actions } = useContext(AppContext);
  const { logoutUser } = actions;

  const settingsList = [

    {
      value: 'Setting',
      title: 'Settings for your profile...',
      icon: 'md-settings',
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
          onPress={() => NavigationService.navigate('Settings')}
        />
        );
      }
    }, {
      value: 'Default Wallet',
      title: 'This is your default selected wallet screen...',
      icon: 'md-wallet',
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
          onPress={() => NavigationService.navigate('Wallet')}
        />
        );
      }
    }, {
      value: 'Wallets',
      title: 'This is the wallet selection screen...',
      icon: 'md-wallet',
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
          onPress={() => NavigationService.navigate('Wallets')}
        />
        );
      }
    }, {
      value: 'Messages',
      title: 'Go to sending and receiving messages...',
      icon: 'md-mail',
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
          onPress={() => NavigationService.navigate('Messages')}
        />
        );
      }
    }, {
      value: 'Address Book',
      title: 'This is the address book managment screen...',
      icon: 'md-book',
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
          onPress={() => NavigationService.navigate('AddressBook')}
        />
        );
      }
    }, {
      value: 'Address Book',
      title: 'This is the address book managment screen...',
      icon: 'md-trending-up',
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
          onPress={() => NavigationService.navigate('Market')}
        />
        );
      }
    }
  ];

  // key extractor for the list
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.value}
      subtitle={item.title}
      rightElement={item.rightElement}
      titleStyle={styles.settingsText}
      subtitleStyle={styles.settingsLabel}
      containerStyle={styles.settingsItem}
      leftIcon={< Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32 * getAspectRatio()}
      />}
    />
  );

  return (
    <View style={AppStyles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Navigation', style: AppStyles.appHeaderText }}
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
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
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
