import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'react-form';
import Alert from 'react-bootstrap/lib/Alert';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const SimpleInput = ({
  field,
  showErrors,
  errorBefore,
  isForm,
  noTouch,
  id,
  label,
  warning,
  labelColMd,
  componentColMd,
  ...rest
}) => (
  <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore}
    isForm={isForm}>
    {({ getValue, setValue, getTouched, getError }) => {
      const showAnyErrors = showErrors &&
                            (isForm ? getTouched() === true : true);
      const hasError = showAnyErrors && getTouched() && getError();

      return (
        <div>
          {warning &&
            <Alert bsStyle="warning">
              <Glyphicon glyph="alert" />{' '}
              {warning}
            </Alert>
          }
          <FormGroup controlId={id} validationState={hasError ? 'error' : null}>
            {label &&
              <Col componentClass={ControlLabel} md={labelColMd || 4}>
                {label}
              </Col>
            }
            <Col md={componentColMd || 6}>
              <FormControl
                {...rest} value={getValue('')}
                onChange={e => setValue(e.target.value, noTouch)}
              />
            </Col>
          </FormGroup>
        </div>
      );
    }}
  </FormInput>
);

SimpleInput.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  showErrors: PropTypes.bool.isRequired,
  errorBefore: PropTypes.bool.isRequired,
  isForm: PropTypes.bool.isRequired,
  noTouch: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  warning: PropTypes.node,
  labelColMd: PropTypes.number,
  componentColMd: PropTypes.number,
};

SimpleInput.defaultProps = {
  showErrors: true,
  errorBefore: false,
  isForm: true,
};

export default SimpleInput;
