import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import { getDefaultValues } from './utils';
import FormActions from './FormActions';
import SimpleInput from './inputs/Simple';

const RecalboxConfForm = ({ t, saving, onSubmit, defaultValues, confPath }) => (
  <Form
    onSubmit={values => onSubmit(values)}
    defaultValues={getDefaultValues(defaultValues)}
  >
    {({ submitForm, resetForm }) => (
      <BootstrapForm horizontal onSubmit={submitForm}>
        <Panel header={
          <h3>
            {t("Chemin d'accès :")}{' '}
            <strong>{confPath}</strong>
          </h3>
        }>
          <SimpleInput id="content" field="content" rows={28}
            componentClass="textarea" componentColMd={12}
          />
        </Panel>

        <FormActions resetForm={resetForm} saving={saving} />
      </BootstrapForm>
    )}
  </Form>
);

RecalboxConfForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  confPath: PropTypes.string,
};

export default translate()(RecalboxConfForm);
