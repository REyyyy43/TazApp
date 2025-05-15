import React, { useEffect, useState } from "react";

const CurrencyConverter = () => {
  const [oficial, setOficial] = useState(null);
  const [paralelo, setParalelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedRate, setSelectedRate] = useState("promedio");

  const [usd, setUsd] = useState("");
  const [ves, setVes] = useState("");
  const [lastEdited, setLastEdited] = useState("usd"); // para saber cuál input se modificó

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const [oficialRes, paraleloRes] = await Promise.all([
          fetch("https://ve.dolarapi.com/v1/dolares/oficial"),
          fetch("https://ve.dolarapi.com/v1/dolares/paralelo"),
        ]);
        const [oficialData, paraleloData] = await Promise.all([
          oficialRes.json(),
          paraleloRes.json(),
        ]);
        setOficial(oficialData);
        setParalelo(paraleloData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos del dólar:", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const getRate = () => {
    if (!oficial || !paralelo) return 0;
    switch (selectedRate) {
      case "oficial":
        return oficial.promedio || 0;
      case "paralelo":
        return paralelo.promedio || 0;
      case "promedio":
      default:
        return ((oficial.promedio || 0) + (paralelo.promedio || 0)) / 2;
    }
  };

  const rate = getRate();

  // Efecto para sincronizar valores al editar
  useEffect(() => {
    if (!rate) return;

    if (lastEdited === "usd" && !isNaN(parseFloat(usd))) {
      const vesValue = parseFloat(usd) * rate;
      setVes(vesValue.toFixed(2));
    } else if (lastEdited === "ves" && !isNaN(parseFloat(ves))) {
      const usdValue = parseFloat(ves) / rate;
      setUsd(usdValue.toFixed(2));
    }
  }, [usd, ves, lastEdited, rate]);

  const lastUpdate =
    oficial?.fechaActualizacion || paralelo?.fechaActualizacion || "N/A";

  return (
    <div className="p-2">
      <div className="bg-gray-800 p-6 text-white rounded-xl shadow-md w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Dólar en Venezuela</h2>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : error ? (
          <p className="text-red-600">Error al cargar los datos</p>
        ) : (
          <>
            <div className="mb-4">
              <p><strong>Oficial (BCV):</strong> Bs. {oficial?.promedio ?? "N/A"}</p>
              <p><strong>Paralelo:</strong> Bs. {paralelo?.promedio ?? "N/A"}</p>
              <p><strong>Promedio:</strong> Bs. {getRate().toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Última actualización: {new Date(lastUpdate).toLocaleString()}
              </p>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Tipo de cambio:</label>
              <div className="border bg-gray-800 border-gray-300 rounded-lg p-3 w-full flex gap-2 justify-center">
                <button
                  type="button"
                  className={`px-3 py-2 rounded ${
                    selectedRate === "oficial"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                  onClick={() => setSelectedRate("oficial")}
                >
                  Dólar (BCV)
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded ${
                    selectedRate === "paralelo"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                  onClick={() => setSelectedRate("paralelo")}
                >
                  Paralelo
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded ${
                    selectedRate === "promedio"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                  onClick={() => setSelectedRate("promedio")}
                >
                  Promedio
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="usd" className="block font-semibold mb-1">USD ($):</label>
              <input
                id="usd"
                type="number"
                min="0"
                value={usd}
                onChange={(e) => {
                  setUsd(e.target.value);
                  setLastEdited("usd");
                }}
                className="border bg-gray-800 border-gray-300 rounded p-2 w-full text-center"
                placeholder="0.00"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="ves" className="block font-semibold mb-1">Bolívares (Bs):</label>
              <input
                id="ves"
                type="number"
                min="0"
                value={ves}
                onChange={(e) => {
                  setVes(e.target.value);
                  setLastEdited("ves");
                }}
                className="border bg-gray-800 border-gray-300 rounded p-2 w-full text-center"
                placeholder="0.00"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
