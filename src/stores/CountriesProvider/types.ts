export type Country = {
    name: string;
    isoAlpha2: string;
    flagUrl: string;
    callingCode: string;
};
  
export   type CountryContextType = {
    selectedCountry: Country | null;
    availableCountries: Country[];
    blockedCountries: Country[];
    restoreCountry: (isoCode: string) => void;
    selectCountry: (isoCode: string) => void;
    removeCountry: (isoCode: string) => void;
    isCountryPending: boolean;
};