import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import  { post } from '../../api';

class PostActionButton extends React.Component {
  static propTypes = {
    bsStyle: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    hideContentOnAction: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
    body: PropTypes.object.isRequired,
  }

  static defaultProps = {
    body: {},
    hideContentOnAction: false,
  }

  constructor(props) {
    super(props);
    this.state = { isWorking: false };
  }

  onClick = () => {
    this.setState({ isWorking: true });

    const action = this.props.action;
    const body = this.props.body;

    post(action, body).then(() => {
      this.setState({ isWorking: false });
    }, (err) => {
      console.error(err);
    });
  }

  render() {
    const renderChildren =
      !this.state.isWorking ||
      (this.state.isWorking && !this.props.hideContentOnAction)
    ;

    return (
      <Button onClick={this.onClick} bsStyle={this.props.bsStyle}>
      {this.state.isWorking &&
        <Glyphicon glyph="refresh" className="glyphicon-spin" />
      } {renderChildren && this.props.children}
      </Button>
    );
  }
}

export default PostActionButton;
