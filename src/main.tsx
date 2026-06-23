import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import { AuthProvider } from "./lib/auth/AuthProvider";
import "./index.css";
import App from "./App.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster } from "sonner";
import { APIProvider } from "@vis.gl/react-google-maps";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <TooltipProvider>
          <APIProvider apiKey={apiKey}>
            <App />
          </APIProvider>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
