import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";

type Variant = {
  id: string;
  notes: string;
  shortNotes: string;
  price: {
    fiatValue: string;
  };
  imageUrl: string;
};

type VariantSliderProps = {
  variants: Variant[];
  title: string;
};

export default function VariantSlider({ variants, title }) {
  const [index, setIndex] = React.useState(0);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setIndex(newValue);
    }
  };

  const current = variants[index];

  return (
    <Box sx={{ width: 300, mx: "auto", my: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        {title}
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar
            src={current?.imageUrl}
            alt="logo"
            variant="square"
            sx={{ width: 56, height: 56 }}
          />
          <Box>
            <Typography variant="h6" color="primary">
              ${current?.price.fiatValue} MXN
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Slider
        value={index}
        min={0}
        step={1}
        max={variants.length - 1}
        onChange={handleChange}
        valueLabelFormat={(i) => variants[i].shortNotes}
      />
      <Typography variant="body2" color="text.secondary" align="center">
        {current?.notes}
      </Typography>
    </Box>
  );
}
