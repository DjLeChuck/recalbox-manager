import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { Row, Col, Panel } from 'react-bootstrap';
import { get } from '../api';
import { promisifyData } from '../utils';
import gamepad from '../dependencies/img/gamepad.png';
import keyboard from '../dependencies/img/keyboard.png';

class Index extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const state = await promisifyData(
      get('hostname')
    );

    this.setState(state);
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t('Accueil')}</h1></div>

        <Row>
          <Col md={2} mdOffset={2} className="text-center">
            <Panel>
              <Link to={`//${this.state.hostname}:8080/`} target="_blank">
                <img src={gamepad} alt={t('Utiliser le gamepad virtuel')}
                  className="img-responsive center-block" />
                <br />
                <br />
                {t('Utiliser le gamepad virtuel')}
              </Link>
            </Panel>
          </Col>
          <Col md={2} mdOffset={2} className="text-center">
            <Panel>
              <Link to={`//${this.state.hostname}:8080/keyboard.html`} target="_blank">
                <img src={keyboard} alt={t('Utiliser le clavier virtuel')}
                  className="img-responsive center-block" />
                <br />
                <br />
                {t('Utiliser le clavier virtuel')}
              </Link>
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

export default translate()(Index);
