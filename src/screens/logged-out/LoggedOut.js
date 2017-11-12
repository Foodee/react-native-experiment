import React from "react";
import { StackNavigator } from "react-navigation";

import Login from './Login';
import SignUp from './SignUp';

export default StackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: 'Sign Up'
      }
    }
  },
  {
    headerMode: 'none',
    mode: 'modal',
  }
);
