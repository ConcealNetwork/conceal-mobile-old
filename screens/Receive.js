import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import styles from '../components/Style';


const Receive = () => {
  return (
    <View style={styles.viewContainer}>
      <ScrollView style={styles.viewContainer} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>RECEIVE CCX</Text>
        <Text style={styles.textRegular}>QR CODE</Text>
      </ScrollView>
    </View>
  )
};

export default Receive;
