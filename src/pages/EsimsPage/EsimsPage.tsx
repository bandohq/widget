import { Box } from "@mui/material";
import { useHeader } from "../../hooks/useHeader";
import { Variant } from "../../stores/ProductProvider/types";
import { PageContainer } from "../../components/PageContainer";
import { BrandsGrid } from "../ProductsPage/ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";

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
  {
    id: "456",
    brand: "Colombia",
    productType: "esims",
    targetCountry: {
      countryName: "Colombia",
      countryCode: "CO",
      flagUrl: "https://flagcdn.com/w40/co.png",
    },
    fupId: "",
    country: "*",
    notes: "",
    sku: "",
    price: undefined,
    shortNotes: "",
    subTypes: [],
    imageUrl: "https://flagcdn.com/w40/co.png",
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
  return (
    <PageContainer bottomGutters>
      <Box
        sx={{
          padding: 2,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {mockVariants.map((variant) => (
          <BrandsGrid key={variant.id} onClick={() => {}}>
            <ImageAvatar
              name={variant.brand}
              src={variant.imageUrl}
              sx={{
                maxHeight: "60px",
                maxWidth: "60px",
                width: "60px",
                height: "60px",
                objectFit: "contain",
              }}
            />
          </BrandsGrid>
        ))}
      </Box>
    </PageContainer>
  );
};
