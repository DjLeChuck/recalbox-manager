import React from 'react';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { cloneObject } from '../../utils';

import '../../dependencies/css/bootstrap-slider.min.css';

class SliderGroup extends React.Component {
  render() {
    const sliderValue = parseInt(this.props.value, 10);
    let sliderProps = cloneObject(this.props);

    delete sliderProps.value;

    return (
      <FormGroup controlId={this.props.id} className={this.props.extraClass}>
      {this.props.label &&
        <Col componentClass={ControlLabel} md={4}>{this.props.label}</Col>
      }
        <Col md={6}>
          <ReactBootstrapSlider {...sliderProps} value={sliderValue} />
        </Col>
      </FormGroup>
    );
  }
}

export default SliderGroup;
