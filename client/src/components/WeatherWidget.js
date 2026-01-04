import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaTemperatureHigh, FaTint, FaWind, FaExclamationTriangle } from 'react-icons/fa';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to get user location from context or default
    fetchWeather('Mumbai');
  }, []);

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const [weatherRes, alertsRes] = await Promise.all([
        api.get('/weather/current', { params: { city } }),
        api.get('/weather/alerts')
      ]);
      setWeather(weatherRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (location) {
      fetchWeather(location);
    }
  };

  const getWeatherIcon = (main) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️'
    };
    return icons[main] || '🌤️';
  };

  return (
    <div className="weather-widget">
      <h2>Weather Information</h2>
      <p className="subtitle">Get current weather and alerts for your area</p>

      <div className="weather-search">
        <input
          type="text"
          placeholder="Enter city name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>

      {weather && (
        <motion.div
          className="weather-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="weather-header">
            <div className="weather-icon">
              {getWeatherIcon(weather.weather[0]?.main)}
            </div>
            <div className="weather-location">
              <h3>{weather.name}</h3>
              <p>{weather.weather[0]?.description}</p>
            </div>
          </div>

          <div className="weather-details">
            <div className="weather-item">
              <FaTemperatureHigh className="weather-item-icon" />
              <div>
                <span className="weather-value">{Math.round(weather.main.temp)}°C</span>
                <span className="weather-label">Temperature</span>
              </div>
            </div>
            <div className="weather-item">
              <FaTint className="weather-item-icon" />
              <div>
                <span className="weather-value">{weather.main.humidity}%</span>
                <span className="weather-label">Humidity</span>
              </div>
            </div>
            <div className="weather-item">
              <FaWind className="weather-item-icon" />
              <div>
                <span className="weather-value">{weather.wind.speed} m/s</span>
                <span className="weather-label">Wind Speed</span>
              </div>
            </div>
            <div className="weather-item">
              <span className="weather-value">{weather.main.pressure} hPa</span>
              <span className="weather-label">Pressure</span>
            </div>
          </div>
        </motion.div>
      )}

      {alerts.length > 0 && (
        <motion.div
          className="alerts-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>
            <FaExclamationTriangle /> Weather Alerts
          </h3>
          <div className="alerts-list">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`alert-card ${alert.severity}`}>
                <div className="alert-header">
                  <span className="alert-type">{alert.type.toUpperCase()}</span>
                  <span className={`alert-severity ${alert.severity}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <p className="alert-time">
                  {new Date(alert.startTime).toLocaleString()} - {new Date(alert.endTime).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherWidget;

