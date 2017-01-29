import React from 'react';
import { Link } from 'react-router';
import { Panel, Alert, Glyphicon, Button } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Select2 from 'react-select2-wrapper';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import '../dependencies/css/bootstrap-slider.min.css';
import 'react-select2-wrapper/css/select2.css';

class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="page-header"><h1>Audio</h1></div>

        <p className="important">Cette page permet de gérer la partie audio de recalbox.</p>

        <form>
          <Panel header={<h3>Musique de fond</h3>}>
            <Alert bsStyle="warning">
              <Glyphicon glyph="alert" /> <strong className="sr-only">Attention :</strong>
              Cette modification nécessite de redémarrer EmulationStation pour être prise en compte.
            </Alert>

            <Switch defaultValue={true} />
          </Panel>

          <Panel header={<h3>Volume du son</h3>}>
            <div className="top30">
              <ReactBootstrapSlider value={this.state.currentValue}
                change={this.changeValue} slideStop={this.changeValue}
                step={1} max={100} min={0} tooltip="always"
              />
            </div>
          </Panel>

          <Panel header={<h3>Sortie audio</h3>}>
            <Select2 data={[42, 43, 44]} />
          </Panel>

          <p>
            <Link to="/audio" className="btn btn-danger">Annuler</Link>{" "}
             <Button bsStyle="success">Enregistrer</Button>
          </p>
        </form>
      </div>
    );
  }
}

export default Audio;
