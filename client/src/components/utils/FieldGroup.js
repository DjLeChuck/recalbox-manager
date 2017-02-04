import React from 'react';
import { FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';

class FieldGroup extends React.Component {
  render() {
    return (
      <FormGroup controlId={this.props.id}>
        <Col componentClass={ControlLabel} md={4}>{this.props.label}</Col>
        <Col md={6}><FormControl {...this.props} /></Col>
      </FormGroup>
    );
  }
}

export default FieldGroup;
