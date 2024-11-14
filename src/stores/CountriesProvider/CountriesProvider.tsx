import React, { createContext, useContext, useEffect, useState } from "react";
import { Country, CountryContextType } from "./types";
import { useFetch } from "../../hooks/useFetch";

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountriesProvider: React.FC<{
  children: React.ReactNode;
  blockedCountries?: string[];
  configCountry?: string;
}> = ({ children, blockedCountries, configCountry }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const { data: countriesResponse } = useFetch({
    url: "countries",
  });

  useEffect(() => {
    if (countriesResponse?.data?.results) {
      setCountries(
        blockedCountries
          ? countriesResponse.data.results.filter(
              (country: Country) =>
                !blockedCountries.includes(country.iso_alpha2)
            )
          : countriesResponse.data.results
      );
      const defaultCountry = configCountry
        ? countriesResponse.data.results.find(
            (country: Country) => country.iso_alpha2 === configCountry
          )
        : countriesResponse.data.results.find(
            (country: Country) => country.iso_alpha2 === "MX"
          );
      setCountry(defaultCountry || null);
    }
  }, [countriesResponse]);

  const selectCountry = (isoCode: string) => {
    const country = countries.find((c) => c.iso_alpha2 === isoCode);
    if (country) {
      setCountry(country);
    }
  };

  const removeCountry = (isoCode: string) => {
    setCountries((prev) =>
      prev.filter((country) => country.iso_alpha2 !== isoCode)
    );
  };

  return (
    <CountryContext.Provider
      value={{ countries, country, selectCountry, removeCountry }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const useCountryContext = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountryContext must be used within a CountryProvider");
  }
  return context;
};
