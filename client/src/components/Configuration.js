import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Form, Well, Alert, Tabs, Tab } from 'react-bootstrap';
import { get, grep, conf, translatableConf, save } from '../api';
import { diffObjects, cloneObject, promisifyData } from '../utils';
import FieldGroup from './utils/FieldGroup';
import SelectGroup from './utils/SelectGroup';
import SwitchGroup from './utils/SwitchGroup';
import FormActions from './utils/FormActions';

class Configuration extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.initialValues = {};
    this.currentValues = {};
    this.state = {
      isLoaded: false,
      isSaving: false,
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
    this.initialValues = state;
    state.isLoaded = true;

    this.setState(state);
  }

  handleSwitchChange = (elm, newState) => {
    this.handleInputChange({
      target: {
        name: elm.props.name,
        type: 'input',
        value: newState ? 1 : 0,
      }
    });
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.currentValues[name] = value;
    this.setState({ [name]: value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    let diff = diffObjects(this.initialValues, this.currentValues);

    if (0 < Object.keys(diff).length) {
      this.setState({ isSaving: true });

      save(diff).then(() => {
        this.initialValues = cloneObject(this.currentValues);

        this.setState({ isSaving: false });
      });
    }
  }

  reset = (e) => {
    e.preventDefault();

    this.currentValues = cloneObject(this.initialValues);

    this.setState(this.currentValues);
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t("Configuration")}</h1></div>

        <p className="important">{t("Cette page permet de gérer différentes configurations de recalbox tel que les paramètres Wi-Fi, la timezone, la locale, etc.")}</p>

        <Loader loaded={this.state.isLoaded}>
          <Form horizontal onSubmit={this.onSubmit}>
            <Panel header={<h3>{t('Options système')}</h3>}>
              <SelectGroup label={t('Langue du système')}
                id="system-language" name="system.language"
                data={this.state['recalbox.configuration.systemlocales']}
                defaultValue={this.state['system.language']}
                onChange={this.handleInputChange}
              />

              <SelectGroup label={t('Layout du clavier')}
                id="system-kblayout" name="system.kblayout"
                data={this.state['recalbox.configuration.keyboardlayouts']}
                defaultValue={this.state['system.kblayout']}
                onChange={this.handleInputChange}
              />

              <SelectGroup label={t('Timezone')}
                id="system-kblayout" name="system.timezone"
                data={this.state['recalbox.configuration.timezones']}
                defaultValue={this.state['system.timezone']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <Panel header={<h3>{t('Options réseau')}</h3>}>
              <FieldGroup type="text" label={t("Nom d'hôte")}
                id="system-hostname" name="system.hostname"
                placeholder={t("Nom d'hôte")}
                value={this.state['system.hostname']}
                onChange={this.handleInputChange}
              />

              <SwitchGroup label={t('Activer le wifi')}
                id="wifi-enabled" name="wifi.enabled"
                value={this.state['wifi.enabled']}
                onChange={this.handleSwitchChange}
              />

              <Well>
                <Alert bsStyle="warning">
                  {t('Attention, si vous vous trompez dans vos informations vous risquez de ne plus pouvoir accéder à votre recalbox par le wifi.')}
                  <br />
                  {t("Les clés sont cryptées et ne sont donc pas réaffichées dans les champs. Cela ne veut pas dire que la valeur n'est pas renseignée !")}
                  <br />
                  {t('Si vous renseignez une valeur, cela écrasera la précédente.')}
                </Alert>
              </Well>

              <Tabs id="wifi-parameters" defaultActiveKey={1}>
                <Tab title={t('Paramétrer le wifi 1')} eventKey={1}>
                  <Well>
                    <FieldGroup type="text" label={t("SSID")}
                      id="wifi-ssid" name="wifi.ssid"
                      placeholder={t("SSID")}
                      value={this.state['wifi.ssid']}
                      onChange={this.handleInputChange}
                    />

                    <FieldGroup type="text" label={t("Clé")}
                      id="wifi-key" name="wifi.key"
                      placeholder={t("Clé")}
                      value={this.state['wifi.key']}
                      onChange={this.handleInputChange}
                    />
                  </Well>
                </Tab>
                <Tab title={t('Paramétrer le wifi 2')} eventKey={2}>
                  <Well>
                    <FieldGroup type="text" label={t("SSID")}
                      id="wifi2-ssid" name="wifi2.ssid"
                      placeholder={t("SSID")}
                      value={this.state['wifi2.ssid']}
                      onChange={this.handleInputChange}
                    />

                    <FieldGroup type="text" label={t("Clé")}
                      id="wifi2-key" name="wifi2.key"
                      placeholder={t("Clé")}
                      value={this.state['wifi2.key']}
                      onChange={this.handleInputChange}
                    />
                  </Well>
                </Tab>
                <Tab title={t('Paramétrer le wifi 3')} eventKey={3}>
                  <Well>
                    <FieldGroup type="text" label={t("SSID")}
                      id="wifi3-ssid" name="wifi3.ssid"
                      placeholder={t("SSID")}
                      value={this.state['wifi3.ssid']}
                      onChange={this.handleInputChange}
                    />

                    <FieldGroup type="text" label={t("Clé")}
                      id="wifi3-key" name="wifi3.key"
                      placeholder={t("Clé")}
                      value={this.state['wifi3.key']}
                      onChange={this.handleInputChange}
                    />
                  </Well>
                </Tab>
              </Tabs>
            </Panel>

            <Panel header={<h3>{t('Options Kodi')}</h3>}>
              <SwitchGroup label={t('Activer Kodi')}
                id="kodi-enabled" name="kodi.enabled"
                value={this.state['kodi.enabled']}
                onChange={this.handleSwitchChange}
              />

              <SwitchGroup label={t('Lancer Kodi au démarrage')}
                id="kodi-atstartup" name="kodi.atstartup"
                value={this.state['kodi.atstartup']}
                onChange={this.handleSwitchChange}
              />

              <SwitchGroup label={<span dangerouslySetInnerHTML={{__html: t('Lancer Kodi via la touche <kbd>X</kbd>')}} />}
                id="kodi-xbutton" name="kodi.xbutton"
                value={this.state['kodi.xbutton']}
                onChange={this.handleSwitchChange}
              />
            </Panel>

            <Panel header={<h3>{t("EmulationStation")}</h3>}>
              <SelectGroup label={t("Choix du style de menu")}
                id="system-es-menu" name="system.es.menu"
                data={this.state['recalbox.configuration.esMenus']}
                defaultValue={this.state['system.es.menu']}
                onChange={this.handleInputChange}
                preComponent={
                  <div className="bs-callout bs-callout-warning">
                    <h4>{t("Options disponibles :")}</h4>
                    <ul>
                      <li><strong>default</strong> {t("correspond au menu de base avec toutes les options,")}</li>
                      <li><strong>none</strong> {t("n'offre aucun menu excepté celui de recherche de jeux,")}</li>
                      <li><strong>bartop</strong> {t("comporte peu de menu, seulement ceux nécessaires pour les bartops.")}</li>
                    </ul>
                  </div>
                }
              />

              <SelectGroup label={t('Système sélectionné par défaut')}
                id="system-es-selectedsystem" name="emulationstation.selectedsystem"
                data={this.state.directoryListing}
                defaultValue={this.state['emulationstation.selectedsystem']}
                onChange={this.handleInputChange}
              />

              <SwitchGroup label={t('Démarrer sur la liste de jeux du premier système (ou de celui sélectionné)')}
                id="system-es-bootongamelist" name="emulationstation.bootongamelist"
                value={this.state['emulationstation.bootongamelist']}
                onChange={this.handleSwitchChange}
                warning={t('ES se lancera et affichera directement la liste de jeux du premier système (ou celui sélectionné).')}
              />

              <SwitchGroup label={t("Désactiver la sélection des systèmes.")}
                id="system-es-hidesystemview" name="emulationstation.hidesystemview"
                value={this.state['emulationstation.hidesystemview']}
                onChange={this.handleSwitchChange}
                warning={t("ES se lancera et n'affichera QUE le premier système (ou celui sélectionné).")}
              />

              <SwitchGroup label={t("N'afficher que les jeux parsés.")}
                id="system-es-gamelistonly" name="emulationstation.gamelistonly"
                value={this.state['emulationstation.gamelistonly']}
                onChange={this.handleSwitchChange}
                warning={t("ES n'affichera que les jeux listés dans les fichiers gamelist.xml (accélère les temps d'affichage).")}
              />
            </Panel>

            <Panel header={<h3>{t("Touche spéciale")}</h3>}>
              <h4>{t("Choix du comportement de la touche spéciale dans les émulateurs")}</h4>

              <SelectGroup
                id="system-emulators-specialkeys" name="system.emulators.specialkeys"
                data={this.state['recalbox.configuration.emulatorsSpecialkeys']}
                defaultValue={this.state['system.emulators.specialkeys']}
                onChange={this.handleInputChange}
                preComponent={
                  <div className="bs-callout bs-callout-warning">
                    <h4>{t("Options disponibles :")}</h4>
                    <ul>
                      <li><strong>default</strong> {t("correspond au fonctionnement de base avec toutes les possibilités,")}</li>
                      <li><strong>nomenu</strong> {t("désactive l'affichage du menu,")}</li>
                      <li><strong>none</strong> {t("désactive la touche spéciale.")}</li>
                    </ul>
                  </div>
                }
              />
            </Panel>

            <Panel title={<h3>{t('API')}</h3>}>
              <SwitchGroup label={t("Activer l'option de recalbox qui permet d'interagir avec via une API REST")}
                id="system-api-enabled" name="system.api.enabled"
                value={this.state['system.api.enabled']}
                onChange={this.handleSwitchChange}
                warning={t("Cette modification nécessite de redémarrer votre recalbox pour être prise en compte.")}
              />
            </Panel>

            <Panel header={<h3>{t("Mises à jour")}</h3>}>
              <SwitchGroup label={t("Vérifier les mises à jours au démarrage du système")}
                id="updates-enabled" name="updates.enabled"
                value={this.state['updates.enabled']}
                onChange={this.handleSwitchChange}
              />

              <SelectGroup label={t('Type de version')}
                id="update-type" name="updates.type"
                data={this.state['recalbox.configuration.updatesTypes']}
                defaultValue={this.state['updates.type']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <FormActions reset={this.reset} isSaving={this.state.isSaving} />
          </Form>
        </Loader>
      </div>
    );
  }
}

export default translate()(Configuration);
