// libraries
import React, {Component} from "react";
import {
  SectionList,
  Dimensions,
  StyleSheet,
  Text,
  View, ListItem,
} from 'react-native';

import {masterFoxClient} from "../../util/Auth";
import {Header} from "react-navigation";

import Colors from "../../constants/colors";
import moment from "moment";

const {height, width} = Dimensions.get('window');

let styles = StyleSheet.create({
  item: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD'
  },
  section: {
    padding: 5,
    backgroundColor: Colors.FOODEE_RED
  },
  sectionText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default class extends Component {

  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.order.identifier} @ ${moment(navigation.state.params.order.pickupAt).format('hh:mm a')}`
  });

  renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Text>{`${item.quantity}x ${item.menuItem.name}`}</Text>
        {item.menuOptionItems.map(_ => (<Text key={_.id}> {this.renderMoi(_)}</Text>))}
      </View>
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

  renderMoi(moi){
    let ret;
    const mog = moi.menuOptionGroup;
    const verb = mog.verb;

    if (verb === 'pick'){
      ret = ` • ${verb} ${moi.name} ${mog.name}`
    }
    else if (verb === 'substitute') {
      ret = ` • ${verb} ${mog.name} with ${moi.name}`
    } else {
      ret = ` • ${verb} ${moi.name}`
    }

    return ret;
  }

  render() {

    const {params} = this.props.navigation.state;

    const order = params.order;

    const groupedByMenuGroup = order
      .orderItems
      .reduce((acc, orderItem) => {

        const orderItemsMenuGroup = acc[orderItem.menuItem.menuGroup.id] || {
          id: orderItem.menuItem.menuGroup.id,
          title: orderItem.menuItem.menuGroup.name,
          data: []
        };

        orderItemsMenuGroup.data.push(orderItem);

        acc[orderItem.menuItem.menuGroup.id] = orderItemsMenuGroup;

        return acc;
      }, {});

    return (
      <SectionList
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        sections={Object.values(groupedByMenuGroup)}
        keyExtractor={(item, _) => item.id}
      />
    )

  }
}
