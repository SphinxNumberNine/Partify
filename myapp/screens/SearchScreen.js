import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  FlatList
} from 'react-native';
import SocketIO from 'socket.io-client';
import Config from '../config';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Searchbar } from 'react-native-paper';
import Spotify from 'rn-spotify-sdk';

import Track from '../Track';

let counter = 0;

export default class SearchScreen extends Component {
  constructor() {
    super();
    state = {
      searchQuery: '',
      displayResults: false,
      results: null,
      tracks: []
    };

    this.socket = SocketIO(Config.SERVER_URL);
    this.code = global.code;

    this.trackPressed = this.trackPressed.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  trackPressed(playbackUrl) {
    this.socket.emit('new-song', {
      code: global.code,
      playbackURI: playbackUrl
    });

    this.refs.toast.show('Song Added to Queue', 1000);
  }

  render() {
    let searchQuery = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.topText} />
        <Searchbar
          style={styles.searchbar}
          theme={{ dark: true, colors: { background: 'gray' } }}
          placeholder='Search tracks, artists, or albums'
          onChangeText={text => {
            this.setState({ searchQuery: text });
          }}
          value={this.searchQuery}
          onIconPress={() => {
            this.processSearch();
          }}
        />
        <FlatList
          data={this.getData()}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => this.trackPressed(item.playbackUrl)}
            >
              <View style={styles.trackContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.queueImage}
                    resizeMode={'contain'}
                    source={{ uri: item.image }}
                  />
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.songText}>{item.name}</Text>
                  <Text style={styles.artistText}>{item.artist}</Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Toast
          ref='toast'
          style={{
            backgroundColor: 'rgba(52, 52, 52, 0.0)',
            marginBottom: 20,
            borderColor: '#2FD556'
          }}
          textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
        />
      </View>
    );
  }

  getData() {
    let items = [];
    if (this.state && this.state.tracks && this.state.tracks.length > 0) {
      this.state.tracks.map(item => {
        let exists = false;
        for (let i = 0; i < items.length; i++) {
          if (items[i].name == item.getName()) {
            exists = true;
          }
        }
        if (exists) {
          items.push({
            key: item.getName(),
            name: item.getName(),
            artist: item.getArtist(),
            image: item.getImageURL(),
            playbackUrl: item.getPlaybackURI()
          });
        } else {
          items.push({
            key: item.getName(),
            name: item.getName(),
            artist: item.getArtist(),
            image: item.getImageURL(),
            playbackUrl: item.getPlaybackURI()
          });
        }
      });
      return items;
    }
  }

  getSearchStatus() {
    if (!this.state) return 'Search for a track:';
    else return this.state.displayResults ? 'Results:' : 'Search for a track:';
  }

  parseSongs(uris) {
    let newTracks = [];
    for (let i = 0; i < uris.length; i++) {
      let newTrack = new Track();
      newTrack.initialize(uris[i]);
      newTracks.push(newTrack);
    }
    this.setState({ tracks: newTracks });
  }

  processSearch() {
    if (this.state) this.setState({ displayResults: true });
    if (this.state && this.state.searchQuery && this.state.searchQuery != '') {
      let searchQuery = this.state.searchQuery;
      Spotify.search(searchQuery, ['track'], { limit: 10 })
        .then(res => {
          this.setState({ results: res });
        })
        .finally(() => {
          let uris = [];
          for (let i = 0; i < this.state.results.tracks.items.length; i++) {
            uris.push(this.state.results.tracks.items[i].uri);
          }
          this.parseSongs(uris);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#121212',
    width: '100%'
  },
  searchbar: {
    padding: 10,
    marginTop: 5
  },
  topText: {
    padding: 10,
    fontSize: 24,
    marginTop: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'white',
    width: '100%'
  },
  queueImage: {
    width: 80,
    height: 80,
    marginLeft: 20,
    resizeMode: 'contain',
    marginBottom: 5
  },
  trackContainer: {
    flex: 1,
    width: '100%',
    height: '30%',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  infoContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'flex-start'
  },
  imageContainer: {
    flex: 1,
    width: '20%'
  },
  songText: {
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5
  },
  artistText: {
    color: 'white',
    marginRight: 60
  }
});
