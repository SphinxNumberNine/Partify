import React, { Component } from 'react';
import { Text } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import PlayerScreen from './screens/PlayerScreen';
import PartyScreen from './screens/PartyScreen';
import SearchScreen from './screens/SearchScreen';

const tintColor = 'green';

export default createMaterialBottomTabNavigator(
  {
    Player: {
      screen: PlayerScreen,
      navigationOptions: {
        tabBarLabel: 'Player',
        tabBarIcon: ({ tintColor }) => (
          <Icon name='md-musical-notes' color={tintColor} size={24} />
        )
      }
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ tintColor }) => (
          <Icon name='md-search' color={tintColor} size={24} />
        )
      }
    },
    Party: {
      screen: PartyScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon name='md-person' color={tintColor} size={24} />
        )
      }
    }
  },
  {
    initialRouteName: 'Player',
    activeTintColor: 'white',
    //activeColor: 'white',
    inactiveColor: 'green',
    barStyle: { backgroundColor: '#333333', paddingBottom: 0 },
    shifting: true,
    labelStyle: {
      color: 'white',
      fontWeight: 'normal'
    }
  }
);
