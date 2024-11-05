import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { DefaultValues, FormFieldNames } from "../form/types";
import { useFieldActions } from "../form/useFieldActions";
import { useFieldValues } from "../form/useFieldValues";
import { useTouchedFields } from "../form/useTouchedFields";

const formValueKeys: FormFieldNames[] = [
  "fromChain",
  "fromToken",
  "productId",
  "country",
];

const getDefaultValuesFromQueryString = (): Partial<DefaultValues> => {
  const searchParams = Object.fromEntries(
    new URLSearchParams(window?.location.search)
  );

  return {
    ...(Number.isFinite(Number.parseInt(searchParams.fromChain, 10))
      ? { fromChain: Number.parseInt(searchParams.fromChain, 10) }
      : {}),
    ...(searchParams.fromToken ? { fromToken: searchParams.fromToken } : {}),
    ...(searchParams.productId ? { productId: searchParams.productId } : {}),
    ...(searchParams.country ? { country: searchParams.country } : {}),
  };
};

export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation();
  const touchedFields = useTouchedFields();
  const values = useFieldValues(...formValueKeys);

  const { getFieldValues, isTouched, setUserAndDefaultValues } =
    useFieldActions();

  useEffect(() => {
    // Get values from URL
    const formValues = getDefaultValuesFromQueryString();
    setUserAndDefaultValues(formValues);
  }, [setUserAndDefaultValues]);

  useEffect(() => {
    // Update values in URL
    const url = new URL(window.location as any);
    formValueKeys.forEach((key) => {
      const value = getFieldValues(key)[0];
      if (isTouched(key) && value) {
        url.searchParams.set(key, value.toString());
      } else if (url.searchParams.has(key) && !value) {
        url.searchParams.delete(key);
      }
    });
    url.searchParams.sort();
    window.history.replaceState(window.history.state, "", url);
  }, [pathname, touchedFields, values, isTouched, getFieldValues]);

  return null;
};
