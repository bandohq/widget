import { isValidPhoneNumber } from "react-phone-number-input";
import { ReferenceType } from "../providers/CatalogProvider/types";

export const isReferenceValid = (ref: string, type: ReferenceType) => {
  if (!ref) return false;

  if (type.name === "phone" && !isValidPhoneNumber(ref)) return false;

  const regex =
    typeof type.regex === "string" ? new RegExp(type.regex) : type.regex;

  if (regex && !regex.test(ref)) return false;

  return true;
};

export const areRequiredFieldsValid = (ref: any, fields: ReferenceType[]) => {
  if (!ref || !fields || !Array.isArray(fields)) return false;

  return fields.every((field, index) => {
    const value = Array.isArray(ref) ? ref[index]?.value : ref;
    return isReferenceValid(value, field);
  });
};
