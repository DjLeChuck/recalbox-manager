import React from 'react';
import { FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';

export function diffObjects(prev, cur) {
  let newValues = Object.assign({}, prev, cur);
  let diff = {};

  for (const [key, value] of Object.entries(newValues)) {
    if (prev[key] !== value) {
      diff[key] = value;
    }
  }

  return diff;
}

export function cloneObject(obj) {
  return Object.assign({}, obj);
}

export function FieldGroup({ id, label, ...props }) {
  return (
    <FormGroup controlId={id}>
      <Col componentClass={ControlLabel} md={4}>{label}</Col>
      <Col md={6}><FormControl {...props} /></Col>
    </FormGroup>
  );
}
