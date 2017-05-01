import React, { Component } from 'react';
import ESActions from './ESActions';
import { get } from '../../../api';
import { promisifyData, cancelPromises } from '../../../utils';

class ESActionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { ESStatus: 'OK' };
    this.intervalId;
  }

  componentDidMount() {
    this.fetchESStatus();

    this.intervalId = setInterval(this.fetchESStatus, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    cancelPromises();
  }

  onSuccess = () => {
    this.fetchESStatus();
  }

  onError = (err) => {
    console.error(err);
  }

  fetchESStatus = async () => {
    const state = await promisifyData(get('ESStatus'));

    this.setState(state);
  }

  render() {
    const { ESStatus } = this.state;

    return (
      <ESActions status={ESStatus} onSuccess={() => this.onSuccess()}
        onError={err => this.onError(err)} />
    );
  }
}

export default ESActionsContainer;
