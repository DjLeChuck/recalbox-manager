import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import  { post } from '../../api';

class PostActionButton extends Component {
  static propTypes = {
    bsStyle: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    hideContentOnAction: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
    body: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
  };

  static defaultProps = {
    body: {},
    hideContentOnAction: false,
    onSuccess: () => {},
    onError: () => {},
  };

  constructor(props) {
    super(props);
    this.state = { isWorking: false };
  }

  onClick = () => {
    this.setState({ isWorking: true });

    const { body, action, onSuccess, onError } = this.props;

    post(action, body).then(() => {
      this.setState({ isWorking: false });
      onSuccess();
    }, (err) => {
      console.error(err);
      onError(err);
    });
  };

  render() {
    const { isWorking } = this.state;
    const { hideContentOnAction, bsStyle, children } = this.props;
    const renderChildren = !isWorking || (isWorking && !hideContentOnAction);

    return (
      <Button onClick={this.onClick} bsStyle={bsStyle}>
      {isWorking &&
        <Glyphicon glyph="refresh" className="glyphicon-spin" />
      } {renderChildren && children}
      </Button>
    );
  }
}

export default PostActionButton;
