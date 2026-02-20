import { createRoot } from "react-dom/client";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <App />
);