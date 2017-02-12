import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Glyphicon, Panel, Row, Col } from 'react-bootstrap';
import { get } from '../../api';

class List extends React.Component {
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

  componentWillMount() {
    const promises = [];

    promises.push(get('directoryListing'));
    promises.push(get('esSystems'));

    Promise.all(promises).then((values) => {
      let newState = { isLoaded: true };

      for (const value of values) {
        Object.assign(newState, value);
      }

      this.setState(newState);
    }).catch((err) => {
      console.error(err);
    });
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
