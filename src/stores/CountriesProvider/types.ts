export type Country = {
    name: string;
    iso_alpha2: string;
    flag_url: string;
};
  
export   type CountryContextType = {
    countries: Country[];
    country: Country;
    selectCountry: (isoCode: string) => void;
    removeCountry: (isoCode: string) => void;
    isCountryPending: boolean;
};