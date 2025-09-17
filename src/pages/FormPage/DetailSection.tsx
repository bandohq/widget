import { Input } from "../../components/ReferenceInput/ReferenceInput";
import { Typography } from "@mui/material";
import { palette } from "../../themes/palettes";
import { ReferenceType } from "../../providers/CatalogProvider/types";
import { useTranslation } from "react-i18next";

interface DetailSectionProps {
  productType: string;
  referenceType: ReferenceType;
  requiredFields?: ReferenceType[];
}
export const DetailSection: React.FC<DetailSectionProps> = ({
  productType,
  referenceType,
  requiredFields = [],
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: "15px" }}>
      <Input
        formType="from"
        referenceType={referenceType}
        style={{ marginBottom: "15px" }}
      />
      {requiredFields.map((item, index) => (
        <Input
          key={index}
          index={index}
          formType="from"
          referenceType={item}
          style={{ marginBottom: "15px" }}
          isRequired
        />
      ))}
    </div>
  );
};
