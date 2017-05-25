import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { get, grep, conf, translatableConf, save } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Configuration from './Configuration';

class ConfigurationContainer extends Component {
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
      get('directoryListing', 'addFavorites=1'),
      conf([
        'recalbox.configuration.keyboardlayouts',
        'recalbox.configuration.systemlocales',
        'recalbox.configuration.timezones',
        'recalbox.configuration.esMenus',
        'recalbox.configuration.emulatorsSpecialkeys',
      ]),
      translatableConf(['recalbox.configuration.updatesTypes']),
      grep([
        'system.language',
        'system.kblayout',
        'system.timezone',
        'system.hostname',
        'wifi.enabled',
        'wifi.ssid',
        'wifi2.enabled',
        'wifi2.ssid',
        'wifi3.enabled',
        'wifi3.ssid',
        'kodi.enabled',
        'kodi.atstartup',
        'kodi.xbutton',
        'system.es.menu',
        'system.emulators.specialkeys',
        'system.api.enabled',
        'emulationstation.selectedsystem',
        'emulationstation.bootongamelist',
        'emulationstation.hidesystemview',
        'emulationstation.gamelistonly',
        'updates.enabled',
        'updates.type',
      ])
    );

    state['wifi.key'] = '';
    state['wifi2.key'] = '';
    state['wifi3.key'] = '';
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
    const { directoryListing } = this.state;

    return (
      <Configuration {...this.state} onSubmit={this.onSubmit} dataset={{
        systemLocales: this.state['recalbox.configuration.systemlocales'],
        keyboardLayouts: this.state['recalbox.configuration.keyboardlayouts'],
        timezones: this.state['recalbox.configuration.timezones'],
        esMenus: this.state['recalbox.configuration.esMenus'],
        specialKeys: this.state['recalbox.configuration.emulatorsSpecialkeys'],
        updatesTypes: this.state['recalbox.configuration.updatesTypes'],
        directoryListing,
      }} defaultValues={{
        'system.language': this.state['system.language'],
        'system.kblayout': this.state['system.kblayout'],
        'system.timezone': this.state['system.timezone'],
        'system.hostname': this.state['system.hostname'],
        'wifi.enabled': this.state['wifi.enabled'],
        'wifi.ssid': this.state['wifi.ssid'],
        'wifi.key': this.state['wifi.key'],
        'wifi.ssid2': this.state['wifi.ssid2'],
        'wifi.key2': this.state['wifi.key2'],
        'wifi.ssid3': this.state['wifi.ssid3'],
        'wifi.key3': this.state['wifi.key3'],
        'kodi.enabled': this.state['kodi.enabled'],
        'kodi.atstartup': this.state['kodi.atstartup'],
        'kodi.xbutton': this.state['kodi.xbutton'],
        'system.es.menu': this.state['system.es.menu'],
        'emulationstation.selectedsystem': this.state['emulationstation.selectedsystem'],
        'emulationstation.bootongamelist': this.state['emulationstation.bootongamelist'],
        'emulationstation.hidesystemview': this.state['emulationstation.hidesystemview'],
        'emulationstation.gamelistonly': this.state['emulationstation.gamelistonly'],
        'system.emulators.specialkeys': this.state['system.emulators.specialkeys'],
        'system.api.enabled': this.state['system.api.enabled'],
        'updates.enabled': this.state['updates.enabled'],
        'updates.type': this.state['updates.type'],
      }} />
    );
  }
}

export default translate()(ConfigurationContainer);
