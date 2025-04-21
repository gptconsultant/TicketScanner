import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Banner } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const OfflineNotice = () => {
  return (
    <Banner
      visible={true}
      icon={({size}) => (
        <Feather name="wifi-off" size={size} color="#F57C00" />
      )}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => {},
        },
      ]}
      style={styles.banner}
    >
      <Text style={styles.bannerText}>
        You are currently offline. Changes will be saved locally and synchronized when you reconnect.
      </Text>
    </Banner>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3E0',
  },
  bannerText: {
    color: '#333',
  },
});

export default OfflineNotice;
