import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Button, Glyphicon, Panel, Row, Col } from 'react-bootstrap';
import reactStringReplace from 'react-string-replace';

class View extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div>VIEW</div>
    );
  }
}

export default View;
