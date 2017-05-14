import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import { getDefaultValues } from './utils';
import FormActions from './FormActions';
import SwitchInput from './inputs/Switch';
import SelectInput from './inputs/Select';
import SimpleInput from './inputs/Simple';

const ControllersForm = ({ t, saving, onSubmit, defaultValues, dataset }) => (
  <Form
    onSubmit={values => onSubmit(values)}
    defaultValues={getDefaultValues(defaultValues)}
  >
    {({ submitForm, resetForm }) => (
      <BootstrapForm horizontal onSubmit={submitForm}>
        <Panel header={<h3>{t('Contrôleur DB9')}</h3>}>
          <SwitchInput id="db9-enabled" field="controllers.db9.enabled"
            label={t('Support des contrôleurs DB9')}
          />

          <SimpleInput id="db9-args" field="controllers.db9.args"
            label={t('Paramètres')}
          />
        </Panel>

        <Panel header={<h3>{t('Contrôleur Gamecon')}</h3>}>
          <SwitchInput id="gamecon-enabled" field="controllers.gamecon.enabled"
            label={t('Support des contrôleurs Gamecon')}
          />

          <SimpleInput id="gamecon-args" field="controllers.gamecon.args"
            label={t('Paramètres')}
          />
        </Panel>

        <Panel header={<h3>{t('Contrôleur GPIO')}</h3>}>
          <SwitchInput id="gpio-enabled" field="controllers.gpio.enabled"
            label={t('Support des contrôleurs GPIO')}
          />

          <SimpleInput id="gpio-args" field="controllers.gpio.args"
            label={t('Paramètres')}
          />
        </Panel>

        <Panel header={<h3>{t('Contrôleur PS3')}</h3>}>
          <SwitchInput id="ps3-enabled" field="controllers.ps3.enabled"
            label={t('Support des contrôleurs PS3')}
          />

          <SelectInput id="ps3-driver" field="controllers.ps3.driver"
            label={t('Driver à utiliser')} data={dataset.ps3Drivers}
          />
        </Panel>

        <FormActions resetForm={resetForm} saving={saving} />
      </BootstrapForm>
    )}
  </Form>
);

ControllersForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  dataset: PropTypes.object,
};

export default translate()(ControllersForm);
