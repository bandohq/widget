import React, { createContext, useContext, useEffect, useState } from "react";
import { Country, CountryContextType, CountryError } from "./types";
import { useFetch } from "../../hooks/useFetch";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { useTranslation } from "react-i18next";

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountriesProvider: React.FC<{
  children: React.ReactNode;
  configCountry?: string;
  allowedCountries?: string[];
}> = ({
  children,
  configCountry,
  allowedCountries: initialAllowedCountries,
}) => {
  const { t } = useTranslation();
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const [blockedCountries, setBlockedCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [error, setError] = useState<CountryError | null>(null);

  const { buildUrl } = useWidgetConfig();
  const {
    data: countriesResponse,
    isPending,
    error: fetchError,
    refetch,
  } = useFetch({
    method: "GET",
    url: "countries",
  });

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      setError({
        message: t("error.message.countriesFetchFailed"),
        code: fetchError.message,
        status: (fetchError as any)?.status,
      });
    } else {
      setError(null);
    }
  }, [fetchError, t]);

  useEffect(() => {
    if (countriesResponse?.data?.results) {
      const allCountries = countriesResponse.data.results;

      const filteredCountries =
        initialAllowedCountries && initialAllowedCountries.length > 0
          ? allCountries.filter((country) =>
              initialAllowedCountries.includes(country.isoAlpha2)
            )
          : allCountries;

      setAvailableCountries(filteredCountries);

      const searchParams = new URLSearchParams(window.location.search);
      const urlCountryIso = searchParams.get("country");

      const urlCountry = filteredCountries.find(
        (country) => country.isoAlpha2 === urlCountryIso
      );

      const configSelectedCountry = configCountry
        ? filteredCountries.find(
            (country) => country.isoAlpha2 === configCountry
          )
        : null;

      const isCurrentCountry = filteredCountries.find(
        (country) => country.isCurrent
      );

      const defaultCountry =
        urlCountry && buildUrl
          ? urlCountry
          : configSelectedCountry
          ? configSelectedCountry
          : isCurrentCountry
          ? isCurrentCountry
          : filteredCountries.find((country) => country.isoAlpha2 === "US");

      setSelectedCountry(defaultCountry || null);
    }
  }, [countriesResponse, initialAllowedCountries, configCountry, buildUrl]);

  const selectCountry = (isoCode: string) => {
    const country = availableCountries.find((c) => c.isoAlpha2 === isoCode);
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
      prev.filter((country) => country.isoAlpha2 !== isoCode)
    );
    const blockedCountry = availableCountries.find(
      (country) => country.isoAlpha2 === isoCode
    );
    if (blockedCountry) {
      setBlockedCountries((prev) => [...prev, blockedCountry]);
    }
  };

  const restoreCountry = (isoCode: string) => {
    setBlockedCountries((prev) =>
      prev.filter((country) => country.isoAlpha2 !== isoCode)
    );
    const restoredCountry = blockedCountries.find(
      (country) => country.isoAlpha2 === isoCode
    );
    if (restoredCountry) {
      setAvailableCountries((prev) => [...prev, restoredCountry]);
    }
  };

  const retryFetch = () => {
    setError(null);
    refetch();
  };

  const hasCountries = availableCountries.length > 0;

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
        error,
        hasCountries,
        retryFetch,
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
