import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, User, Cloud, Languages, ChevronDown, AlertTriangle } from 'lucide-react';
import { setLanguage } from '../store/store';

const Header = ({ translations }) => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.language);
  const stock = useSelector(state => state.stock);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleLanguage = () => {
    dispatch(setLanguage(language === 'en' ? 'ta' : 'en'));
    setShowMobileMenu(false);
  };

  const handleBackup = () => {
    alert(translations.googleDriveBackup);
    setShowMobileMenu(false);
  };

  const lowStockItems = stock.filter(item => item.quantity < 20);
  
  const getLowStockBadge = (count) => {
    if (count === 0) return null;
    if (count === 1) return '1';
    return count > 99 ? '99+' : count.toString();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3">
        {/* Main Header Row */}
        <div className="flex items-center justify-between">
          {/* Left Section - Dashboard Title */}
          <div className="flex items-center">
            {/* Mobile menu spacer */}
            <div className="lg:hidden w-10 sm:w-12 shrink-0"></div>
            
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800 truncate">
              {translations.dashboard}
            </h2>
          </div>

          {/* Center Section - Low Stock Alert (Desktop & Tablet) */}
          {lowStockItems.length > 0 && (
            <div className="hidden sm:flex flex-1 justify-center px-4">
              {lowStockItems.length === 1 ? (
                // Single item alert - amber/warning
                <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full flex items-center border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  <span className="font-medium">1 {translations.addItem} {translations.lowStock}</span>
                </span>
              ) : (
                // Multiple items alert - red/urgent
                <span className="bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full flex items-center border border-red-200">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-1.5 animate-pulse"></span>
                  <span className="font-medium">{translations.lowStock}: {lowStockItems.length} items</span>
                </span>
              )}
            </div>
          )}

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={handleBackup}
              className="p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-all"
              title={translations.backup}
            >
              <Cloud className="h-5 w-5" />
            </button>
            
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 hover:bg-red-50 rounded-lg flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-all"
            >
              <Languages className="h-5 w-5" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'தமிழ்' : 'English'}
              </span>
            </button>
            
            <button className="p-2 hover:bg-red-50 rounded-lg relative text-gray-600 hover:text-red-600 transition-all">
              <Bell className="h-5 w-5" />
              {lowStockItems.length > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{getLowStockBadge(lowStockItems.length)}</span>
                  </span>
                  {lowStockItems.length > 1 && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-600 rounded-full animate-ping"></span>
                  )}
                </>
              )}
            </button>
            
            <div className="flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-full">
              <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>

          {/* Right Section - Tablet */}
          <div className="hidden sm:flex md:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600"
            >
              <Languages className="h-5 w-5" />
            </button>
            
            <button className="p-2 hover:bg-red-50 rounded-lg relative text-gray-600 hover:text-red-600">
              <Bell className="h-5 w-5" />
              {lowStockItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{getLowStockBadge(lowStockItems.length)}</span>
                </span>
              )}
            </button>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600"
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Right Section - Mobile */}
          <div className="flex sm:hidden items-center space-x-1">
            {/* Low Stock Badge for Mobile - Compact */}
            {lowStockItems.length > 0 && (
              <span className={`${
                lowStockItems.length === 1 
                  ? 'bg-amber-100 text-amber-700 border-amber-200' 
                  : 'bg-red-100 text-red-600 border-red-200'
              } text-xs px-2 py-1 rounded-full flex items-center border mr-1`}>
                {lowStockItems.length === 1 ? (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    <span className="font-medium">1</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                    <span className="font-bold">{lowStockItems.length}</span>
                  </>
                )}
              </span>
            )}
            
            <button className="p-1.5 hover:bg-red-50 rounded-lg relative text-gray-600 hover:text-red-600">
              <Bell className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600"
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-2 py-2 space-y-1">
            {/* Low Stock Alert Detail - Mobile Only */}
            {lowStockItems.length > 0 && (
              <div className="sm:hidden px-3 py-2 mb-2 border-b border-gray-100">
                <div className={`${
                  lowStockItems.length === 1 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                } text-sm px-3 py-2 rounded-lg flex items-center justify-center border`}>
                  {lowStockItems.length === 1 ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="font-medium">1 item is running low</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                      <span className="font-medium">{lowStockItems.length} items are running low</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-100">
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@chicken.com</p>
              </div>
            </div>

            {/* Menu Items */}
            <button
              onClick={handleBackup}
              className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Cloud className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">{translations.backup || 'Backup to Cloud'}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Languages className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">Language</span>
              </div>
              <span className="text-sm font-medium text-red-600">
                {language === 'en' ? 'தமிழ்' : 'English'}
              </span>
            </button>

            <button
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">Notifications</span>
              </div>
              {lowStockItems.length > 0 && (
                <span className={`${
                  lowStockItems.length === 1 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-red-100 text-red-600'
                } text-xs px-2 py-0.5 rounded-full font-medium`}>
                  {lowStockItems.length} {lowStockItems.length === 1 ? 'alert' : 'alerts'}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
