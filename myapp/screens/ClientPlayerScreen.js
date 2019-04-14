import React, { PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from 'react-native';
import GlobalFont from 'react-native-global-font';
import Icon from 'react-native-vector-icons/Ionicons';
import SocketIO from 'socket.io-client';
import Spotify from 'rn-spotify-sdk';

import Track from '../Track';
import Queue from './Queue';
import Config from '../config';
import { noop } from '@babel/types';

let queue = [];
let track;

export default class ClientPlayerScreen extends PureComponent {
  static navigationOptions = {
    title: 'Player'
  };

  constructor(props) {
    super(props);

    this.state = {
      inQueueScreen: false
    };

    this.queueButtonWasPressed = this.queueButtonWasPressed.bind(this);

    this.socket = SocketIO(Config.SERVER_URL);

    this.socket.on('queue-changed', data => {
      if (data.code === global.code) {
        queue = [];
        data.queue.map(item => {
          let newTrack = new Track();
          newTrack.initialize(item);
          queue.push(newTrack);
        });
      }
    });

    this.socket.on('retrieve-from-next-pressed', data => {
      if (data.code === global.code) {
        queue = [];
        data.queue.map(item => {
          let newTrack = new Track();
          newTrack.initialize(item);
          queue.push(newTrack);
        });
        let firstTrack = new Track();
        firstTrack.initialize(data.track);
        track = firstTrack;
      }
    });
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.inQueueScreen ? (
          <View style={styles.Queue}>
            <Queue queue={queue} />
          </View>
        ) : (
            this.renderPlaybackSpace()
          )}
        <View style={styles.playBar}>
          <TouchableHighlight
            onPress={this.queueButtonWasPressed}
            style={{ marginLeft: '25%' }}
          >
            <Icon name='md-reorder' color='white' size={30} />
          </TouchableHighlight>
          <TouchableHighlight disabled={true}>
            <Icon name={'md-play'} color='grey' size={30} />
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              marginRight: '25%'
            }}
            disabled={true}
          >
            <Icon name='md-skip-forward' color={'grey'} size={30} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  queueButtonWasPressed() {
    var flippedQueueState = !this.state.inQueueScreen;
    this.setState({ inQueueScreen: flippedQueueState });
  }

  renderPlaybackSpace() {
    return (
      <View style={styles.playbackSpace}>
        <Image
          resizeMode={'contain'}
          style={styles.albumCover}
          source={{ uri: track ? track.getImageURL() : undefined }}
        />
        <Text style={styles.trackTitle}>{track ? track.getName() : ''}</Text>
        <Text style={styles.trackArtist}>{track ? track.getArtist() : ''}</Text>
        <Text style={styles.trackAlbum}>{track ? track.getAlbum() : ''}</Text>
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
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  albumCover: {
    width: 320,
    height: 320,
    marginTop: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 25,
    resizeMode: 'contain'
  },
  playbackSpace: {
    width: '100%',
    height: '90%',
    alignItems: 'center'
  },
  playBar: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Queue: {
    width: '100%',
    height: '90%',
    alignItems: 'center'
  },
  trackTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  trackArtist: {
    color: 'white',
    fontSize: 22,
    marginBottom: 5,
    textAlign: 'center'
  },
  trackAlbum: {
    color: 'white',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center'
  }
});
