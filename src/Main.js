// libraries
import React, { Component } from "react";
import {
  Animated,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RefreshableToolbar from "./RefreshableToolbar";
import Gear from "./Gear";
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

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


const FOODEE_RED = '#9D2524';
const TOOLBAR_HEIGHT = 60;
const COVER_HEIGHT = 150;
const PULL_TO_REFRESH_HEIGHT = 100;

let restaurantId = 330;

class Main extends Component {

  state = {
    isRefreshing: false,
    shouldRefresh: false,
    restaurant: {},
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

  yPosition = new Animated.Value(0);
  onScroll = Animated
    .event([{
        nativeEvent: {
          contentOffset: {
            y: this.yPosition
          }
        }
      }],
      {useNativeDriver: true}
    );

  componentDidMount() {
    this._fetchData();
    this.yPosition.addListener(this._handleScroll)
  }

  componentWillUnmount() {
    this.yPosition.removeListener(this._handleScroll)
  }

  _handleScroll = ({value}) => {
    if (value < -PULL_TO_REFRESH_HEIGHT) {
      this.setState({shouldRefresh: true});
    }
  };

  _handleRelease = () => {
    if (this.state.shouldRefresh) {
      this.setState({shouldRefresh: false});
      this._fetchData();
    }
  };

  _fetchData = () => {
    restaurantId += 1;

    this.setState({isRefreshing: true});

    fetch(`https://concierge.food.ee/api/v3/restaurants/${restaurantId}`, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      }
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({restaurant: json.data.attributes})
      })
      .catch(_ => console.error(_))
      .then(_ => this.setState({isRefreshing: false}))
  };

  render() {

    // Avatar scale interoplations
    const interpolateAvatarScale = this
      .yPosition
      .interpolate({
        inputRange: [0, TOOLBAR_HEIGHT],
        outputRange: [1, 0.6],
        extrapolate: 'clamp'
      });

    // Rotations for Gears
    const interpolatedRotateClockwise = this
      .yPosition
      .interpolate({
        inputRange: [0, 200],
        outputRange: ['20deg', '380deg'],
      });

    const interpolatedRotateAntiClockwise = this
      .yPosition
      .interpolate({
        inputRange: [0, 200],
        outputRange: ['0deg', '-360deg'],
      });

    return (
      <View
        style={{position: 'absolute', backgroundColor: FOODEE_RED, top: 0, right: 0, bottom: 0, left: 0}}
      >
        <StatusBar
          barStyle='light-content'
        />
        <RefreshableToolbar
          toolbarHeight={TOOLBAR_HEIGHT}
          coverHeight={COVER_HEIGHT}
          pullToRefreshHeight={PULL_TO_REFRESH_HEIGHT}
          scrollPosition={this.yPosition}
          isRefreshing={this.state.isRefreshing}

          coverUrl={this.state.restaurant['cover-image-url']}
          title={this.state.restaurant.name}
          subtitle={this.state.restaurant.subtitle}
        />

        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={this.onScroll}
          style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, paddingTop: COVER_HEIGHT - 25, zIndex: 1}}
          onResponderRelease={this._handleRelease}
        >

          <View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Animated.Image
                source={{uri: this.state.restaurant['thumbnail-image-url']}}
                style={{
                  width: 90,
                  height: 90,
                  borderColor: FOODEE_RED,
                  borderWidth: 4,
                  marginLeft: 10,
                  borderRadius: 4,
                  transform: [{scale: interpolateAvatarScale}]
                }}
              />

              <View style={{flex: 1, marginTop: 30, marginLeft: 10, backgroundColor: 'transparent'}}>
                <Text style={{fontSize: 20, color: 'white'}}>{this.state.restaurant.name}</Text>
                <Text style={{color: 'white'}}>{this.state.restaurant.subtitle}</Text>
              </View>
            </View>

            <View style={{display: 'flex', alignItems: 'center', minHeight: 2000}}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Gear rotationalTransform={interpolatedRotateAntiClockwise} color="blue"/>
                <Gear rotationalTransform={interpolatedRotateClockwise} color="green"/>
              </View>
            </View>
          </View>

        </Animated.ScrollView>

      </View>
    )
  }
}

class OrderScreen extends Component {

}

const SimpleApp = StackNavigator({
  Home: { screen: Main},
  Chat: { screen: OrderScreen},
});

const HomeScreen = ({ navigation }) => (
  <Main />
);

const ProfileScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

const RootDrawer = DrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      drawerLabel: 'Profile',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
    },
  },
});

export default RootDrawer;

