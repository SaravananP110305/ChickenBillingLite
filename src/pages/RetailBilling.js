import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Printer, MessageCircle, Save, AlertCircle, Scale, ShoppingBag } from 'lucide-react';
import { addSale } from '../store/store';

const RetailBilling = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);
  const stock = useSelector(state => state.stock);
  const rates = useSelector(state => state.rates);

  const [customerName, setCustomerName] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedType, setSelectedType] = useState('Broiler');
  const [billItems, setBillItems] = useState([]);
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  const handleAddToBill = () => {
    if (!weight || !customerName) return;

    const rate = selectedType === 'Broiler' ? rates.broiler :
                selectedType === 'Country' ? rates.country : rates.dressed;

    const total = parseFloat(weight) * rate;
    
    setBillItems([
      ...billItems,
      {
        id: Date.now(),
        customerName,
        type: selectedType,
        weight: parseFloat(weight),
        rate,
        total
      }
    ]);

    if (total > 5000) {
      setShowCreditAlert(true);
      setTimeout(() => setShowCreditAlert(false), 3000);
    }

    setWeight('');
  };

  const handleSaveBill = () => {
    billItems.forEach(item => {
      dispatch(addSale(item));
    });
    alert(translations.retailBillSaved);
    setBillItems([]);
    setCustomerName('');
  };

  const handleWhatsAppBill = () => {
    alert(translations.whatsappSimulation);
  };

  const handlePrintBill = () => {
    alert(translations.printSimulation);
  };

  const totalBill = billItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <ShoppingBag className="h-6 w-6 text-red-600" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{translations.retailBilling}</h1>
      </div>

      {showCreditAlert && (
        <div className="bg-red-100 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded flex items-center animate-pulse">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm sm:text-base">{translations.creditLimitExceeded}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing Form */}
        <div className="lg:col-span-1 card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Scale className="h-5 w-5 text-red-600 mr-2" />
            {translations.addItem}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translations.customerName}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-field"
                placeholder={translations.enterCustomerName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chicken Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field"
              >
                {stock.map(item => (
                  <option key={item.id} value={item.type}>{item.type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translations.weight}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-field pr-12"
                  placeholder="0.00"
                  step="0.1"
                  min="0"
                />
                <span className="absolute right-3 top-2 text-gray-500 text-sm">kg</span>
              </div>
            </div>

            <button
              onClick={handleAddToBill}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
            >
              <Plus className="h-4 w-4" />
              <span>{translations.addToBill}</span>
            </button>
          </div>

          {/* Stock Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Available Stock</h3>
            <div className="space-y-2">
              {stock.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.type}</span>
                  <span className={item.quantity < 20 ? 'text-red-600 font-medium' : 'text-gray-800'}>
                    {item.quantity} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="lg:col-span-2 card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Bill Summary</h2>
          
          {billItems.length > 0 ? (
            <>
              {/* Mobile Bill Items */}
              <div className="block sm:hidden space-y-3 mb-4">
                {billItems.map(item => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.customerName}</span>
                      <span className="text-red-600 font-semibold">₹{item.total}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.type} • {item.weight} kg • ₹{item.rate}/kg
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="table-header">
                    <tr>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Weight</th>
                      <th className="px-4 py-2 text-left">Rate</th>
                      <th className="px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {billItems.map(item => (
                      <tr key={item.id}>
                        <td className="table-cell">{item.customerName}</td>
                        <td className="table-cell">{item.type}</td>
                        <td className="table-cell">{item.weight} kg</td>
                        <td className="table-cell">₹{item.rate}</td>
                        <td className="table-cell font-medium text-red-600">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Grand Total:</span>
                  <span className="text-2xl font-bold text-red-600">₹{totalBill}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <button
                  onClick={handlePrintBill}
                  className="btn-secondary flex items-center justify-center space-x-2 py-3"
                >
                  <Printer className="h-4 w-4" />
                  <span>{translations.printBill}</span>
                </button>
                <button
                  onClick={handleWhatsAppBill}
                  className="btn-secondary flex items-center justify-center space-x-2 py-3"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{translations.whatsappBill}</span>
                </button>
                <button
                  onClick={handleSaveBill}
                  className="btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <Save className="h-4 w-4" />
                  <span>{translations.saveBill}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items added to bill</p>
              <p className="text-sm text-gray-400 mt-1">Add items using the form</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetailBilling;