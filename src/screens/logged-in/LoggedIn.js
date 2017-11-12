// libraries
import React, { Component } from "react";
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orders from './Orders';
import Logout from "./Logout";
import Order from "./Order";

export default DrawerNavigator({
  Home: {
    screen: StackNavigator({
        Home: {screen: Orders},
        Order: {screen: Order},
      },
      {headerMode: 'screen'}
    ),
    navigationOptions: {
      drawerLabel: 'Orders',
      drawerIcon: ({tintColor, focused}) => (
        <Ionicons
          name={focused ? 'ios-cart' : 'ios-cart-outline'}
          size={20}
          style={{color: tintColor}}
        />
      ),
    },
  },
  Logout: {
    screen: Logout,
    navigationOptions: {
      drawerLabel: 'Logout',
      drawerIcon: ({tintColor, focused}) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={20}
          style={{color: tintColor}}
        />
      ),
    },
  },
});
