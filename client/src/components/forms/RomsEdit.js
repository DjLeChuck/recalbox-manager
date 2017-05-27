import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Form } from 'react-form';
import Button from 'react-bootstrap/lib/Button';
import BootstrapForm from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Clearfix from 'react-bootstrap/lib/Clearfix';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Row from 'react-bootstrap/lib/Row';
import { getDefaultValues } from './utils';
import FormActions from './FormActions';
import SimpleInput from './inputs/Simple';
import SelectInput from './inputs/OnlySelect';
import RateInput from './inputs/Rate';
import CustomDropzone from '../utils/Dropzone';

// Selects de date de jeu
const days = [];
const months = [];

for (let x = 1; x < 32; x++) {
  const value = `0${x}`.slice(-2);

  days.push({
    id: value,
    text: value,
  });
}

for (let x = 1; x < 13; x++) {
  const value = `0${x}`.slice(-2);

  months.push({
    id: value,
    text: value,
  });
}

const RomsEditForm = ({
  t,
  saving,
  onSubmit,
  defaultValues,
  close,
  rom: { image, name, path },
  dzParams,
  onImageUpload,
}) => (
  <Form
    onSubmit={values => onSubmit(values)}
    defaultValues={getDefaultValues(defaultValues)}
  >
    {({ submitForm, resetForm }) => (
      <BootstrapForm horizontal onSubmit={submitForm}>
        <Col md={4}>
          {image &&
            <img src={`/viewer/roms/${image}`} alt={name}
              style={{ marginBottom: 10 }}
              className="img-responsive img-thumbnail" />
          }
          {!image &&
            <Glyphicon glyph="picture"
              className="big-glyphicon rom-image" />
          }

          <div className="dropzone-image-upload">
            <CustomDropzone type="romImage"
              params={dzParams}
              onSuccess={({ image }) => onImageUpload(path, image)}
              dropLabel={t('Nouvelle image')}
            />
          </div>
        </Col>
        <Col md={8}>
          <SimpleInput id="name" field="name" label={t('Nom')}
            labelColMd={3} componentColMd={9} />

          <SimpleInput id="publisher" field="publisher" label={t('Éditeur')}
            labelColMd={3} componentColMd={9} />

          <SimpleInput id="developer" field="developer" label={t('Développeur')}
            labelColMd={3} componentColMd={9} />
        </Col>

        <Col md={12}>
          <FormGroup>
            <Row>
              <Col componentClass={ControlLabel} md={3}>
                {t('Date de sortie')}
              </Col>
              <Col md={9}>
                <Col xs={3}>
                  <SelectInput id="releasedate-day" field="releasedate.day"
                    data={days}
                  />
                </Col>
                <Col xs={4}>
                  <SelectInput id="releasedate-month" field="releasedate.month"
                    data={months}
                  />
                </Col>
                <Col xs={5}>
                  <SimpleInput type="number" id="releasedate-year"
                    field="releasedate.year" componentColMd={12} />
                </Col>
              </Col>
            </Row>
          </FormGroup>
        </Col>

        <Col md={6}>
          <SimpleInput id="genre" field="genre" label={t('Genre')}
            labelColMd={3} componentColMd={9} />
        </Col>
        <Col md={6}>
          <SimpleInput id="players" field="players" label={t('Joueurs')}
            labelColMd={3} componentColMd={9} />
        </Col>

        <Col md={12}>
          <FormGroup controlId="rating">
            <Col componentClass={ControlLabel} md={3}>{t('Note')}</Col>
            <Col md={9}>
              <RateInput field="rating" />
            </Col>
          </FormGroup>
        </Col>

        <Col md={12}>
          <SimpleInput id="desc" field="desc" label={t('Description')}
            componentClass="textarea" rows={10}
            labelColMd={3} componentColMd={9}
          />
        </Col>
        <Clearfix />

        {close && <Button onClick={close}>{t('Fermer')}</Button>}
        <FormActions resetForm={resetForm} saving={saving} />
      </BootstrapForm>
    )}
  </Form>
);

RomsEditForm.propTypes = {
  t: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  close: PropTypes.func,
  rom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  dzParams: PropTypes.object,
  onImageUpload: PropTypes.func.isRequired,
};

RomsEditForm.defautProps = {
  onImageUpload: () => {},
};

export default translate()(RomsEditForm);
