import React, { useContext } from 'react';
import { Icon, Header, ListItem } from 'react-native-elements';
import { ScrollView, Text, View, StyleSheet, FlatList } from 'react-native';
import { format0Decimals, format2Decimals, format4Decimals, format8Decimals } from '../helpers/utils';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator } from 'react-native';
import { AppContext } from '../components/ContextProvider';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import { sprintf } from 'sprintf-js';

const Market = () => {
  const { actions, state } = useContext(AppContext);
  const { network, user, prices } = state;
  const { logoutUser } = actions;

  const list = [
    {
      value: sprintf('$ %s', prices.usd.toLocaleString(undefined, format4Decimals)),
      title: 'CCX to USD',
      icon: 'logo-usd'
    },
    {
      value: prices.btc.toLocaleString(undefined, format8Decimals),
      title: 'CCX to BTC',
      icon: 'logo-bitcoin'
    },
    {
      value: sprintf('$ %s', prices.usd_market_cap.toLocaleString(undefined, format0Decimals)),
      title: 'Marketcap (USD)',
      icon: 'md-cash'
    },
    {
      value: sprintf('$ %s', prices.usd_24h_vol.toLocaleString(undefined, format0Decimals)),
      title: '24h Volume (USD)',
      icon: 'md-rocket'
    },
    {
      value: sprintf('%s %%', prices.btc_24h_change.toLocaleString(undefined, format2Decimals)),
      title: '24h Change (BTC)',
      icon: 'md-pricetag'
    },
    {
      value: sprintf('%s %%', prices.usd_24h_change.toLocaleString(undefined, format2Decimals)),
      title: '24h Change (USD)',
      icon: 'md-pricetag'
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

  return (
    <View style={styles.pageWrapper}>
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
        centerComponent={{ text: 'Market Data', style: AppStyles.appHeaderText }}
      />
      <FlatList
        data={list}
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
  settingsLabel: {
    fontSize: '14rem',
    color: AppColors.concealOrange
  },
  settingsText: {
    fontSize: '16rem',
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

export default Market;
