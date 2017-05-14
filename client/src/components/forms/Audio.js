import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import set from 'lodash.set';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Panel from 'react-bootstrap/lib/Panel';
import FormActions from './FormActions';
import SwitchInput from './inputs/Switch';
import SliderInput from './inputs/Slider';
import SelectInput from './inputs/Select';

const getDefaultValues = (values) => {
  const result = {};

  for (const key of Object.keys(values)) {
    set(result, key, values[key]);
  }

  return result;
};

const AudioForm = ({ t, saving, onSubmit, defaultValues, dataset }) => (
  <Form
    onSubmit={values => onSubmit(values)}
    defaultValues={getDefaultValues(defaultValues)}
  >
    {({ submitForm, resetForm, getValue }) => (
      <BootstrapForm onSubmit={submitForm}>
        <Panel header={<h3>{t('Musique de fond')}</h3>}>
          <SwitchInput id="audio-bgmusic" field="audio.bgmusic"
            getValue={getValue}
            warning={t('Cette modification nécessite de redémarrer EmulationStation pour être prise en compte.')}
          />
        </Panel>

        <Panel header={<h3>{t('Volume du son')}</h3>}>
          <SliderInput id="audio-volume" field="audio.volume"
            step={1} max={100} min={0} tooltip="always" extraClass="top30"
          />
        </Panel>

        <Panel header={<h3>{t('Sortie audio')}</h3>}>
          <SelectInput id="ps3-driver" field="audio.device"
            data={dataset.audioDevices} />
        </Panel>

        <FormActions resetForm={resetForm} saving={saving} />
      </BootstrapForm>
    )}
  </Form>
);

AudioForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  dataset: PropTypes.object,
};

export default translate()(AudioForm);
