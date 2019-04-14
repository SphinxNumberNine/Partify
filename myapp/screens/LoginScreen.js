import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from 'react-native';
import Spotify from 'rn-spotify-sdk';

export default class LoginScreen extends PureComponent {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.code = this.props.navigation.getParam('code', 'default');

    this.state = {
      spotifyInitialized: false
    };

    this.spotifyLoginButtonWasPressed = this.spotifyLoginButtonWasPressed.bind(
      this
    );
  }

  goToPlayer() {
    global.client
      ? this.props.navigation.navigate('clientPlayer', { code: this.code })
      : this.props.navigation.navigate('player');
  }

  async initializeIfNeeded() {
    if (!(await Spotify.isInitializedAsync())) {
      // spotify initialization
      const options = {
        clientID: 'f5f336f6b4bf40ec902968f6f6c1aa8f',
        sessionUserDefaultsKey: 'SpotifySession',
        redirectURL: 'myapp://auth',
        scopes: [
          'user-read-private',
          'playlist-read',
          'playlist-read-private',
          'streaming'
        ]
      };

      const loggedIn = await Spotify.initialize(options);

      this.setState({
        spotifyInitialized: true
      });

      if (loggedIn) {
        this.goToPlayer();
      }
    } else {
      this.setState({
        spotifyInitialized: true
      });

      if (await Spotify.isLoggedInAsync()) {
        this.goToPlayer();
      }
    }
  }

  componentDidMount() {
    this.initializeIfNeeded().catch(error => {
      Alert.alert('Error', error.status);
      this.props.navigation.navigate('logIn');
    });
  }

  spotifyLoginButtonWasPressed() {
    // log into Spotify
    Spotify.login()
      .then(loggedIn => {
        if (loggedIn) {
          // logged in
          this.goToPlayer();
        } else {
          // cancelled
        }
      })
      .catch(error => {
        // error
        Alert.alert('Error', error.message);
      });
  }

  render() {
    if (!this.state.spotifyInitialized) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating={true} style={styles.loadIndicator} />
          <Text style={styles.loadMessage}>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.greeting}>Log into Spotify</Text>
          <TouchableHighlight
            onPress={this.spotifyLoginButtonWasPressed}
            style={styles.logInButtonFancy}
          >
            <Image
              resizeMode={'contain'}
              style={styles.image}
              source={require('../assets/login-button-mobile.png')}
            /* source={{
              uri:
                'https://uptune.herokuapp.com/assets/login-button-mobile-82c2ef9bca0473f7f2ce860eca70cfb7318b25edf58d27994a0a5f5ae1a5d6f4.png'
            }} */
            />
          </TouchableHighlight>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212'
  },

  loadIndicator: {
    //
  },
  loadMessage: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  logInButtonFancy: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 45,
    borderRadius: 64
  },
  spotifyLoginButton: {
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'green',
    overflow: 'hidden',
    width: 200,
    height: 40,
    margin: 20
  },
  spotifyLoginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white'
  },
  image: {
    width: 250,
    height: 50
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
