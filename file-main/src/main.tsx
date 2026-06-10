
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

import { isMobileApp } from "./utils/isMobile";

const GOOGLE_CLIENT_ID = "544452206953-hf3mo2cn3gbkadb8g5ejkm6skigio6er.apps.googleusercontent.com";


const root = createRoot(document.getElementById("root")!);

if (isMobileApp) {
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  root.render(
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}
