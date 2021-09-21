import axios from 'axios';
import React, {createRef, useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CardContact from '../components/CardContact';
import ActionSheet from 'react-native-actions-sheet';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/core';

const actionSheetUser = createRef();

const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const homeState = useSelector(state => state.HomeReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    getContact();
    setLoading(false);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const getContact = () => {
    var config = {
      method: 'get',
      url: 'https://simple-contact-crud.herokuapp.com/contact',
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data.data));
        dispatch({type: 'SET_DATA', value: response.data.data});
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addUser = () => {
    var i = 0;
    Object.keys(homeState.addUser).map(item => {
      if (!homeState.addUser[item]) {
        i++;
      }
    });
    console.log(i);
    if (i != 0) {
      Alert.alert('Fill Data', 'Please fill all data');
    } else {
      actionSheetUser.current?.hide();
      setLoading(true);
      var config = {
        method: 'post',
        url: 'https://simple-contact-crud.herokuapp.com/contact',
        headers: {
          'Content-Type': 'application/json',
        },
        data: homeState.addUser,
      };

      axios(config)
        .then(function (response) {
          setLoading(false);
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
      dispatch({type: 'CLEAR_USER'});
      getContact();
    }
  };

  const pickPhoto = () => {
    launchImageLibrary(
      {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        mediaType: 'photo',
        maxWidth: 1000,
        maxHeight: 1000,
        // quality: 1,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else {
          console.log(response.assets[0].uri);
          dispatch({
            type: 'SET_ADDUSER',
            typeInput: 'photo',
            value: response.assets[0].uri,
          });
        }
      },
    );
  };

  const setAddUser = (type, value) => {
    dispatch({type: 'SET_ADDUSER', typeInput: type, value: value});
  };

  const navigateProfile = id => {
    navigation.navigate('Profile', {data: homeState.dataContact[id]});
  };

  console.log('state : ' + JSON.stringify(homeState.addUser));

  return (
    <View style={styles.body}>
      {loading ? (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#EFD9CE"
        />
      ) : (
        <View></View>
      )}

      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.AndroidSafeArea}>
        <View style={[styles.paddingApp, styles.header]}>
          <Text style={styles.title}>ContactApp</Text>
          <TouchableOpacity
            onPress={() => actionSheetUser.current?.setModalVisible()}>
            <Image
              style={styles.icon}
              source={require('../assets/add_icon.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.listContainer]}>
          <FlatList
            data={homeState.dataContact}
            renderItem={({item, index}) => (
              <CardContact
                id={index}
                name={`${item.firstName} ${item.lastName}`}
                age={item.age}
                avatar={item.photo}
                navigate={navigateProfile}
              />
            )}
          />
        </View>
      </View>
      <ActionSheet
        ref={actionSheetUser}
        containerStyle={styles.ActionSheet}
        gestureEnabled={true}
        overlayColor="#25283D">
        <View style={styles.containerForm}>
          <Text style={[styles.title, {fontSize: 18, textAlign: 'center'}]}>
            Add Contact
          </Text>
          <TouchableOpacity onPress={() => pickPhoto()}>
            <Image
              style={styles.imageProfile}
              source={
                homeState.addUser.photo
                  ? {uri: homeState.addUser.photo}
                  : require('../assets/user_icon.png')
              }
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#9B9B9B"
            onChangeText={text => setAddUser('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#9B9B9B"
            onChangeText={text => setAddUser('lastName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#9B9B9B"
            onChangeText={text => setAddUser('age', text)}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.buttonAdd} onPress={() => addUser()}>
            <Text style={styles.buttonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#25283D',
    height: '100%',
  },
  AndroidSafeArea: {
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loading: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 26,
    letterSpacing: 0.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
  },
  listContainer: {
    marginVertical: 16,
    paddingLeft: 20,
  },
  paddingApp: {
    paddingHorizontal: 20,
  },
  ActionSheet: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    backgroundColor: '#25283D',
  },
  imageProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginVertical: 12,
  },
  input: {
    backgroundColor: '#494B5A',
    color: 'white',
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 8,
  },
  buttonAdd: {
    backgroundColor: '#8F3985',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
