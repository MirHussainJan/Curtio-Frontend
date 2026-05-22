import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


const Google_Client_ID = import.meta.env.VITE_CLIENT_ID;
if (!Google_Client_ID) {
  console.warn("⚠️ VITE_CLIENT_ID is undefined! Google Auth popup/modal will NOT open.");
} else {
  console.log("✅ Google Client ID loaded successfully");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={Google_Client_ID || ""}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
