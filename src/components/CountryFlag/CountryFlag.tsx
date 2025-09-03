import React from 'react';
import { FLAG_S3_BUCKET_URL } from '../../config/constants';

interface CountryFlagProps {
  country: string;
  countryName: string;
}

// Helper function to convert country name to snake case (preserving capitalization)
const toSnakeCase = (str: string): string => {
  return str.replace(/ /g, '_');
};

export const CountryFlag: React.FC<CountryFlagProps> = ({ country, countryName }) => {
  // Format the country name to snake case if it contains spaces
  const formattedName = countryName.includes(' ') ? toSnakeCase(countryName) : countryName;
  
  return (
    <img
      alt={`${countryName || country || 'Unknown'}`}
      src={`${FLAG_S3_BUCKET_URL}/${formattedName}.svg`}
      style={{
        width: '24px',
        height: '18px',
        objectFit: 'cover',
        borderRadius: '2px',
      }}
    />
  );
};
