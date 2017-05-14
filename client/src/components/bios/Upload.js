import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Collapse from 'react-bootstrap/lib/Collapse';
import Well from 'react-bootstrap/lib/Well';
import CustomDropzone from '../utils/Dropzone';

class BiosUpload extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  onClick = () => this.setState({ open: !this.state.open })

  render() {
    const { t, onSuccess } = this.props;
    const { open } = this.state;

    return (
      <div>
        <Button bsStyle="primary" onClick={this.onClick}>
          {t('Uploader des BIOS')}
        </Button>
        <Collapse in={open}>
          <div>
            <Well>
              <CustomDropzone type="bios" onSuccess={onSuccess} />
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default translate()(BiosUpload);
