import React from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import './output.css';


function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <CurrencyConverter />
    </div>
  );
}

export default App;
