import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import Form from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import { conf, post, get } from '../api';
import { diffObjects, cloneObject } from '../utils';
import FieldGroup from './utils/FieldGroup';
import FormActions from './utils/FormActions';
import StickyAlert from './utils/StickyAlert';

class RecalboxConf extends React.Component {
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
      stickyContent: null,
      stickyStyle: 'danger',
    };
  }

  componentWillMount() {
    conf(['recalbox.confPath']).then((response) => {
      get('readFile', `file=${response['recalbox.confPath']}`).then((data) => {
        this.initialValues = Object.assign({}, data, response);
        let newState = this.initialValues;
        newState.isLoaded = true;

        this.setState(newState);
      }, (err) => {
        this.setState({
          stickyContent: err.message,
          stickyStyle: 'danger',
        });
      });
    }, (err) => {
      this.setState({
        stickyContent: err.message,
        stickyStyle: 'danger',
      });
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
      }).then(() => {
        this.initialValues = cloneObject(this.currentValues);

        this.setState({
          isSaving: false,
          stickyContent: this.props.t('Le fichier a bien été sauvegardé.'),
          stickyStyle: 'success',
        });
      }, () => {
        this.setState({
          isSaving: false,
          stickyContent: this.props.t("Il semble que votre fichier n'ait pas été sauvegardé."),
          stickyStyle: 'danger',
        });
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

        <StickyAlert bsStyle={this.state.stickyStyle} container={this}>
          {this.state.stickyContent}
        </StickyAlert>

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
