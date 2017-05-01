import React, { Component } from 'react';
import Home from './Home';
import { get } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { hostname: '' };
  }

  async componentDidMount() {
    const state = await promisifyData(get('hostname'));

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  render() {
    const { hostname } = this.state;

    return (
      <Home hostname={hostname} />
    );
  }
}

export default HomeContainer;
