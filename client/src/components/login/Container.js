import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import Login from './Login';
import { post } from '../../api';

class LoginContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      stickyContent: null,
      stickyStyle: 'danger',
    };
  }

  onSubmit = (values) => {
    this.setState({ saving: true });

    post('login', { ...values }).then(() => {
      browserHistory.push('/');
    }, () => {
      const { t } = this.props;

      this.setState({
        saving: false,
        stickyContent: t('Identifiants incorrects.'),
        stickyStyle: 'danger',
      });
    });
  };

  render() {
    return (
      <Login {...this.state} onSubmit={this.onSubmit} />
    );
  }
}

export default translate()(LoginContainer);
