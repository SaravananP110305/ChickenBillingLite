import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Package,
  Moon,
  FileText,
  Settings,
  Store,
  Menu,
  X,
} from "lucide-react";
import { GiChicken } from "react-icons/gi";

const Sidebar = ({ translations }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: translations.dashboard,
    },
    {
      path: "/retail-billing",
      icon: ShoppingCart,
      label: translations.retailBilling,
    },
    {
      path: "/wholesale-billing",
      icon: Truck,
      label: translations.wholesaleBilling,
    },
    { path: "/stock", icon: Package, label: translations.stock },
    { path: "/day-close", icon: Moon, label: translations.dayClose },
    { path: "/reports", icon: FileText, label: translations.reports },
    { path: "/settings", icon: Settings, label: translations.settings },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-3 sm:top-3 left-2 sm:left-3 z-50 bg-red-600 text-white p-1.5 sm:p-2 rounded-md hover:bg-red-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 sm:h-6 w-5 sm:w-6" />
        ) : (
          <Menu className="h-5 sm:h-6 w-5 sm:w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 md:w-72 lg:w-64 bg-white shadow-lg z-40 flex flex-col
      `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-14 sm:h-16 bg-red-600 shrink-0">
          <GiChicken className="h-7 sm:h-9 w-7 sm:w-9 text-white" />
          <span className="ml-2 text-base sm:text-lg font-bold text-white">
            Chicken Billing Lite
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto mt-4 sm:mt-6 px-2 sm:px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 sm:px-4 py-2.5 sm:py-3 mb-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-red-50 text-red-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="h-4 sm:h-5 w-4 sm:w-5 shrink-0" />
              <span className="ml-3 text-sm sm:text-base">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 shrink-0">
          <div className="text-xs text-gray-500 text-center">
            <span className="text-red-600 font-semibold">
              🐔 Chicken Billing Lite
            </span>
            <br />
            v1.0.0
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
