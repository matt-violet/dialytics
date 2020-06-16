import React, { Component } from 'react';
import './index.css';
import { GoogleCharts } from 'google-charts';
import 'flatpickr/dist/themes/material_green.css';

const flatpickr = require('flatpickr');

class Dashboard extends Component {
  componentDidMount() {
    const { requestBgData } = this.props;

    GoogleCharts.load(this.drawChart);
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

  componentDidUpdate(prevProps) {
    const { dateRange, requestBgData } = this.props;

    if (prevProps.dateRange !== dateRange) {
      requestBgData(dateRange.startDateISO, dateRange.endDateISO)
        .then(
          this.drawChart()
        );
    }
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

  getTimeHigh() {
    const { bgData } = this.props;
    let numTimesHigh = 0;

    for (let i = 0; i < bgData.length; i += 1) {
      if (bgData[i].value >= 180) {
        numTimesHigh += 1;
      }
    }

    const result = ((numTimesHigh / bgData.length) * 100).toFixed(2);
    return parseInt(result, 10);
  }

  getTimeLow() {
    const { bgData } = this.props;
    let numTimesLow = 0;

    for (let i = 0; i < bgData.length; i += 1) {
      if (bgData[i].value <= 80) {
        numTimesLow += 1;
      }
    }

    const result = ((numTimesLow / bgData.length) * 100).toFixed(2);
    return parseInt(result, 10);
  }

  getDateRange() {
    const { dateRange } = this.props;

    return `${dateRange.startDateReadable} - ${dateRange.endDateReadable}`;
  }

  drawChart = () => {
    const data = GoogleCharts.api.visualization.arrayToDataTable([
      ['% Time in Range', `Low (${this.getTimeLow()}%)`, `In Range (${this.getTimeInRange()}%)`, `High (${this.getTimeHigh()}%)`],
      ['% Time in Range', parseInt(this.getTimeLow(), 10), parseInt(this.getTimeInRange(), 10), parseInt(this.getTimeHigh(), 10)]
    ]);
    const options = {
      isStacked: true,
      height: 100,
      legend: { position: 'top', maxLines: 1 },
      hAxis: {
        minValue: 0,
        ticks: [0, 25, 50, 75, 100]
      },
      series: {
        0: { color: 'red' },
        1: { color: 'limegreen' },
        2: { color: 'gold' }
      }
    };
    const barChart = new GoogleCharts.api.visualization.BarChart(document.getElementById('chart1'));

    barChart.draw(data, options);
  }

  render() {
    const { bgData } = this.props;

    if (bgData) {
      return (
        <div>
          <h1>Dashboard</h1>
          <p className="date-range">{this.getDateRange()}</p>
          <input className="calendar" type="text" />
          <div id="chart1" />
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
