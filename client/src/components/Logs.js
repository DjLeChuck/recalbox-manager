import React from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Button, FormControl, Col } from 'react-bootstrap';
import { conf, get } from '../api';

class Logs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      loadingFile: false,
    };
  }

  componentWillMount() {
    conf(['recalbox.logsPaths']).then((response) => {
      response.isLoaded = true;

      this.setState(response);
    }).catch((err) => {
      console.error(err);
    });
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

    get('readFile', this.state.log_file).then((response) => {
      response.loadingFile = false;

      this.setState(response);
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t("Logs")}</h1></div>

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
          <div>
            <p className="bg-info">
              {t("Fichier en cours de visualisation :")}{' '}
              <strong>{this.state.log_file}</strong>
            </p>

            <FormControl componentClass="textarea" rows={25}
              defaultValue={this.state.readFile}
            />
          </div>
        }
      </Loader>
      </div>
    );
  }
}

export default translate()(Logs);
