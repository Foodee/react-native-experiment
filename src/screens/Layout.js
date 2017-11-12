// libraries
import React, { Component } from "react";
import LoggedIn from "./logged-in/LoggedIn";
import LoggedOut from "./logged-out/LoggedOut";
import {StackNavigator} from "react-navigation";

export const createRootNavigator = (loggedIn = false) => {
  return StackNavigator(
    {
      LoggedIn: {
        screen: LoggedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      LoggedOut: {
        screen: LoggedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: loggedIn ? "LoggedIn" : "LoggedOut"
    }
  );
};

