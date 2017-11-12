// libraries
import React, { Component } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RefreshableToolbar from "./RefreshableToolbar";
import Icon from 'react-native-vector-icons/FontAwesome';

class Gear extends Component {
  props: {
    rotationalTransform: Animated.Value,
    color: string
  };

  state = {
    scale: new Animated.Value(1)
  };

  _handleTap = () => {
    let friction = 2;
    let tension = 50;

    Animated.sequence([
      Animated.spring(this.state.scale, {
        toValue: 3,
        friction: friction,
        tension: tension,
        useNativeDriver: true
      }),
      Animated.spring(this.state.scale, {
        toValue: 1,
        friction: friction,
        tension: tension,
        useNativeDriver: true
      })
    ]).start()
  };

  render() {

    let transform = [
      {scale: this.state.scale}
    ];

    if (this.props.rotationalTransform) {
      transform.push(
        {rotate: this.props.rotationalTransform}
      )
    }

    return (
      <Animated.View
        onTouchEnd={this._handleTap}
        style={{
          transform: transform,
          marginTop: -7,
          marginBottom: -7,
          marginLeft: -2,
          marginRight: -2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}>
        <Icon name="gear" size={80} color={this.props.color || 'blue'}/>
      </Animated.View>
    )
  }
}

export default Gear;

