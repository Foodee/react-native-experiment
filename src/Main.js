// libraries
import React, { Component } from "react";
import {createRootNavigator} from './screens/Layout';
import {isLoggedIn} from "./util/Auth";

export default class extends Component {

  state = {
    isLoggedIn: false,
    checkedLogin: false
  };

  componentDidMount(){
    this._checkLoggedIn();
  }

  async _checkLoggedIn(){
    const loggedIn= await isLoggedIn();

    this.setState({ isLoggedIn: loggedIn, checkedLogin: true })
  }

  render() {

    const {isLoggedIn, checkedLogin} = this.state;

    if (!checkedLogin){
      return null;
    }

    const Layout = createRootNavigator(isLoggedIn);
    return <Layout/>;
  }

}
