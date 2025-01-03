import { Input } from "../../components/ReferenceInput/ReferenceInput";
import { Typography } from "@mui/material";
import { palette } from "../../themes/palettes";
import { ReferenceType } from "../../providers/CatalogProvider/types";
import { useTranslation } from "react-i18next";

interface DetailSectionProps {
  productType: string;
  referenceType: ReferenceType[];
}
export const DetailSection: React.FC<DetailSectionProps> = ({
  productType,
  referenceType,
}) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: "15px" }}>
      <Typography variant="subtitle1" style={{ color: palette.grey[400] }}>
        Details
      </Typography>
      {referenceType.map((item, index) => (
        <Input
          key={index}
          index={index}
          formType="from"
          referenceType={item}
          style={{ marginBottom: "15px" }}
        />
      ))}
      <Typography variant="subtitle2" style={{ color: palette.grey[400] }}>
        {t("info.detailMessage", { productType })}
      </Typography>
    </div>
  );
};
