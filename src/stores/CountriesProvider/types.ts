export type Country = {
    name: string;
    iso_alpha2: string;
    flag_url: string;
};
  
export   type CountryContextType = {
    countries: Country[];
    removeCountry: (isoCode: string) => void;
};