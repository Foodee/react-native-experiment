// libraries
import React, { Component } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RefreshableToolbar from "../../components/RefreshableToolbar";
import MasterFox from 'master-fox-client';
import {Button, FormInput, FormLabel} from "react-native-elements";
import Colors from "../../constants/colors";

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

  state = {
    email: '',
    password: '',
    imageSize: new Animated.Value(200),
    isSigningUp: false,
    errorText: null
  };

  render(){
   return (
     <View style={{paddingVertical: 70}}>
       <Animated.Image
         style={{width: this.state.imageSize, height: this.state.imageSize, marginLeft: 'auto', marginRight: 'auto'}}
         source={require('../../img/foodee.gif')}
       />
       <FormLabel>Restaurant Name</FormLabel>
       <FormInput placeholder="Foxee Food" onChangeText={restaurantName => this.setState({restaurantName})}/>
       <FormLabel>Email</FormLabel>
       <FormInput placeholder="Email address..." onChangeText={email => this.setState({email})}/>
       <FormLabel>Password</FormLabel>
       <FormInput secureTextEntry placeholder="Password..." onChangeText={password => this.setState({password})}/>

       {this.state.errorText ? <Text h2>{this.state.errorText}</Text> : null}

       <Button
         buttonStyle={{marginTop: 20}}
         backgroundColor={Colors.FOODEE_RED}
         icon={this.state.isSigningUp ? null : {name: 'ios-log-in', type: 'ionicon'}}
         title={this.state.isSigningUp ? null : "SIGN UP"}
         disabled={this.state.email.length === 0 || this.state.password.length === 0}
         loading={this.state.isSigningUp}
         onPress={this._login}
       />

       <Button
         buttonStyle={{marginTop: 20}}
         color={Colors.FOODEE_RED}
         backgroundColor='transparent'
         title='LOGIN'
         onPress={() => this.props.navigation.navigate("Login")}
       />
     </View>
   )
  }

}


