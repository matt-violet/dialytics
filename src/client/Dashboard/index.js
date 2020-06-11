import React, { Component } from 'react';
import './index.css';


class Dashboard extends Component {
  getAvgGlucose = () => {
    const { userBgData } = this.props;
    let sum = 0;
    let count = 0;

    for (let i = 0; i < userBgData.egvs.length; i += 1) {
      sum += userBgData.egvs[i].value;
      count += 1;
    }

    const result = Math.round(sum / count);
    return result;
  }

  render() {
    const { userBgData } = this.props;

    if (userBgData) {
      return (
        <div>
          <h1>Dashboard</h1>
          <table>
            <tbody>
              <tr>
                <td>Average Glucose:</td>
                <td>{this.getAvgGlucose()} mg/dL</td>
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

// Dashboard.propTypes = {
//   requestUserBgData: React.PropTypes.func.isRequired,
//   userBgData: React.PropTypes.object.isRequired
// };

export default Dashboard;
