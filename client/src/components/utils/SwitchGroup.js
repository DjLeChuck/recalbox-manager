import React from 'react';
import { FormGroup, ControlLabel, Col, Alert, Glyphicon } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

class SwitchGroup extends React.Component {
  render() {
    return (
      <FormGroup controlId={this.props.id}>
      {this.props.warning &&
        <Alert bsStyle="warning">
          <Glyphicon glyph="alert" />{' '}
          {this.props.warning}
        </Alert>
      }
      {this.props.label &&
        <Col componentClass={ControlLabel} md={4}>{this.props.label}</Col>
      }
        <Col md={6}><Switch {...this.props} /></Col>
      </FormGroup>
    );
  }
}

export default SwitchGroup;
