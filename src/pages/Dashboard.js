import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, Package, AlertTriangle, DollarSign, Clock, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  const stock = useSelector(state => state.stock);
  const sales = useSelector(state => state.sales);
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);

  const todaySales = sales.filter(sale => 
    new Date(sale.date).toDateString() === new Date().toDateString()
  );

  const totalSalesToday = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalStock = stock.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = stock.filter(item => item.quantity < 20);

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-xl sm:text-2xl font-semibold mt-1 text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Non-Veg Theme */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <span className="bg-red-600 w-2 h-8 rounded-full mr-3"></span>
          {translations.dashboard}
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={TrendingUp}
          label={translations.totalSales}
          value={`₹${totalSalesToday.toLocaleString()}`}
          bgColor="bg-red-600"
        />
        <StatCard
          icon={Package}
          label={translations.totalStock}
          value={`${totalStock} kg`}
          bgColor="bg-red-600"
        />
        <StatCard
          icon={AlertTriangle}
          label={translations.lowStock}
          value={lowStockItems.length}
          bgColor="bg-red-600"
        />
        <StatCard
          icon={DollarSign}
          label={translations.todaysSales}
          value={todaySales.length}
          bgColor="bg-red-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Status */}
        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Package className="h-5 w-5 text-red-600 mr-2" />
            {translations.currentStock}
          </h2>
          <div className="space-y-4">
            {stock.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4 mb-2 sm:mb-0">
                  <span className="font-medium text-gray-800">{item.type}</span>
                  <span className="text-sm text-gray-500 sm:hidden">₹{item.price}/kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{item.quantity} kg</span>
                    <span className="text-gray-600 hidden sm:inline">₹{item.price}/kg</span>
                  </div>
                  <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.quantity < 20 ? 'bg-red-600' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((item.quantity / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
            Recent Sales
          </h2>
          {todaySales.length > 0 ? (
            <div className="space-y-3">
              {todaySales.slice(0, 5).map(sale => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{sale.customerName}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {sale.type} • {sale.weight} kg • {new Date(sale.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="font-semibold text-red-600">₹{sale.total}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sales today</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {/* <div className="card p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-red-600 rounded-full mr-3"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="btn-secondary text-sm sm:text-base">Add Stock</button>
            <button className="btn-secondary text-sm sm:text-base">Record Sale</button>
            <button className="btn-secondary text-sm sm:text-base">View Reports</button>
            <button className="btn-primary text-sm sm:text-base">Close Day</button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;