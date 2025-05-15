const BASE_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = "TU_API_KEY"; // <-- Reemplaza con tu API Key real
const BASE_CURRENCY = "USD";

export const getExchangeRates = async () => {
  try {
    const response = await fetch(`${BASE_URL}${API_KEY}/latest/${BASE_CURRENCY}`);
    if (!response.ok) throw new Error("No se pudo obtener la tasa de cambio");
    const data = await response.json();
    return data.conversion_rates; // esto te da un objeto {VES: 36.2, EUR: 0.93, ...}
  } catch (error) {
    console.error("Error al obtener tasas de cambio:", error);
    return null;
  }
};
