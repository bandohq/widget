export type Country = {
    name: string;
    iso_alpha2: string;
    flag_url: string;
    calling_code: string;
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