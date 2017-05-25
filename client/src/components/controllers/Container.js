import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { grep, translatableConf, save } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Controllers from './Controllers';

class ControllerContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      saving: false,
      stickyContent: null,
      stickyStyle: 'danger',
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      translatableConf(['recalbox.controllers.ps3drivers']),
      grep([
        'controllers.db9.enabled',
        'controllers.db9.args',
        'controllers.gamecon.enabled',
        'controllers.gamecon.args',
        'controllers.gpio.enabled',
        'controllers.gpio.args',
        'controllers.ps3.enabled',
        'controllers.ps3.driver',
      ])
    );

    state.loaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  onSubmit = (values) => {
    const { t } = this.props;

    this.setState({ saving: true });

    save(values).then(() => (
      this.setState({
        saving: false,
        stickyContent: t('La configuration a bien été sauvegardée.'),
        stickyStyle: 'success',
      })
    ), () => (
      this.setState({
        saving: false,
        stickyContent: t('Une erreur est survenue lors de la sauvegarde de la configuration.'),
        stickyStyle: 'danger',
      })
    ));
  }

  render() {
    return (
      <Controllers {...this.state} onSubmit={this.onSubmit} dataset={{
        ps3Drivers: this.state['recalbox.controllers.ps3drivers'],
      }} defaultValues={{
        'controllers.db9.enabled': this.state['controllers.db9.enabled'],
        'controllers.db9.args': this.state['controllers.db9.args'],
        'controllers.gamecon.enabled': this.state['controllers.gamecon.enabled'],
        'controllers.gamecon.args': this.state['controllers.gamecon.args'],
        'controllers.gpio.enabled': this.state['controllers.gpio.enabled'],
        'controllers.gpio.args': this.state['controllers.gpio.args'],
        'controllers.ps3.enabled': this.state['controllers.ps3.enabled'],
        'controllers.ps3.driver': this.state['controllers.ps3.driver'],
      }} />
    );
  }
}

export default translate()(ControllerContainer);
