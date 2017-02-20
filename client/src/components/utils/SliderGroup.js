import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { cloneObject } from '../../utils';

import '../../dependencies/css/bootstrap-slider.min.css';

class SliderGroup extends React.Component {
  static propTypes = {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
    id: PropTypes.string.isRequired,
    extraClass: PropTypes.string,
    label: PropTypes.node,
  }

  static defaultProps = {
    value: 0,
  }

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
