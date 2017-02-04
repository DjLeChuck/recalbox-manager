import React from 'react';
import { FormGroup, ControlLabel, FormControl, Col, Button } from 'react-bootstrap';

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

export function FormActions({ t, reset, isSaving }) {
  return (
    <p>
      <Button bsStyle="danger" onClick={reset}>{t('Annuler')}</Button>{" "}
      <Button bsStyle="success" type="submit" disabled={isSaving}>
        {isSaving &&
          <span className="glyphicon glyphicon-refresh glyphicon-spin"></span>
        } {t('Enregistrer')}
      </Button>
    </p>
  );
}
