import React, { createContext, useContext, useEffect, useState } from "react";
import { Country, CountryContextType } from "./types";
import { useFetch } from "../../hooks/useFetch";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountriesProvider: React.FC<{
  children: React.ReactNode;
  blockedCountries?: string[];
  configCountry?: string;
}> = ({ children, blockedCountries, configCountry }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const { buildUrl } = useWidgetConfig();
  const { data: countriesResponse, isPending } = useFetch({
    url: "countries",
  });

  useEffect(() => {
    if (countriesResponse?.data?.results) {
      const availableCountries = blockedCountries
        ? countriesResponse.data.results.filter(
            (country: Country) => !blockedCountries.includes(country.iso_alpha2)
          )
        : countriesResponse.data.results;

      setCountries(availableCountries);

      const searchParams = new URLSearchParams(window.location.search);
      const urlCountryIso = searchParams.get("country");

      const urlCountry = availableCountries.find(
        (country) => country.iso_alpha2 === urlCountryIso
      );

      const defaultCountry =
        urlCountry && buildUrl
          ? urlCountry
          : configCountry
          ? availableCountries.find(
              (country) => country.iso_alpha2 === configCountry
            )
          : availableCountries.find((country) => country.iso_alpha2 === "US");

      setCountry(defaultCountry || null);
    }
  }, [countriesResponse]);

  const selectCountry = (isoCode: string) => {
    const country = countries.find((c) => c.iso_alpha2 === isoCode);
    if (country) {
      setCountry(country);

      // Update URL with selected country
      if (buildUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set("country", isoCode);
        window.history.replaceState({}, "", url);
      }
    }
  };

  const removeCountry = (isoCode: string) => {
    setFilteredCountries((prev) => [
      ...prev,
      ...countries.filter((country) => country.iso_alpha2 === isoCode),
    ]);
  };

  useEffect(() => {}, [filteredCountries]);

  return (
    <CountryContext.Provider
      value={{
        countries,
        filteredCountries,
        country,
        selectCountry,
        removeCountry,
        isCountryPending: isPending,
      }}
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
