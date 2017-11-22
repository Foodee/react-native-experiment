// libraries
import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RefreshableToolbar from "../../components/RefreshableToolbar";
import {masterFoxClient} from "../../util/Auth";
import {Card} from "react-native-elements";
import moment from "moment";

const {height, width} = Dimensions.get('window');

let styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  background: {
    color: 'red',
  },
});

export default class extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `Order ${navigation.state.params.order.identifier}`,
  });

  render() {

    return (
      <Text h1>Hello</Text>
    )

  }
}
