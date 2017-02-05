import React from 'react';
import { FormGroup, ControlLabel, Col, Alert, Glyphicon } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import { cloneObject } from '../../utils';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

class SwitchGroup extends React.Component {
  render() {
    const switchValue = 1 === parseInt(this.props.value, 10);
    let switchProps = cloneObject(this.props);

    delete switchProps.warning;
    delete switchProps.value;
    delete switchProps.help;

    return (
      <div>
        {this.props.help}
      {this.props.warning &&
        <Alert bsStyle="warning">
          <Glyphicon glyph="alert" />{' '}
          {this.props.warning}
        </Alert>
      }
        <FormGroup controlId={this.props.id}>
        {this.props.label &&
          <Col componentClass={ControlLabel} md={4}>{this.props.label}</Col>
        }
          <Col md={6}>
            <Switch {...switchProps} value={switchValue} />
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default SwitchGroup;
