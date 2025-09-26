import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BasinFormSubmission } from "./lib/basinFormSubmission";

// Add BasinFormSubmission to window for testing
(window as any).BasinFormSubmission = BasinFormSubmission;

createRoot(document.getElementById("root")!).render(<App />);
