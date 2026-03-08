import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  Minus, 
  AlertTriangle, 
  Package,
  Edit3,
  XCircle
} from 'lucide-react';
import { updateStock, addStock, addExpense } from '../store/store';

const StockManagement = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);
  const stock = useSelector(state => state.stock);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showWastageForm, setShowWastageForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [wastageReason, setWastageReason] = useState('');
  const [newStock, setNewStock] = useState({
    type: '',
    quantity: '',
    price: '',
    unit: 'kg'
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const handleAddStock = () => {
    if (selectedItem) {
      const item = stock.find(i => i.id === parseInt(selectedItem));
      if (item) {
        dispatch(updateStock({
          ...item,
          quantity: item.quantity + parseFloat(quantity)
        }));
      }
    } else {
      dispatch(addStock({
        type: newStock.type,
        quantity: parseFloat(newStock.quantity),
        price: parseFloat(newStock.price),
        unit: newStock.unit
      }));
    }

    setShowAddForm(false);
    setSelectedItem(null);
    setQuantity('');
    setNewStock({ type: '', quantity: '', price: '', unit: 'kg' });
    alert('✅ Stock updated successfully!');
  };

  const handleWastage = () => {
    if (!selectedItem || !quantity || !wastageReason) return;

    const item = stock.find(i => i.id === parseInt(selectedItem));
    if (item && parseFloat(quantity) <= item.quantity) {
      dispatch(updateStock({
        ...item,
        quantity: item.quantity - parseFloat(quantity)
      }));

      dispatch(addExpense({
        type: 'Wastage',
        amount: parseFloat(quantity) * item.price,
        description: `${item.type} wastage: ${wastageReason}`,
        quantity: parseFloat(quantity)
      }));

      setShowWastageForm(false);
      setSelectedItem(null);
      setQuantity('');
      setWastageReason('');
      alert('✅ Wastage recorded successfully!');
    } else {
      alert('❌ Insufficient stock!');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header with Actions */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
            {translations.stock}
          </h1>
        </div>
        
        <div className="flex w-full xs:w-auto space-x-2">
          <button
            onClick={() => {
              setShowAddForm(true);
              setShowWastageForm(false);
            }}
            className="flex-1 xs:flex-none bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 inline-flex items-center justify-center text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">{isMobile ? 'Add' : translations.addStock}</span>
          </button>
          <button
            onClick={() => {
              setShowWastageForm(true);
              setShowAddForm(false);
            }}
            className="flex-1 xs:flex-none bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 inline-flex items-center justify-center text-sm sm:text-base"
          >
            <Minus className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">{isMobile ? 'Waste' : translations.wastage}</span>
          </button>
        </div>
      </div>

      {/* Stock Grid/Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Mobile/Tablet Card View */}
        {(isMobile || isTablet) ? (
          <div className="divide-y divide-gray-200">
            {stock.map((item) => {
              const totalValue = item.quantity * item.price;
              const isLowStock = item.quantity < 20;
              const isCritical = item.quantity < 10;
              
              return (
                <div 
                  key={item.id} 
                  className={`p-4 hover:bg-red-50 transition-colors ${
                    isCritical ? 'bg-red-50' : isLowStock ? 'bg-orange-50' : ''
                  }`}
                >
                  {/* Header with Type and Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isCritical ? 'bg-red-600' : isLowStock ? 'bg-orange-500' : 'bg-green-500'
                      }`}></div>
                      <h3 className="font-semibold text-gray-800 truncate">{item.type}</h3>
                    </div>
                    {isCritical && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center flex-shrink-0 ml-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Critical
                      </span>
                    )}
                    {isLowStock && !isCritical && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center flex-shrink-0 ml-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low
                      </span>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-base font-bold text-gray-800">{item.quantity} kg</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-base font-bold text-gray-800">₹{item.price}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded col-span-2">
                      <p className="text-xs text-gray-500">Total Value</p>
                      <p className="text-base font-bold text-gray-800">₹{totalValue.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Progress Bar and Actions */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            isCritical ? 'bg-red-600' : isLowStock ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((item.quantity / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedItem(item.id);
                        setShowAddForm(true);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center flex-shrink-0"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Adjust
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stock.map((item) => {
                  const totalValue = item.quantity * item.price;
                  const isLowStock = item.quantity < 20;
                  const isCritical = item.quantity < 10;
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-red-50 transition-colors ${
                        isCritical ? 'bg-red-50' : isLowStock ? 'bg-orange-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            isCritical ? 'bg-red-600' : isLowStock ? 'bg-orange-500' : 'bg-green-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${
                          isCritical ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                          {item.quantity} kg
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">₹{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">₹{totalValue.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isCritical ? (
                          <span className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs w-fit">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Critical
                          </span>
                        ) : isLowStock ? (
                          <span className="flex items-center text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs w-fit">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs w-fit">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedItem(item.id);
                            setShowAddForm(true);
                          }}
                          className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Stock Modal - Responsive */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                <Package className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <span className="truncate">{selectedItem ? 'Adjust Stock' : translations.addStock}</span>
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {!selectedItem && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chicken Type
                  </label>
                  <input
                    type="text"
                    value={newStock.type}
                    onChange={(e) => setNewStock({...newStock, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    placeholder="e.g., Broiler, Country"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={quantity || (selectedItem ? '' : newStock.quantity)}
                    onChange={(e) => {
                      if (selectedItem) {
                        setQuantity(e.target.value);
                      } else {
                        setNewStock({...newStock, quantity: e.target.value});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pr-12 text-sm"
                    step="0.1"
                    min="0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 text-sm">kg</span>
                </div>
              </div>

              {!selectedItem && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per kg (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={newStock.price}
                      onChange={(e) => setNewStock({...newStock, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pl-8 text-sm"
                      step="1"
                      min="0"
                    />
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={handleAddStock}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm sm:text-base"
                >
                  {selectedItem ? 'Update Stock' : 'Add Stock'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wastage Modal - Responsive */}
      {showWastageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                <Minus className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <span className="truncate">{translations.wastage}</span>
              </h2>
              <button
                onClick={() => {
                  setShowWastageForm(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Item
                </label>
                <select
                  value={selectedItem || ''}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="">Select an item</option>
                  {stock.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.type} (Available: {item.quantity} kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wastage Quantity (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pr-12 text-sm"
                    step="0.1"
                    min="0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 text-sm">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={wastageReason}
                  onChange={(e) => setWastageReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="e.g., Spoiled, Damaged"
                />
              </div>

              {selectedItem && quantity && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Loss Amount: <span className="font-bold text-red-600">
                      ₹{(parseFloat(quantity) * (stock.find(i => i.id === parseInt(selectedItem))?.price || 0)).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={handleWastage}
                  disabled={!selectedItem || !quantity || !wastageReason}
                  className={`flex-1 text-white px-4 py-2 rounded-md text-sm sm:text-base ${
                    !selectedItem || !quantity || !wastageReason
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Record Wastage
                </button>
                <button
                  onClick={() => {
                    setShowWastageForm(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;