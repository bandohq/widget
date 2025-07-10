export type Country = {
  name: string;
  isoAlpha2: string;
  flagUrl: string;
  callingCode: string;
  isCurrent?: boolean;
};
  
export type CountryError = {
  message: string;
  code?: string;
  status?: number;
};

export type CountryContextType = {
  selectedCountry: Country | null;
  availableCountries: Country[];
  blockedCountries: Country[];
  restoreCountry: (isoCode: string) => void;
  selectCountry: (isoCode: string) => void;
  removeCountry: (isoCode: string) => void;
  isCountryPending: boolean;
  error: CountryError | null;
  hasCountries: boolean;
  retryFetch: () => void;
};