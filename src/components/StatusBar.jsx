import React, { Component } from 'react';

import '../../styles/StatusBar.scss';
import { version } from '../../package.json';

const { ipcRenderer } = window.require('electron');

class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateStatus: '',
    };
    this.handleUpdateMessage = this.handleUpdateMessage.bind(this);
  }

  handleUpdateMessage(text) {
    this.setState((prevState) => {
      let { updateStatus } = prevState;
      if (text === 'checking-for-update') {
        updateStatus = 'Checking For Update';
      } else if (text === 'update-available') {
        updateStatus = 'An update is available';
      } else if (text === 'download-progress') {
        updateStatus = 'Downloading update';
      } else if (text === 'update-downloaded') {
        updateStatus = 'Update was downloaded, it will be applied on the next restart';
      } else if (text === 'error') {
        updateStatus = 'An error occured while updating. Please check the log file.';
      } else {
        updateStatus = '';
      }
      return { updateStatus };
    });  
  }

  render() {
    const { updateStatus } = this.state;
    ipcRenderer.on('message', (event, text) => {
      console.log(text);
      this.handleUpdateMessage(text);
    });
    return (
      <div className="status-bar-container">
        <div className="status-bar-row">
          <div className="status-bar-col status-bar-col-left">{updateStatus}</div>
          <div className="status-bar-col status-bar-col-right">Version: {version}</div>
        </div>
      </div>
    );
  }
}

export default StatusBar;