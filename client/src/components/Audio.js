import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { grep, translatableConf, save } from '../api';
import { promisifyData, cancelPromises } from '../utils';
import StickyAlert from './utils/StickyAlert';
import AudioForm from './forms/Audio';

class Audio extends Component {
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
  }

  render() {
    const { t } = this.props;
    const { stickyStyle, stickyContent, loaded, saving } = this.state;

    return (
      <div>
        <div className="page-header"><h1>{t('Audio')}</h1></div>

        <p className="important">
          {t('Cette page permet de gérer la partie audio de recalbox.')}
        </p>

        <StickyAlert bsStyle={stickyStyle} container={this}>
          {stickyContent}
        </StickyAlert>

        <Loader loaded={loaded}>
          <AudioForm t={t} saving={saving}
            onSubmit={values => this.onSubmit(values)} dataset={{
              audioDevices: this.state['recalbox.audio.devices'],
            }} defaultValues={{
              'audio.bgmusic': this.state['audio.bgmusic'],
              'audio.volume': this.state['audio.volume'],
              'audio.device': this.state['audio.device'],
            }}
          />
        </Loader>
      </div>
    );
  }
}

export default translate()(Audio);
