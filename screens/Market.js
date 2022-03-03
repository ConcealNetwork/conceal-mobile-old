import React, { useContext } from 'react';
import { FlatList, View, Text } from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { sprintf } from 'sprintf-js';
import { AppContext } from '../components/ContextProvider';
import AppStyles from '../components/Style';
import { AppColors } from '../constants/Colors';
import { format0Decimals, format2Decimals, format4Decimals, format8Decimals, getAspectRatio } from '../helpers/utils';

const Market = ({ navigation: { goBack } }) => {
  const { state } = useContext(AppContext);
  const { prices } = state;

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

  const renderItem = ({ item }) =>
    <ListItem containerStyle={styles.settingsItem} key={item.value} onPress={item.onPress}>
      <Icon name={item.icon} type='ionicon' color='white' size={32 * getAspectRatio()} />
      <ListItem.Content>
        <ListItem.Title style={styles.settingsText}>{item.value}</ListItem.Title>
        <ListItem.Subtitle style={styles.settingsLabel}>{item.title}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>

  return (
    <View style={styles.pageWrapper}>
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
            Market Data
            </Text>
          </View>
        }        
      />
      <FlatList
        data={list}
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

export default Market;
