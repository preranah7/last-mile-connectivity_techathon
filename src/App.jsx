// src/App.jsx

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { KYCProvider } from './contexts/KYCContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <KYCProvider>
          <AppRoutes />
        </KYCProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;