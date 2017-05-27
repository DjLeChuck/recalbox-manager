import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import Loader from 'react-loader';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

const RomsList = ({ t, loaded, directoryListing, esSystems }) => (
  <div>
    <div className="page-header">
      <h1>{t('Gestion des ROMs')}</h1>
    </div>

    <Loader loaded={loaded}>
      <Row className="is-flex">
        {directoryListing.map((system, index) => {
          const systemData = esSystems.find(x => x.name === system);
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

RomsList.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  directoryListing: PropTypes.array.isRequired,
  esSystems: PropTypes.array.isRequired,
};

export default translate()(RomsList);
