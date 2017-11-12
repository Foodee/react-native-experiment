import React, { Component } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ActivityIndicator,
  Dimensions,
  Animated,
  Text,
} from 'react-native';


class RefreshableToolbar extends Component {

  props: {
    // Heights
    // The height of the toolbar when its in toolbar mode
    toolbarHeight: number,
    // the height of the toolbar when its in cover mode
    coverHeight: number,
    // the height to pull in order to refresh
    pullToRefreshHeight: number,

    // Image
    coverUrl: string,

    // titles
    title: string,
    subtitle: string,


    // Used to drive animations
    scrollPosition: Animated.Value,

    // Show dat spinner
    isRefreshing: boolean
  };

  constructor(props) {
    super(props);

    this.state = {
      // initialize to cover height
      height: props.coverHeight,
      isRefreshing: false
    };
  }

  componentDidMount() {
    this.props.scrollPosition.addListener(this._handleScroll)
  }

  componentWillUnmount() {
    this.props.scrollPosition.removeListener(this._handleScroll)
  }

  _handleScroll = ({value}) => {
    let y = value;
    const COVER_HEIGHT = this.props.coverHeight;
    const TOOLBAR_HEIGHT = this.props.toolbarHeight;

    if (y < 0) {
      this.setState({height: COVER_HEIGHT + Math.abs(y)})
    }
    else if (y >= 0 && y < COVER_HEIGHT - TOOLBAR_HEIGHT) {
      this.setState({height: COVER_HEIGHT - y})
    }
    else {
      this.setState({height: TOOLBAR_HEIGHT})
    }
  };

  render() {
    let PULL_TO_REFRESH_HEIGHT = this.props.pullToRefreshHeight;
    let WINDOW_HEIGHT = Dimensions.get('window').height;
    let WINDOW_WIDTH = Dimensions.get('window').width;

    // Toolbar Title Interpolations to slide up the title once the main title
    // has scrolled up
    const interpolateTranslateTop = this
      .props
      .scrollPosition
      .interpolate({
        inputRange: [0, this.props.coverHeight],
        outputRange: [200, 0],
        extrapolate: 'clamp'
      });

    const interpolateTitleOpacity = this
      .props
      .scrollPosition
      .interpolate({
        inputRange: [this.props.toolbarHeight, this.props.coverHeight],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      });

    // Toolbar translation to move the cover image up and down with the scroll position
    const interpolateToolbarTranslateY = this
      .props
      .scrollPosition
      .interpolate({
        inputRange: [-WINDOW_HEIGHT, 0, this.props.coverHeight / 2],
        outputRange: [WINDOW_HEIGHT, this.props.coverHeight, this.props.toolbarHeight],
        extrapolate: 'clamp'
      });


    // Cover Image interpolations to scale and fade the cover image
    // with the scroll bar
    const interpolateCoverImageOpacity = this
      .props
      .scrollPosition
      .interpolate({
        inputRange: [this.props.toolbarHeight, this.props.coverHeight],
        outputRange: [1, 0.3],
        extrapolate: 'clamp'
      });

    const interpolateCoverImageScale = this
      .props
      .scrollPosition
      .interpolate({
        inputRange: [-WINDOW_HEIGHT, 0],
        outputRange: [5, 1],
        extrapolate: 'clamp'
      });

    // Refresh Control
    const interpolateRefreshControlOpacity = this
      .props
      .scrollPosition
      .interpolate({
        inputRange: [-PULL_TO_REFRESH_HEIGHT, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      });

    const interpolateRefreshControlRotation = this
      .props
      .scrollPosition
      .interpolate({
        inputRange: [-PULL_TO_REFRESH_HEIGHT - 10, -PULL_TO_REFRESH_HEIGHT],
        outputRange: ['180deg', '0deg'],
        extrapolate: 'clamp'
      });

    return (
      <Animated.View
        style={{
          overflow: 'hidden',
          position: 'absolute',
          top: -WINDOW_HEIGHT,
          left: 0,
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT,
          transform: [{translateY: interpolateToolbarTranslateY}],
          zIndex: (this.state.height <= this.props.toolbarHeight) ? 100 : 0,
          backgroundColor: 'black'
        }}
      >

        <Animated.Image
          source={{uri: this.props.coverUrl}}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: this.props.coverHeight + 60, // add statusbar padding
            opacity: interpolateCoverImageOpacity,
            transform: [{scale: interpolateCoverImageScale}],
          }}
        />

        <Animated.View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 70,
            left: (WINDOW_WIDTH / 2) - 15,
            opacity: interpolateRefreshControlOpacity,
            transform: [
              {rotate: interpolateRefreshControlRotation}
            ]
          }}
        >
          <Icon name="arrow-down" color="white" size={30}/>

        </Animated.View>


        { this.props.isRefreshing && ( <ActivityIndicator
          color="white"
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 70,
            left: (WINDOW_WIDTH / 2) - 15,
          }}/>) }

        <Animated.View style={{
          position: 'absolute',
          bottom: 5,
          backgroundColor: 'transparent',
          left: 0,
          right: 0,
          transform: [{translateY: interpolateTranslateTop}],
          opacity: interpolateTitleOpacity
        }}>
          <Text style={{textAlign: 'center', color: 'white'}}>{this.props.title}</Text>
          <Text style={{textAlign: 'center', color: 'white'}}>{this.props.subtitle}</Text>
        </Animated.View>

        {this.props.children}
      </Animated.View>
    )
  }

}

export default RefreshableToolbar;

