import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecipesPage from './pages/RecipesPage';
import IngredientsPage from './pages/IngredientsPage';
import RecipeForm from './pages/RecipeForm';
import RecipeDetail from './pages/RecipeDetail';
import LandingPage from './pages/LandingPage';

const App = () => {
  const theme = useMemo(() => createTheme({ palette: { mode: 'dark' } }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/recipes/new" element={<RecipeForm />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/recipes/edit/:id" element={<RecipeForm />} />
                <Route path="/ingredients" element={<IngredientsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
