import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar translations={translations} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header translations={translations} />
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
