import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'react-form';
import Alert from 'react-bootstrap/lib/Alert';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Switch from 'react-bootstrap-switch';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

class SwitchInput extends Component {
  static contextTypes = {
    formAPI: PropTypes.object.isRequired,
  }

  static propTypes = {
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
    help: PropTypes.node,
    warning: PropTypes.node,
  };

  static defaultProps = {
    showErrors: true,
    errorBefore: false,
    isForm: true,
  };

  constructor(props, context) {
    super(props, context);

    const { formAPI: { getValue }} = this.context;
    const { field } = this.props;

    this.state = { value: this.getBooleanValue(getValue(field)) };
  }

  getBooleanValue = value => parseInt(value, 10) ? true : false;

  render() {
    const {
      field,
      showErrors,
      errorBefore,
      isForm,
      noTouch,
      id,
      label,
      help,
      warning,
      ...rest
    } = this.props;
    const { value } = this.state;

    return (
      <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore}
        isForm={isForm}>
        {({ setValue }) => (
          <div>
            {help}
          {warning &&
            <Alert bsStyle="warning">
              <Glyphicon glyph="alert" />{' '}
              {warning}
            </Alert>
          }
            <FormGroup controlId={id}>
            {label &&
              <Col componentClass={ControlLabel} md={4}>{label}</Col>
            }
              <Col md={6}>
                <Switch {...rest} id={id} value={value}
                  onChange={(el, value) => {
                    setValue(value, noTouch);
                    this.setState({ value });
                  }} />
              </Col>
            </FormGroup>
          </div>
        )}
      </FormInput>
    );
  }
}

export default SwitchInput;
