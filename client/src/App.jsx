import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormList from './components/FormList/FormList';
import FormView from './components/FormView/FormView';
import Layout from './components/Layout/Layout';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/forms" replace />} />
            <Route path="forms" element={<FormList />} />
            <Route path="forms/new" element={<FormBuilder />} />
            <Route path="forms/:id/edit" element={<FormBuilder />} />
            <Route path="form/:id" element={<FormView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App; 