import { configureStore, createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('chickenBillingState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('chickenBillingState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

// Initial State
const initialState = loadState() || {
  language: 'en',
  stock: [
    { id: 1, type: 'Broiler', quantity: 50, price: 180, unit: 'kg' },
    { id: 2, type: 'Country', quantity: 30, price: 250, unit: 'kg' },
    { id: 3, type: 'Dressed', quantity: 25, price: 220, unit: 'kg' },
  ],
  customers: [
    { id: 1, name: 'Kumar Stores', type: 'wholesale', creditLimit: 50000, currentCredit: 25000 },
    { id: 2, name: 'Murugan Catering', type: 'wholesale', creditLimit: 75000, currentCredit: 45000 },
    { id: 3, name: 'Selvi Hotel', type: 'wholesale', creditLimit: 60000, currentCredit: 12000 },
  ],
  sales: [],
  expenses: [],
  rates: {
    broiler: 180,
    country: 250,
    dressed: 220,
    wholeSaleBroiler: 165,
    wholeSaleCountry: 230,
    wholeSaleDressed: 200,
  },
  translations: {
    en: {
      // Navigation
      dashboard: 'Dashboard',
      retailBilling: 'Retail Billing',
      wholesaleBilling: 'Wholesale Billing',
      stock: 'Stock Management',
      dayClose: 'Day Close',
      reports: 'Reports',
      settings: 'Settings',
      
      // Dashboard
      totalSales: 'Total Sales',
      totalStock: 'Total Stock',
      lowStock: 'Low Stock Alert',
      todaysSales: "Today's Sales",
      currentStock: 'Current Stock',
      
      // Billing
      customerName: 'Customer Name',
      weight: 'Weight (kg)',
      rate: 'Rate (₹/kg)',
      total: 'Total (₹)',
      addToBill: 'Add to Bill',
      printBill: 'Print Bill',
      whatsappBill: 'WhatsApp Bill',
      saveBill: 'Save Bill',
      addItem: 'Add Item',
      enterCustomerName: 'Enter customer name',
      selectCustomer: 'Select Customer',
      addWholesaleItem: 'Add Wholesale Item',
      billSavedSuccessfully: '✅ Bill saved successfully!',
      retailBillSaved: '✅ Retail bill saved successfully!',
      wholesaleBillSaved: '✅ Wholesale bill saved successfully!',
      
      // Credit
      customerCredit: 'Customer Credit',
      creditLimitExceeded: 'Credit Limit Exceeded!',
      creditAvailable: 'Credit Available',
      
      // Stock Management
      addStock: 'Add Stock',
      adjustStock: 'Adjust Stock',
      wastage: 'Wastage Entry',
      stockType: 'Stock Type',
      stockQuantity: 'Quantity',
      stockPrice: 'Price',
      wastageReason: 'Wastage Reason',
      stockUpdated: '✅ Stock updated successfully!',
      wastageRecorded: '✅ Wastage recorded successfully!',
      insufficientStock: '❌ Insufficient stock!',
      editStock: 'Edit Stock',
      removeStock: 'Remove Stock',
      
      // Day Close
      closeDay: 'Close Day',
      dayCloseTitle: 'Ready to close the day?',
      dayCloseDescription: 'This will generate a summary of today\'s transactions and update stock levels.',
      closeDayButton: 'Close Day',
      salesDetails: 'Sales Details',
      expensesAndWastage: 'Expenses & Wastage',
      closingStock: 'Closing Stock',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit',
      noSalestoday: 'No sales today',
      noExpensesToday: 'No expenses today',
      transactions: 'transactions',
      entries: 'entries',
      todaysEarnings: "Today's earnings",
      
      // Reports
      reports: 'Reports',
      downloadReport: 'Download Report',
      today: 'Today',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      last12Months: 'Last 12 Months',
      allTime: 'All Time',
      salesReport: 'Sales Report',
      profitReport: 'Profit Report',
      stockReport: 'Stock Report',
      
      // Settings
      settings: 'Settings',
      languageSettings: 'Language Settings',
      rateConfiguration: 'Rate Configuration',
      retailRates: 'Retail Rates',
      wholesaleRates: 'Wholesale Rates',
      broiler: 'Broiler',
      country: 'Country',
      dressed: 'Dressed',
      language: 'Language',
      english: 'English',
      tamil: 'Tamil',
      switchToTamil: 'Switch to Tamil',
      switchToEnglish: 'Switch to English',
      current: 'Current',
      ratesUpdated: '✅ Rates updated successfully!',
      
      // Type names
      broilerType: 'Broiler',
      countryType: 'Country',
      dressedType: 'Dressed',
      
      // Buttons
      googleDriveBackup: '☁️ Google Drive backup simulation - UI only',
      whatsappSimulation: '📱 WhatsApp bill simulation - Bill would be sent via WhatsApp',
      printSimulation: '🖨️ Print simulation - Bill would be printed',
      emailSimulation: 'Email simulation - Summary would be sent via email',
      smsSimulation: 'SMS simulation - Summary would be sent via SMS',
      downloadSimulation: 'Download simulation - Summary would be downloaded as PDF',
      downloadCSVSimulation: 'Download simulation - Report would be downloaded as CSV',
      
      // Common
      send: 'Send',
      download: 'Download',
      print: 'Print',
      save: 'Save',
      update: 'Update',
      delete: 'Delete',
      cancel: 'Cancel',
      edit: 'Edit',
      add: 'Add',
      kg: 'kg',
    },
    ta: {
      // Navigation
      dashboard: 'டாஷ்போர்டு',
      retailBilling: 'சில்லறை விற்பனை',
      wholesaleBilling: 'மொத்த விற்பனை',
      stock: 'இருப்பு மேலாண்மை',
      dayClose: 'நாள் முடிவு',
      reports: 'அறிக்கைகள்',
      settings: 'அமைப்புகள்',
      
      // Dashboard
      totalSales: 'மொத்த விற்பனை',
      totalStock: 'மொத்த இருப்பு',
      lowStock: 'குறைந்த இருப்பு எச்சரிக்கை',
      todaysSales: 'இன்றைய விற்பனை',
      currentStock: 'தற்போதைய இருப்பு',
      
      // Billing
      customerName: 'வாடிக்கையாளர் பெயர்',
      weight: 'எடை (கிலோ)',
      rate: 'விலை (₹/கிலோ)',
      total: 'மொத்தம் (₹)',
      addToBill: 'பில்லில் சேர்',
      printBill: 'பில் அச்சிடுக',
      whatsappBill: 'வாட்ஸ்அப்பில் பில்',
      saveBill: 'பில் சேமி',
      addItem: 'உருப்பொருள் சேர்க்க',
      enterCustomerName: 'வாடிக்கையாளர் பெயர் உள்ளிடவும்',
      selectCustomer: 'வாடிக்கையாளர் தேர்ந்தெடுக்கவும்',
      addWholesaleItem: 'மொத்த விற்பனை உருப்பொருள் சேர்க்க',
      billSavedSuccessfully: '✅ பில் வெற்றிகரமாக சேமிக்கப்பட்டது!',
      retailBillSaved: '✅ சில்லறை பில் வெற்றிகரமாக சேமிக்கப்பட்டது!',
      wholesaleBillSaved: '✅ மொத்த பில் வெற்றிகரமாக சேமிக்கப்பட்டது!',
      
      // Credit
      customerCredit: 'வாடிக்கையாளர் கடன்',
      creditLimitExceeded: 'கடன் வரம்பு மீறப்பட்டது!',
      creditAvailable: 'கிடைக்கும் கடன்',
      
      // Stock Management
      addStock: 'இருப்பு சேர்க்க',
      adjustStock: 'இருப்பு சரிசெய்',
      wastage: 'விரயம் பதிவு',
      stockType: 'பங்கின் வகை',
      stockQuantity: 'அளவு',
      stockPrice: 'விலை',
      wastageReason: 'விரயம் காரணம்',
      stockUpdated: '✅ இருப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
      wastageRecorded: '✅ விரயம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!',
      insufficientStock: '❌ போதுமான இருப்பு இல்லை!',
      editStock: 'இருப்பு திருத்து',
      removeStock: 'இருப்பு அகற்று',
      
      // Day Close
      closeDay: 'நாள் முடி',
      dayCloseTitle: 'நாளை முடிக்க தயாரா?',
      dayCloseDescription: 'இது இன்றைய பரிவர்த்தனைகளின் சாராம்சம் உருவாக்கி இருப்பு நிலைகளை புதுப்பிக்கும்.',
      closeDayButton: 'நாள் முடிவு',
      salesDetails: 'விற்பனை விவரங்கள்',
      expensesAndWastage: 'செலவுகள் மற்றும் விரயம்',
      closingStock: 'முடிக்கும் இருப்பு',
      totalExpenses: 'மொத்த செலவுகள்',
      netProfit: 'நிகர லாभม்',
      noSalestoday: 'இன்று விற்பனை இல்லை',
      noExpensesToday: 'இன்று செலவுகள் இல்லை',
      transactions: 'பரிவர்த்தனைகள்',
      entries: 'உள்ளீடுகள்',
      todaysEarnings: 'இன்றைய வருமானம்',
      
      // Reports
      reports: 'அறிக்கைகள்',
      downloadReport: 'அறிக்கை பதிவிறக்கம் செய்க',
      today: 'இன்று',
      last7Days: 'கடந்த 7 நாட்கள்',
      last30Days: 'கடந்த 30 நாட்கள்',
      last12Months: 'கடந்த 12 மாதங்கள்',
      allTime: 'அனைத்து நேரம்',
      salesReport: 'விற்பனை அறிக்கை',
      profitReport: 'லாभம் அறிக்கை',
      stockReport: 'இருப்பு அறிக்கை',
      
      // Settings
      settings: 'அமைப்புகள்',
      languageSettings: 'மொழி அமைப்புகள்',
      rateConfiguration: 'விலை கட்டமைப்பு',
      retailRates: 'சில்லறை வீதம்',
      wholesaleRates: 'மொத்த விலை',
      broiler: 'கோழி',
      country: 'நாட்டு',
      dressed: 'கூறப்பட்ட',
      language: 'மொழி',
      english: 'ஆங்கிலம்',
      tamil: 'தமிழ்',
      switchToTamil: 'தமிழுக்கு மாற்று',
      switchToEnglish: 'ஆங்கிலத்திற்கு மாற்று',
      current: 'தற்போதைய',
      ratesUpdated: '✅ விலைகள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
      
      // Type names
      broilerType: 'கோழி',
      countryType: 'நாட்டு',
      dressedType: 'கூறப்பட்ட',
      
      // Buttons
      googleDriveBackup: '☁️ Google Drive பின்தங்கிய உருவகસிப்பு - UI மட்டுமே',
      whatsappSimulation: '📱 WhatsApp பில் உருவகசிப்பு - பில் WhatsApp வழியாக அனுப்பப்படும்',
      printSimulation: '🖨️ அச்சிடு உருவகசிப்பு - பில் அச்சிடப்படும்',
      emailSimulation: 'மின்னஞ்சல் உருவகசிப்பு - சாராம்சம் மின்னஞ்சல் வழியாக அனுப்பப்படும்',
      smsSimulation: 'SMS உருவகசிப்பு - சாராம்சம் SMS வழியாக அனுப்பப்படும்',
      downloadSimulation: 'பதிவிறக்கம் உருவகசிப்பு - சாராம்சம் PDF ஆக பதிவிறக்கம் செய்யப்படும்',
      downloadCSVSimulation: 'பதிவிறக்கம் உருவகசிப்பு - அறிக்கை CSV ஆக பதிவிறக்கம் செய்யப்படும்',
      
      // Common
      send: 'அனுப்பு',
      download: 'பதிவிறக்கம் செய்க',
      print: 'அச்சிடுக',
      save: 'சேமி',
      update: 'புதுப்பிக்க',
      delete: 'நீக்கு',
      cancel: 'ரத்துசெய்',
      edit: 'திருத்து',
      add: 'சேர்க்க',
      kg: 'கிலோ',
    }
  }
};

// Create Slices
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      saveState(state);
    },
    updateStock: (state, action) => {
      const index = state.stock.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.stock[index] = action.payload;
      }
      saveState(state);
    },
    addStock: (state, action) => {
      state.stock.push({
        id: Date.now(),
        ...action.payload
      });
      saveState(state);
    },
    addSale: (state, action) => {
      state.sales.push({
        id: Date.now(),
        date: new Date().toISOString(),
        ...action.payload
      });
      
      // Update stock
      const stockItem = state.stock.find(item => item.type === action.payload.type);
      if (stockItem) {
        stockItem.quantity -= action.payload.weight;
      }
      saveState(state);
    },
    addExpense: (state, action) => {
      state.expenses.push({
        id: Date.now(),
        date: new Date().toISOString(),
        ...action.payload
      });
      saveState(state);
    },
    updateCustomerCredit: (state, action) => {
      const customer = state.customers.find(c => c.id === action.payload.id);
      if (customer) {
        customer.currentCredit += action.payload.amount;
      }
      saveState(state);
    },
    updateRates: (state, action) => {
      state.rates = { ...state.rates, ...action.payload };
      saveState(state);
    },
  },
});

export const { 
  setLanguage, 
  updateStock, 
  addStock, 
  addSale, 
  addExpense, 
  updateCustomerCredit,
  updateRates 
} = appSlice.actions;

export const store = configureStore({
  reducer: appSlice.reducer,
});