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
      bgData: [],
      prevRangeBgData: [],
      dateRange: {},
      deviceSettings: {}
    };
    this.getBgData = this.getBgData.bind(this);
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
    if (authorizationCode && accessToken && !bgData.length) {
      this.getDeviceSettings();
      this.getBgData();
    }
  }

  getDeviceSettings = () => {
    const { accessToken } = this.state;
    const that = this;
    const data = null;
    const startDateISO = moment().subtract(1, 'week').format().slice(0, -6);
    const endDateISO = moment().format().slice(0, -6);

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function saveDeviceSettingsToState() {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText).devices[0];
        that.setState((prevState) => {
          const state = Object.assign({}, prevState);
          state.deviceSettings = {};
          state.deviceSettings.displayDevice = res.displayDevice;
          state.deviceSettings.transmitterGen = res.transmitterGeneration;
          state.deviceSettings.highAlert = res.alertScheduleList[0].alertSettings[3].value;
          state.deviceSettings.lowAlert = res.alertScheduleList[0].alertSettings[6].value;

          return state;
        });
      }
    });

    xhr.open('GET', `https://api.dexcom.com/v2/users/self/devices?startDate=${startDateISO}&endDate=${endDateISO}`);
    xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);

    xhr.send(data);
  }

  getBgData(startDateInput, endDateInput) {
    const { accessToken } = this.state;
    const that = this;
    const data = null;
    const startDateISO = startDateInput ? startDateInput.slice(0, -5) : moment().subtract(1, 'week').format().slice(0, -6);
    const endDateISO = endDateInput ? endDateInput.slice(0, -5) : moment().format().slice(0, -6);
    const startDateReadable = startDateInput ? moment(startDateInput).format('MMM DD, Y') : moment().subtract(1, 'week').format('ll');
    const endDateReadable = endDateInput ? moment(endDateInput).format('MMM DD, Y') : moment().format('ll');
    const rangeInDays = moment(endDateISO).diff(moment(startDateISO), 'days');
    const prevRangeStartDateISO = moment(startDateISO).subtract(rangeInDays, 'days').format().slice(0, -6);
    const prevRangeEndDateISO = moment(endDateISO).subtract(rangeInDays, 'days').format().slice(0, -6);

    const xhr = new XMLHttpRequest();
    const xhr2 = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function setBgDataToState() {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText);
        res.startDateReadable = startDateReadable;
        res.startDateISO = startDateISO;
        res.endDateReadable = endDateReadable;
        res.endDateISO = endDateISO;
        res.rangeInDays = rangeInDays;
        res.prevDateRange = {};
        res.prevDateRange.startDateISO = prevRangeStartDateISO;
        res.prevDateRange.endDateISO = prevRangeEndDateISO;

        that.saveBgData(res);
      }
    });

    xhr2.addEventListener('readystatechange', function setPrevRangeBgData() {
      if (this.readyState === 4) {
        const res2 = JSON.parse(this.responseText);
        res2.isPrevData = true;

        that.saveBgData(res2);
      }
    });

    xhr.open('GET', `https://api.dexcom.com/v2/users/self/egvs?startDate=${startDateISO}&endDate=${endDateISO}`);
    xhr2.open('GET', `https://api.dexcom.com/v2/users/self/egvs?startDate=${prevRangeStartDateISO}&endDate=${prevRangeEndDateISO}`);
    xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
    xhr2.setRequestHeader('authorization', `Bearer ${accessToken}`);

    xhr.send(data);
    xhr2.send(data);
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

  saveBgData(data) {
    if (data.isPrevData) {
      this.setState((prevState) => {
        const state = Object.assign({}, prevState);
        state.prevRangeBgData = data.egvs;

        return state;
      });
    } else {
      this.setState((prevState) => {
        const state = Object.assign({}, prevState);
        state.bgData = data.egvs;
        state.dateRange.startDateISO = data.startDateISO;
        state.dateRange.endDateISO = data.endDateISO;
        state.dateRange.endDateReadable = data.endDateReadable;
        state.dateRange.startDateReadable = data.startDateReadable;
        state.dateRange.rangeInDays = data.rangeInDays;
        state.prevDateRange = {};
        state.prevDateRange.startDateISO = data.prevDateRange.startDateISO;
        state.prevDateRange.endDateISO = data.prevDateRange.endDateISO;

        return state;
      });
    }
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
      prevRangeBgData,
      dateRange,
      deviceSettings
    } = this.state;

    if (authorizationCode && accessToken && bgData.length) {
      return (
        <Dashboard
          bgData={bgData}
          dateRange={dateRange}
          prevRangeBgData={prevRangeBgData}
          getBgData={this.getBgData}
          deviceSettings={deviceSettings}
        />
      );
    }
    if (authorizationCode && !bgData.length) {
      return (
        <div className="loading"></div>
      );
    }
    return (
      <SignIn />
    );
  }
}

export default App;
