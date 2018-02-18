// libraries
import React, { Component } from "react";
import {
  Animated,
  Button,
  Dimensions, FlatList,
  Image, SectionList,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { masterFoxClient } from "../../util/Auth";
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
    textShadowColor: 'rgba(70, 70, 70, 1)',
    textShadowOffset: {width: 1, height: 1},
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    textShadowColor: 'rgba(70, 70, 70, 1)',
    textShadowOffset: {width: 1, height: 1},
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  background: {
    color: 'red',
  },
  section: {
    padding: 5,
    backgroundColor: Colors.FOODEE_RED
  },
  sectionText: {
    color: 'white',
    fontWeight: 'bold'
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

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = async () => {
    this.setState({isRefreshing: true});
    const client = await masterFoxClient();

    const restaurant = await client.restaurants.get(restaurantId);
    this.setState({restaurant, isRefreshing: false});

    let orders = await client.restaurants.from(restaurantId).index.orders({
      filter: {
        deliverOn: this.state.date.format('YYYY-MM-DD')
      },
      include: 'order-items.menu-item.menu-group,order-items.menu-option-items.menu-option-group'
    });

    orders = Object.values(orders.reduce((acc, order) => {
      const tranche = acc[order.tranche] || {
        id: order.id,
        title: order.tranche,
        data: []
      };

      tranche.data.push(order);

      acc[order.tranche] = tranche;

      return acc;
    }, {}));

    this.setState({orders});
  };

  render() {

    return (
      <View style={{display: 'flex', height: '100%', backgroundColor: 'white'}}>
        <StatusBar
          barStyle='light-content'
        />
        <View style={{position: 'relative'}}>
          <Image
            source={{uri: this.state.restaurant.coverImageUrl}}
            style={{width: '100%', height: 200}}
          />

          <View style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center'
          }}>
            <Animated.Image
              source={{uri: this.state.restaurant.thumbnailImageUrl}}
              style={{
                width: 90,
                height: 90,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 20,
                marginBottom: 20,
                borderColor: 'white',
                borderWidth: 4,
                borderRadius: 45
              }}
            />
            <View>
              <Text style={styles.title} textShadowColor="black">
                {this.state.restaurant.name}
              </Text>
              <Text style={styles.subtitle}>{this.state.restaurant.subtitle} </Text>
            </View>
          </View>

        </View>

        {
          this.state.orders.length > 0
            ? <SectionList
              style={{flex: 1}}
              renderSectionHeader={this.renderSectionHeader}
              renderItem={this.renderItem}
              sections={this.state.orders}
              keyExtractor={(item, _) => item.id}
            />
            : this.renderEmptyState()
        }

        {this.renderFooter()}
      </View>
    )
  }

  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.identifier}
        onPress={() => this.props.navigation.navigate('Order', {order: item})}
      >
        <View
          style={styles.item}
        >
          <View style={{flex: 1}}>
            <Text>
              {item.identifier}
            </Text>
            <Text>
              {item.numberOfPeople} people @ {moment(item.pickupAt).format('HH:MM a')}
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
  };

  renderSectionHeader = ({section}) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>
          {section.title}
        </Text>
      </View>
    )
  };

  renderEmptyState() {
    return (
      <View>
        <Image
          style={{
            width: width - (width / 4),
            height: 250,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 80
          }}
          resizeMode={Image.resizeMode.contain}
          source={require('../../img/empty-pink.png')}
        />
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={{width: 60}}
          onPress={() => {
            this.setState({date: moment(this.state.date).subtract(1, 'days')});
            this._fetchData();
          }}
        >
          <Icon
            name="angle-left"
            color={Colors.FOODEE_PINK}
            size={30}
          />
        </TouchableOpacity>
        <View style={{flex: 1, display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
            {this.state.date.format('MMMM Do YYYY')}
          </Text>
        </View>

        <TouchableOpacity
          style={{width: 60, display: 'flex', alignItems: 'flex-end'}}
          onPress={() => {
            this.setState({date: moment(this.state.date).add(1, 'days')});
            this._fetchData();
          }}
        >
          <Icon
            name="angle-right"
            color={Colors.FOODEE_PINK}
            size={30}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Orders;



