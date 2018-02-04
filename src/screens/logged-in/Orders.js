// libraries
import React, {Component} from "react";
import {
  Animated,
  Button,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RefreshableToolbar from "../../components/RefreshableToolbar";
import {masterFoxClient} from "../../util/Auth";
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
  item: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    display: 'flex',
    flexDirection: 'row'
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.FOODEE_RED,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 100
  }
});


const TOOLBAR_HEIGHT = 60;
const COVER_HEIGHT = 150;
const PULL_TO_REFRESH_HEIGHT = 100;

let restaurantId = 8;

class Orders extends Component {

  static navigationOptions = {
    header: null
  };

  state = {
    isRefreshing: false,
    shouldRefresh: false,
    restaurant: {},
    orders: [],
    scale: new Animated.Value(1),
    date: moment()
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
        deliverOn: this.state.date.format('YYYY-MM-DD')
      },
      include: 'order-items.menu-item.menu-group,order-items.menu-option-items.menu-option-group'
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

        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={this.onScroll}
          style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, paddingTop: COVER_HEIGHT - 25, zIndex: 1}}
          onResponderRelease={this._handleRelease}
        >

          <View style={{paddingBottom: 800}}>
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

            {this.renderOrders()}
          </View>
        </Animated.ScrollView>

        {this.renderFooter()}
      </View>
    )
  }

  renderOrders() {
    return this.state.orders.length > 0 ?
      this.state.orders.map(_ => this.renderOrder(_)) : this.renderEmptyState();
  }

  renderOrder(order) {
    return (
      <TouchableOpacity
        key={order.identifier}
        onPress={() => this.props.navigation.navigate('Order', {order: order})}
      >
        <View
          style={styles.item}
        >
          <View style={{flex: 1}}>
            <Text>
              {order.identifier}
            </Text>
            <Text>
              {order.numberOfPeople} people @ {moment(order.pickupAt).format('HH:MM a')}
            </Text>
          </View>
          <Icon
            name="angle-right"
            color={Colors.FOODEE_PINK}
            size={30}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderEmptyState() {
    return (
      <Image
        style={{width: width, height: height / 2, marginLeft: 'auto', marginRight: 'auto'}}
        source={require('../../img/empty-pink.png')}
      />
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        <Icon
          name="angle-left"
          color={Colors.FOODEE_PINK}
          size={30}
          onPress={() => {
            this.setState({date: moment(this.state.date).subtract(1, 'days')});
            this._fetchData();
          }}
        />
        <View style={{flex: 1, display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
            {this.state.date.format('MMMM Do YYYY')}
          </Text>
        </View>

        <Icon
          name="angle-right"
          color={Colors.FOODEE_PINK}
          size={30}
          onPress={() => {
            this.setState({date: moment(this.state.date).add(1, 'days')});
            this._fetchData();
          }}
        />
      </View>
    );
  }
}

export default Orders;



