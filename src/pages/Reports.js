import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';

const Reports = () => {
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);
  const sales = useSelector(state => state.sales);
  const expenses = useSelector(state => state.expenses);
  const stock = useSelector(state => state.stock);

  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');

  // Filter data based on date range
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();

    switch(dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0,0,0,0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    const filteredSales = sales.filter(sale => new Date(sale.date) >= startDate);
    const filteredExpenses = expenses.filter(expense => new Date(expense.date) >= startDate);

    return { sales: filteredSales, expenses: filteredExpenses };
  };

  const { sales: filteredSales, expenses: filteredExpenses } = getFilteredData();

  // Calculate totals
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalSales - totalExpenses;

  // Group sales by type
  const salesByType = filteredSales.reduce((acc, sale) => {
    acc[sale.type] = (acc[sale.type] || 0) + sale.total;
    return acc;
  }, {});

  const handleDownloadReport = () => {
    alert('Download simulation - Report would be downloaded as CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{translations.reports}</h1>
        <button
          onClick={handleDownloadReport}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 inline-flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setReportType('sales')}
              className={`px-4 py-2 rounded-md ${
                reportType === 'sales'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sales Report
            </button>
            <button
              onClick={() => setReportType('stock')}
              className={`px-4 py-2 rounded-md ${
                reportType === 'stock'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Stock Report
            </button>
            <button
              onClick={() => setReportType('expenses')}
              className={`px-4 py-2 rounded-md ${
                reportType === 'expenses'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expenses Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalSales.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{filteredSales.length} transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{filteredExpenses.length} entries</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{netProfit.toLocaleString()}
              </p>
            </div>
            <TrendingUp className={`h-8 w-8 ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {stock.reduce((sum, item) => sum + item.quantity, 0)} kg
              </p>
            </div>
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{stock.length} types</p>
        </div>
      </div>

      {/* Report Tables */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {reportType === 'sales' && (
          <div>
            <div className="px-6 py-4 bg-red-50 border-b">
              <h2 className="text-lg font-semibold text-red-800">Sales Report</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.weight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{sale.rate}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">₹{sale.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-red-50">
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-right font-bold text-red-800">Grand Total:</td>
                  <td className="px-6 py-4 font-bold text-red-600">₹{totalSales}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {reportType === 'stock' && (
          <div>
            <div className="px-6 py-4 bg-red-50 border-b">
              <h2 className="text-lg font-semibold text-red-800">Stock Report</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Price/kg</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stock.map(item => (
                  <tr key={item.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{(item.quantity * item.price).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity < 20 ? (
                        <span className="text-red-600 font-medium">Low Stock</span>
                      ) : (
                        <span className="text-green-600 font-medium">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'expenses' && (
          <div>
            <div className="px-6 py-4 bg-red-50 border-b">
              <h2 className="text-lg font-semibold text-red-800">Expenses Report</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">₹{expense.amount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-red-50">
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right font-bold text-red-800">Total Expenses:</td>
                  <td className="px-6 py-4 font-bold text-red-600">₹{totalExpenses}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Sales by Type Chart (simplified) */}
      {reportType === 'sales' && Object.keys(salesByType).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-red-800">Sales by Type</h2>
          <div className="space-y-3">
            {Object.entries(salesByType).map(([type, amount]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{type}</span>
                  <span className="font-medium">₹{amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(amount / totalSales) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;