import axios from "axios";

export default async function getWeather(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el clima:', error);
    throw error;
  }
}
