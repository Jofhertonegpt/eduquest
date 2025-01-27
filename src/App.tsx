import { BrowserRouter as Router } from "react-router-dom";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/components/routes/AppRoutes";
import React from 'react';

function App() {
  return (
    <React.StrictMode>
      <AppProviders>
        <Router>
          <AppRoutes />
        </Router>
      </AppProviders>
    </React.StrictMode>
  );
}

export default App;