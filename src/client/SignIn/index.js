import React, { Component } from 'react';
import './index.css';

const tokens = require('../../../tokens');

export default class SignIn extends Component {
  navToDexcomLogin = () => {
    const dexcomLoginUrl = `https://api.dexcom.com/v2/oauth2/login?client_id=${tokens.client_id}&redirect_uri=${tokens.redirect_uri}&response_type=code&scope=offline_access`;

    window.location.href = dexcomLoginUrl;
  }

  render() {
    return (
      <div>
        <h1>Welcome to Dialytics</h1>
        <h4>Powered by Dexcom</h4>
        <button type="button" onClick={this.navToDexcomLogin}>Sign In</button>
        {/* <button type="button" onClick={this.requestUserBgData}>Request Data</button> */}
      </div>
    );
  }
}
