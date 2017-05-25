import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { conf, get } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Logs from './Logs';

class LogsContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      loadingFile: false,
      stickyContent: null,
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      conf(['recalbox.logsPaths'])
    );

    state.loaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  onSubmit = (values) => {
    const { filePath } = values;

    if (!filePath) {
      return;
    }

    this.setState({
      loadingFile: true,
      stickyContent: null,
    });

    get('readFile', `file=${filePath}`).then(
      (response) => {
        response.loadedFile = filePath;

        this.setState(response);
      },
      err => this.setState({ stickyContent: err.message })
    ).then(() => this.setState({ loadingFile: false }));
  };

  render() {
    return (
      <Logs {...this.state} onSubmit={this.onSubmit}
        dataset={{ logsPaths: this.state['recalbox.logsPaths'] }}/>
    );
  }
}

export default translate()(LogsContainer);
