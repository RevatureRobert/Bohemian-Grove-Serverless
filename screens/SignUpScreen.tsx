import * as React from 'react';
import { StyleSheet, TextInput, SafeAreaView, Button, Pressable, Text, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { screenWidth } from '../constants/Layout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native';
import { IAppState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const SignUpScreen = (props: any) => {
  const auth = useSelector((state: IAppState) => state.auth);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(' ');
  const [displayname, setDisplayName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  const navigation = useNavigation();

  const createNewUser = async () => {

    console.log("Creating user");

    try {
      const resp = await axios.post('https://w822121nz1.execute-api.us-east-2.amazonaws.com/Prod/auth/signup', {
        userName: username,
        password: password,
        email: email
      });
    } catch (err) {
      console.log(err);
      console.log(err.response.data);
      return;
    }

    try {
      const resp2 = await axios.post('https://w822121nz1.execute-api.us-east-2.amazonaws.com/Prod/user/' + username, {
        dataKey: username,
        dataType: 'user',
        displayName: displayname,
        email: email,
        profileImg: 'https://image.flaticon.com/icons/png/512/3239/3239647.png'
      });
    } catch (err) {
      console.log(err);
      console.log(err.response.data);
      return;
    }

    props.submitFunc();
  }

  const redirectGlobal = () => {

  }

  const validateEmail = (text: string) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      return false;
    }
    else {
      console.log("Email is Correct");
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="white"
        onChangeText={(text) => setUsername(text)}
        keyboardType="ascii-capable"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text => setPassword(text))}
        placeholder="Password"
        placeholderTextColor="white"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        placeholderTextColor="white"
        onChangeText={(text) => setDisplayName(text)}
        keyboardType="ascii-capable"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="white"
        onChangeText={(text) => {
          validateEmail(text)
          setEmail(text)
        }}
        keyboardType="ascii-capable"
      />
      <Pressable
        style={styles.button}
        onPress={() => createNewUser()}>
        <Text
          style={styles.text}>Submit</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: screenWidth - 100,
    paddingBottom: 10,
    alignItems: 'center',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: 'purple',
    color: 'white',
    fontSize: 18,
    borderRadius: 10,
    paddingHorizontal: 25
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'purple',
    fontSize: 18,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  safeArea: {
    flex: 3,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default SignUpScreen;