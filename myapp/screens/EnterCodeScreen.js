import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TextInput
} from 'react-native';
import GlobalFont from 'react-native-global-font';
import Icon from 'react-native-vector-icons/Ionicons';
import SocketIO from 'socket.io-client';
import Config from '../config';
import { Input } from 'react-native-elements';

export default class EnterCodeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      name: ''
    };

    this.continuePressed = this.continuePressed.bind(this);
    this.handleCode = this.handleCode.bind(this);
    this.handleName = this.handleName.bind(this);

    this.socket = SocketIO(Config.SERVER_URL);

    this.socket.on('valid-join', data => {
      this.socket.emit('client-join', {
        name: this.state.name,
        code: this.state.code
      });

      global.code = this.state.code;
      global.client = true;
      this.props.navigation.navigate('logIn');
    });

    this.socket.on('invalid-join', data => {
      alert('Invalid code! Please try again.');
    });
  }

  getCode() {
    return '1F9037';
  }

  continuePressed() {
    this.socket.emit('check-valid-join', {
      code: this.state.code
    });
  }

  handleCode(text) {
    this.setState({ code: text });
  }

  handleName(text) {
    this.setState({ name: text });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 250, color: 'white' }}>
          Enter your Party Code:
        </Text>
        <TextInput
          style={styles.input}
          placeholder='Party Code'
          placeholderTextColor='white'
          autoCapitalize='none'
          textAlign={'center'}
          onChangeText={this.handleCode}
          maxLength={6}
        />
        <TouchableHighlight onPress={this.continuePressed}>
          <Image
            style={{ width: 240, height: 60, marginTop: 30, resizeMode: "contain" }}
            source={require("../assets/enter-party.png")}
          />

        </TouchableHighlight>
        <Text style={{ color: 'white', fontStyle: 'italic', marginTop: 10 }}>Don't keep your host waiting!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212',
    width: '100%'
  },
  input: {
    width: '50%',
    height: '5%',
    opacity: 1,
    borderColor: '#2FD556',
    borderWidth: 1,
    marginTop: 30,
    color: 'white'
  }
});
