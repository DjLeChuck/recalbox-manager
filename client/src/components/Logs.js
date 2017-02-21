import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Panel from 'react-bootstrap/lib/Panel';
import FieldGroup from './utils/FieldGroup';
import StickyAlert from './utils/StickyAlert';
import { conf, get } from '../api';
import { promisifyData, cancelPromises } from '../utils';

class Logs extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      loadingFile: false,
      stickyContent: null,
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      conf(['recalbox.logsPaths'])
    );

    state.isLoaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  handleInputChange = (e) => {
    const target = e.target;

    this.setState({ [target.name]: target.value });
  }

  onClick = (e) => {
    e.preventDefault();

    if (!this.state.log_file) {
      return;
    }

    this.setState({ loadingFile: true });

    get('readFile', `file=${this.state.log_file}`).then((response) => {
      response.loadingFile = false;
      response.loadedFile = this.state.log_file;

      this.setState(response);
    }).catch((err) => {
      this.setState({
        stickyContent: err.message,
      });
    });
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t("Logs")}</h1></div>

        <StickyAlert bsStyle="danger" container={this}>
          {this.state.stickyContent}
        </StickyAlert>

        <Loader loaded={this.state.isLoaded}>
          <Panel header={<h3>{t('Fichiers de logs')}</h3>}>
            <Col md={8}>
              <FormControl componentClass="select" name="log_file"
                onChange={this.handleInputChange}>
                <option>–</option>
                {this.state['recalbox.logsPaths'] && this.state['recalbox.logsPaths'].map((log) => {
                  return <option key={log} value={log}>{log}</option>
                })}
              </FormControl>
            </Col>
            <Col md={4}>
              <Button bsStyle="success" onClick={this.onClick}>
                {t('Voir')}
              </Button>
            </Col>
          </Panel>
        </Loader>

        <Loader loaded={!this.state.loadingFile}>
        {this.state.readFile &&
          <Form>
            <Panel header={
              <h3>
                {t("Fichier en cours de visualisation :")}{' '}
                <strong>{this.state.loadedFile}</strong>
              </h3>
            }>
              <FieldGroup id="read-file" name="readFile"
                componentClass="textarea" rows={28}
                componentColMd={12}
                defaultValue={this.state.readFile}
              />
            </Panel>
          </Form>
        }
      </Loader>
      </div>
    );
  }
}

export default translate()(Logs);
