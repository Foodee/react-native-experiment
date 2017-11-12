// libraries
import React, { Component } from "react";
import {
  Keyboard,
  Animated,
  View
} from 'react-native';
import { Button, FormLabel, FormInput } from "react-native-elements";

import Colors from '../../constants/colors';
import {login} from "../../util/Auth";
import Text from "react-native-elements/src/text/Text";

export default class extends Component {

  state = {
    email: '',
    password: '',
    imageSize: new Animated.Value(300),
    isSigningUp: false,
    errorText: null
  };

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    Animated.spring(this.state.imageSize, {
      toValue: 100,
    }).start();
  };

  _keyboardDidHide = () => {
    Animated.spring(this.state.imageSize, {
      toValue: 300,
    }).start();
  };

  _login = async () => {
    this.setState({isSigningUp: true});
    try {
      await login(this.state.email, this.state.password);
      this.props.navigation.navigate("LoggedIn");
    }
    catch (e) {
      console.error(e);
      this.setState({errorText: 'Could not login'});
    }
    finally {
      this.setState({isSigningUp: false});
    }
  };

  render() {
    return (
      <View style={{paddingVertical: 70}}>
        <Animated.Image
          style={{width: this.state.imageSize, height: this.state.imageSize, marginLeft: 'auto', marginRight: 'auto'}}
          source={require('../../img/foodee.gif')}
        />
        <FormLabel>Email</FormLabel>
        <FormInput
          placeholder="Email address..."
          onChangeText={email => this.setState({email})}
        />
        <FormLabel>Password</FormLabel>
        <FormInput secureTextEntry
                   placeholder="Password..."
                   onChangeText={password => this.setState({password})}
        />

        {this.state.errorText ? <Text style={{textAlign: 'center'}}>{this.state.errorText}</Text> : null}

        <Button
          buttonStyle={{marginTop: 20}}
          backgroundColor={Colors.FOODEE_RED}
          icon={this.state.isSigningUp ? null : {name: 'ios-log-in', type: 'ionicon'}}
          title={this.state.isSigningUp ? null : "LOGIN"}
          disabled={this.state.email.length === 0 || this.state.password.length === 0}
          loading={this.state.isSigningUp}
          onPress={this._login}
        />
        <Button
          buttonStyle={{marginTop: 20}}
          color={Colors.FOODEE_RED}
          backgroundColor='transparent'
          title='Sign Up'
          onPress={() => this.props.navigation.navigate("SignUp")}
        />
      </View>
    )
  }

}


