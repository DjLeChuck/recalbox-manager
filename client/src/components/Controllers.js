import React from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Alert, Glyphicon, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Select2 from 'react-select2-wrapper';
import { grep, conf, save } from '../api';
import { diffObjects, cloneObject, FieldGroup, FormActions } from '../utils';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';
import '../dependencies/css/bootstrap-slider.min.css';
import 'react-select2-wrapper/css/select2.css';

class Controllers extends React.Component {
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
    conf(['recalbox.controllers.ps3drivers']).then((response) => {
      this.setState({ ps3drivers: response['recalbox.controllers.ps3drivers'] });
    }).catch((err) => {
      console.error(err);
    });

    grep([
      'controllers.db9.enabled',
      'controllers.db9.args',
      'controllers.gamecon.enabled',
      'controllers.gamecon.args',
      'controllers.gpio.enabled',
      'controllers.gpio.args',
      'controllers.ps3.enabled',
      'controllers.ps3.driver',
      'controllers.xboxdrv.enabled',
      'controllers.xboxdrv.nbcontrols',
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

  handleSliderChange = (e) => {
    e.target.name = 'controllers.xboxdrv.nbcontrols';
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
        <div className="page-header"><h1>{t('Contrôleurs')}</h1></div>

        <p className="important">{t('Cette page permet de gérer les différents contrôleurs supportés par de recalbox.')}</p>

        <Loader loaded={this.state.isLoaded}>
          <Form horizontal onSubmit={this.onSubmit}>
            <Panel header={<h3>{t('Contrôleur DB9')}</h3>}>
              <FormGroup>
                <Col componentClass={ControlLabel} md={4}>
                  {t('Support des contrôleurs DB9')}
                </Col>

                <Col md={8}>
                  <Switch name="controllers.db9.enabled"
                    onChange={this.handleSwitchChange}
                    value={1 === parseInt(this.state['controllers.db9.enabled'], 10)} />
                </Col>
              </FormGroup>

              <FieldGroup type="text" label={t('Paramètres')}
                id="db9-args" name="controllers.db9.args"
                value={this.state['controllers.db9.args']}
                onChange={this.handleInputChange} />
            </Panel>

            <Panel header={<h3>{t('Contrôleur Gamecon')}</h3>}>
              <FormGroup>
                <Col componentClass={ControlLabel} md={4}>
                  {t('Support des contrôleurs Gamecon')}
                </Col>

                <Col md={8}>
                  <Switch name="controllers.gamecon.enabled"
                    onChange={this.handleSwitchChange}
                    value={1 === parseInt(this.state['controllers.gamecon.enabled'], 10)} />
                </Col>
              </FormGroup>

              <FieldGroup type="text" label={t('Paramètres')}
                id="gamecon-args" name="controllers.gamecon.args"
                value={this.state['controllers.gamecon.args']}
                onChange={this.handleInputChange} />
            </Panel>

            <Panel header={<h3>{t('Contrôleur GPIO')}</h3>}>
              <FormGroup>
                <Col componentClass={ControlLabel} md={4}>
                  {t('Support des contrôleurs GPIO')}
                </Col>

                <Col md={8}>
                  <Switch name="controllers.gpio.enabled"
                    onChange={this.handleSwitchChange}
                    value={1 === parseInt(this.state['controllers.gpio.enabled'], 10)} />
                </Col>
              </FormGroup>

              <FieldGroup type="text" label={t('Paramètres')}
                id="gpio-args" name="controllers.gpio.args"
                value={this.state['controllers.gpio.args']}
                onChange={this.handleInputChange} />
            </Panel>

            <Panel header={<h3>{t('Contrôleur PS3')}</h3>}>
              <FormGroup>
                <Col componentClass={ControlLabel} md={4}>
                  {t('Support des contrôleurs PS3')}
                </Col>

                <Col md={8}>
                  <Switch name="controllers.ps3.enabled"
                    onChange={this.handleSwitchChange}
                    value={1 === parseInt(this.state['controllers.ps3.enabled'], 10)} />
                </Col>
              </FormGroup>

              <FormGroup controlId="ps3-driver">
                <Col componentClass={ControlLabel} md={4}>
                  {t('Driver à utiliser')}
                </Col>
                <Col md={6}>
                  <Select2 id="ps3-driver" name="controllers.ps3.driver"
                    data={this.state.ps3drivers}
                    defaultValue={this.state['controllers.ps3.driver']}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </FormGroup>
            </Panel>

            <Panel header={<h3>{t('Contrôleur XBOX')}</h3>}>
              <FormGroup>
                <Col componentClass={ControlLabel} md={4}>
                  {t('Support des contrôleurs XBOX')}
                </Col>

                <Col md={8}>
                  <Switch name="controllers.xboxdrv.enabled"
                    onChange={this.handleSwitchChange}
                    value={1 === parseInt(this.state['controllers.xboxdrv.enabled'], 10)} />
                </Col>
              </FormGroup>

              <FormGroup controlId="ps3-driver">
                <Col componentClass={ControlLabel} md={4}>
                  {t('Nombre des contrôleurs')}
                </Col>
                <Col md={6}>
                  <ReactBootstrapSlider slideStop={this.handleSliderChange}
                    value={parseInt(this.state['controllers.xboxdrv.nbcontrols'], 10)}
                    step={1} max={4} min={0} tooltip="always"
                    tooltip_position="bottom"
                  />
                </Col>
              </FormGroup>
            </Panel>

            <FormActions t={t} reset={this.reset} isSaving={this.state.isSaving} />
          </Form>
        </Loader>
      </div>
    );
  }
}

export default translate()(Controllers);
