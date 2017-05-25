import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import SelectInput from './inputs/OnlySelect';

const LogsForm = ({ t, onSubmit, dataset }) => (
  <Form onSubmit={values => onSubmit(values)}>
    {({ submitForm }) => (
      <BootstrapForm onSubmit={submitForm}>
        <Panel header={<h3>{t('Fichiers de logs')}</h3>}>
          <Col md={8}>
            <SelectInput field="filePath" data={dataset.logsPaths} />
          </Col>
          <Col md={4}>
            <Button bsStyle="success" type="submit">
              {t('Voir')}
            </Button>
          </Col>
        </Panel>
      </BootstrapForm>
    )}
  </Form>
);

LogsForm.propTypes = {
  t: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  dataset: PropTypes.object,
};

export default translate()(LogsForm);
