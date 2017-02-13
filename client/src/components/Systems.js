import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Form, Well } from 'react-bootstrap';
import reactStringReplace from 'react-string-replace';
import { grep, conf, save } from '../api';
import { diffObjects, cloneObject } from '../utils';
import FieldGroup from './utils/FieldGroup';
import SelectGroup from './utils/SelectGroup';
import SwitchGroup from './utils/SwitchGroup';
import FormActions from './utils/FormActions';

class Systems extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { t } = this.props;

    this.retroachievementDesc = reactStringReplace(t("RetroAchievements.org (%s) est un site communautaire qui permet de gagner des haut-faits sur mesure dans les jeux d'arcade grâce à l'émulation."), '%s', (match, i) => (
      <a key={i} href="http://retroachievements.org/">http://retroachievements.org/</a>
    ));
    this.initialValues = {};
    this.currentValues = {};
    this.state = {
      isLoaded: false,
      isSaving: false,
    };
  }

  componentWillMount() {
    conf(['recalbox.systems.ratio', 'recalbox.systems.shaderset']).then((response) => {
      this.setState(response);
    }).catch((err) => {
      console.error(err);
    });

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
    ]).then((data) => {
      this.initialValues = data;
      let newState = data;
      newState.isLoaded = true;

      this.setState(newState);
    }).catch((err) => {
      console.error(err);
    });
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
        <div className="page-header"><h1>{t('Système')}</h1></div>

        <p className="important">{t('Cette page permet de gérer les différents réglages système de recalbox.')}</p>

        <Loader loaded={this.state.isLoaded}>
          <Form horizontal onSubmit={this.onSubmit}>
            <Panel header={<h3>{t("Ratio de l'écran")}</h3>}>
              <SelectGroup
                id="global-ratio" name="global.ratio"
                data={this.state['recalbox.systems.ratio']}
                defaultValue={this.state['global.ratio']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <Panel header={<h3>{t("Set de shaders")}</h3>}>
              <SelectGroup
                id="global-shaderset" name="global.shaderset"
                data={this.state['recalbox.systems.shaderset']}
                defaultValue={this.state['global.shaderset']}
                onChange={this.handleInputChange}
                preComponent={
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
              <SwitchGroup
                id="global-smooth" name="global.smooth"
                value={this.state['global.smooth']}
                onChange={this.handleSwitchChange}
              />
            </Panel>

            <Panel header={<h3>{t('Rembobinage des jeux')}</h3>}>
              <SwitchGroup
                id="global-rewind" name="global.rewind"
                value={this.state['global.rewind']}
                onChange={this.handleSwitchChange}
                help={<p>{t("L'option rembobinage vous autorise à effectuer des retours dans le temps lors de votre partie.")}</p>}
                warning={t("Cela peut ralentir certains émulateurs (snes, psx) si vous l'activez par défaut.")}
              />
            </Panel>

            <Panel header={<h3>{t('Sauvegarde / Chargement automatique')}</h3>}>
                <SwitchGroup
                  id="global-autosave" name="global.autosave"
                  value={this.state['global.autosave']}
                  onChange={this.handleSwitchChange}
                  help={
                    <div>
                      <p>{t('Cette option vous permet de créer une sauvegarde automatique de votre jeu quand vous le quittez, puis de la charger à nouveau quand vous le relancerez.')}</p>
                      <p>{t("Une fois le jeu lancé et la sauvegarde chargée, si vous souhaitez revenir à l'écran titre du jeu, utilisez la commande spéciale de reset.")}</p>
                    </div>
                  }
                />
            </Panel>

            <Panel header={<h3>{t('Pixel perfect')}</h3>}>
              <SwitchGroup
                id="global-integerscale" name="global.integerscale"
                value={this.state['global.integerscale']}
                onChange={this.handleSwitchChange}
                help={<p>{t('Une fois activée, votre écran sera rognée, et vous aure un rendu "pixel perfect" dans vos jeux.')}</p>}
              />
            </Panel>

            <Panel header={<h3>{t('Retroachievements')}</h3>}>
              <SwitchGroup label={t('Activer RetroAchievements')}
                id="retroachievements-enabled" name="global.retroachievements"
                value={this.state['global.retroachievements']}
                onChange={this.handleSwitchChange}
                help={
                  <div>
                    <p>
                      {this.retroachievementDesc}
                    </p>
                    <p>{t('Les haut-faits sont conçus par et pour la communauté.')}</p>
                  </div>
                }
              />

              <Well>
                <FieldGroup type="text" label={t('Login')}
                  id="retroachievements-username" name="global.retroachievements.username"
                  value={this.state['global.retroachievements.username']}
                  onChange={this.handleInputChange}
                />

                <FieldGroup type="text" label={t('Mot de passe')}
                  id="retroachievements-password" name="global.retroachievements.password"
                  value={this.state['global.retroachievements.password']}
                  onChange={this.handleInputChange}
                />

                <SwitchGroup label={t('Activer le mode Hardcore')}
                  id="retroachievements-hardcore" name="global.retroachievements.hardcore"
                  value={this.state['global.retroachievements.hardcore']}
                  onChange={this.handleSwitchChange}
                  warning={
                    <span>
                      {t("Le mode Hardcore Hardcore désactive *toutes* les possibilités de sauvegarder dans l'émulateur : vous ne pourrez ni sauvegarder ni recharger votre partie en cours de jeu.")}
                      <br />
                      {t("Vous devrez compléter le jeu et obtenir les hauts-faits du premier coup, comme c'était le cas sur la console originale !")}
                    </span>
                  }
                />
              </Well>
            </Panel>

            <FormActions reset={this.reset} isSaving={this.state.isSaving} />
          </Form>
        </Loader>
      </div>
    );
  }
}

export default translate()(Systems);
