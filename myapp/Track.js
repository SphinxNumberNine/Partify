import Spotify from 'rn-spotify-sdk';

export default class Track {
  constructor() { }

  async initialize(uri) {
    if (Spotify.isInitialized()) {
      let metadata = await Spotify.getTrack(uri.substring(14), {});
      this.metadata = metadata;
      this.name = metadata.name;
      this.artist = metadata.artists[0].name;
      this.album = metadata.album.name;
      this.imageURL = metadata.album.images[0].url;
      this.playbackURI = metadata.uri;
    }
  }

  getName() {
    return this.name;
  }

  getArtist() {
    return this.artist;
  }

  getAlbum() {
    return this.album;
  }

  getImageURL() {
    return this.imageURL;
  }

  getPlaybackURI() {
    return this.playbackURI;
  }
}
