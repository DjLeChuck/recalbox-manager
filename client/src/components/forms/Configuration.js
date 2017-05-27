import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import Alert from 'react-bootstrap/lib/Alert';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';
import Well from 'react-bootstrap/lib/Well';
import { getDefaultValues } from './utils';
import FormActions from './FormActions';
import SwitchInput from './inputs/Switch';
import SelectInput from './inputs/Select';
import SimpleInput from './inputs/Simple';

const ConfigurationForm = ({ t, saving, onSubmit, defaultValues, dataset }) => (
  <Form
    onSubmit={values => onSubmit(values)}
    defaultValues={getDefaultValues(defaultValues)}
  >
    {({ submitForm, resetForm }) => (
      <BootstrapForm horizontal onSubmit={submitForm}>
        <Panel header={<h3>{t('Options système')}</h3>}>
          <SelectInput id="system-language" field="system.language"
            label={t('Langue du système')} data={dataset.systemLocales}
          />

          <SelectInput id="system-kblayout" field="system.kblayout"
            label={t('Layout du clavier')} data={dataset.keyboardLayouts}
          />

          <SelectInput id="system-timezone" field="system.timezone"
            label={t('Timezone')} data={dataset.timezones}
          />
        </Panel>

        <Panel header={<h3>{t('Options réseau')}</h3>}>
          <SimpleInput id="system-hostname" field="system.hostname"
            label={t("Nom d'hôte")}
          />

          <SwitchInput id="wifi-enabled" field="wifi.enabled"
            label={t('Activer le wifi')}
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
                <SimpleInput id="wifi-ssid" field="wifi.ssid"
                  label={t('SSID')}
                />

                <SimpleInput type="password" id="wifi-key" field="wifi.key"
                  label={t('Clé')} />
              </Well>
            </Tab>
            <Tab title={t('Paramétrer le wifi 2')} eventKey={2}>
              <Well>
                <SimpleInput id="wifi2-ssid" field="wifi2.ssid"
                  label={t('SSID')}
                />

                <SimpleInput type="password" id="wifi2-key" field="wifi2.key"
                  label={t('Clé')}
                />
              </Well>
            </Tab>
            <Tab title={t('Paramétrer le wifi 3')} eventKey={3}>
              <Well>
                <SimpleInput id="wifi3-ssid" field="wifi3.ssid"
                  label={t('SSID')}
                />

                <SimpleInput type="password" id="wifi3-key" field="wifi3.key"
                  label={t('Clé')}
                />
              </Well>
            </Tab>
          </Tabs>
        </Panel>

        <Panel header={<h3>{t('Options Kodi')}</h3>}>
          <SwitchInput id="kodi-enabled" field="kodi.enabled"
            label={t('Activer Kodi')}
          />

          <SwitchInput id="kodi-atstartup" field="kodi.atstartup"
            label={t('Lancer Kodi au démarrage')}
          />

          <SwitchInput id="kodi-xbutton" field="kodi.xbutton"
             label={<span dangerouslySetInnerHTML={{ __html: t('Lancer Kodi via la touche <kbd>X</kbd>') }} />}
          />
        </Panel>

        <Panel header={<h3>{t('EmulationStation')}</h3>}>
          <SelectInput id="system-es-menu" field="system.es.menu"
            data={dataset.esMenus}  label={t('Choix du style de menu')}
            preComponent={
              <div className="bs-callout bs-callout-warning">
                <h4>{t('Options disponibles :')}</h4>
                <ul>
                  <li>
                    <strong>default</strong>{' '}
                    {t('correspond au menu de base avec toutes les options,')}
                  </li>
                  <li>
                    <strong>none</strong>{' '}
                    {t("n'offre aucun menu excepté celui de recherche de jeux,")}
                  </li>
                  <li>
                    <strong>bartop</strong>{' '}
                    {t('comporte peu de menu, seulement ceux nécessaires pour les bartops.')}
                  </li>
                </ul>
              </div>
            }
          />

          <SelectInput id="emulationstation-selectedsystem"
            field="emulationstation.selectedsystem"
            data={dataset.directoryListing}
            label={t('Système sélectionné par défaut')}
          />

          <SwitchInput id="emulationstation-bootongamelist"
            field="emulationstation.bootongamelist"
            label={t('Démarrer sur la liste de jeux du premier système (ou de celui sélectionné)')}
            warning={t('ES se lancera et affichera directement la liste de jeux du premier système (ou celui sélectionné).')}
          />

          <SwitchInput id="emulationstation-hidesystemview"
            field="emulationstation.hidesystemview"
            label={t("Désactiver la sélection des systèmes.")}
            warning={t("ES se lancera et n'affichera QUE le premier système (ou celui sélectionné).")}
          />

          <SwitchInput id="emulationstation-gamelistonly"
            field="emulationstation.gamelistonly"
            label={t("N'afficher que les jeux parsés.")}
            warning={t("ES n'affichera que les jeux listés dans les fichiers gamelist.xml (accélère les temps d'affichage).")}
          />
        </Panel>

        <Panel header={<h3>{t('Touche spéciale')}</h3>}>
          <h4>{t('Choix du comportement de la touche spéciale dans les émulateurs')}</h4>

          <SelectInput id="system-emulators-specialkeys"
            field="system.emulators.specialkeys"
            data={dataset.specialKeys}
            preComponent={
              <div className="bs-callout bs-callout-warning">
                <h4>{t('Options disponibles :')}</h4>
                <ul>
                  <li>
                    <strong>default</strong>{' '}
                    {t('correspond au fonctionnement de base avec toutes les possibilités,')}
                  </li>
                  <li>
                    <strong>nomenu</strong>{' '}
                    {t("désactive l'affichage du menu,")}
                  </li>
                  <li>
                    <strong>none</strong>{' '}
                    {t('désactive la touche spéciale.')}
                  </li>
                </ul>
              </div>
            }
          />
        </Panel>

        <Panel title={<h3>{t('API')}</h3>}>
          <SwitchInput id="system-api-enabled"
            field="system.api.enabled"
            label={t("Activer l'option de recalbox qui permet d'interagir avec via une API REST")}
            warning={t('Cette modification nécessite de redémarrer votre recalbox pour être prise en compte.')}
          />
        </Panel>

        <Panel header={<h3>{t("Mises à jour")}</h3>}>
          <SwitchInput id="updates-enabled"
            field="updates.enabled"
            label={t('Vérifier les mises à jours au démarrage du système')}
          />

          <SelectInput id="updates-type" field="updates.type"
            label={t('Type de version')}
            data={dataset.updatesTypes}
          />
        </Panel>

        <FormActions resetForm={resetForm} saving={saving} />
      </BootstrapForm>
    )}
  </Form>
);

ConfigurationForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  dataset: PropTypes.object,
};

export default translate()(ConfigurationForm);
