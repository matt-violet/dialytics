/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import BarChart from './BarChart/index';
import './index.css';
import 'flatpickr/dist/themes/material_green.css';

const flatpickr = require('flatpickr');

class Dashboard extends Component {
  componentDidMount() {
    const { getBgData } = this.props;
    const config = {
      altInput: true,
      altFormat: 'Y-m-d Z',
      dateFormat: 'Y-m-d Z',
      mode: 'range',
      onChange: (dates) => {
        if (dates[0] && dates[1]) {
          getBgData(dates[0].toISOString(), dates[1].toISOString());
          this.clearCalendarInput();
        }
      }
    };

    flatpickr('.calendar', config);
  }

  getAvgGlucose = (data) => {
    let sum = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 1) {
      sum += data[i].value;
      count += 1;
    }

    const result = Math.round(sum / count);
    return result;
  }

  getChangeOfTimeInRange() {
    const { bgData, prevRangeBgData } = this.props;
    const currentTimeInRange = this.getTimeInRange(bgData);
    const prevTimeInRange = this.getTimeInRange(prevRangeBgData);

    const percentDifference = currentTimeInRange >= prevTimeInRange
      ? `+${currentTimeInRange - prevTimeInRange}`
      : `-${prevTimeInRange - currentTimeInRange}`;

    return percentDifference;
  }

  getTimeInRange = (data) => {
    let numTimesInRange = 0;

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].value >= 80 && data[i].value <= 180) {
        numTimesInRange += 1;
      }
    }

    const result = (numTimesInRange / data.length).toFixed(2).slice(2);
    return result;
  }

  getStandardDeviation = (data) => {
    const deviations = [];
    let sumOfDeviations = 0;

    for (let i = 0; i < data.length; i += 1) {
      deviations.push(Math.abs(data[i].value - 100));
    }
    for (let i = 0; i < deviations.length; i += 1) {
      sumOfDeviations += deviations[i];
    }

    const avgDeviation = Math.round(sumOfDeviations / deviations.length);

    return avgDeviation;
  }

  clearCalendarInput() {
    const { getBgData } = this.props;
    const config = {
      altInput: true,
      altFormat: 'Y-m-d Z',
      dateFormat: 'Y-m-d Z',
      mode: 'range',
      onChange: (dates) => {
        if (dates[0] && dates[1]) {
          getBgData(dates[0].toISOString(), dates[1].toISOString());
          this.clearCalendarInput();
        }
      }
    };

    flatpickr('.calendar', config).clear('');
  }

  render() {
    const { bgData, dateRange, deviceSettings } = this.props;

    if (bgData.length) {
      return (
        <div>
          <h1 className="title">Dialytics Dashboard</h1>
          <div className="analytics-container">
            <div className="date-range">
              <p className="range-in-days">{dateRange.rangeInDays === 1 ? `${dateRange.rangeInDays} Day` : `${dateRange.rangeInDays} Days`}</p>
              <p className="dates">{`${dateRange.startDateReadable} - ${dateRange.endDateReadable}`}</p>
            </div>
            <input className="calendar" type="text" placeholder="Select date range" />
            <BarChart bgData={bgData} getTimeInRange={this.getTimeInRange} />
            <div className="bg-analytics-container">
              <div>
                <h3 className="header">Average Glucose:</h3>
                <p className="numbers">{`${this.getAvgGlucose(bgData)} mg/dL`}</p>
              </div>
              <div>
                <h3 className="header">Time in Range:</h3>
                <p className="numbers">{`${this.getTimeInRange(bgData)}%`}</p>
              </div>
              <div>
                <h3 className="header">{`Change since prior ${dateRange.rangeInDays} day period:`}</h3>
                <p className="numbers">{`${this.getChangeOfTimeInRange()}%`}</p>
              </div>
              <div>
                <h3 className="header">Average Standard Deviation:</h3>
                <p className="numbers">{`${this.getStandardDeviation(bgData)} mg/dL`}</p>
              </div>
            </div>
          </div>
          <div className="device-settings-container">
            <div className="device-settings-header">Device Settings</div>
            <div>
              <h3 className="header">Display Device:</h3>
              <p className="numbers">{deviceSettings.displayDevice}</p>
            </div>
            <div>
              <h3 className="header">High Alert:</h3>
              <p className="numbers">{`${deviceSettings.highAlert} mg/dL`}</p>
            </div>
            <div>
              <h3 className="header">Low Alert:</h3>
              <p className="numbers">{`${deviceSettings.lowAlert} mg/dL`}</p>
            </div>
            <div>
              <h3 className="header">Transmitter Generation:</h3>
              <p className="numbers">{deviceSettings.transmitterGen}</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>Loading Dashboard...</div>
    );
  }
}

export default Dashboard;
