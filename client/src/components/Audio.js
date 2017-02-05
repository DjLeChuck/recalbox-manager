import React from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Form } from 'react-bootstrap';
import { grep, conf, save } from '../api';
import { diffObjects, cloneObject } from '../utils';
import SelectGroup from './utils/SelectGroup';
import SliderGroup from './utils/SliderGroup';
import SwitchGroup from './utils/SwitchGroup';
import FormActions from './utils/FormActions';

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

    this.setState(this.currentValues);
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t('Audio')}</h1></div>

        <p className="important">{t('Cette page permet de gérer la partie audio de recalbox.')}</p>

        <Loader loaded={this.state.isLoaded}>
          <Form onSubmit={this.onSubmit}>
            <Panel header={<h3>{t('Musique de fond')}</h3>}>
              <SwitchGroup
                id="audio-bgmusic" name="audio.bgmusic"
                value={this.state['audio.bgmusic']}
                onChange={this.handleSwitchChange}
                warning={t('Cette modification nécessite de redémarrer EmulationStation pour être prise en compte.')}
              />
            </Panel>

            <Panel header={<h3>{t('Volume du son')}</h3>}>
              <SliderGroup
                id="audio-volume" name="audio.volume"
                value={this.state['audio.volume']}
                slideStop={this.handleSliderChange}
                step={1} max={100} min={0}
                tooltip="always"
                extraClass="top30"
              />
            </Panel>

            <Panel header={<h3>{t('Sortie audio')}</h3>}>
              <SelectGroup
                id="ps3-driver" name="audio.device"
                data={this.state.devices}
                defaultValue={this.state['audio.device']}
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

export default translate()(Audio);
