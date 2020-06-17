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
      bgData: {},
      dateRange: {}
    };
    this.requestBgData = this.requestBgData.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    const { authorizationCode } = this.state;

    if (!authorizationCode) {
      this.extractAuthCode();
    }
  }

  componentDidUpdate() {
    const { authorizationCode, accessToken, bgData } = this.state;

    if (authorizationCode && !accessToken) {
      this.obtainAccessToken();
    }
    if (authorizationCode && accessToken && !Object.keys(bgData).length) {
      this.requestBgData();
    }
  }

  clearState = () => {
    this.setState({
      bgData: {},
      dateRange: {}
    });
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

  requestBgData(startDateInput, endDateInput) {
    const that = this;
    const data = null;
    const { accessToken } = this.state;
    const startDateISO = startDateInput ? startDateInput.slice(0, -5) : moment().subtract(1, 'week').format().slice(0, -6);
    const endDateISO = endDateInput ? endDateInput.slice(0, -5) : moment().format().slice(0, -6);
    const startDateReadable = startDateInput ? moment(startDateInput).format('MMM DD, Y') : moment().subtract(1, 'week').format('ll');
    const endDateReadable = endDateInput ? moment(endDateInput).format('MMM DD, Y') : moment().format('ll');

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function setBgDataToState() {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText);
        that.setState((prevState) => {
          const state = Object.assign({}, prevState);
          state.bgData.egvs = res.egvs;
          state.dateRange.startDateISO = startDateISO;
          state.dateRange.endDateISO = endDateISO;
          state.dateRange.endDateReadable = endDateReadable;
          state.dateRange.startDateReadable = startDateReadable;
          return state;
        });
      }
    });

    xhr.open('GET', `https://api.dexcom.com/v2/users/self/egvs?startDate=${startDateISO}&endDate=${endDateISO}`);
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
    const {
      authorizationCode,
      accessToken,
      bgData,
      dateRange
    } = this.state;

    if (authorizationCode && accessToken && Object.keys(bgData).length) {
      return (
        <Dashboard
          bgData={bgData.egvs}
          dateRange={dateRange}
          requestBgData={this.requestBgData}
          clearState={this.clearState}
        />
      );
    }
    return (
      <SignIn />
    );
  }
}

export default App;
