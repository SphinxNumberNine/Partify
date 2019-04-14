import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from "react-native";
import GlobalFont from "react-native-global-font";
import Icon from "react-native-vector-icons/Ionicons";

export default class HostClientScreen extends Component {
  constructor(props) {
    super(props);

    this.hostPartyPressed = this.hostPartyPressed.bind(this);
    this.clientPartyPressed = this.clientPartyPressed.bind(this);
  }

  hostPartyPressed() {
    this.props.navigation.navigate("viewCode");
  }

  clientPartyPressed() {
    this.props.navigation.navigate("enterCode");
  }

  componentDidMount() {
    let fontName = "HelveticaNeue-Thin";
    GlobalFont.applyGlobal(fontName);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 240, height: 240, marginTop: 80 }}
          source={require("../assets/logo-final-black.png")}
        />
        <Image
          style={{ width: 235, height: 76, marginTop: 10 }}
          source={require("../assets/partify-word-logo.png")}
        />
        <TouchableHighlight
          style={{ width: 240, height: 60, marginTop: 100 }}
          onPress={this.hostPartyPressed}
        >
          <Image
            style={{ width: 240, height: 60, resizeMode: "contain" }}
            source={require("../assets/throw-party.png")}
          />
        </TouchableHighlight>
        <TouchableHighlight
          style={{ width: 240, height: 60, marginTop: 20 }}
          onPress={this.clientPartyPressed}
        >
          <Image
            style={{ width: 240, height: 60, resizeMode: "contain" }}
            source={require("../assets/crash-party.png")}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#121212",
    width: "100%"
  }
});