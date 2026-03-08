import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  Printer, 
  MessageCircle, 
  Save, 
  AlertCircle, 
  User,
  Truck,
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  Shield
} from 'lucide-react';
import { addSale } from '../store/store';

const WholesaleBilling = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.language);
  const translations = useSelector(state => state.translations[language]);
  const customers = useSelector(state => state.customers);
  const stock = useSelector(state => state.stock);
  const rates = useSelector(state => state.rates);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedType, setSelectedType] = useState('Broiler');
  const [billItems, setBillItems] = useState([]);
  const [showCreditAlert, setShowCreditAlert] = useState(false);
  const [creditMessage, setCreditMessage] = useState('');

  const handleAddToBill = () => {
    if (!weight || !selectedCustomer) return;

    const customer = customers.find(c => c.id === parseInt(selectedCustomer));
    const rate = selectedType === 'Broiler' ? rates.wholeSaleBroiler :
                selectedType === 'Country' ? rates.wholeSaleCountry : rates.wholeSaleDressed;

    const total = parseFloat(weight) * rate;
    
    // Check credit limit
    if (customer) {
      const newCreditAmount = customer.currentCredit + total;
      if (newCreditAmount > customer.creditLimit) {
        setCreditMessage(`${customer.name}: Credit limit of ₹${customer.creditLimit} will be exceeded by ₹${newCreditAmount - customer.creditLimit}`);
        setShowCreditAlert(true);
        setTimeout(() => setShowCreditAlert(false), 5000);
      }
    }

    setBillItems([
      ...billItems,
      {
        id: Date.now(),
        customerId: customer?.id,
        customerName: customer?.name,
        type: selectedType,
        weight: parseFloat(weight),
        rate,
        total
      }
    ]);

    setWeight('');
  };

  const handleSaveBill = () => {
    billItems.forEach(item => {
      dispatch(addSale({
        ...item,
        type: 'wholesale'
      }));
    });
    alert(translations.wholesaleBillSaved);
    setBillItems([]);
    setSelectedCustomer('');
  };

  const handleWhatsAppBill = () => {
    const customer = customers.find(c => c.id === parseInt(selectedCustomer));
    alert(`📱 ${translations.whatsappSimulation} ${customer?.name}`);
  };

  const handlePrintBill = () => {
    alert(translations.printSimulation);
  };

  const totalBill = billItems.reduce((sum, item) => sum + item.total, 0);
  const selectedCustomerData = customers.find(c => c.id === parseInt(selectedCustomer));

  // Calculate credit percentage
  const creditPercentage = selectedCustomerData 
    ? (selectedCustomerData.currentCredit / selectedCustomerData.creditLimit) * 100 
    : 0;
  
  const remainingCredit = selectedCustomerData 
    ? selectedCustomerData.creditLimit - selectedCustomerData.currentCredit 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with Non-Veg Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Truck className="h-6 w-6 text-red-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{translations.wholesaleBilling}</h1>
          <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            B2B
          </div>
        </div>
        
        {/* Credit Summary Badge */}
        {selectedCustomerData && (
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-full">
            <CreditCard className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">
              {translations.creditAvailable}: ₹{remainingCredit.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Credit Alert */}
      {showCreditAlert && (
        <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded-lg flex items-center animate-pulse">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm sm:text-base">{creditMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing Form */}
        <div className="lg:col-span-1 card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Users className="h-5 w-5 text-red-600 mr-2" />
            {translations.addWholesaleItem}
          </h2>
          
          <div className="space-y-4">
            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translations.selectCustomer}
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="input-field"
              >
                <option value="">Select a customer</option>
                {customers.map(customer => {
                  const creditPercent = (customer.currentCredit / customer.creditLimit) * 100;
                  return (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - ₹{customer.currentCredit.toLocaleString()}/₹{customer.creditLimit.toLocaleString()} ({Math.round(creditPercent)}%)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Customer Info - Enhanced Credit Display */}
            {selectedCustomerData && (
              <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-lg border-2 border-red-600">
                {/* Customer Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-600 p-2 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 text-lg">{selectedCustomerData.name}</span>
                      <p className="text-xs text-gray-500">{translations.wholesaleBilling}</p>
                    </div>
                  </div>
                  <Shield className="h-5 w-5 text-red-600" />
                </div>

                {/* Credit Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">{translations.customerCredit} {translations.customerName}</p>
                    <p className="text-lg font-bold text-gray-800">₹{selectedCustomerData.creditLimit.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">பயன்படுத்தப்பட்ட கடன்</p>
                    <p className="text-lg font-bold text-red-600">₹{selectedCustomerData.currentCredit.toLocaleString()}</p>
                  </div>
                </div>

                {/* Credit Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Credit Usage</span>
                    <span className="text-sm font-bold text-red-600">{Math.round(creditPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        creditPercentage > 90 ? 'bg-red-600' :
                        creditPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${creditPercentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Credit Status */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        remainingCredit > 10000 ? 'bg-green-500' :
                        remainingCredit > 5000 ? 'bg-orange-500' : 'bg-red-600'
                      }`}></div>
                      <span className="text-xs text-gray-600">
                        {remainingCredit > 10000 ? 'Healthy Credit' :
                         remainingCredit > 5000 ? 'Moderate Credit' : 'Low Credit'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Remaining: ₹{remainingCredit.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-red-200">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-gray-600">Avg. Monthly: ₹45,000</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-gray-600">Payment: 30 days</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chicken Type Selection */}
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
                  <option key={item.id} value={item.type}>
                    {item.type} (₹
                    {item.type === 'Broiler' ? rates.wholeSaleBroiler :
                     item.type === 'Country' ? rates.wholeSaleCountry : rates.wholeSaleDressed}/kg)
                  </option>
                ))}
              </select>
            </div>

            {/* Weight Input */}
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

            {/* Add to Bill Button */}
            <button
              onClick={handleAddToBill}
              disabled={!selectedCustomer || !weight}
              className={`w-full text-white px-4 py-3 rounded-md flex items-center justify-center space-x-2 transition-colors ${
                !selectedCustomer || !weight 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{translations.addToBill}</span>
            </button>
          </div>

          {/* Wholesale Rates Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <span className="w-1.5 h-4 bg-red-600 rounded-full mr-2"></span>
              Today's Wholesale Rates
            </h3>
            <div className="space-y-2">
              {stock.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <span className="text-gray-700">{item.type}</span>
                  <span className="font-semibold text-red-600">
                    ₹{item.type === 'Broiler' ? rates.wholeSaleBroiler :
                       item.type === 'Country' ? rates.wholeSaleCountry : rates.wholeSaleDressed}/kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="lg:col-span-2 card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Truck className="h-5 w-5 text-red-600 mr-2" />
            Wholesale Bill Summary
          </h2>
          
          {billItems.length > 0 ? (
            <>
              {/* Mobile View */}
              <div className="block sm:hidden space-y-3 mb-4">
                {billItems.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{item.customerName}</span>
                      <span className="text-red-600 font-bold">₹{item.total}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-1 text-gray-700">{item.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="ml-1 text-gray-700">{item.weight} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Rate:</span>
                        <span className="ml-1 text-gray-700">₹{item.rate}/kg</span>
                      </div>
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
                      <tr key={item.id} className="hover:bg-red-50 transition-colors">
                        <td className="table-cell font-medium">{item.customerName}</td>
                        <td className="table-cell">{item.type}</td>
                        <td className="table-cell">{item.weight} kg</td>
                        <td className="table-cell">₹{item.rate}</td>
                        <td className="table-cell font-semibold text-red-600">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Section with Credit Impact */}
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-3">
                  <span className="text-lg font-semibold text-gray-700">Grand Total:</span>
                  <span className="text-2xl font-bold text-red-600">₹{totalBill}</span>
                </div>
                
                {selectedCustomerData && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Current Credit:</span>
                      <span className="font-medium text-gray-800">₹{selectedCustomerData.currentCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">After this bill:</span>
                      <span className={`font-medium ${selectedCustomerData.currentCredit + totalBill > selectedCustomerData.creditLimit ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{(selectedCustomerData.currentCredit + totalBill).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Remaining Limit:</span>
                      <span className={`font-medium ${selectedCustomerData.creditLimit - (selectedCustomerData.currentCredit + totalBill) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{(selectedCustomerData.creditLimit - (selectedCustomerData.currentCredit + totalBill)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
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
              <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No wholesale items added</p>
              <p className="text-sm text-gray-400 mt-1">Select a customer and add items to the bill</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WholesaleBilling;