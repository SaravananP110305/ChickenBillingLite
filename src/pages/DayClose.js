import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, Mail, Printer, CheckCircle, AlertCircle } from 'lucide-react';

const DayClose = () => {
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);
  const sales = useSelector(state => state.sales);
  const expenses = useSelector(state => state.expenses);
  const stock = useSelector(state => state.stock);

  const [showSummary, setShowSummary] = useState(false);

  // Get today's date
  const today = new Date().toLocaleDateString();
  
  // Filter today's sales
  const todaySales = sales.filter(sale => 
    new Date(sale.date).toDateString() === new Date().toDateString()
  );

  // Filter today's expenses
  const todayExpenses = expenses.filter(expense => 
    new Date(expense.date).toDateString() === new Date().toDateString()
  );

  // Calculate totals
  const totalSales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalSales - totalExpenses;

  const handleCloseDay = () => {
    setShowSummary(true);
  };

  const handleSendEmail = () => {
    alert('Email simulation - Summary would be sent via email');
  };

  const handlePrint = () => {
    alert('Print simulation - Summary would be printed');
  };

  const handleDownload = () => {
    alert('Download simulation - Summary would be downloaded as PDF');
  };

  const handleSMS = () => {
    alert('SMS simulation - Summary would be sent via SMS');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{translations.dayClose}</h1>

      {!showSummary ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Ready to close the day?</h2>
            <p className="text-gray-600 mb-6">
              This will generate a summary of today's transactions and update stock levels.
            </p>
            <button
              onClick={handleCloseDay}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-flex items-center text-lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Close Day - {today}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h3>
              <p className="text-3xl font-bold text-green-600">₹{totalSales.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">{todaySales.length} transactions</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">{todayExpenses.length} entries</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Net Profit</h3>
              <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{netProfit.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">Today's earnings</p>
            </div>
          </div>

          {/* Detailed Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Sales Details</h2>
              {todaySales.length > 0 ? (
                <div className="space-y-3">
                  {todaySales.map(sale => (
                    <div key={sale.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{sale.customerName}</p>
                        <p className="text-sm text-gray-500">{sale.type} - {sale.weight} kg</p>
                      </div>
                      <span className="font-medium text-green-600">₹{sale.total}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 font-bold">
                    <span>Total Sales</span>
                    <span className="text-green-600">₹{totalSales}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No sales today</p>
              )}
            </div>

            {/* Expenses Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Expenses & Wastage</h2>
              {todayExpenses.length > 0 ? (
                <div className="space-y-3">
                  {todayExpenses.map(expense => (
                    <div key={expense.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{expense.type}</p>
                        <p className="text-sm text-gray-500">{expense.description}</p>
                      </div>
                      <span className="font-medium text-red-600">₹{expense.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 font-bold">
                    <span>Total Expenses</span>
                    <span className="text-red-600">₹{totalExpenses}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No expenses today</p>
              )}
            </div>

            {/* Stock Summary */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Closing Stock</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stock.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-700">{item.type}</p>
                    <p className="text-2xl font-bold mt-1">{item.quantity} kg</p>
                    <p className="text-sm text-gray-500">Value: ₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Share Summary</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 inline-flex items-center"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 inline-flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </button>
              <button
                onClick={handleSMS}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 inline-flex items-center"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                SMS
              </button>
              <button
                onClick={handleDownload}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 inline-flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Note: This is a UI simulation. No actual emails or SMS will be sent.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayClose;