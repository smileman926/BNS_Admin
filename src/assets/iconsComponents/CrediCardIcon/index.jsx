import React from 'react';

const CreditCardIcon = ({ height, width, color = '#000' }) => (
  <svg xmlns='http://www.w3.org/2000/svg' height={height} viewBox='0 0 24 24' width={width} color={color}>
    <path  d='M0 0h24v24H0V0z' fill='none' />
    <path fill={color} d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' />
  </svg>
);
export default CreditCardIcon;
