import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { grep, translatableConf, save } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Systems from './Systems';

class SystemContainer extends Component {
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
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      translatableConf(['recalbox.systems.ratio', 'recalbox.systems.shaderset']),
      grep([
        'global.ratio',
        'global.shaderset',
        'global.smooth',
        'global.rewind',
        'global.autosave',
        'global.integerscale',
        'global.retroachievements',
        'global.retroachievements.hardcore',
        'global.retroachievements.username',
        'global.retroachievements.password',
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
  };

  render() {
    return (
      <Systems {...this.state} onSubmit={this.onSubmit} dataset={{
        ratioList: this.state['recalbox.systems.ratio'],
        shadersets: this.state['recalbox.systems.shaderset'],
      }} defaultValues={{
        'global.ratio': this.state['global.ratio'],
        'global.shaderset': this.state['global.shaderset'],
        'global.smooth': this.state['global.smooth'],
        'global.rewind': this.state['global.rewind'],
        'global.autosave': this.state['global.autosave'],
        'global.integerscale': this.state['global.integerscale'],
        'global.retroachievements': this.state['global.retroachievements'],
        'global.retroachievements.hardcore': this.state['global.retroachievements.hardcore'],
        'global.retroachievements.username': this.state['global.retroachievements.username'],
        'global.retroachievements.password': this.state['global.retroachievements.password'],
      }} />
    );
  }
}

export default translate()(SystemContainer);
