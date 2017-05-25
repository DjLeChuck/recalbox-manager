import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import Well from 'react-bootstrap/lib/Well';
import reactStringReplace from 'react-string-replace';
import { getDefaultValues } from './utils';
import FormActions from './FormActions';
import SwitchInput from './inputs/Switch';
import SelectInput from './inputs/Select';
import SimpleInput from './inputs/Simple';

const SystemsForm = ({ t, saving, onSubmit, defaultValues, dataset }) => {
  const retroachievementDesc = reactStringReplace(t("RetroAchievements.org (%s) est un site communautaire qui permet de gagner des haut-faits sur mesure dans les jeux d'arcade grâce à l'émulation."), '%s', (match, i) => (
    <a key={i} href="http://retroachievements.org/">http://retroachievements.org/</a>
  ));

  return (
    <Form
      onSubmit={values => onSubmit(values)}
      defaultValues={getDefaultValues(defaultValues)}
    >
      {({ submitForm, resetForm }) => (
        <BootstrapForm horizontal onSubmit={submitForm}>
          <Panel header={<h3>{t("Ratio de l'écran")}</h3>}>
            <SelectInput id="global-ratio" field="global.ratio"
              data={dataset.ratioList}
            />
          </Panel>

          <Panel header={<h3>{t("Set de shaders")}</h3>}>
            <SelectInput id="global-shaderset" field="global.shaderset"
              data={dataset.shadersets} preComponent={
                <div className="bs-callout bs-callout-warning">
                  <h4>{t('Shaders disponibles :')}</h4>
                  <ul>
                    <li><strong>scanlines</strong> {t('active les scanlines sur tous les emulateurs,')}</li>
                    <li>
                      <strong>retro</strong>{' '}
                      {t('sélectionne le "meilleur" shader pour chaque système, choisi par la communauté.')}
                      {t("Il vous apportera l'expérience de jeu la plus proche de l'expérience originale,")}</li>
                    <li><strong>none</strong> {t('ne met aucun shaders.')}</li>
                  </ul>
                </div>
              }
            />
          </Panel>

          <Panel header={<h3>{t('Lissage des jeux')}</h3>}>
            <SwitchInput field="global.smooth" />
          </Panel>

          <Panel header={<h3>{t('Rembobinage des jeux')}</h3>}>
            <SwitchInput field="global.rewind"
              help={<p>{t("L'option rembobinage vous autorise à effectuer des retours dans le temps lors de votre partie.")}</p>}
              warning={t("Cela peut ralentir certains émulateurs (snes, psx) si vous l'activez par défaut.")}
            />
          </Panel>

          <Panel header={<h3>{t('Sauvegarde / Chargement automatique')}</h3>}>
            <SwitchInput field="global.autosave"
              help={
                <div>
                  <p>{t('Cette option vous permet de créer une sauvegarde automatique de votre jeu quand vous le quittez, puis de la charger à nouveau quand vous le relancerez.')}</p>
                  <p>{t("Une fois le jeu lancé et la sauvegarde chargée, si vous souhaitez revenir à l'écran titre du jeu, utilisez la commande spéciale de reset.")}</p>
                </div>
              }
            />
          </Panel>

          <Panel header={<h3>{t('Pixel perfect')}</h3>}>
            <SwitchInput field="global.integerscale"
              help={<p>{t('Une fois activée, votre écran sera rognée, et vous aure un rendu "pixel perfect" dans vos jeux.')}</p>}
            />
          </Panel>

          <Panel header={<h3>{t('Retroachievements')}</h3>}>
            <SwitchInput field="global.retroachievements"
              id="global-retroachievements"
              label={t('Activer RetroAchievements')} help={
                <div>
                  <p>{retroachievementDesc}</p>
                  <p>{t('Les haut-faits sont conçus par et pour la communauté.')}</p>
                </div>
              }
            />

            <Well>
              <SimpleInput id="retroachievements-username" label={t('Login')}
                field="global.retroachievements.username"
              />

              <SimpleInput type="password" id="retroachievements-password"
                label={t('Mot de passe')}
                field="global.retroachievements.password"
              />

              <SwitchInput field="global.retroachievements.hardcore"
                id="global-retroachievements-hardcore"
                label={t('Activer le mode Hardcore')}
                warning={
                  <span>
                    {t("Le mode Hardcore désactive *toutes* les possibilités de sauvegarder dans l'émulateur : vous ne pourrez ni sauvegarder ni recharger votre partie en cours de jeu.")}
                    <br />
                    {t("Vous devrez compléter le jeu et obtenir les hauts-faits du premier coup, comme c'était le cas sur la console originale !")}
                  </span>
                }
              />
            </Well>
          </Panel>

          <FormActions resetForm={resetForm} saving={saving} />
        </BootstrapForm>
      )}
    </Form>
  );
};

SystemsForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  dataset: PropTypes.object,
};

export default translate()(SystemsForm);
