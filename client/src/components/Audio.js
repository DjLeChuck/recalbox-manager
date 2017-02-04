import React from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Alert, Glyphicon, Button } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Select2 from 'react-select2-wrapper';
import { grep, conf, save } from '../api';
import { diffObjects, cloneObject } from '../utils';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import '../dependencies/css/bootstrap-slider.min.css';
import 'react-select2-wrapper/css/select2.css';

class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.initialValues = {};
    this.currentValues = {};
    this.state = {
      isLoaded: false,
      isSaving: false,
      devices: [],
    };
  }

  componentWillMount() {
    conf(['recalbox.audio.devices']).then((response) => {
      this.setState({ devices: response['recalbox.audio.devices'] });
    }).catch((err) => {
      console.error(err);
    });

    grep(['audio.device', 'audio.volume', 'audio.bgmusic']).then((data) => {
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

  handleSliderChange = (e) => {
    e.target.name = 'audio.volume';
    e.target.type = 'input';

    this.handleInputChange(e);
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

    for (const [key, value] of Object.entries(this.initialValues)) {
      this.setState({ [key]: value });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t('Audio')}</h1></div>

        <p className="important">{t('Cette page permet de gérer la partie audio de recalbox.')}</p>

        <Loader loaded={this.state.isLoaded}>
          <form onSubmit={this.onSubmit}>
            <Panel header={<h3>{t('Musique de fond')}</h3>}>
              <Alert bsStyle="warning">
                <Glyphicon glyph="alert" /> <strong className="sr-only">{t('Attention :')}</strong>
                {t('Cette modification nécessite de redémarrer EmulationStation pour être prise en compte.')}
              </Alert>

              <Switch name="audio.bgmusic" onChange={this.handleSwitchChange}
                value={1 === parseInt(this.state['audio.bgmusic'], 10)} />
            </Panel>

            <Panel header={<h3>{t('Volume du son')}</h3>}>
              <div className="top30">
                <ReactBootstrapSlider slideStop={this.handleSliderChange}
                  value={parseInt(this.state['audio.volume'], 10)}
                  step={1} max={100} min={0} tooltip="always"
                />
              </div>
            </Panel>

            <Panel header={<h3>{t('Sortie audio')}</h3>}>
              <Select2 name="audio.device" data={this.state.devices}
                defaultValue={this.state['audio.device']} onChange={this.handleInputChange} />
            </Panel>

            <p>
              <Button bsStyle="danger" onClick={this.reset}>{t('Annuler')}</Button>{" "}
              <Button bsStyle="success" type="submit" disabled={this.state.isSaving}>
                {this.state.isSaving &&
                  <span className="glyphicon glyphicon-refresh glyphicon-spin"></span>
                } {t('Enregistrer')}
              </Button>
            </p>
          </form>
        </Loader>
      </div>
    );
  }
}

export default translate()(Audio);
