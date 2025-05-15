import React, { useEffect, useState } from 'react';

const CurrencyConverter = () => {
  const [oficial, setOficial] = useState(null);
  const [paralelo, setParalelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [inputAmount, setInputAmount] = useState('');
  const [conversionType, setConversionType] = useState('usdToVes'); // 'usdToVes' o 'vesToUsd'
  const [selectedRate, setSelectedRate] = useState('promedio'); // 'oficial', 'paralelo', 'promedio'

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const [oficialRes, paraleloRes] = await Promise.all([
          fetch('https://ve.dolarapi.com/v1/dolares/oficial'),
          fetch('https://ve.dolarapi.com/v1/dolares/paralelo'),
        ]);

        const [oficialData, paraleloData] = await Promise.all([
          oficialRes.json(),
          paraleloRes.json(),
        ]);

        setOficial(oficialData);
        setParalelo(paraleloData);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los datos del dólar:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const getRate = () => {
    if (!oficial || !paralelo) return 0;

    switch (selectedRate) {
      case 'oficial':
        return oficial.promedio || 0;
      case 'paralelo':
        return paralelo.promedio || 0;
      case 'promedio':
        return ((oficial.promedio || 0) + (paralelo.promedio || 0)) / 2;
      default:
        return 0;
    }
  };

  const rate = getRate();
  const amountNum = parseFloat(inputAmount);
  let convertedAmount = '';

  if (!isNaN(amountNum) && rate) {
    if (conversionType === 'usdToVes') {
      convertedAmount = (amountNum * rate).toFixed(2);
    } else {
      convertedAmount = (amountNum / rate).toFixed(2);
    }
  }

  const lastUpdate = oficial?.fechaActualizacion || paralelo?.fechaActualizacion || 'N/A';

  return (
    <div className="bg-gray-800 p-6 text-white rounded-xl flex flex-col shadow-md w-full max-w-sm text-center">
      <h2 className="text-xl font-bold mb-4">Dólar en Venezuela</h2>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : error ? (
        <p className="text-red-600">Error al cargar los datos</p>
      ) : (
        <>
          <div className="mb-4">
            <p><strong>Oficial (BCV):</strong> Bs. {oficial?.promedio ?? 'N/A'}</p>
            <p><strong>Paralelo:</strong> Bs. {paralelo?.promedio ?? 'N/A'}</p>
            <p><strong>Promedio:</strong> Bs. {((oficial?.promedio ?? 0) + (paralelo?.promedio ?? 0)) / 2}</p>
            <p className="text-sm text-gray-500 mt-2">Última actualización: {new Date(lastUpdate).toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block font-semibold mb-2">Ingrese monto:</label>
            <input
              id="amount"
              type="number"
              min="0"
              value={inputAmount}
              onChange={e => setInputAmount(e.target.value)}
              className="border bg-gray-800 border-gray-300 rounded p-2 w-full text-center"
              placeholder="Ingrese la cantidad"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Convertir:</label>
            <select
              value={conversionType}
              onChange={e => setConversionType(e.target.value)}
              className="border bg-gray-800 border-gray-300 rounded p-2 w-full"
            >
              <option value="usdToVes">Dólares a Bolívares</option>
              <option value="vesToUsd">Bolívares a Dólares</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Tipo de cambio:</label>
            <select
              value={selectedRate}
              onChange={e => setSelectedRate(e.target.value)}
              className="border bg-gray-800 border-gray-300 rounded p-2 w-full"
            >
              <option value="oficial">Oficial (BCV)</option>
              <option value="paralelo">Paralelo</option>
              <option value="promedio">Promedio</option>
            </select>
          </div>

          {inputAmount && !isNaN(amountNum) && (
            <p className="text-xl font-semibold text-blue-100">
              {conversionType === 'usdToVes'
                ? `${amountNum} USD = ${convertedAmount} VES`
                : `${amountNum} VES = ${convertedAmount} USD`}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CurrencyConverter;
