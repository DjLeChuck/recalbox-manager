import React from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Form } from 'react-bootstrap';
import { conf, post, get } from '../api';
import { diffObjects, cloneObject } from '../utils';
import FieldGroup from './utils/FieldGroup';
import FormActions from './utils/FormActions';

class RecalboxConf extends React.Component {
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
    conf(['recalbox.confPath']).then((response) => {
      get('readFile', response['recalbox.confPath']).then((data) => {
        this.initialValues = Object.assign({}, data, response);
        let newState = this.initialValues;
        newState.isLoaded = true;

        this.setState(newState);
      }).catch((err) => {
        console.error(err);
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.currentValues[name] = value;
    this.setState({ [name]: value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    let diff = diffObjects(this.initialValues, this.currentValues);

    if (0 < Object.keys(diff).length) {
      this.setState({ isSaving: true });

      post('writeFile', {
        file: this.state['recalbox.confPath'],
        data: this.state.readFile
      }).then((data) => {
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
        <div className="page-header"><h1>recalbox.conf</h1></div>

        <div className="bs-callout bs-callout-info">
          <p>
            {t("Si jamais les autres vues ne suffisent pas, le contenu du fichier recalbox.conf peut-être entièrement vu et modifié via cette interface.")}
          </p>
        </div>

        <Loader loaded={this.state.isLoaded}>
          <Form onSubmit={this.onSubmit}>
            <Panel header={
              <h3>
                {t("Chemin d'accès :")}{' '}
                <strong>{this.state['recalbox.confPath']}</strong>
              </h3>
            }>
              <FieldGroup id="read-file" name="readFile"
                componentClass="textarea" rows={28}
                componentColMd={12}
                value={this.state.readFile}
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

export default translate()(RecalboxConf);
