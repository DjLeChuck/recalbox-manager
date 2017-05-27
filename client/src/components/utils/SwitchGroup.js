import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/lib/Alert';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Switch from 'react-bootstrap-switch';
import { cloneObject } from '../../utils';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

class SwitchGroup extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    id: PropTypes.string.isRequired,
    help: PropTypes.node,
    label: PropTypes.node,
    warning: PropTypes.node,
  };

  static defaultProps = {
    value: 0,
  };

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
