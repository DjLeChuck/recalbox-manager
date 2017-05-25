import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'react-form';
import Select2 from 'react-select2-wrapper';

import 'react-select2-wrapper/css/select2.css';

const OnlySelect = ({ field, noTouch, ...rest }) => (
  <FormInput field={field}>
    {({ setValue, getValue }) => (
      <Select2 {...rest} style={{ width: '100%' }}
        defaultValue={getValue()}
        onChange={e => setValue(e.target.value, noTouch)} />
    )}
  </FormInput>
);

OnlySelect.propTypes = {
  field: PropTypes.string.isRequired,
  noTouch: PropTypes.bool,
};

export default OnlySelect;
