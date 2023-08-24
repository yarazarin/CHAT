import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chat = ({ route }) => {
  const { name, selectedColor } = route.params;
  return (
    <View style={[styles.container, { backgroundColor: selectedColor}]}>
      <Text style={styles.headerText}>Hello {name} !</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Chat;
