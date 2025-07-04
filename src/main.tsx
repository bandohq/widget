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
        theme: {
          container: {
            boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
          },
        },
        country: "MX",
      }}
    />
  </div>
);
