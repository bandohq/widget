import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <App
      integrator="bando-app"
      buildUrl={true}
      config={{
        categories: [],
        theme: {
          header: {
            background: "transparent",
          },
          container: {
            borderRadius: "10px",
            border: "3px solid #00ffff",
            boxShadow: `
              0 0 10px #00ffff,
              0 0 20px #00ffff,
              0 0 40px #ff00ff,
              0 0 80px #ff00ff,
              0 0 120px #00ff00,
              inset 0 0 30px rgba(0, 255, 255, 0.4),
              inset 0 0 60px rgba(0, 255, 255, 0.1)
            `,
            maxHeight: "600px",
          },
          typography: {
            fontFamily: "Inter, sans-serif",
            "& .MuiTypography-h4": {
              background: "linear-gradient(90deg, #15AF84 0%, #B93FED 100%)",
              fontStyle: "italic",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "600",
            },
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  borderRadius: "50px",
                  background: "linear-gradient(90deg, #15AF84 0%, #B93FED 100%)",
                  color: "#ffffff !important",
                },
              },
            },
            SelectProductCard: {
              styleOverrides: {
                root: {
                  background: "linear-gradient(45deg, #15AF84 0%, #B93FED 100%)",
                  color: "#ffffff !important",
                  border: "none",
                },
                actionButton: {
                  borderRadius: "6px",
                  padding: "6px 12px",
                  background: "linear-gradient(45deg, #FBD1FF 15%, #FF9CFF 100%)",
                  color: "#B93FED !important",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.32);"
                },
              },
            },
            MuiInput: {
              styleOverrides: {
                root: {
                  borderRadius: "8px",
                  background: "#3F5A5A",
                  color: "#ffffff !important",
                  border: "none",
                  ["& :hover"]: {
                    background: "#3F5A5A",
                  },
                  ["& :focus"]: {
                    background: "#3F5A5A",
                  },
                },
              },
            },
          }
        },
        country: "MX",
      }}
    />
  </div>
);
