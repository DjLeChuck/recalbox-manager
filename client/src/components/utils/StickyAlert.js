import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoAffix from 'react-overlays/lib/AutoAffix';
import Alert from 'react-bootstrap/lib/Alert';

class StickyAlert extends Component {
  static propTypes = {
    bsStyle: PropTypes.oneOf(['success', 'warning', 'danger']).isRequired,
    container: PropTypes.object,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props);

    this.state = { show: true };
  }

  componentWillReceiveProps() {
    this.setState({ show: true });
  }

  render() {
    if (!this.state.show || !this.props.children) {
      return null;
    }

    return (
      <AutoAffix viewportOffsetTop={65} container={this.props.container}
        affixStyle={{ zIndex: 1 }}>
        <Alert bsStyle={this.props.bsStyle}
          onDismiss={() => this.setState({ show: false })}>
          {this.props.children}
        </Alert>
      </AutoAffix>
    );
  }
}

export default StickyAlert;
