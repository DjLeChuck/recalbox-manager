import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const RomsDelete = ({ onClick }) => (
  <Button bsStyle="danger" onClick={onClick}>
    <Glyphicon glyph="trash" />
  </Button>
);

RomsDelete.propTypes = {
  onClick: PropTypes.func.isRequired,
};

RomsDelete.defaultProps = {
  onClick: () => {},
};

export default RomsDelete;
