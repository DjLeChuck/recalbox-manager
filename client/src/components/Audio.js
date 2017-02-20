import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import Form from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import { grep, translatableConf, save } from '../api';
import { diffObjects, cloneObject, promisifyData, cancelPromises } from '../utils';
import SelectGroup from './utils/SelectGroup';
import SliderGroup from './utils/SliderGroup';
import SwitchGroup from './utils/SwitchGroup';
import FormActions from './utils/FormActions';

class Audio extends React.Component {
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
      translatableConf(['recalbox.audio.devices']),
      grep(['audio.device', 'audio.volume', 'audio.bgmusic'])
    );

    this.initialValues = state;
    state.isLoaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
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
                data={this.state['recalbox.audio.devices']}
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
