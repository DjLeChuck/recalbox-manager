import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import { cloneObject } from '../../utils';

class FieldGroup extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
    labelColMd: PropTypes.number,
    componentColMd: PropTypes.number,
  }

  render() {
    let controlProps = cloneObject(this.props);

    delete controlProps.componentColMd;
    delete controlProps.labelColMd;
    delete controlProps.label;

    return (
      <FormGroup controlId={this.props.id}>
      {this.props.label &&
        <Col componentClass={ControlLabel} md={this.props.labelColMd || 4}>
          {this.props.label}
        </Col>
      }
        <Col md={this.props.componentColMd || 6}>
          <FormControl {...controlProps} />
        </Col>
      </FormGroup>
    );
  }
}

export default FieldGroup;
