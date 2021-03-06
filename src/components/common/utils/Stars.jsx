import React from 'react';
import numeral from 'numeral';

const Stars = (props) => {
  const value = props.value;
  const digits = (value > 1000 && value < 10000) ? '0.0' : '0';
  return (
    <span>
      { numeral(value).format(digits + ' a') }
      { props.icon && (
        <span className="octicon octicon-star" style={{ marginLeft: 2 }}></span>
      ) }
    </span>
  );
};
module.exports = Stars;
