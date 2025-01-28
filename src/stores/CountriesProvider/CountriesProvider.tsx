import React, { createContext, useContext, useEffect, useState } from "react";
import { Country, CountryContextType } from "./types";
import { useFetch } from "../../hooks/useFetch";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountriesProvider: React.FC<{
  children: React.ReactNode;
  configCountry?: string;
  blockedCountries?: string[];
}> = ({
  children,
  configCountry,
  blockedCountries: initialBlockedCountries,
}) => {
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const [blockedCountries, setBlockedCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const { buildUrl } = useWidgetConfig();
  const { data: countriesResponse, isPending } = useFetch({
    url: "countries",
  });

  useEffect(() => {
    if (countriesResponse?.data?.results) {
      const allCountries = countriesResponse.data.results;

      setAvailableCountries(allCountries);

      const searchParams = new URLSearchParams(window.location.search);
      const urlCountryIso = searchParams.get("country");

      const urlCountry = allCountries.find(
        (country) => country.iso_alpha2 === urlCountryIso
      );

      const defaultCountry =
        urlCountry && buildUrl
          ? urlCountry
          : configCountry
          ? allCountries.find((country) => country.iso_alpha2 === configCountry)
          : allCountries.find((country) => country.iso_alpha2 === "US");

      setSelectedCountry(defaultCountry || null);
    }
  }, [countriesResponse]);

  useEffect(() => {
    if (countriesResponse?.data?.results && initialBlockedCountries) {
      initialBlockedCountries.forEach((isoCode) => {
        removeCountry(isoCode);
      });
    }
  }, [initialBlockedCountries, countriesResponse]);

  const selectCountry = (isoCode: string) => {
    const country = availableCountries.find((c) => c.iso_alpha2 === isoCode);
    if (country) {
      setSelectedCountry(country);

      // Update URL with selected country
      if (buildUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set("country", isoCode);
        window.history.replaceState({}, "", url);
      }
    }
  };

  const removeCountry = (isoCode: string) => {
    setAvailableCountries((prev) =>
      prev.filter((country) => country.iso_alpha2 !== isoCode)
    );
    const blockedCountry = availableCountries.find(
      (country) => country.iso_alpha2 === isoCode
    );
    if (blockedCountry) {
      setBlockedCountries((prev) => [...prev, blockedCountry]);
    }
  };

  const restoreCountry = (isoCode: string) => {
    setBlockedCountries((prev) =>
      prev.filter((country) => country.iso_alpha2 !== isoCode)
    );
    const restoredCountry = blockedCountries.find(
      (country) => country.iso_alpha2 === isoCode
    );
    if (restoredCountry) {
      setAvailableCountries((prev) => [...prev, restoredCountry]);
    }
  };

  return (
    <CountryContext.Provider
      value={{
        availableCountries,
        blockedCountries,
        selectedCountry,
        selectCountry,
        removeCountry,
        restoreCountry,
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
    throw new Error(
      "useCountryContext must be used within a CountriesProvider"
    );
  }
  return context;
};
