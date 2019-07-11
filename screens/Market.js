import React, { useContext } from 'react';
import { Icon, Header, ListItem } from 'react-native-elements';
import { ScrollView, Text, View, StyleSheet, FlatList } from 'react-native';
import NavigationService from '../helpers/NavigationService';
import { ActivityIndicator } from 'react-native';
import { AppContext } from '../components/ContextProvider';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';


const Market = () => {
  const { actions, state } = useContext(AppContext);
  const { network, user, prices } = state;
  const { logoutUser } = actions;

  const list = [
    {
      value: prices.usd,
      title: 'CCX to USD',
      icon: 'logo-usd'
    },
    {
      value: prices.btc,
      title: 'CCX to BTC',
      icon: 'logo-bitcoin'
    },
    {
      value: prices.usd_market_cap,
      title: 'Marketcap',
      icon: 'md-cash'
    },
    {
      value: prices.usd_24h_vol,
      title: '24h Volume',
      icon: 'md-rocket'
    },
    {
      value: prices.usd_24h_change,
      title: '24h Change',
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
        size={26}
      />}
    />
  );

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={styles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={26}
        />}
        centerComponent={{ text: 'Market Data', style: { color: '#fff', fontSize: 20 } }}
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

const styles = StyleSheet.create({
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
    color: AppColors.concealOrange
  },
  settingsText: {
    color: AppColors.concealTextColor
  },
  settingsList: {
    margin: 10,
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
