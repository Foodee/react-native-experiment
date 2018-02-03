// libraries
import React, { Component } from "react";
import {
  Animated,
  Button,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RefreshableToolbar from "../../components/RefreshableToolbar";
import {masterFoxClient} from "../../util/Auth";
import {Card} from "react-native-elements";
import moment from "moment";
import Colors from "../../constants/colors";

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


const FOODEE_RED = '#9D2524';
const TOOLBAR_HEIGHT = 60;
const COVER_HEIGHT = 150;
const PULL_TO_REFRESH_HEIGHT = 100;

let restaurantId = 8;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Orders extends Component {

  static navigationOptions = {
    header: null
  };

  state = {
    isRefreshing: false,
    shouldRefresh: false,
    restaurant: {},
    orders: [],
    scale: new Animated.Value(1)
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

  _fetchData = async () => {
    this.setState({isRefreshing: true});
    const client = await masterFoxClient();

    const restaurant = await client.restaurants.get(restaurantId);
    this.setState({restaurant, isRefreshing: false});

    const orders = await client.restaurants.from(restaurantId).index.orders({
      filter: {
        deliverOn: moment().format('YYYY-MM-DD')
      },
      include: 'order-items.menu-item'
    });
    this.setState({orders});
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

    return (
      <View
        style={{position: 'absolute', backgroundColor: 'white', top: 0, right: 0, bottom: 0, left: 0}}
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

          coverUrl={this.state.restaurant.coverImageUrl}
          title={this.state.restaurant.name}
          subtitle={this.state.restaurant.subtitle}
        />

        <AnimatedScrollView
          scrollEventThrottle={1}
          onScroll={this.onScroll}
          style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, paddingTop: COVER_HEIGHT - 25, zIndex: 1}}
          onResponderRelease={this._handleRelease}
        >

          <View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Animated.Image
                source={{uri: this.state.restaurant.thumbnailImageUrl}}
                style={{
                  width: 90,
                  height: 90,
                  borderColor: 'white',
                  borderWidth: 4,
                  marginLeft: 10,
                  borderRadius: 45,
                  transform: [{scale: interpolateAvatarScale}]
                }}
              />

              <View style={{flex: 1, marginTop: 30, marginLeft: 10, backgroundColor: 'transparent'}}>
                <Text style={{fontSize: 20, color: 'black'}}>{this.state.restaurant.name}</Text>
                <Text style={{color: 'black'}}>{this.state.restaurant.subtitle}</Text>
              </View>

            </View>


            {this.state.orders.length > 0
             ? this.state.orders.map(
               order =>
                <Card
                  key={order.identifier}
                >
                  <Button
                    color={Colors.FOODEE_RED}
                    backgroundColor='transparent'
                    title={order.identifier}
                    onPress={() => this.props.navigation.navigate('Order', { order: order })}
                  />
                </Card>
              )
             :(
               <Image
                  style={{width: width / 2, height: height / 2, marginLeft: 'auto', marginRight: 'auto'}}
                  source={require('../../img/empty-pink.png')}
                />
                )
            }
          </View>
        </AnimatedScrollView>
      </View>
    )
  }
}

export default Orders;

