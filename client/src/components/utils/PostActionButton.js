import React, { PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import  { post } from '../../api';

class PostActionButton extends React.Component {
  static propTypes = {
    bsStyle: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { isWorking: false };
  }

  onClick = (e) => {
    this.setState({ isWorking: true });

    const target = e.currentTarget;
    const action = target.dataset.action;

    post(action).then(() => {
      this.setState({ isWorking: false });
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <Button onClick={this.onClick} {...this.props}>
      {this.state.isWorking &&
        <Glyphicon glyph="refresh" className="glyphicon-spin" />
      } {this.props.children}
      </Button>
    );
  }
}

export default PostActionButton;
