import React from 'react';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select2 from 'react-select2-wrapper';

import 'react-select2-wrapper/css/select2.css';

class SelectGroup extends React.Component {
  render() {
    return (
      <FormGroup controlId={this.props.id}>
      {this.props.label &&
        <Col componentClass={ControlLabel} md={4}>{this.props.label}</Col>
      }
        <Col md={6}><Select2 {...this.props} /></Col>
      </FormGroup>
    );
  }
}

export default SelectGroup;
