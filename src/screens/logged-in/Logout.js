// libraries
import React, { Component } from "react";
import {logout} from "../../util/Auth";

export default class extends Component {

  componentDidMount(){
    this._doLogout();
  }

  async _doLogout(){
    await logout();
    this.props.navigation.navigate("Login")
  }

  render(){
   return null;
  }

}


