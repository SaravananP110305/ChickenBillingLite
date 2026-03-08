import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Save, Languages, Cloud, Settings as SettingsIcon, DollarSign } from 'lucide-react';
import { setLanguage, updateRates } from '../store/store';

const Settings = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);
  const rates = useSelector(state => state.rates);
  const stock = useSelector(state => state.stock);

  const [rateSettings, setRateSettings] = useState({
    broiler: rates.broiler,
    country: rates.country,
    dressed: rates.dressed,
    wholeSaleBroiler: rates.wholeSaleBroiler,
    wholeSaleCountry: rates.wholeSaleCountry,
    wholeSaleDressed: rates.wholeSaleDressed,
  });

  const handleRateChange = (key, value) => {
    setRateSettings({
      ...rateSettings,
      [key]: parseFloat(value) || 0
    });
  };

  const handleSaveRates = () => {
    dispatch(updateRates(rateSettings));
    alert('✅ Rates updated successfully!');
  };

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === 'en' ? 'ta' : 'en'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-6 w-6 text-red-600" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{translations.settings}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Settings */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <Languages className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">{translations.language}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">English</span>
                <span className="text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-700">தமிழ்</span>
              </div>
              <button
                onClick={handleLanguageToggle}
                className="btn-primary w-full sm:w-auto px-6"
              >
                {language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Current: {language === 'en' ? 'English' : 'தமிழ்'}
            </p>
          </div>
        </div>

        {/* Rate Settings */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Rate Configuration</h2>
          </div>
          
          <div className="space-y-6">
            {/* Retail Rates */}
            <div>
              <h3 className="font-medium text-red-600 mb-3 text-sm uppercase tracking-wider">Retail Rates</h3>
              <div className="space-y-3">
                {stock.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm text-gray-600 w-24">{item.type}:</label>
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="number"
                        value={rateSettings[item.type.toLowerCase()]}
                        onChange={(e) => handleRateChange(item.type.toLowerCase(), e.target.value)}
                        className="input-field"
                        min="0"
                        step="1"
                      />
                      <span className="text-gray-500 w-12">₹/kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wholesale Rates */}
            <div>
              <h3 className="font-medium text-red-600 mb-3 text-sm uppercase tracking-wider">Wholesale Rates</h3>
              <div className="space-y-3">
                {stock.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm text-gray-600 w-24">{item.type}:</label>
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="number"
                        value={rateSettings[`wholeSale${item.type}`]}
                        onChange={(e) => handleRateChange(`wholeSale${item.type}`, e.target.value)}
                        className="input-field"
                        min="0"
                        step="1"
                      />
                      <span className="text-gray-500 w-12">₹/kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveRates}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
            >
              <Save className="h-4 w-4" />
              <span>Save All Rates</span>
            </button>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <Cloud className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Google Drive Backup</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Backup your data to Google Drive automatically. 
              <span className="block text-xs text-gray-500 mt-1">(Demo feature - no actual backup)</span>
            </p>
            
            <button
              onClick={() => alert('☁️ Google Drive backup simulation')}
              className="btn-primary w-full py-3"
            >
              Backup Now
            </button>
            
            <div className="text-xs text-gray-500 text-center">
              Last backup: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">System Information</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Version</span>
              <span className="font-medium text-red-600">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Theme</span>
              <span className="font-medium flex items-center">
                <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                Red & White (Non-Veg)
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium">LocalStorage</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Products</span>
              <span className="font-medium">{stock.length}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Total Customers</span>
              <span className="font-medium">{useSelector(state => state.customers.length)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;