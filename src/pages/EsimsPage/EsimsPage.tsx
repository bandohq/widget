import { Box } from "@mui/material";
import { useHeader } from "../../hooks/useHeader";
import { Variant } from "../../stores/ProductProvider/types";

const mockVariants: Variant[] = [
  {
    id: "123",
    brand: "Mexico",
    productType: "esims",
    targetCountry: {
      countryName: "Mexico",
      countryCode: "MX",
      flagUrl: "https://flagcdn.com/w40/mx.png",
    },
    fupId: "",
    country: "*",
    notes: "",
    sku: "",
    price: undefined,
    shortNotes: "",
    subTypes: [],
    imageUrl: "https://flagcdn.com/w40/mx.png",
    dataGB: 0,
    dataSpeeds: 0,
    dataUnlimited: false,
    durationDays: 0,
    smsNumber: 0,
    smsUnlimited: false,
    voiceMinutes: 0,
    voiceUnlimited: false,
    sendCurrency: "",
    sendPrice: 0,
  },
];

export const EsimsPage = () => {
  useHeader("Esims");
  return <Box sx={{ height: "100%", display: "grid" }}></Box>;
};
