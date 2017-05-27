import React, { Component } from 'react';
import RomsUpload from './Upload';

class RomsUploadContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  onClick = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <RomsUpload {...this.state} {...this.props} onClick={this.onClick} />
    );
  }
}

export default RomsUploadContainer;
