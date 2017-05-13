import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'react-form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select2 from 'react-select2-wrapper';

import 'react-select2-wrapper/css/select2.css';

const SelectInput = ({
  field,
  showErrors,
  errorBefore,
  isForm,
  noTouch,
  id,
  label,
  preComponent,
  ...rest
}) => (
  <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore}
    isForm={isForm}>
    {({ getValue, setValue }) => (
      <div>
        {preComponent}
        <FormGroup controlId={id}>
        {label &&
          <Col componentClass={ControlLabel} md={4}>{label}</Col>
        }
          <Col md={6}>
            <Select2 {...rest} id={id} style={{ width: '100%' }}
              defaultValue={getValue()}
              onChange={e => setValue(e.target.value, noTouch)} />
          </Col>
        </FormGroup>
      </div>
    )}
  </FormInput>
);

SelectInput.propTypes = {
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
  preComponent: PropTypes.node,
};

SelectInput.defaultProps = {
  showErrors: true,
  errorBefore: false,
  isForm: true,
};

export default SelectInput;
