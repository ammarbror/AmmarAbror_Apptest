import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const CardContact = props => {
  const {id, name, age, avatar, navigate} = props;
  // console.log(typeof avatar);
  return (
    <TouchableOpacity style={styles.container} onPress={() => navigate(id)}>
      <Image
        style={styles.image}
        source={
          avatar.startsWith('http') || avatar.startsWith('file')
            ? {uri: avatar}
            : require('../assets/user_icon.png')
        }
      />
      <View style={styles.containerData}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.age}>{age}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardContact;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  containerData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  age: {
    color: '#9B9B9B',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
});
