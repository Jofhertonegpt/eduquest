import { BrowserRouter as Router } from "react-router-dom";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/components/routes/AppRoutes";

function App() {
  return (
    <Router>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </Router>
  );
}

export default App;