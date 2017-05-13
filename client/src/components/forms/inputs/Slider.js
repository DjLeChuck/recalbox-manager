import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'react-form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ReactBootstrapSlider from 'react-bootstrap-slider';

import '../../../dependencies/css/bootstrap-slider.min.css';

const SliderInput = ({
  field,
  showErrors,
  errorBefore,
  isForm,
  noTouch,
  id,
  label,
  extraClass,
  ...rest
}) => (
  <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore}
    isForm={isForm}>
    {({ getValue, setValue }) => (
      <FormGroup controlId={id} className={extraClass}>
      {label &&
        <Col componentClass={ControlLabel} md={4}>{label}</Col>
      }
        <Col md={6}>
          <ReactBootstrapSlider {...rest} id={id}
            value={parseInt(getValue(), 10)}
            slideStop={e => setValue(e.target.value, noTouch)} />
        </Col>
      </FormGroup>
    )}
  </FormInput>
);

SliderInput.propTypes = {
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
  extraClass: PropTypes.string,
};

SliderInput.defaultProps = {
  showErrors: true,
  errorBefore: false,
  isForm: true,
};

export default SliderInput;
