import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select2 from 'react-select2-wrapper';
import { cloneObject } from '../../utils';

import 'react-select2-wrapper/css/select2.css';

class SelectGroup extends Component {
  static propTypes = {
    preComponent: PropTypes.node,
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
  };

  render() {
    let selectProps = cloneObject(this.props);

    delete selectProps.preComponent;
    delete selectProps.label;

    return (
      <div>
        {this.props.preComponent}
        <FormGroup controlId={this.props.id}>
        {this.props.label &&
          <Col componentClass={ControlLabel} md={4}>{this.props.label}</Col>
        }
          <Col md={6}>
            <Select2 {...selectProps} style={{ width: '100%' }} />
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default SelectGroup;
