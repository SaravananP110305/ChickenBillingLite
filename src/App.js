import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RetailBilling from './pages/RetailBilling';
import WholesaleBilling from './pages/WholesaleBilling';
import StockManagement from './pages/StockManagement';
import DayClose from './pages/DayClose';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/retail-billing" element={<RetailBilling />} />
            <Route path="/wholesale-billing" element={<WholesaleBilling />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/day-close" element={<DayClose />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;