import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import BootstrapForm from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Panel from 'react-bootstrap/lib/Panel';
import SimpleInput from './inputs/Simple';

const LoginForm = ({ t, saving, onSubmit }) => (
  <Form onSubmit={values => onSubmit(values)}>
    {({ submitForm }) => (
      <BootstrapForm onSubmit={submitForm} horizontal>
        <Panel header={<h3>{t('Identifiants de connexion')}</h3>}>
          <SimpleInput id="login" field="login" label={t('Identifiant')} />
          <SimpleInput
            type="password" id="password" field="password"
            label={t('Mot de passe')}
          />

          <FormGroup>
            <Col smOffset={4} sm={8}>
              <Button bsStyle="success" type="submit" disabled={saving}>
                {saving &&
                  <Glyphicon glyph="refresh" className="glyphicon-spin" />
                } {t('Se connecter')}
              </Button>
            </Col>
          </FormGroup>
        </Panel>
      </BootstrapForm>
    )}
  </Form>
);

LoginForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default translate()(LoginForm);
