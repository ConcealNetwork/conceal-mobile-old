import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
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
      onPress: function () {
        navigate('Settings');
      },
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />
        );
      }
    }, {
      value: 'Default Wallet',
      title: 'This is your default selected wallet screen...',
      icon: 'md-wallet',
      onPress: function () {
        navigate('Wallet');
      },
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />
        );
      }
    }, {
      value: 'Wallets',
      title: 'This is the wallet selection screen...',
      icon: 'md-wallet',
      onPress: function () {
        navigate('Wallets');
      },
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />
        );
      }
    }, {
      value: 'Messages',
      title: 'Go to sending and receiving messages...',
      icon: 'md-mail',
      onPress: function () {
        navigate('Messages');
      },
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />
        );
      }
    }, {
      value: 'Address Book',
      title: 'This is the address book managment screen...',
      icon: 'md-book',
      onPress: function () {
        navigate('AddressBook');
      },
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />
        );
      }
    }, {
      value: 'Market Data',
      title: 'This is the current market data...',
      icon: 'md-trending-up',
      onPress: function () {
        navigate('Market');
      },
      rightElement: function () {
        return (<Icon
          name='md-play'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />
        );
      }
    }
  ];

  const renderItem = ({ item }) => (
    <ListItem key={item.value} onPress={item.onPress} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.value}</ListItem.Title>
        <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
    /*<ListItem
      title={item.value}
      subtitle={item.title}
      rightElement={item.rightElement}
      titleStyle={styles.settingsText}
      subtitleStyle={styles.settingsLabel}
      containerStyle={styles.settingsItem}
      onPress={item.onPress}
      leftIcon={< Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32 * getAspectRatio()}
      />}
    />*/
  );

  return (
    <View style={AppStyles.pageWrapper}>
      <Header
        placement='left'
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => goBack()}
          name='arrow-back-outline'
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
