import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loader from 'react-loader';
import Form from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import FieldGroup from '../utils/FieldGroup';
import StickyAlert from '../utils/StickyAlert';
import LogsForm from '../forms/Logs';

let stickyContainer;

const Logs = ({
  t,
  loaded,
  stickyContent,
  loadingFile,
  loadedFile,
  readFile,
  ...rest,
}) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header">
      <h1>{t('Logs')}</h1>
    </div>

    <StickyAlert bsStyle="danger" container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <Loader loaded={loaded}>
      <LogsForm {...rest} />
    </Loader>

    <Loader loaded={!loadingFile}>
      {readFile &&
        <Form>
          <Panel header={
            <h3>
              {t('Fichier en cours de visualisation :')}{' '}
              <strong>{loadedFile}</strong>
            </h3>
          }>
            <FieldGroup id="read-file" name="readFile"
              componentClass="textarea" rows={28}
              componentColMd={12}
              defaultValue={readFile}
            />
          </Panel>
        </Form>
      }
    </Loader>
  </div>
);

Logs.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  stickyContent: PropTypes.string,
  loadingFile: PropTypes.bool.isRequired,
  loadedFile: PropTypes.string,
  readFile: PropTypes.string,
};

export default translate()(Logs);
