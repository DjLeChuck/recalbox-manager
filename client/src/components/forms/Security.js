import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import { getDefaultValues } from './utils';
import FormActions from './FormActions';
import SwitchInput from './inputs/Switch';
import SimpleInput from './inputs/Simple';

const SecurityForm = ({ t, saving, onSubmit, defaultValues }) => (
  <Form
    onSubmit={values => onSubmit(values)}
    defaultValues={getDefaultValues(defaultValues)}
    validate={({ needAuth, login, password }) => {
      return {
        login: needAuth && !login ? t("L'identifiant est obligatoire.") : undefined,
        password: needAuth && !password ? t("Le mot de passe est obligatoire.") : undefined,
      };
    }}
  >
    {({ submitForm, resetForm }) => (
      <BootstrapForm onSubmit={submitForm} horizontal>
        <Panel header={<h3>{t('Authentification requise')}</h3>}>
          <SwitchInput id="needAuth" field="needAuth" />
        </Panel>

        <Panel header={<h3>{t('Identifiants de connexion')}</h3>}>
          <SimpleInput id="login" field="login" label={t('Identifiant')} />
          <SimpleInput
            type="password" id="password" field="password"
            label={t('Mot de passe')}
            warning={t("Le mot de passe n'est pas visible pour des raisons de sécurité.")}
          />
        </Panel>

        <FormActions resetForm={resetForm} saving={saving} />
      </BootstrapForm>
    )}
  </Form>
);

SecurityForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};

export default translate()(SecurityForm);
