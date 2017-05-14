import React, { Component } from 'react';
import Monitoring from './Monitoring';
import { get } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';

class MonitoringContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      cpus: [],
      ram: {},
      temperature: {},
      disks: [],
    };
    this.intervalId = null;
  }

  componentDidMount() {
    this.fetchData();

    this.intervalId = setInterval(this.fetchData, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    cancelPromises();
  }

  fetchData = async () => {
    const state = await promisifyData(
      get('temperature'),
      get('ram'),
      get('disks'),
      get('cpus')
    );

    state.loaded = true;

    this.setState(state);
  }

  render() {
    return (
      <Monitoring {...this.state} />
    );
  }
}

export default MonitoringContainer;
