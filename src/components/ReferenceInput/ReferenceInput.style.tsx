import {
  Box,
  Card,
  InputBase,
  FormControl as MuiFormControl,
  darken,
  inputBaseClasses,
  lighten,
  styled,
} from "@mui/material";

export const maxInputFontSize = 24;
export const minInputFontSize = 14;

export const InputCard = styled(Card, {
  name: "MuiInputCard",
  slot: "root",
})(({ theme }) => ({
  marginTop: "10px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? darken(theme.palette.background.paper, 0.02)
        : lighten(theme.palette.background.paper, 0.02),
  },
  "&.error": {
    borderColor: theme.palette.error.main,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,
    "& input": {
      color: theme.palette.error.main,
    },
  },
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
}));

export const FormControl = styled(MuiFormControl)(() => ({
  height: 40,
}));

export const StyledInput = styled(InputBase)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 200,
  boxShadow: "none",
  lineHeight: 1.5,
  [`.${inputBaseClasses.input}`]: {
    height: 24,
    padding: theme.spacing(0, 0, 0, 2),
  },
  '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
    {
      WebkitAppearance: "none",
      margin: 0,
    },
  '& input[type="number"]': {
    MozAppearance: "textfield",
  },
  [`&.${inputBaseClasses.disabled}`]: {
    color: "inherit",
  },
  [`.${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
    WebkitTextFillColor: "unset",
  },
}));

export const StyledPhoneInput = styled("div")(({ theme }) => ({
  "& .PhoneInput": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontSize: 24,
    fontWeight: 200,
    fontFamily: "Kanit, Arial, sans-serif",
  },
  "& .PhoneInputInput": {
    all: "unset",
    width: "100%",
  },
}));
