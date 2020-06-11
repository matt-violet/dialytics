import React, { Component } from 'react';
import './index.css';


class Dashboard extends Component {
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

  getDateRange() {
    const { dateRange } = this.props;

    return dateRange.startDateReadable + ' - ' + dateRange.endDateReadable;
  }

  render() {
    const { bgData } = this.props;

    if (bgData) {
      return (
        <div>
          <h1>Dashboard</h1>
            <p className='date-range'>{this.getDateRange()}</p>
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
      <div>Loading...</div>
    );
  }
}

export default Dashboard;
