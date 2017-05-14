import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'react-form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';

const simpleInput = ({
  field,
  showErrors,
  errorBefore,
  isForm,
  noTouch,
  id,
  label,
  labelColMd,
  componentColMd,
  ...rest
}) => (
  <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore}
    isForm={isForm}>
    {({ getValue, setValue }) => (
      <FormGroup controlId={id}>
        {label &&
          <Col componentClass={ControlLabel} md={labelColMd || 4}>
            {label}
          </Col>
        }
        <Col md={componentColMd || 6}>
          <FormControl {...rest} value={getValue()}
            onChange={e => setValue(e.target.value, noTouch)} />
        </Col>
      </FormGroup>
    )}
  </FormInput>
);

simpleInput.propTypes = {
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
  labelColMd: PropTypes.number,
  componentColMd: PropTypes.number,
};

simpleInput.defaultProps = {
  showErrors: true,
  errorBefore: false,
  isForm: true,
};

export default simpleInput;
