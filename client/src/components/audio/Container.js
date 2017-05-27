import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { grep, translatableConf, save } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Audio from './Audio';

class AudioContainer extends Component {
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
      translatableConf(['recalbox.audio.devices']),
      grep(['audio.device', 'audio.volume', 'audio.bgmusic'])
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
      <Audio {...this.state} onSubmit={this.onSubmit} dataset={{
        audioDevices: this.state['recalbox.audio.devices'],
      }} defaultValues={{
        'audio.bgmusic': this.state['audio.bgmusic'],
        'audio.volume': this.state['audio.volume'],
        'audio.device': this.state['audio.device'],
      }} />
    );
  }

}

export default translate()(AudioContainer);
