/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import BarChart from './BarChart/index';
import './index.css';
import 'flatpickr/dist/themes/material_green.css';

const flatpickr = require('flatpickr');

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.getTimeInRange = this.getTimeInRange.bind(this);
  }

  componentDidMount() {
    const { requestBgData } = this.props;

    flatpickr('.calendar', {
      altInput: true,
      altFormat: 'Y-m-d Z',
      dateFormat: 'Y-m-d Z',
      mode: 'range',
      onChange: (dates) => {
        if (dates[0] && dates[1]) {
          requestBgData(dates[0].toISOString(), dates[1].toISOString());
        }
      }
    });
  }

  getAvgGlucose = () => {
    const { bgData } = this.props;
    let sum = 0;
    let count = 0;

    for (let i = 0; i < bgData.length; i += 1) {
      sum += bgData[i].value;
      count += 1;
    }

    const result = Math.round(sum / count);
    return result;
  }

  getTimeInRange() {
    const { bgData } = this.props;
    let numTimesInRange = 0;

    for (let i = 0; i < bgData.length; i += 1) {
      if (bgData[i].value >= 80 && bgData[i].value <= 180) {
        numTimesInRange += 1;
      }
    }

    const result = (numTimesInRange / bgData.length).toFixed(2).slice(2);
    return result;
  }

  render() {
    const { bgData, dateRange } = this.props;

    if (bgData) {
      return (
        <div>
          <h1>Dashboard</h1>
          <p className="date-range">
            {`${dateRange.startDateReadable} - ${dateRange.endDateReadable}`}
          </p>
          <input className="calendar" type="text" />
          <BarChart bgData={bgData} getTimeInRange={this.getTimeInRange} />
          <table>
            <tbody>
              <tr>
                <td>Average Glucose:</td>
                <td>{this.getAvgGlucose()} mg/dL</td>
              </tr>
              <tr>
                <td>Time in Range:</td>
                <td>{this.getTimeInRange()}%</td>
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
