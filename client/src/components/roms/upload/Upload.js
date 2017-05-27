import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Collapse from 'react-bootstrap/lib/Collapse';
import Well from 'react-bootstrap/lib/Well';
import CustomDropzone from '../../utils/Dropzone';

const RomsUpload = ({ t, open, onClick, onSuccess, dzParams }) => (
  <div>
    <Button bsStyle="primary" onClick={onClick}>
      {t('Uploader des ROMs')}
    </Button>{' '}
    <Collapse in={open}>
      <div>
        <Well>
          <CustomDropzone type="roms" params={dzParams} onSuccess={onSuccess}
            dropLabel={t('Déposez ici les ROMs à uploader.')}
          />
      </Well>
    </div>
    </Collapse>
  </div>
);

RomsUpload.propTypes = {
  t: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  dzParams: PropTypes.object,
};

RomsUpload.defaultProps = {
  onClick: () => {},
  onSuccess: () => {},
};

export default translate()(RomsUpload);
