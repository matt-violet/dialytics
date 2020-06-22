/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import BarChart from './BarChart/index';
import './index.css';
import 'flatpickr/dist/themes/material_green.css';

const flatpickr = require('flatpickr');

class Dashboard extends Component {
  componentDidMount() {
    const { getBgData } = this.props;

    flatpickr('.calendar', {
      altInput: true,
      altFormat: 'Y-m-d Z',
      dateFormat: 'Y-m-d Z',
      mode: 'range',
      onChange: (dates) => {
        if (dates[0] && dates[1]) {
          getBgData(dates[0].toISOString(), dates[1].toISOString());
        }
      }
    });
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

  render() {
    const { bgData, dateRange } = this.props;

    if (bgData.length) {
      return (
        <div>
          <h1>Dashboard</h1>
          <div className="date-range">
            <p className="range-in-days">
              {`${dateRange.rangeInDays} day range`}
            </p>
            <p className="dates">
              {`${dateRange.startDateReadable} - ${dateRange.endDateReadable}`}
            </p>
          </div>
          <input className="calendar" type="text" placeholder="Select date range" />
          <BarChart bgData={bgData} getTimeInRange={this.getTimeInRange} />
          <table>
            <tbody>
              <tr>
                <td>Average Glucose:</td>
                <td>{`${this.getAvgGlucose(bgData)} mg/dL`}</td>
              </tr>
              <tr>
                <td>Time in Range:</td>
                <td>{`${this.getTimeInRange(bgData)}%`}</td>
              </tr>
              <tr>
                <td>{`Change since prior ${dateRange.rangeInDays} day period:`}</td>
                <td>{`${this.getChangeOfTimeInRange()}%`}</td>
              </tr>
              <tr>
                <td>Average Standard Deviation:</td>
                <td>{`${this.getStandardDeviation(bgData)} mg/dL`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <div>Loading Dashboard...</div>
    );
  }
}

export default Dashboard;
