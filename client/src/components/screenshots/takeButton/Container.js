import React from 'react';
import PropTypes from 'prop-types';
import { post } from '../../../api';
import TakeButton from './TakeButton';

class TakeButtonContainer extends React.Component {
  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSuccess: () => {},
    onError: () => {},
  };

  constructor(props) {
    super(props);

    this.state = { working: false };
  }

  onClick = () => {
    const { onSuccess, onError } = this.props;

    this.setState({ working: true });

    post('takeScreenshot').then(
      ({ data }) => onSuccess(data),
      err => onError(err)
    ).then(() => this.setState({ working: false }));
  };

  render() {
    return (
      <TakeButton {...this.state} onClick={this.onClick} />
    );
  }
}

export default TakeButtonContainer;
