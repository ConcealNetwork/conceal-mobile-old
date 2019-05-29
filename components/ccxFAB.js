import React  from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

export default function ConcealFAB({
  onPress
}) 
{
  return (
    <FAB style={styles.fab} small icon="chevron-right" color="#FFFFFF" onPress={onPress} />
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#FFA500"
  },
})