import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.social}
        onPress={() => navigation.navigate('ChatRoom')}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>Google</Text>
      </TouchableOpacity>
      <Text style={{marginTop: 10, color: 'red', fontSize: 15}}>
        Sign in to google
      </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  social: {
    width: 95,
    height: 95,
    borderRadius: 55,
    backgroundColor: '#df1c44',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
