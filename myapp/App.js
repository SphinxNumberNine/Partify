import React, { Component } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import LoginScreen from './screens/LoginScreen';
import PlayerScreen from './screens/PlayerScreen';
import Navigator from './Navigator';
import HostClientScreen from './screens/HostClientScreen';
import ViewCodeScreen from './screens/ViewCodeScreen';
import EnterCodeScreen from './screens/EnterCodeScreen';
import ClientNavigator from './ClientNavigator';
import { YellowBox } from 'react-native';

const App = createSwitchNavigator({
  initial: { screen: HostClientScreen },
  viewCode: { screen: ViewCodeScreen },
  enterCode: { screen: EnterCodeScreen },
  logIn: { screen: LoginScreen },
  player: { screen: Navigator },
  clientPlayer: { screen: ClientNavigator }
});

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const AppContainer = createAppContainer(App);

export default AppContainer;
