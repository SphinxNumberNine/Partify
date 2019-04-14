import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Image
} from 'react-native';
import { Avatar } from 'react-native-elements'
import SocketIO from 'socket.io-client';
import Config from '../config';
import Spotify from 'rn-spotify-sdk';

export default class PartyScreen extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);

    if (Spotify.isInitialized()) {
      Spotify.getMe().then((res) => {
        console.log("RESULT: " + JSON.stringify(res));
        this.username = res.display_name;
        this.imageURL = res.images[0].url;
        console.log("IMAGE: " + this.imageURL);
      }).catch((err) => console.log(err));
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  logOut() {
    Spotify.logout().finally(() => {
      this.props.navigation.navigate('logIn');
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={global.code}
          placeholderTextColor='white'
          autoCapitalize='none'
          textAlign={'center'}
          onChangeText={this.handleCode}
          maxLength={6}
          editable={false}
        />
        <Text style={{ fontSize: 26, marginTop: 50, color: 'white' }}>Signed in as:</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 26, marginTop: 5, color: 'white' }}>{this.username}</Text>
        <TouchableHighlight onPress={this.logOut}>
          <Image
            style={{ width: 240, height: 60, marginTop: 30, resizeMode: "contain" }}
            source={require("../assets/logout.png")}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212'
  },
  input: {
    width: '50%',
    height: '5%',
    opacity: 1,
    borderColor: '#2FD556',
    borderWidth: 1,
    marginTop: 70,
    color: 'white'
  }
});
