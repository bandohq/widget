import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../components/Search/SearchInput.js";
import { useFieldActions } from "../../stores/form/useFieldActions.js";
import { useFieldController } from "../../stores/form/useFieldController";

export const SearchTokenInput = () => {
  const { t } = useTranslation();
  const { setFieldValue } = useFieldActions();
  const { onChange, onBlur, name, value } = useFieldController({
    name: "tokenSearchFilter",
  });

  useEffect(
    () => () => {
      setFieldValue("tokenSearchFilter", "");
    },
    [setFieldValue]
  );

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    const searchValue = (e.target as HTMLInputElement).value;
    onChange(searchValue);
  };

  return (
    <SearchInput
      name={name}
      placeholder={t("main.tokenSearch")}
      onChange={handleSearchChange}
      onBlur={onBlur}
      value={value as string | undefined}
    />
  );
};
