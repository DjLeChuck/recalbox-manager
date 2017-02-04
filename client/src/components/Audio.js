import React from 'react';
import { Link } from 'react-router';
import Loader from 'react-loader';
import { Panel, Alert, Glyphicon, Button } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Select2 from 'react-select2-wrapper';
import { grep, conf, save } from '../api';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import '../dependencies/css/bootstrap-slider.min.css';
import 'react-select2-wrapper/css/select2.css';

class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.initialValues = {};
    this.currentValues = {};
    this.state = {
      loaded: false,
      devices: [],
    };
  }

  componentWillMount() {
    conf(['recalbox.audio.devices']).then((response) => {
      this.setState({ devices: response['recalbox.audio.devices'] });
    }).catch((err) => {
      console.error(err);
    });

    grep(['audio.device', 'audio.volume', 'audio.bgmusic']).then((response) => {
      for (const [key, data] of Object.entries(response.data)) {
        this.initialValues[key] = data.value;
      };

      let newState = this.initialValues;
      newState.loaded = true;

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
        value: newState,
      }
    });
  }

  handleSliderChange = (e, i, j) => {
    e.target.name = 'audio.volume';
    e.target.type = 'input';

    this.handleInputChange(e);
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.currentValues[name] = value;
  }

  onSubmit = (e) => {
    e.preventDefault();

    let newValues = Object.assign({}, this.initialValues, this.currentValues);
    let diff = {};

    for (const [key, value] of Object.entries(newValues)) {
      if (this.initialValues[key] !== value) {
        diff[key] = value;
      }
    }

    if (0 < Object.keys(diff).length) {
      save(diff).then((data) => {
        console.log(data);
      });
    }
  }

  render() {
    return (
      <div>
        <div className="page-header"><h1>Audio</h1></div>

        <p className="important">Cette page permet de gérer la partie audio de recalbox.</p>

        <Loader loaded={this.state.loaded}>
          <form onSubmit={this.onSubmit}>
            <Panel header={<h3>Musique de fond</h3>}>
              <Alert bsStyle="warning">
                <Glyphicon glyph="alert" /> <strong className="sr-only">Attention :</strong>
                Cette modification nécessite de redémarrer EmulationStation pour être prise en compte.
              </Alert>

              <Switch name="audio.bgmusic" defaultValue={'1' === this.state['audio.bgmusic']}
                onChange={this.handleSwitchChange} />
            </Panel>

            <Panel header={<h3>Volume du son</h3>}>
              <div className="top30">
                <ReactBootstrapSlider
                  slideStop={this.handleSliderChange} value={parseInt(this.state['audio.volume'], 10)}
                  step={1} max={100} min={0} tooltip="always"
                />
              </div>
            </Panel>

            <Panel header={<h3>Sortie audio</h3>}>
              <Select2 name="audio.device" data={this.state.devices}
                defaultValue={this.state['audio.device']} onChange={this.handleInputChange} />
            </Panel>

            <p>
              <Link to="/audio" className="btn btn-danger">Annuler</Link>{" "}
              <Button bsStyle="success" type="submit">Enregistrer</Button>
            </p>
          </form>
        </Loader>
      </div>
    );
  }
}

export default Audio;
