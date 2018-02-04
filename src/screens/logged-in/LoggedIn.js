// libraries
import React, {Component} from "react";
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orders from './Orders';
import Logout from "./Logout";
import Order from "./Order";
import Colors from "../../constants/colors";


const icon = (focusedIcon, blurredIcon) =>
  ({tintColor, focused}) => (
    <Ionicons
      name={focused ? focusedIcon : blurredIcon}
      size={20}
      style={{color: tintColor}}
    />
  );

export default DrawerNavigator(
  {
    Home: {
      screen: StackNavigator({
          Home: {screen: Orders},
          Order: {screen: Order},
        },
        {headerMode: 'screen'},
        {
          contentOptions: {
            activeTintColor: Colors.FOODEE_RED,
          },
        }
      ),
      navigationOptions: {
        drawerLabel: 'Orders',
        drawerIcon: icon('ios-cart', 'ios-cart-outline'),
      },
    },
    Logout: {
      screen: Logout,
      navigationOptions: {
        drawerLabel: 'Logout',
        drawerIcon: icon('ios-person', 'ios-person-outline')
      },
    },
  }, {
    contentOptions: {
      activeTintColor: Colors.FOODEE_RED,
    },
  }
);
