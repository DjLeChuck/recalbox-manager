import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoAffix from 'react-overlays/lib/AutoAffix';
import Alert from 'react-bootstrap/lib/Alert';

class StickyAlert extends Component {
  static propTypes = {
    bsStyle: PropTypes.oneOf(['success', 'warning', 'danger']).isRequired,
    container: PropTypes.object,
    children: PropTypes.node,
  };

  static defaultProps = {
    bsStyle: 'success',
  };

  constructor(props) {
    super(props);

    const { children } = this.props;
    this.state = {
      show: true,
      children,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { children } = nextProps;

    this.setState({
      show: true,
      children,
    });
  }

  dismiss = () => this.setState({
    open: false,
    children: null,
  });

  render() {
    const { show, children } = this.state;

    if (!show || !children) {
      return null;
    }

    const { container, bsStyle } = this.props;

    return (
      <AutoAffix viewportOffsetTop={65} container={container}
        affixStyle={{ zIndex: 1 }}>
        <Alert bsStyle={bsStyle}
          onDismiss={this.dismiss}>
          {children}
        </Alert>
      </AutoAffix>
    );
  }
}

export default StickyAlert;
