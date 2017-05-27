import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const RomsEdit = ({ onClick }) => (
  <Button bsStyle="primary" onClick={onClick}>
    <Glyphicon glyph="pencil" />
  </Button>
);

RomsEdit.propTypes = {
  onClick: PropTypes.func.isRequired,
};

RomsEdit.defaultProps = {
  onClick: () => {},
};

export default RomsEdit;
