import React, { Component } from 'react';
import './index.css';


class Dashboard extends Component {
  componentDidMount() {
    const { requestUserBgData } = this.props;

    requestUserBgData();
  }

  render() {
    const { userBgData } = this.props;

    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}

// Dashboard.propTypes = {
//   requestUserBgData: React.PropTypes.func.isRequired,
//   userBgData: React.PropTypes.object.isRequired
// };

export default Dashboard;
