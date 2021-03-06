/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { GoogleCharts } from 'google-charts';
import './index.css';

class BarChart extends Component {
  componentDidMount() {
    GoogleCharts.load(this.drawChart);
  }

  componentDidUpdate() {
    GoogleCharts.load(this.drawChart);
  }

  getTimeLow = (data) => {
    let numTimesLow = 0;

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].value <= 80) {
        numTimesLow += 1;
      }
    }

    const result = ((numTimesLow / data.length) * 100).toFixed(2);
    return parseInt(result, 10);
  }

  getTimeHigh = (data) => {
    let numTimesHigh = 0;

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].value >= 180) {
        numTimesHigh += 1;
      }
    }

    const result = ((numTimesHigh / data.length) * 100).toFixed(2);
    return parseInt(result, 10);
  }

  drawChart = () => {
    const { bgData, getTimeInRange } = this.props;

    const data = GoogleCharts.api.visualization.arrayToDataTable([
      ['% Time in Range', `Low (${this.getTimeLow(bgData)}%)`, `In Range (${getTimeInRange(bgData)}%)`, `High (${this.getTimeHigh(bgData)}%)`],
      ['', parseInt(this.getTimeLow(bgData), 10), parseInt(getTimeInRange(bgData), 10), parseInt(this.getTimeHigh(bgData), 10)]
    ]);
    const options = {
      isStacked: true,
      height: 100,
      chartArea: {
        width: '90%'
      },
      legend: {
        position: 'top',
        maxLines: 1,
        textStyle: { fontSize: 12 }
      },
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
    const barChart = new GoogleCharts.api.visualization.BarChart(document.getElementById('timeInRangeChart'));

    barChart.draw(data, options);
  }

  render() {
    return (
      <div id="timeInRangeChart" />
    );
  }
}

export default BarChart;
