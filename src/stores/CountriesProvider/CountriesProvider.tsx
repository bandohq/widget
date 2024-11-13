import React, { createContext, useContext, useEffect, useState } from "react";
import { Country, CountryContextType } from "./types";
import { useFetch } from "../../hooks/useFetch";

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const { data: countriesResponse } = useFetch({
    url: "countries",
  });

  useEffect(() => {
    if (countriesResponse?.data?.results) {
      setCountries(countriesResponse.data.results);
    }
  }, [countriesResponse]);

  const removeCountry = (isoCode: string) => {
    setCountries((prev) =>
      prev.filter((country) => country.iso_alpha2 !== isoCode)
    );
  };

  return (
    <CountryContext.Provider value={{ countries, removeCountry }}>
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
