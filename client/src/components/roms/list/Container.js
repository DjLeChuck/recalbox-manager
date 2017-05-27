import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { get } from '../../../api';
import { promisifyData, cancelPromises } from '../../../utils';
import RomsList from './List';

class RomsListContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      directoryListing: [],
      esSystems: [],
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      get('directoryListing'),
      get('esSystems')
    );

    state.loaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  render() {
    return (
      <RomsList {...this.state} />
    );
  }
}

export default translate()(RomsListContainer);
