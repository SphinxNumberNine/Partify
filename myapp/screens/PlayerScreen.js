import React, { PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from 'react-native';
import SocketIO from 'socket.io-client';
import Config from '../config';
import Spotify from 'rn-spotify-sdk';
import GlobalFont from 'react-native-global-font';
import Icon from 'react-native-vector-icons/Ionicons';

import Track from '../Track';
import Queue from './Queue';

let queue = [];

let currentTrackAlbumCoverUrl;
let currentTrackTitle;
let currentTrackArtist;
let currentTrackAlbum;
let track;

Spotify.addListener('audioDeliveryDone', event => {
  if (track && queue.length != 0) {
    track = queue.shift();
    Spotify.playURI(track.getPlaybackURI(), 0, 0);
  }
});

Spotify.addListener('trackChange', event => {
  Spotify.getPlaybackMetadataAsync().then(res => {
    currentTrackAlbumCoverUrl = track.getImageURL();
    currentTrackTitle = track.getName();
    currentTrackArtist = track.getArtist();
    currentTrackAlbum = track.getAlbum();
  });

  let q = [];
  queue.map(item => {
    q.push(item.getPlaybackURI());
  });

  global.socket.emit('next-button-pressed', {
    queue: q,
    code: global.code,
    track: track.getPlaybackURI()
  });
});

export default class PlayerScreen extends PureComponent {
  static navigationOptions = {
    title: 'Player'
  };

  constructor(props) {
    super(props);

    this.state = {
      spotifyUserName: null,
      playPauseText: 'md-play',
      currentTrackName: null,
      inQueueScreen: false
    };

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

    global.socket = this.socket;

    this.playButtonWasPressed = this.playButtonWasPressed.bind(this);

    this.nextButtonWasPressed = this.nextButtonWasPressed.bind(this);

    this.queueButtonWasPressed = this.queueButtonWasPressed.bind(this);
  }

  componentDidMount() {
    // send api request to get user info
    let fontName = 'HelveticaNeue-Thin';
    GlobalFont.applyGlobal(fontName);

    /*let track1 = new Track();
    track1.initialize('spotify:track:3DK6m7It6Pw857FcQftMds');
    let track2 = new Track();
    track2.initialize('spotify:track:2dXME00xUY1CRcMZsM3Y4q');
    let track3 = new Track();
    track3.initialize('spotify:track:7KA4W4McWYRpgf0fWsJZWB');
    let track4 = new Track();
    track4.initialize('spotify:track:2CHmgtK8OCL28WtIK96u4N');
    let track5 = new Track();
    track5.initialize('spotify:track:1eRBW1HcyM1zPlxO26cScZ');
    let track6 = new Track();
    track6.initialize('spotify:track:0c81djsFYx69xCaNx4NHfH');

    queue.push(track6);
    queue.push(track2);
    queue.push(track3);
    queue.push(track4);
    queue.push(track5);
    queue.push(track6);
    */
    Spotify.getMe()
      .then(result => {
        // update state with user info
        this.setState({ spotifyUserName: result.display_name });
        // play song
      })
      .catch(error => {
        // error
        Alert.alert(
          'Error',
          'Internal Error. Please Log Out and Log Back in to Spotify.'
        );
      });

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
          <TouchableHighlight onPress={this.playButtonWasPressed}>
            <Icon name={this.state.playPauseText} color='white' size={30} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.nextButtonWasPressed}
            style={{
              marginRight: '25%'
            }}
            disabled={this.getQueueStatus()}
          >
            <Icon
              name='md-skip-forward'
              color={this.getQueueStatus() ? 'grey' : 'white'}
              size={30}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  getQueueStatus() {
    if (queue.length == 0) {
      return true;
    }

    return false;
  }

  playButtonWasPressed() {
    if (!this.state.currentTrackName) {
      if (queue.length > 0) {
        track = queue.shift();
        if (Spotify.isInitialized()) {
          Spotify.playURI(track.getPlaybackURI(), 0, 0);
        }

        this.setState({
          playPauseText: 'md-pause',
          currentTrackName: track.getName()
        });
      }
    } else {
      Spotify.getPlaybackStateAsync().then(playbackState => {
        if (playbackState.playing) {
          Spotify.setPlaying(false);
          this.setState({ playPauseText: 'md-play' });
        } else {
          Spotify.setPlaying(true);
          this.setState({ playPauseText: 'md-pause' });
        }
      });
    }
  }

  nextButtonWasPressed() {
    track = queue.shift();
    Spotify.playURI(track.getPlaybackURI(), 0, 0).then(() => {
      this.setState({
        playPauseText: 'md-pause',
        currentTrackName: track.getName()
      });
    });
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
          source={{ uri: currentTrackAlbumCoverUrl }}
        />
        <Text style={styles.trackTitle}>{currentTrackTitle}</Text>
        <Text style={styles.trackArtist}>{currentTrackArtist}</Text>
        <Text style={styles.trackAlbum}>{currentTrackAlbum}</Text>
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
