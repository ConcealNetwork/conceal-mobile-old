import React, { useContext } from 'react';
import { Icon, Header, ListItem } from 'react-native-elements';
import {View, StyleSheet, FlatList, Platform} from 'react-native';
import NavigationService from '../helpers/NavigationService';
import { AppContext } from '../components/ContextProvider';
import { AppColors } from '../constants/Colors';
import { formatDecimals } from '../helpers/utils';


const Market = () => {
  const { state } = useContext(AppContext);
  const { prices } = state;

  const marketData = [
    {
      value: `$ ${formatDecimals(prices.usd, 4)}`,
      title: 'CCX to USD',
      icon: 'logo-usd'
    },
    {
      value: formatDecimals(prices.btc, 8),
      title: 'CCX to BTC',
      icon: 'logo-bitcoin'
    },
    {
      value: `$ ${formatDecimals(prices.usd_market_cap, 2)}`,
      title: 'Marketcap (USD)',
      icon: 'md-cash'
    },
    {
      value: `$ ${formatDecimals(prices.usd_24h_vol, 2)}`,
      title: '24h Volume (USD)',
      icon: 'md-rocket'
    },
    {
      value: `${formatDecimals(prices.btc_24h_change, 2)}%`,
      title: '24h Change (BTC)',
      icon: 'md-pricetag'
    },
    {
      value: `${formatDecimals(prices.usd_24h_change, 2)}%`,
      title: '24h Change (USD)',
      icon: 'md-pricetag'
    }
  ];

  const renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      subtitle={item.value}
      titleStyle={styles.marketTitle}
      subtitleStyle={styles.marketLabel}
      containerStyle={styles.marketItem}
      leftIcon={
        <Icon
          name={item.icon}
          type="ionicon"
          color="white"
          size={26}
          fixedWidth
        />
      }
    />
  );

  return (
    <View style={styles.pageWrapper}>
      <Header
        containerStyle={styles.appHeader}
        leftComponent={
          <Icon
            onPress={() => NavigationService.goBack()}
            name={Platform.OS === 'android' ? 'md-arrow-round-back' : 'ios-arrow-back'}
            type="ionicon"
            color="white"
            underlayColor="transparent"
            size={32}
          />
        }
        centerComponent={{ text: 'Market Data', style: { color: '#fff', fontSize: 20 } }}
      />
      <FlatList
        data={marketData}
        style={styles.marketList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)',
  },
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40',
  },
  marketTitle: {
    fontSize: 11,
    color: AppColors.concealOrange,
  },
  marketLabel: {
    fontSize: 18,
    color: AppColors.concealTextColor,
  },
  marketText: {
    fontSize: 14,
    color: AppColors.concealTextColor,
  },
  marketList: {
    margin: 10,
    backgroundColor: AppColors.concealBackground,
  },
  marketItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground,
  }
});

export default Market;
