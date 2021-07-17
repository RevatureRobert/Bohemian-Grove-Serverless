import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {

    const [email, setEmail] = useState(' ');
    const [handle, setHandle] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [profileimg, setProfileImage] = useState(' ');

    function submitForm() {

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
            setEmail(text);
        }
    }

    return (

        <SafeAreaView style={styles.formcontainer}>
            <Text style={styles.text}> Change your profile information </Text>
            <View style={styles.topform}>

                <TextInput placeholder="Email" onChangeText={(text) => { validateEmail(text) }} />
            </View>
            <View style={styles.form}>
                <TextInput placeholder="Handle" onChangeText={(text) => setHandle(text)} />
            </View>
            <View style={styles.form}>
                <TextInput placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
            </View>
            <View style={styles.form}>
                <TextInput placeholder="Profile Image" onChangeText={(text) => setProfileImage(text)} />
            </View>
            <View>
                <Pressable style={styles.button} onPress={() => submitForm()}>
                    <Text style={styles.buttontext}>Submit</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    formcontainer: {
        flex: 1,
        backgroundColor: "white"
    },
    topform: {
        marginTop: 100,
        marginLeft: 100,
    },
    form: {
        marginTop: 30,
        marginLeft: 100,
    },
    text: {
        marginTop: 50,
        fontSize: 25
    },
    button: {
        marginTop: 30,
        marginLeft: 50
    },
    buttontext: {
        fontSize: 15
    }
})

