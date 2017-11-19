import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { get, post } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Security from './Security';

class SecurityContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      saving: false,
      stickyContent: null,
      stickyStyle: 'danger',
      authConfig: {},
    };
  }

  async componentWillMount() {
    const state = await promisifyData(get('authConfig'));
    state.loaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  onSubmit = (values) => {
    const { t } = this.props;

    this.setState({ saving: true });

    post('security', values).then(() => (
      this.setState({
        saving: false,
        stickyContent: t('La configuration a bien été sauvegardée.'),
        stickyStyle: 'success',
      }, () => {
        // Clear cookies
        document.cookie.split(";").forEach(c =>
          document.cookie = c.replace(/^ +/, "")
                             .replace(/=.*/, "=;expires=" + new Date()
                             .toUTCString() + ";path=/")
        );
      })
    ), () => (
      this.setState({
        saving: false,
        stickyContent: t('Une erreur est survenue lors de la sauvegarde de la configuration.'),
        stickyStyle: 'danger',
      })
    ));
  };

  render() {
    const { authConfig, ...rest } = this.state;

    return (
      <Security
        {...rest} onSubmit={this.onSubmit} defaultValues={{ ...authConfig }}
      />
    );
  }
}

export default translate()(SecurityContainer);
