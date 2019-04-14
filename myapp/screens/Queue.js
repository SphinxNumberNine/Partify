import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import Spotify from 'rn-spotify-sdk';
import GlobalFont from 'react-native-global-font';
import Icon from 'react-native-vector-icons/Ionicons';
import SocketIO from 'socket.io-client';
import Config from '../config';

import Track from '../Track';
import Toast from 'react-native-easy-toast';

let counter = 0;

export default class Queue extends Component {
  constructor(props) {
    super(props);

    this.socket = SocketIO(Config.SERVER_URL);

    this.socket.on('queue-changed', data => {
      if (global.code === data.code) {
        this.props.queue = [];
        data.queue.map(item => {
          let track = new Track();
          track.initialize(item);
          this.props.queue.push(track);
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.upNext}>{this.getQueueStatus()}</Text>
          <FlatList
            data={this.getData()}
            renderItem={({ item }) => (
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
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }

  getData() {
    let items = [];
    this.props.queue.map(item => {
      let exists = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].key == item.getName()) {
          exists = true;
        }
      }

      /*if (exists) {
        items.push({
          key: item.getName() + counter++,
          name: item.getName(),
          artist: item.getArtist(),
          image: item.getImageURL()
        });
      } else {
        items.push({
          key: item.getName(),
          name: item.getName(),
          artist: item.getArtist(),
          image: item.getImageURL()
        });
      }*/
      items.push({
        name: item.getName(),
        artist: item.getArtist(),
        image: item.getImageURL()
      });
    });

    return items;
  }

  getQueueStatus() {
    if (!this.props.queue) {
      return 'Your Queue is Empty!';
    } else {
      return 'Up Next: ';
    }
  }

  getQueueStatus() {
    if (this.props.queue.length == 0) {
      return 'Your Queue is Empty!';
    } else {
      return 'Up Next: ';
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'white',
    width: '100%'
  },
  upNext: {
    padding: 10,
    fontSize: 24,
    marginLeft: 10,
    //fontWeight: 'bold',
    color: 'white',
    width: '100%'
  },
  queueImage: {
    width: 100,
    height: 100,
    marginLeft: 20,
    resizeMode: 'contain',
    marginBottom: 5
  },
  trackContainer: {
    flex: 1,
    width: '100%',
    height: '30%',
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
    marginTop: 5,
    fontSize: 17
  },
  artistText: {
    color: 'white',
    marginRight: 60,
    fontSize: 14
  }
});
