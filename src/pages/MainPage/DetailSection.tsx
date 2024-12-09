import { Input } from "../../components/ReferenceInput/ReferenceInput";
import { Typography } from "@mui/material";
import { palette } from "../../themes/palettes";

interface DetailSectionProps {
  productType: string;
  referenceType: {
    name: "email" | "phone";
    regexp: RegExp;
    valueType: "string" | "number";
  };
}
export const DetailSection: React.FC<DetailSectionProps> = ({
  productType,
  referenceType,
}) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <Typography variant="subtitle1" style={{ color: palette.grey[400] }}>
        Details
      </Typography>
      <Input formType="to" referenceType={referenceType[0]} />
      <Typography variant="subtitle2" style={{ color: palette.grey[400] }}>
        Is where you will recibe your {productType}.
      </Typography>
    </div>
  );
};
