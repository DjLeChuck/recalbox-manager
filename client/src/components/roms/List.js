import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import { get } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';

class List extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      directoryListing: [],
      esSystems: [],
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      get('directoryListing'),
      get('esSystems')
    );

    state.isLoaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t('Gestion des ROMs')}</h1></div>

        <Loader loaded={this.state.isLoaded}>
          <Row className="is-flex">
            {this.state.directoryListing.map((system, index) => {
              const systemData = this.state.esSystems.find((s) => {
                return s.name === system;
              });
              const fullName = systemData ? systemData.fullname : system;

              return (
                <Col key={index} lg={2} md={3} xs={6}>
                  <Panel className="text-center">
                    <Link to={`/roms/${system}`}>
                      <Glyphicon glyph="folder-open" className="big-glyphicon" />
                      <br />
                      {fullName}
                    </Link>
                  </Panel>
                </Col>
              );
            })}
          </Row>
        </Loader>
      </div>
    );
  }
}

export default translate()(List);
