import React, { useContext } from 'react';
import { Icon, Header, ListItem } from 'react-native-elements';
import { ScrollView, Text, View, StyleSheet, FlatList } from 'react-native';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';


const Settings = () => {
  const { actions, state } = useContext(AppContext);
  const { logoutUser, check2FA } = actions;
  const { network, user, userSettings } = state;

  const settingsList = [
    {
      value: user.name,
      title: 'User Name',
      icon: 'md-person'
    },
    {
      value: user.email,
      title: 'Email',
      icon: 'md-mail'
    },
    {
      value: network.blockchainHeight.toLocaleString(),
      title: 'Height',
      icon: 'md-pulse'
    },
    {
      value: userSettings.twoFAEnabled ? 'Two Factor Authentication is ON' : 'Two Factor Authentication is OFF',
      title: 'Visit: "https://conceal.cloud" to change',
      icon: 'md-lock'
    }
  ];

  // key extractor for the list
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.value}
      subtitle={item.title}
      titleStyle={styles.settingsText}
      subtitleStyle={styles.settingsLabel}
      containerStyle={styles.settingsItem}
      leftIcon={<Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32 * getAspectRatio()}
      />}
    />
  );

  if (userSettings.twoFAEnabled === null) {
    check2FA();
  }

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
        centerComponent={{ text: 'User Settings', style: AppStyles.appHeaderText }}
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
  }
});

export default Settings;
