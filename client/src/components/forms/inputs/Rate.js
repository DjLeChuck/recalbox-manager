import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'react-form';
import Rating from 'react-rating';

const RateInput = ({ field }) => (
  <FormInput field={field}>
    {({ getValue, setValue }) => (
      <Rating stop={1} step={.2} fractions={2}
        initialRate={parseFloat(getValue())}
        empty="glyphicon glyphicon-star-empty big-glyphicon rating"
        full="glyphicon glyphicon-star big-glyphicon rating"
        onClick={value => setValue(value)} />
    )}
  </FormInput>
);

RateInput.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
};

export default RateInput;
