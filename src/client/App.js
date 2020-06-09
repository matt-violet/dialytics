import React, { Component } from 'react';
import './app.css';

const tokens = require('../../tokens');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorizationCode: '',
      accessToken: '',
      userBgData: {}
    };
    this.navToDexcomLogin = this.navToDexcomLogin.bind(this);
  }

  componentDidMount = () => {
    const { authorizationCode } = this.state;
    if (!authorizationCode) {
      this.saveUserAuth();
    }
    this.obtainAccessToken();
  }

  saveUserAuth = () => {
    const userAuth = window.location.href.replace('http://localhost:3000/?code=', '');
    if (userAuth.length) {
      this.state.authorizationCode = userAuth;
    }
  }

  navToDexcomLogin = () => {
    const dexcomLoginUrl = `https://api.dexcom.com/v2/oauth2/login?client_id=${tokens.client_id}&redirect_uri=${tokens.redirect_uri}&response_type=code&scope=offline_access`;
    window.location.href = dexcomLoginUrl;
  }

  obtainAccessToken = () => {
    const that = this;
    const { authorizationCode } = this.state;
    const data = `client_secret=${tokens.client_secret}&client_id=${tokens.client_id}&code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${tokens.redirect_uri}`;

    const req = new XMLHttpRequest();
    req.withCredentials = true;

    req.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText);
        that.setState({
          accessToken: res.access_token
        });
      }
    });
    req.open('POST', 'https://api.dexcom.com/v2/oauth2/token');
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    req.setRequestHeader('cache-control', 'no-cache');

    req.send(data);
  }

  requestUserBgData = () => {
    const that = this;
    const data = null;
    const { accessToken } = this.state;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText);
        that.setState({
          userBgData: res
        });
      }
    });

    xhr.open('GET', 'https://api.dexcom.com/v2/users/self/egvs?startDate=2020-01-01T15:30:00&endDate=2020-01-20T15:45:00');
    xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);

    xhr.send(data);
  }

  render() {
    return (
      <div>
        <h1>Dialytics</h1>
        <button type="button" onClick={this.navToDexcomLogin}>Obtain User Authorization</button>
        <button type="button" onClick={this.requestUserBgData}>Request Data</button>
      </div>
    );
  }
}
