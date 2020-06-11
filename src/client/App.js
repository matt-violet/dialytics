import React, { Component } from 'react';
import SignIn from './SignIn/index';
import Dashboard from './Dashboard/index';

const moment = require('moment');
const tokens = require('../../tokens');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorizationCode: '',
      accessToken: '',
      userBgData: {}
    };
    this.requestUserBgData = this.requestUserBgData.bind(this);
  }

  componentDidMount() {
    const { authorizationCode } = this.state;

    if (!authorizationCode) {
      this.extractAuthCode();
    }
  }

  componentDidUpdate() {
    const { authorizationCode, accessToken, userBgData } = this.state;

    if (authorizationCode && !accessToken) {
      this.obtainAccessToken();
    }
    if (authorizationCode && accessToken && !Object.keys(userBgData).length) {
      this.requestUserBgData();
    }
  }

  obtainAccessToken = () => {
    const that = this;
    const { authorizationCode } = this.state;
    const data = `client_secret=${tokens.client_secret}&client_id=${tokens.client_id}&code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${tokens.redirect_uri}`;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function setAccessTokenToState() {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText);
        that.setState({
          accessToken: res.access_token
        });
      }
    });

    xhr.open('POST', 'https://api.dexcom.com/v2/oauth2/token');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('cache-control', 'no-cache');

    xhr.send(data);
  }

  requestUserBgData() {
    const that = this;
    const data = null;
    const { accessToken } = this.state;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function setUserBgDataToState() {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText);
        that.setState({
          userBgData: res
        });
      }
    });

    const endDate = moment().format().slice(0, -6);
    const startDate = moment().subtract(1, 'week').format().slice(0, -6);
    // console.log(endDate);
    // console.log(startDate);

    xhr.open('GET', `https://api.dexcom.com/v2/users/self/egvs?startDate=${startDate}&endDate=${endDate}`);
    xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);

    xhr.send(data);
  }

  extractAuthCode() {
    const userAuth = window.location.href.replace('http://localhost:3000/?code=', '');

    if (userAuth !== 'http://localhost:3000/') {
      this.setState({
        authorizationCode: userAuth
      });
    }
  }

  render() {
    const { authorizationCode, accessToken, userBgData } = this.state;

    if (authorizationCode && accessToken && Object.keys(userBgData).length) {
      return (
        <Dashboard userBgData={userBgData} />
      );
    }
    return (
      <SignIn />
    );
  }
}

export default App;
