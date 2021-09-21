import axios from 'axios';
import React, {createRef, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';

const actionSheetUser = createRef();

const ProfileScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    age: '',
    photo: '',
  });
  const [isChange, setChange] = useState(false);
  console.log(user);

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
          setAddUser('photo', response.assets[0].uri);
        }
      },
    );
  };

  const setAddUser = (type, value) => {
    setUser(prevState => ({
      ...prevState,
      [type]: value,
    }));
  };

  const editUser = () => {
    var editData = JSON.stringify({
      firstName: user.firstName ? user.firstName : data.firstName,
      lastName: user.lastName ? user.lastName : data.lastName,
      age: user.age ? user.age : data.age,
      photo: user.photo ? user.photo : data.photo,
    });

    var config = {
      method: 'put',
      url: `https://simple-contact-crud.herokuapp.com/contact/${data.id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: editData,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    navigation.navigate('Home');
  };

  const deleteUser = () => {
    var config = {
      method: 'delete',
      url: `https://simple-contact-crud.herokuapp.com/contact/${data.id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    navigation.navigate('Home');
  };
  return (
    <View style={styles.body}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <ImageBackground
        style={styles.imageBackground}
        source={
          data.photo.startsWith('http') || data.photo.startsWith('file')
            ? {uri: data.photo}
            : require('../assets/biguser_icon.png')
        }>
        <View style={styles.AndroidSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => navigation.goBack()}>
              <Image
                style={styles.iconBack}
                source={require('../assets/back_icon.png')}
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {`${data.firstName} ${data.lastName}`}
            </Text>
          </View>
        </View>
        <View style={styles.containerData}>
          <View style={styles.containerDataContent}>
            <View>
              <Text style={[styles.title, {marginLeft: 0}]}>
                {`${data.firstName} ${data.lastName}`}
              </Text>
              <Text style={styles.age}>{isChange ? user.age : data.age}</Text>
            </View>
            <View style={styles.containerButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => actionSheetUser.current?.setModalVisible()}>
                <Image
                  style={styles.icon}
                  source={require('../assets/edit_icon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {marginLeft: 16, backgroundColor: '#E03131'},
                ]}
                onPress={deleteUser()}>
                <Image
                  style={styles.icon}
                  source={require('../assets/delete_icon.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
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
                user.photo
                  ? user.photo.startsWith('http') ||
                    user.photo.startsWith('file')
                    ? {uri: user.photo}
                    : require('../assets/biguser_icon.png')
                  : data.photo.startsWith('http') ||
                    data.photo.startsWith('file')
                  ? {uri: data.photo}
                  : require('../assets/biguser_icon.png')
              }
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={data.firstName}
            placeholderTextColor="#9B9B9B"
            onChangeText={text => setAddUser('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder={data.lastName}
            placeholderTextColor="#9B9B9B"
            onChangeText={text => setAddUser('lastName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder={`${data.age}`}
            placeholderTextColor="#9B9B9B"
            onChangeText={text => setAddUser('age', text)}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.buttonAdd} onPress={() => editUser()}>
            <Text style={styles.buttonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#25283D',
    height: '100%',
  },
  AndroidSafeArea: {
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'rgba(37, 40, 61, 0.8)',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonBack: {
    padding: 6,
    borderWidth: 2,
    borderRadius: 32,
    borderColor: '#9b9b9b',
  },
  iconBack: {
    width: 32,
    height: 32,
  },
  icon: {
    width: 26,
    height: 26,
  },
  button: {
    padding: 12,
    borderRadius: 32,
    backgroundColor: '#8F3985',
  },
  title: {
    marginLeft: 12,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 26,
    letterSpacing: 0.4,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  containerData: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(37, 40, 61, 0.8)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  age: {
    fontSize: 20,
    color: '#EFD9CE',
  },
  containerDataContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerButton: {
    flexDirection: 'row',
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
