import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Image
} from 'react-native';
import SocketIO from 'socket.io-client';
import Config from '../config';
import GlobalFont from 'react-native-global-font';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ViewCodeScreen extends Component {
  constructor(props) {
    super(props);

    this.continuePressed = this.continuePressed.bind(this);

    this.socket = SocketIO(Config.SERVER_URL);

    this.socket.on('created-party', code => {
      this.code = code;
      global.code = this.code;
    });

    this.socket.emit('host-join', {}); // object intended to be empty
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 200);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCode() {
    return this.code;
  }

  continuePressed() {
    this.props.navigation.navigate('logIn', { code: this.code });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 250, color: 'white' }}>
          Your Party Code:
        </Text>
        <TextInput
          style={styles.input}
          placeholder={this.code}
          placeholderTextColor='white'
          autoCapitalize='none'
          textAlign={'center'}
          onChangeText={this.handleCode}
          maxLength={6}
          editable={false}
        />
        <TouchableHighlight onPress={this.continuePressed}>
          <Image
            style={{ width: 240, height: 60, marginTop: 30, resizeMode: "contain" }}
            source={require("../assets/enter-party.png")}
          />
        </TouchableHighlight>
        <Text style={{ color: 'white', fontStyle: 'italic', marginTop: 10 }}>Don't keep your guests waiting!</Text>
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
