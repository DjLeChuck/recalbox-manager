import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loader from 'react-loader';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Table from 'react-bootstrap/lib/Table';
import StickyAlert from '../utils/StickyAlert';
import Upload from './Upload';

let stickyContainer;

const Bios = ({
  t, loaded, stickyStyle, stickyContent, biosList, biosPath, onClick,
  onBiosUploaded,
}) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header"><h1>{t("BIOS")}</h1></div>

    <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <p>{t("Voici la liste de l'ensemble des BIOS supportés par recalbox.")}</p>
    <p>{t("Les fichiers se trouvent dans le répertoire suivant :")} <code>{biosPath}</code></p>
    <p>{t('Grâce à la colonne "Valide" du tableau, vous pouvez voir si les BIOS que vous possédez sont bons ou non.')}</p>

    <Upload onSuccess={onBiosUploaded} />

    <Loader loaded={loaded}>
      <Table striped hover className="table-nonfluid">
        <thead>
          <tr>
            <th className="col-md-2">{t('BIOS')}</th>
            <th className="col-md-3">{t('MD5 attendu')}</th>
            <th className="col-md-1">{t('Valide')}</th>
            <th className="col-md-1">{t('Action')}</th>
          </tr>
        </thead>
        <tbody>
        {biosList.map((item, index) => {
          let validity;
          let deletion = (
            <Button bsStyle="danger" onClick={() => onClick(item.name)}>
              <Glyphicon glyph="trash" aria-hidden="true" />
            </Button>
          );

          if (true === item.valid) {
            validity = (
              <Glyphicon glyph="ok"
                className="medium-glyphicon alert alert-success" />
            );
          } else if (false === item.valid) {
            validity = (
              <Glyphicon glyph="remove"
                className="medium-glyphicon alert alert-danger" />
              );
          } else {
            validity = (
              <Glyphicon glyph="minus"
                className="medium-glyphicon alert" />
              );
            deletion = null;
          }

          return (
            <tr key={index} data-row={index}>
              <td>{item.name}</td>
              <td>{item.md5}</td>
              <td>{validity}</td>
              <td>{deletion}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </Loader>
  </div>
);

Bios.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  biosList: PropTypes.array.isRequired,
  biosPath: PropTypes.string,
  onBiosUploaded: PropTypes.func,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
};

export default translate()(Bios);
