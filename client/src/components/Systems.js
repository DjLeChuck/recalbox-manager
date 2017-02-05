import React from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Alert, Glyphicon, Form } from 'react-bootstrap';
import { grep, conf, save } from '../api';
import { diffObjects, cloneObject } from '../utils';
import FieldGroup from './utils/FieldGroup';
import SelectGroup from './utils/SelectGroup';
import SliderGroup from './utils/SliderGroup';
import SwitchGroup from './utils/SwitchGroup';
import FormActions from './utils/FormActions';

class Systems extends React.Component {
  constructor(props) {
    super(props);

    this.initialValues = {};
    this.currentValues = {};
    this.state = {
      isLoaded: false,
      isSaving: false,
    };
  }

  componentWillMount() {
    conf(['recalbox.systems.ratio', 'recalbox.systems.shaderset']).then((response) => {
      this.setState({
        ratio: response['recalbox.systems.ratio'],
        shaderset: response['recalbox.systems.shaderset'],
      });
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

      save(diff).then((data) => {
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

    let retroAchievementsDesc = t("RetroAchievements.org (%s) est un site communautaire qui permet de gagner des haut-faits sur mesure dans les jeux d'arcade grâce à l'émulation.");
    retroAchievementsDesc = retroAchievementsDesc.replace("%s", '<a href="http://retroachievements.org/">http://retroachievements.org/</a>');

    return (
      <div>
        <div className="page-header"><h1>{t('Système')}</h1></div>

        <p className="important">{t('Cette page permet de gérer les différents réglages système de recalbox.')}</p>

        <Loader loaded={this.state.isLoaded}>
          <Form horizontal onSubmit={this.onSubmit}>
            <Panel header={<h3 className="panel-title">{t("Ratio de l'écran")}</h3>}>
              <SelectGroup id="global-ratio" name="global.ratio"
                data={this.state.ratio}
                defaultValue={this.state['global.ratio']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{t('Set de shaders')}</h3>
              </div>
              <div className="panel-body">
                <div className="bs-callout bs-callout-warning">
                  <h4>{t('Shaders disponibles :')}</h4>
                  <ul>
                    <li><strong>scanlines</strong> {t('active les scanlines sur tous les emulateurs,')}</li>
                    <li>
                      <strong>retro</strong>
                      {t('sélectionne le "meilleur" shader pour chaque système, choisi par la communauté.')}
                      {t("Il vous apportera l'expérience de jeu la plus proche de l'expérience originale,")}</li>
                    <li><strong>none</strong> {t('ne met aucun shaders.')}</li>
                  </ul>
                </div>

                <Select2 id="global-shaderset" name="global.shaderset"
                  data={this.state.shaderset}
                  defaultValue={this.state['global.shaderset']}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{t('Lissage des jeux')}</h3>
              </div>
              <div className="panel-body">
                <Switch name="global.smooth"
                  onChange={this.handleSwitchChange}
                  value={1 === parseInt(this.state['global.smooth'], 10)} />
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{t('Rembobinage des jeux')}</h3>
              </div>
              <div className="panel-body">
                <p>{t("L'option rembobinage vous autorise à effectuer des retours dans le temps lors de votre partie.")}</p>

                <div className="alert alert-warning">
                  <span className="glyphicon glyphicon-alert" aria-hidden="true"></span>
                  <span className="sr-only">{t('Attention :')}</span>
                  {t("Cela peut ralentir certains émulateurs (snes, psx) si vous l'activez par défaut.")}
                </div>

                <Switch name="global.rewind"
                  onChange={this.handleSwitchChange}
                  value={1 === parseInt(this.state['global.rewind'], 10)} />
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{t('Sauvegarde / Chargement automatique')}</h3>
              </div>
              <div className="panel-body">
                <p>
                  {t('Cette option vous permet de créer une sauvegarde automatique de votre jeu quand vous le quittez, puis de la charger à nouveau quand vous le relancerez.')}
                  {t("Une fois le jeu lancé et la sauvegarde chargée, si vous souhaitez revenir à l'écran titre du jeu, utilisez la commande spéciale de reset.")}
                </p>

                <Switch name="global.autosave"
                  onChange={this.handleSwitchChange}
                  value={1 === parseInt(this.state['global.autosave'], 10)} />
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{t('Pixel perfect')}</h3>
              </div>
              <div className="panel-body">
                <p>
                  {t('Une fois activée, votre écran sera rognée, et vous aure un rendu "pixel perfect" dans vos jeux.')}
                </p>

                <Switch name="global.integerscale"
                  onChange={this.handleSwitchChange}
                  value={1 === parseInt(this.state['global.integerscale'], 10)} />
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{t('Retroachievements')}</h3>
              </div>
              <div className="panel-body">
                <p>{retroAchievementsDesc}</p>
                <p>{t('Les haut-faits sont conçus par et pour la communauté.')}</p>

                <div className="form-group">
                  <label htmlFor="retroachievements-enabled" className="col-md-4 control-label">{t('Activer RetroAchievements')}</label>
                  <div className="col-md-6">
                    <Switch name="global.retroachievements"
                      onChange={this.handleSwitchChange}
                      value={1 === parseInt(this.state['global.retroachievements'], 10)} />
                  </div>
                </div>

                <div className="well">
                  <div className="form-group">
                    <label htmlFor="retroachievements-username" className="col-md-4 control-label">{t('Login')}</label>
                    <div className="col-md-6">
                      <input type="text" name="global.retroachievements.username"
                        className="form-control" id="retroachievements-username"
                        placeholder={t('Login')}
                        value={this.state['global.retroachievements.username']}
                        onChange={this.handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="retroachievements-password" className="col-md-4 control-label">{t('Mot de passe')}</label>
                    <div className="col-md-6">
                      <input type="text" name="global.retroachievements.password"
                        className="form-control" id="retroachievements-password"
                        placeholder={t('Mot de passe')}
                        value={this.state['global.retroachievements.password']}
                        onChange={this.handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FormActions reset={this.reset} isSaving={this.state.isSaving} />
          </Form>
        </Loader>
      </div>
    );
  }
}

export default translate()(Systems);
