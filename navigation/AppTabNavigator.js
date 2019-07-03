import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import SendScreen from '../screens/Send';
import ReceiveScreen from '../screens/Receive';
import SettingsScreen from '../screens/Settings';
import styles from '../components/Style';
import { colors } from '../constants/Colors';


const AppTabNav = () => {
  const initialRoutes = [
    { key: 'send', title: 'Send' },
    { key: 'receive', title: 'Receive' },
    { key: 'settings', title: 'Settings' },
  ];

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState(initialRoutes);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        onIndexChange={index => setIndex(index)}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderScene={SceneMap({
          send: SendScreen,
          receive: ReceiveScreen,
          settings: SettingsScreen,
        })}
        renderTabBar={props =>
          <TabBar
            {...props}
            style={styles.tabBar}
            labelStyle={styles.tabBarLabel}
            indicatorStyle={styles.tabBarIndicator}
            inactiveColor={colors.tabBarLabel}
            activeColor={colors.tabBarLabelActive}
          />
        }
      />
    </SafeAreaView>
  )
};

export default AppTabNav;
