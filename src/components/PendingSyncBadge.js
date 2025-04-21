import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Badge, Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PendingSyncBadge = ({ count = 0, showNavigate = true }) => {
  const navigation = useNavigation();

  if (count === 0) {
    return (
      <View style={styles.iconContainer}>
        <Feather name="check-circle" size={24} color="#4CAF50" />
      </View>
    );
  }

  const handlePress = () => {
    if (showNavigate) {
      navigation.navigate('PendingSync');
    }
  };

  return (
    <TouchableOpacity
      style={styles.iconContainer}
      onPress={handlePress}
      disabled={!showNavigate}
    >
      <Feather name="database" size={24} color="#FF9800" />
      <Badge style={styles.badge}>{count > 99 ? '99+' : count}</Badge>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF9800',
  },
});

export default PendingSyncBadge;
