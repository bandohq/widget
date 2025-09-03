import React from 'react';
import { FLAG_S3_BUCKET_URL } from '../../config/constants';
import { getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';

// Helper function to convert country name to snake case (preserving capitalization)
function toSnakeCase(str) {
  return str.replace(/ /g, '_');
}

export function countryFlag({ country, countryName }) {
  // Use the country name from the en locale if available, otherwise use the country code
  const displayName = en[country] || countryName || country;
  // Convert to snake case if there are spaces
  const formattedName = displayName.includes(' ') ? toSnakeCase(displayName) : displayName;
  
  return (
    <img
      alt={displayName || 'Unknown'}
      src={`${FLAG_S3_BUCKET_URL}/${formattedName}.svg`}
      style={{
        width: '30px',
        height: '30px',
        objectFit: 'cover',
        borderRadius: '5px',
        marginRight: '8px',
      }}
    />
  );
}

export const getCountryFlagUrl = (country) => {
  if (!country) return null;
  const countryName = en[country] || country;
  // Convert to snake case if there are spaces
  const formattedName = countryName.includes(' ') ? toSnakeCase(countryName) : countryName;
  return `${FLAG_S3_BUCKET_URL}/${formattedName}.svg`;
};

// This component is used for displaying a country and its calling code
export const CountrySelect = ({ value, onChange, options, ...rest }) => {
  return (
    <select
      {...rest}
      value={value || ''}
      onChange={(event) => {
        onChange(event.target.value || undefined);
      }}>
      {options.map(({ value: optionValue, label: optionLabel }) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
};
