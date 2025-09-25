import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleFormSubmission } from "./lib/googleFormSubmission";

// Add GoogleFormSubmission to window for testing (remove this later)
(window as any).GoogleFormSubmission = GoogleFormSubmission;

createRoot(document.getElementById("root")!).render(<App />);
