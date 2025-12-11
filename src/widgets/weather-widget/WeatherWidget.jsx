import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CloudSun, CloudRain, Cloud, Sun, Wind, Droplets, CloudSnow, CloudDrizzle, CloudLightning, CloudFog, AlertTriangle, MapPin, Gauge, Eye, Sunrise, Sunset } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme'; // Import useTheme
import { jazerNeonTheme } from '../../theme/jazerNeonTheme'; // Import full theme as fallback
import { fetchWeatherApi } from 'openmeteo'; // Import Open-Meteo SDK

// Mock weather data with all supported fields
const MOCK_WEATHER = {
  current: {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 12,
    feelsLike: 70,
    uvIndex: 6,
    cloudCover: 45,
    pressure: 1013,
    visibility: 10,
    sunrise: '6:45 AM',
    sunset: '7:30 PM',
    icon: 'partly-cloudy'
  },
  forecast: [
    { day: 'Mon', date: 'Jan 6', high: 75, low: 58, condition: 'Sunny', precipitation: 0, wind: 8, uvIndex: 7, humidity: 55, sunrise: '6:46 AM', sunset: '7:31 PM', icon: 'sunny' },
    { day: 'Tue', date: 'Jan 7', high: 72, low: 60, condition: 'Cloudy', precipitation: 10, wind: 10, uvIndex: 4, humidity: 70, sunrise: '6:46 AM', sunset: '7:32 PM', icon: 'cloudy' },
    { day: 'Wed', date: 'Jan 8', high: 68, low: 55, condition: 'Rainy', precipitation: 80, wind: 15, uvIndex: 2, humidity: 85, sunrise: '6:47 AM', sunset: '7:33 PM', icon: 'rainy' },
    { day: 'Thu', date: 'Jan 9', high: 70, low: 57, condition: 'Partly Cloudy', precipitation: 20, wind: 12, uvIndex: 5, humidity: 65, sunrise: '6:47 AM', sunset: '7:34 PM', icon: 'partly-cloudy' },
    { day: 'Fri', date: 'Jan 10', high: 74, low: 59, condition: 'Sunny', precipitation: 0, wind: 7, uvIndex: 8, humidity: 50, sunrise: '6:48 AM', sunset: '7:35 PM', icon: 'sunny' },
    { day: 'Sat', date: 'Jan 11', high: 76, low: 61, condition: 'Sunny', precipitation: 0, wind: 9, uvIndex: 8, humidity: 48, sunrise: '6:48 AM', sunset: '7:36 PM', icon: 'sunny' },
    { day: 'Sun', date: 'Jan 12', high: 73, low: 60, condition: 'Partly Cloudy', precipitation: 15, wind: 11, uvIndex: 6, humidity: 60, sunrise: '6:49 AM', sunset: '7:37 PM', icon: 'partly-cloudy' }
  ],
  alerts: []
};

// WMO Weather Code Mapping (single source of truth)
const WMO_WEATHER_MAPPING = {
  0: { condition: 'Clear', icon: 'clear' },
  1: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
  2: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
  3: { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
  45: { condition: 'Fog', icon: 'fog' },
  48: { condition: 'Fog', icon: 'fog' },
  51: { condition: 'Drizzle', icon: 'drizzle' },
  53: { condition: 'Drizzle', icon: 'drizzle' },
  55: { condition: 'Drizzle', icon: 'drizzle' },
  56: { condition: 'Drizzle', icon: 'drizzle' },
  57: { condition: 'Drizzle', icon: 'drizzle' },
  61: { condition: 'Rain', icon: 'rain' },
  63: { condition: 'Rain', icon: 'rain' },
  65: { condition: 'Rain', icon: 'rain' },
  66: { condition: 'Rain', icon: 'rain' },
  67: { condition: 'Rain', icon: 'rain' },
  71: { condition: 'Snow', icon: 'snow' },
  73: { condition: 'Snow', icon: 'snow' },
  75: { condition: 'Snow', icon: 'snow' },
  77: { condition: 'Snow', icon: 'snow' },
  80: { condition: 'Rain', icon: 'rain' },
  81: { condition: 'Rain', icon: 'rain' },
  82: { condition: 'Rain', icon: 'rain' },
  85: { condition: 'Snow', icon: 'snow' },
  86: { condition: 'Snow', icon: 'snow' },
  95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
  96: { condition: 'Thunderstorm', icon: 'thunderstorm' },
  99: { condition: 'Thunderstorm', icon: 'thunderstorm' },
};

/**
 * Get weather condition and icon from WMO code
 * @param {number} code - WMO weather code
 * @returns {{ condition: string, icon: string }} Weather condition and icon
 */
const getWeatherFromWMO = (code) => {
  // Direct lookup first
  if (WMO_WEATHER_MAPPING[code]) {
    return WMO_WEATHER_MAPPING[code];
  }
  
  // Range-based fallback for codes not explicitly mapped
  if (code <= 3) return { condition: 'Partly Cloudy', icon: 'partly-cloudy' };
  if (code <= 48) return { condition: 'Fog', icon: 'fog' };
  if (code <= 57) return { condition: 'Drizzle', icon: 'drizzle' };
  if (code <= 67) return { condition: 'Rain', icon: 'rain' };
  if (code <= 77) return { condition: 'Snow', icon: 'snow' };
  if (code <= 82) return { condition: 'Rain', icon: 'rain' };
  if (code <= 86) return { condition: 'Snow', icon: 'snow' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: 'thunderstorm' };
  
  return { condition: 'Cloudy', icon: 'clouds' };
};

// Weather icon component - receives theme as prop
const WeatherIcon = ({ condition, animate, greyscale, size = 32, theme }) => {
  // Use passed theme or fallback to jazerNeonTheme
  const themeData = theme || jazerNeonTheme;
  
  // Fallback colors if themeData.colors is not available
  const defaultColor = greyscale ? '#94A3B8' : '#F59E0B';
  const iconColor = themeData?.colors ? 
    (greyscale ? (themeData.colors.softSlate || '#94A3B8') : (themeData.colors.sunburstGold || '#F59E0B')) : 
    defaultColor;
  
  const iconProps = {
    size,
    className: `${animate ? 'animate-pulse' : ''} ${greyscale ? 'grayscale' : ''}`,
    style: { color: iconColor },
    'aria-hidden': true
  };

  // Helper to safely get theme colors with fallbacks
  const getColor = (colorName, fallback) => themeData?.colors?.[colorName] || fallback;

  // Map OpenWeatherMap condition codes to icons
  const conditionMap = {
    'sunny': <Sun {...iconProps} />,
    'clear': <Sun {...iconProps} />,
    'rainy': <CloudRain {...iconProps} style={{ ...iconProps.style, color: getColor('cosmicBlue', '#3B82F6') }} />,
    'rain': <CloudRain {...iconProps} style={{ ...iconProps.style, color: getColor('cosmicBlue', '#3B82F6') }} />,
    'drizzle': <CloudDrizzle {...iconProps} style={{ ...iconProps.style, color: getColor('aetherTeal', '#06B6D4') }} />,
    'cloudy': <Cloud {...iconProps} style={{ ...iconProps.style, color: getColor('softSlate', '#94A3B8') }} />,
    'clouds': <Cloud {...iconProps} style={{ ...iconProps.style, color: getColor('softSlate', '#94A3B8') }} />,
    'partly-cloudy': <CloudSun {...iconProps} style={{ ...iconProps.style, color: getColor('aetherTeal', '#06B6D4') }} />,
    'snow': <CloudSnow {...iconProps} style={{ ...iconProps.style, color: getColor('stardustWhite', '#F8F9FF') }} />,
    'thunderstorm': <CloudLightning {...iconProps} style={{ ...iconProps.style, color: getColor('electricPurple', '#8B5CF6') }} />,
    'mist': <CloudFog {...iconProps} style={{ ...iconProps.style, color: getColor('softSlate', '#94A3B8') }} />,
    'fog': <CloudFog {...iconProps} style={{ ...iconProps.style, color: getColor('softSlate', '#94A3B8') }} />,
    'haze': <CloudFog {...iconProps} style={{ ...iconProps.style, color: getColor('softSlate', '#94A3B8') }} />,
    'smoke': <CloudFog {...iconProps} style={{ ...iconProps.style, color: getColor('graphite', '#1F2937') }} />,
    'dust': <Wind {...iconProps} style={{ ...iconProps.style, color: getColor('sunburstGold', '#F59E0B') }} />,
    'sand': <Wind {...iconProps} style={{ ...iconProps.style, color: getColor('sunburstGold', '#F59E0B') }} />,
    'tornado': <Wind {...iconProps} style={{ ...iconProps.style, color: getColor('electricPurple', '#8B5CF6') }} />
  };

  const displayCondition = condition?.toLowerCase() || 'partly-cloudy';
  const ariaLabel = `Weather condition: ${condition || 'Partly Cloudy'}`;
  
  return (
    <span role="img" aria-label={ariaLabel}>
      {conditionMap[displayCondition] || <CloudSun {...iconProps} style={{ ...iconProps.style, color: getColor('aetherTeal', '#06B6D4') }} />}
    </span>
  );
};

// Loading skeleton component - orientation aware
const LoadingSkeleton = ({ orientation = 'auto' }) => {
  if (orientation === 'compact') {
    return (
      <div className="animate-pulse flex items-center gap-2 p-2" role="status" aria-label="Loading weather data">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  if (orientation === 'horizontal') {
    return (
      <div className="animate-pulse flex items-center justify-between w-full p-3" role="status" aria-label="Loading weather data">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-28"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  if (orientation === 'wide') {
    return (
      <div className="animate-pulse space-y-4 p-4" role="status" aria-label="Loading weather data">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="h-12 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-28"></div>
        </div>
        <div className="flex justify-between gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded w-16"></div>
          ))}
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-16 h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  // Default/auto skeleton
  return (
    <div className="animate-pulse space-y-4" role="status" aria-label="Loading weather data" aria-live="polite">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="h-6 bg-gray-300 rounded w-32"></div>
      </div>
      <div className="h-12 bg-gray-300 rounded w-24 mb-2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <span className="sr-only">Loading weather data...</span>
    </div>
  );
};

// Severe weather alert component
const SevereWeatherAlert = ({ alert }) => (
  <div 
    className="flex items-start gap-3 p-4 mb-4 rounded-lg border-l-4"
    style={{
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderLeftColor: '#EF4444',
      color: '#DC2626'
    }}
  >
    <AlertTriangle size={24} className="flex-shrink-0 mt-0.5" />
    <div>
      <div className="font-bold text-sm mb-1">{alert.event}</div>
      <div className="text-xs opacity-90">{alert.description}</div>
    </div>
  </div>
);

export const WeatherWidget = ({ config, onCustomizeRequest }) => {
  let themeData;
  try {
    const themeContext = useTheme();
    themeData = themeContext?.theme || jazerNeonTheme;
  } catch {
    // Fallback to default theme if ThemeProvider not available
    themeData = jazerNeonTheme;
  }
  const theme = themeData; // Use this for all theme references
  
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(config.weatherLocation);
  
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync currentLocation with config.weatherLocation when it changes
  useEffect(() => {
    if (!config.useGeolocation && config.weatherLocation !== currentLocation) {
      setCurrentLocation(config.weatherLocation);
    }
  }, [config.weatherLocation, config.useGeolocation, currentLocation]);

  // Fetch weather data from Open-Meteo API using SDK
  const fetchWeatherData = useCallback(async (location, options = {}) => {
    const { signal } = options;
    setLoading(true);
    setError(null);
    setGeoError(null);

    try {
      // Geocode the location using Open-Meteo Geocoding API
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
        { signal }
      );
      
      if (!geoResponse.ok) throw new Error('Location not found');
      
      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) throw new Error('Location not found');

      const { latitude, longitude, name, admin1, country } = geoData.results[0];
      const displayLocation = admin1 ? `${name}, ${admin1}` : `${name}, ${country}`;
      setCurrentLocation(displayLocation);

      // Fetch weather data using Open-Meteo SDK
      const tempUnit = config.preferredUnits === 'metric' ? 'celsius' : 'fahrenheit';
      const windUnit = config.preferredUnits === 'metric' ? 'kmh' : 'mph';
      const precipUnit = config.preferredUnits === 'metric' ? 'mm' : 'inch';
      
      const params = {
        latitude,
        longitude,
        current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'weather_code', 'wind_speed_10m', 'cloud_cover', 'pressure_msl', 'visibility'],
        daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_probability_max', 'wind_speed_10m_max', 'uv_index_max', 'relative_humidity_2m_mean', 'sunrise', 'sunset'],
        temperature_unit: tempUnit,
        wind_speed_unit: windUnit,
        precipitation_unit: precipUnit,
        timezone: 'auto'
      };
      
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      // Get current weather data
      const current = response.current();
      const utcOffsetSeconds = response.utcOffsetSeconds();
      
      // Get timezone from response for proper time formatting
      const locationTimezone = response.timezone();
      
      // Helper function to format time in the location's timezone
      const formatTimeInTimezone = (date) => {
        if (!date) return null;
        try {
          return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true,
            timeZone: locationTimezone || undefined
          });
        } catch {
          // Fallback if timezone is invalid
          return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
      };
      
      // Transform API data to our format
      const transformedData = {
        current: {
          temperature: Math.round(current.variables(0).value()),
          condition: getWeatherFromWMO(current.variables(3).value()).condition,
          humidity: Math.round(current.variables(1).value()),
          wind: Math.round(current.variables(4).value()),
          feelsLike: Math.round(current.variables(2).value()),
          cloudCover: Math.round(current.variables(5).value()),
          pressure: Math.round(current.variables(6).value()),
          visibility: Math.round(current.variables(7).value() / 1000), // Convert to km
          uvIndex: 0, // Will be populated from daily data if available
          icon: getWeatherFromWMO(current.variables(3).value()).icon
        },
        forecast: []
      };

      // Process daily forecast data
      const daily = response.daily();
      const daysToFetch = Math.min(config.numberOfDays + 1, 10);
      
      // Get all sunrise/sunset values upfront
      const sunriseVar = daily.variables(7);
      const sunsetVar = daily.variables(8);
      
      for (let i = 0; i < daysToFetch; i++) {
        const time = Number(daily.time()) + i * daily.interval();
        const date = new Date((time + utcOffsetSeconds) * 1000);
        
        // Sunrise/sunset are returned as Unix timestamps (seconds since epoch)
        let sunriseTime = null;
        let sunsetTime = null;
        
        try {
          if (sunriseVar) {
            const sunriseTimestamp = Number(sunriseVar.valuesInt64(i));
            if (sunriseTimestamp > 0) {
              sunriseTime = new Date(sunriseTimestamp * 1000);
            }
          }
          if (sunsetVar) {
            const sunsetTimestamp = Number(sunsetVar.valuesInt64(i));
            if (sunsetTimestamp > 0) {
              sunsetTime = new Date(sunsetTimestamp * 1000);
            }
          }
        } catch (error) {
          console.warn('Error parsing sunrise/sunset:', error);
        }
        
        transformedData.forecast.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: config.displayDates ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
          high: Math.round(daily.variables(1).valuesArray()[i]),
          low: Math.round(daily.variables(2).valuesArray()[i]),
          condition: getWeatherFromWMO(daily.variables(0).valuesArray()[i]).condition,
          precipitation: Math.round(daily.variables(3).valuesArray()[i] || 0),
          wind: Math.round(daily.variables(4).valuesArray()[i]),
          uvIndex: Math.round(daily.variables(5).valuesArray()[i] || 0),
          humidity: Math.round(daily.variables(6).valuesArray()[i] || 0),
          sunrise: formatTimeInTimezone(sunriseTime),
          sunset: formatTimeInTimezone(sunsetTime),
          icon: getWeatherFromWMO(daily.variables(0).valuesArray()[i]).icon
        });
        
        // Set current UV index from today's forecast
        if (i === 0) {
          transformedData.current.uvIndex = Math.round(daily.variables(5).valuesArray()[i] || 0);
          transformedData.current.sunrise = formatTimeInTimezone(sunriseTime);
          transformedData.current.sunset = formatTimeInTimezone(sunsetTime);
        }
      }
      
      transformedData.alerts = []; // Open-Meteo free tier doesn't include alerts

      setWeatherData(transformedData);
      setLoading(false);
    } catch (err) {
      // Only handle error if not aborted
      if (err.name !== 'AbortError') {
        console.error('Weather fetch error:', err);
        setError(err.message);
        setWeatherData(MOCK_WEATHER);
        setLoading(false);
      }
    }
  }, [config.preferredUnits, config.numberOfDays, config.displayDates]);

  // Fetch weather by coordinates (for geolocation) using Open-Meteo SDK
  const fetchWeatherByCoordinates = useCallback(async (latitude, longitude, locationName, options = {}) => {
    const { signal } = options;
    if (signal?.aborted) return;
    setLoading(true);
    setError(null);
    setGeoError(null);

    try {
      const tempUnit = config.preferredUnits === 'metric' ? 'celsius' : 'fahrenheit';
      const windUnit = config.preferredUnits === 'metric' ? 'kmh' : 'mph';
      const precipUnit = config.preferredUnits === 'metric' ? 'mm' : 'inch';
      
      const params = {
        latitude,
        longitude,
        current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'weather_code', 'wind_speed_10m', 'cloud_cover', 'pressure_msl', 'visibility'],
        daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_probability_max', 'wind_speed_10m_max', 'uv_index_max', 'relative_humidity_2m_mean', 'sunrise', 'sunset'],
        temperature_unit: tempUnit,
        wind_speed_unit: windUnit,
        precipitation_unit: precipUnit,
        timezone: 'auto'
      };
      
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      // Get current weather data
      const current = response.current();
      const utcOffsetSeconds = response.utcOffsetSeconds();
      
      // Get timezone from response for proper time formatting
      const locationTimezone = response.timezone();
      
      // Helper function to format time in the location's timezone
      const formatTimeInTimezone = (date) => {
        if (!date) return null;
        try {
          return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true,
            timeZone: locationTimezone || undefined
          });
        } catch {
          // Fallback if timezone is invalid
          return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
      };
      
      // Transform API data to our format
      const transformedData = {
        current: {
          temperature: Math.round(current.variables(0).value()),
          condition: getWeatherFromWMO(current.variables(3).value()).condition,
          humidity: Math.round(current.variables(1).value()),
          wind: Math.round(current.variables(4).value()),
          feelsLike: Math.round(current.variables(2).value()),
          cloudCover: Math.round(current.variables(5).value()),
          pressure: Math.round(current.variables(6).value()),
          visibility: Math.round(current.variables(7).value() / 1000), // Convert to km
          uvIndex: 0, // Will be populated from daily data if available
          icon: getWeatherFromWMO(current.variables(3).value()).icon
        },
        forecast: [],
        alerts: []
      };

      // Process daily forecast data
      const daily = response.daily();
      const daysToFetch = Math.min(config.numberOfDays + 1, 10);
      
      // Get all sunrise/sunset values upfront
      const sunriseVar = daily.variables(7);
      const sunsetVar = daily.variables(8);
      
      for (let i = 0; i < daysToFetch; i++) {
        const time = Number(daily.time()) + i * daily.interval();
        const date = new Date((time + utcOffsetSeconds) * 1000);
        
        // Sunrise/sunset are returned as Unix timestamps (seconds since epoch)
        let sunriseTime = null;
        let sunsetTime = null;
        
        try {
          if (sunriseVar) {
            const sunriseTimestamp = Number(sunriseVar.valuesInt64(i));
            if (sunriseTimestamp > 0) {
              sunriseTime = new Date(sunriseTimestamp * 1000);
            }
          }
          if (sunsetVar) {
            const sunsetTimestamp = Number(sunsetVar.valuesInt64(i));
            if (sunsetTimestamp > 0) {
              sunsetTime = new Date(sunsetTimestamp * 1000);
            }
          }
        } catch (error) {
          console.warn('Error parsing sunrise/sunset:', error);
        }
        
        transformedData.forecast.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: config.displayDates ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
          high: Math.round(daily.variables(1).valuesArray()[i]),
          low: Math.round(daily.variables(2).valuesArray()[i]),
          condition: getWeatherFromWMO(daily.variables(0).valuesArray()[i]).condition,
          precipitation: Math.round(daily.variables(3).valuesArray()[i] || 0),
          wind: Math.round(daily.variables(4).valuesArray()[i]),
          uvIndex: Math.round(daily.variables(5).valuesArray()[i] || 0),
          humidity: Math.round(daily.variables(6).valuesArray()[i] || 0),
          sunrise: formatTimeInTimezone(sunriseTime),
          sunset: formatTimeInTimezone(sunsetTime),
          icon: getWeatherFromWMO(daily.variables(0).valuesArray()[i]).icon
        });
        
        // Set current UV index and sunrise/sunset from today's forecast
        if (i === 0) {
          transformedData.current.uvIndex = Math.round(daily.variables(5).valuesArray()[i] || 0);
          transformedData.current.sunrise = formatTimeInTimezone(sunriseTime);
          transformedData.current.sunset = formatTimeInTimezone(sunsetTime);
        }
      }

      setCurrentLocation(locationName);
      setWeatherData(transformedData);
      setLoading(false);
    } catch (err) {
      // Only handle error if not aborted
      if (err.name !== 'AbortError') {
        console.error('Weather fetch error:', err);
        setError(err.message);
        setWeatherData(MOCK_WEATHER);
        setLoading(false);
      }
    }
  }, [config.preferredUnits, config.numberOfDays, config.displayDates]);

  // Auto-detect location using geolocation
  const detectLocation = useCallback((options = {}) => {
    const { signal } = options;
    
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setGeoError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Check if aborted before proceeding
        if (signal?.aborted) return;
        
        try {
          const { latitude, longitude } = position.coords;
          
          // Use BigDataCloud free reverse geocoding API (no API key required)
          // Open-Meteo's geocoding API doesn't support reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal }
          );
          
          let locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
          
          if (response.ok) {
            const data = await response.json();
            // Build location name from available data
            const city = data.city || data.locality || data.principalSubdivision;
            const region = data.principalSubdivision || data.countryName;
            if (city && region && city !== region) {
              locationName = `${city}, ${region}`;
            } else if (city) {
              locationName = city;
            } else if (data.countryName) {
              locationName = data.countryName;
            }
          }
          
          setCurrentLocation(locationName);
          
          // Fetch weather directly with coordinates
          fetchWeatherByCoordinates(latitude, longitude, locationName, { signal });
        } catch (err) {
          if (err.name !== 'AbortError') {
            // Still try to fetch weather with coordinates even if reverse geocoding fails
            const { latitude, longitude } = position.coords;
            const fallbackName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
            setCurrentLocation(fallbackName);
            fetchWeatherByCoordinates(latitude, longitude, fallbackName, { signal });
          }
        }
      },
      (geoPositionError) => {
        // Provide more specific error messages based on error code
        let errorMessage = 'Unable to retrieve your location.';
        switch (geoPositionError.code) {
          case geoPositionError.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
            break;
          case geoPositionError.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again later.';
            break;
          case geoPositionError.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
        }
        setGeoError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: false, // Faster response
        timeout: 10000, // 10 second timeout
        maximumAge: 300000 // Cache position for 5 minutes
      }
    );
  }, [fetchWeatherByCoordinates]);

  // Fetch weather on mount and when location/config changes
  useEffect(() => {
    const controller = new AbortController();
    
    if (config.useGeolocation) {
      detectLocation({ signal: controller.signal });
    } else {
      fetchWeatherData(currentLocation, { signal: controller.signal });
    }
    
    return () => controller.abort();
  }, [config.preferredUnits, config.useGeolocation, currentLocation, detectLocation, fetchWeatherData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const controller = new AbortController();
    
    const interval = setInterval(() => {
      if (config.useGeolocation) {
        detectLocation({ signal: controller.signal });
      } else {
        fetchWeatherData(currentLocation, { signal: controller.signal });
      }
    }, 600000); // 10 minutes

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [currentLocation, config.useGeolocation, detectLocation, fetchWeatherData]);

  // Load Google Font if selected
  useEffect(() => {
    if (config.googleFont !== 'none') {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${config.googleFont}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        try {
          if (link && document.head.contains(link)) {
            document.head.removeChild(link);
          }
        } catch {
          // Silently fail on font cleanup
        }
      };
    }
  }, [config.googleFont]);

  // Listen for system dark mode changes
  useEffect(() => {
    if (config.appearanceMode !== 'system' || typeof window === 'undefined') {
      return undefined;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => setSystemPrefersDark(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [config.appearanceMode]);

  const isDark = useMemo(() => {
    if (config.appearanceMode === 'system') return systemPrefersDark;
    return config.appearanceMode === 'dark';
  }, [config.appearanceMode, systemPrefersDark]);

  // Get colors based on appearance mode
  // Support both flat config (textColorLight/textColorDark) and nested theme config
  const textColor = isDark 
    ? (config.textColorDark || config.theme?.dark?.textColor || theme.colors.stardustWhite)
    : (config.textColorLight || config.theme?.light?.textColor || theme.colors.graphite);
  
  // Get font family based on config (memoized)
  const fontFamily = useMemo(() => {
    if (config.googleFont && config.googleFont !== 'none') {
      return `"${String(config.googleFont).replace(/\+/g, ' ')}", system-ui, sans-serif`;
    }
    
    switch (config.textFontFamily) {
      case 'serif':
        return 'Georgia, serif';
      case 'mono':
        return 'ui-monospace, monospace';
      default:
        return theme?.fonts?.body || '"Montserrat", system-ui, sans-serif';
    }
  }, [config.googleFont, config.textFontFamily, theme]);

  // Get background texture pattern (memoized)
  const bgTexture = useMemo(() => {
    if (config.backgroundTexture === 'none') return '';
    
    const textures = {
      noise: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="300" height="300" filter="url(%23n)" opacity="0.05"/%3E%3C/svg%3E',
      stars: 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 60px 70px, white, transparent), radial-gradient(1px 1px at 50px 50px, white, transparent), radial-gradient(1px 1px at 130px 80px, white, transparent), radial-gradient(2px 2px at 90px 10px, white, transparent)',
      dots: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      waves: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
    };
    
    return textures[config.backgroundTexture] || '';
  }, [config.backgroundTexture]);

  // Apply preset themes (memoized)
  const presetTheme = useMemo(() => {
    if (config.presetTheme === 'none') return {};
    
    const themes = {
      cyberpunk: {
        primary: theme.colors.neonPink,
        secondary: theme.colors.electricPurple,
        gradient: `linear-gradient(135deg, ${theme.colors.neonPink}, ${theme.colors.electricPurple})`,
        glow: '0 0 20px rgba(236, 72, 153, 0.5)'
      },
      stealth: {
        primary: theme.colors.graphite,
        secondary: theme.colors.nightBlack,
        gradient: `linear-gradient(135deg, ${theme.colors.graphite}, ${theme.colors.nightBlack})`,
        glow: 'none'
      },
      ocean: {
        primary: theme.colors.aetherTeal,
        secondary: theme.colors.cosmicBlue,
        gradient: `linear-gradient(135deg, ${theme.colors.aetherTeal}, ${theme.colors.cosmicBlue})`,
        glow: '0 0 15px rgba(6, 182, 212, 0.4)'
      },
      sunset: {
        primary: theme.colors.sunburstGold,
        secondary: theme.colors.neonPink,
        gradient: `linear-gradient(135deg, ${theme.colors.sunburstGold}, ${theme.colors.neonPink})`,
        glow: '0 0 20px rgba(245, 158, 11, 0.5)'
      },
      forest: {
        primary: '#10b981',
        secondary: '#059669',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        glow: '0 0 15px rgba(16, 185, 129, 0.4)'
      },
      neon: {
        primary: theme.colors.ultraviolet,
        secondary: theme.colors.neonPink,
        gradient: theme.gradients.gradient,
        glow: theme.effects.glow
      },
      midnight: {
        primary: theme.colors.nightBlack,
        secondary: theme.colors.ultraviolet,
        gradient: `linear-gradient(135deg, ${theme.colors.nightBlack}, ${theme.colors.ultraviolet})`,
        glow: '0 0 10px rgba(167, 139, 250, 0.3)'
      }
    };
    
    return themes[config.presetTheme] || {};
  }, [config.presetTheme, theme]);
  
  // Dynamic gradient backgrounds based on weather condition (memoized)
  const bgColor = useMemo(() => {
    if (config.useTransparentBackground) return 'transparent';
    if (config.setBackgroundColor && !weatherData) return config.backgroundColor;
    
    // Apply preset theme if selected
    if (config.presetTheme !== 'none' && presetTheme.gradient) {
      return presetTheme.gradient;
    }
    
    const condition = weatherData?.current?.icon || 'clear';
    const gradients = {
      clear: `linear-gradient(135deg, ${theme.colors.sunburstGold} 0%, ${theme.colors.cosmicBlue} 100%)`,
      sunny: `linear-gradient(135deg, ${theme.colors.sunburstGold} 0%, ${theme.colors.cosmicBlue} 100%)`,
      clouds: `linear-gradient(135deg, ${theme.colors.softSlate} 0%, ${theme.colors.graphite} 100%)`,
      cloudy: `linear-gradient(135deg, ${theme.colors.softSlate} 0%, ${theme.colors.graphite} 100%)`,
      rain: `linear-gradient(135deg, ${theme.colors.cosmicBlue} 0%, ${theme.colors.graphite} 100%)`,
      rainy: `linear-gradient(135deg, ${theme.colors.cosmicBlue} 0%, ${theme.colors.graphite} 100%)`,
      drizzle: `linear-gradient(135deg, ${theme.colors.aetherTeal} 0%, ${theme.colors.cosmicBlue} 100%)`,
      thunderstorm: `linear-gradient(135deg, ${theme.colors.electricPurple} 0%, ${theme.colors.nightBlack} 100%)`,
      snow: `linear-gradient(135deg, ${theme.colors.stardustWhite} 0%, ${theme.colors.cosmicBlue} 100%)`,
      mist: `linear-gradient(135deg, ${theme.colors.softSlate} 0%, ${theme.colors.stardustWhite} 100%)`,
      fog: `linear-gradient(135deg, ${theme.colors.softSlate} 0%, ${theme.colors.stardustWhite} 100%)`
    };
    
    return config.setBackgroundColor 
      ? config.backgroundColor 
      : (gradients[condition] || (isDark ? theme.colors.nightBlack : theme.colors.stardustWhite));
  }, [config.useTransparentBackground, config.setBackgroundColor, config.backgroundColor, config.presetTheme, presetTheme, weatherData, isDark, theme]);
  
  // Glassmorphism styles for transparent background (memoized)
  const glassmorphismStyles = useMemo(() => {
    return config.useTransparentBackground ? {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      backgroundColor: isDark ? 'rgba(11, 14, 18, 0.7)' : 'rgba(248, 249, 255, 0.7)',
      borderRadius: '12px',
      border: `1px solid ${isDark ? 'rgba(248, 249, 255, 0.1)' : 'rgba(11, 14, 18, 0.1)'}`
    } : {};
  }, [config.useTransparentBackground, isDark]);

  const textShadow = config.textShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none';
  const glowEffect = config.glowEffect ? (presetTheme.glow || theme.effects.glow) : 'none';
  
  // Gradient text style (memoized)
  const gradientTextStyle = useMemo(() => {
    return config.gradientText ? {
      background: presetTheme.gradient || theme.gradients?.gradient || 'linear-gradient(135deg, #EC4899, #8B5CF6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    } : {};
  }, [config.gradientText, presetTheme.gradient, theme.gradients]);

  // Convert temperature based on units (API already returns in correct units)
  const convertTemp = (temp) => Math.round(temp);

  const tempUnit = config.preferredUnits === 'metric' ? '°C' : '°F';
  const windUnit = config.preferredUnits === 'metric' ? 'km/h' : 'mph';

  // Use real data or fallback to mock
  const currentWeather = weatherData || MOCK_WEATHER;

  // Filter forecast days
  const forecastDays = currentWeather.forecast
    .slice(config.hideTodayInForecast ? 1 : 0)
    .slice(0, config.numberOfDays);

  // Render current weather field
  const renderCurrentField = (field) => {
    const { current } = currentWeather;
    switch (field) {
      case 'temperature':
        return (
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold" style={{ fontFamily: theme.fonts.heading, fontSize: `${48 * config.fontScale}px` }}>
              {convertTemp(current.temperature)}{tempUnit}
            </span>
          </div>
        );
      case 'condition':
        return <div className="text-lg opacity-80 text-center" style={{ fontSize: `${18 * config.fontScale}px` }}>{current.condition}</div>;
      case 'humidity':
        return (
          <div className="flex items-center justify-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Droplets size={16 * config.fontScale} />
            <span>Humidity: {current.humidity}%</span>
          </div>
        );
      case 'wind':
        return (
          <div className="flex items-center justify-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Wind size={16 * config.fontScale} />
            <span>Wind: {current.wind} {windUnit}</span>
          </div>
        );
      case 'feelsLike':
        return <div className="text-sm text-center" style={{ fontSize: `${14 * config.fontScale}px` }}>Feels like: {convertTemp(current.feelsLike)}{tempUnit}</div>;
      case 'uvIndex':
        return <div className="text-sm text-center" style={{ fontSize: `${14 * config.fontScale}px` }}>UV Index: {current.uvIndex}</div>;
      case 'cloudCover':
        return (
          <div className="flex items-center justify-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Cloud size={16 * config.fontScale} />
            <span>Cloud Cover: {current.cloudCover}%</span>
          </div>
        );
      case 'pressure':
        return (
          <div className="flex items-center justify-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Gauge size={16 * config.fontScale} />
            <span>Pressure: {current.pressure} hPa</span>
          </div>
        );
      case 'visibility':
        return (
          <div className="flex items-center justify-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Eye size={16 * config.fontScale} />
            <span>Visibility: {current.visibility} {config.preferredUnits === 'metric' ? 'km' : 'mi'}</span>
          </div>
        );
      case 'sunrise':
        return current.sunrise ? (
          <div className="flex items-center justify-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Sunrise size={16 * config.fontScale} />
            <span>Sunrise: {current.sunrise}</span>
          </div>
        ) : null;
      case 'sunset':
        return current.sunset ? (
          <div className="flex items-center justify-center gap-1 text-sm" style={{ fontSize: `${14 * config.fontScale}px` }}>
            <Sunset size={16 * config.fontScale} />
            <span>Sunset: {current.sunset}</span>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  // Layout class based on orientation
  const getLayoutClass = () => {
    switch (config.orientation) {
      case 'horizontal':
        return 'flex-row items-start justify-center';
      case 'compact':
        return 'flex-col items-center max-w-sm mx-auto';
      case 'wide':
        return 'flex-row items-start justify-between w-full';
      default: // auto - responsive
        return 'flex-col items-center md:flex-row md:items-start md:justify-center';
    }
  };

  // ===== HORIZONTAL ORIENTATION =====
  // Banner-style with forecast: main row (icon + temp, location, metrics) + forecast strip below
  const renderHorizontalLayout = () => {
    const { current } = currentWeather;

    return (
      <div className="space-y-3 w-full">
        {/* Main Banner Row */}
        <div
          className="flex items-center justify-between w-full gap-4 px-2"
          style={{ minHeight: '60px' }}
        >
          {/* Left Cluster: Icon + Large Temp */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <WeatherIcon
              condition={current.icon}
              animate={config.animateIcons}
              greyscale={config.greyscaleIcons}
              size={40 * config.fontScale}
              theme={theme}
            />
            <span
              className="text-3xl font-bold whitespace-nowrap"
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: `${36 * config.fontScale}px`,
                textShadow,
                ...gradientTextStyle
              }}
            >
              {convertTemp(current.temperature)}{tempUnit}
            </span>
          </div>

          {/* Center Cluster: Location + Condition */}
          <div className="flex flex-col items-center justify-center flex-1 min-w-0 px-4">
            <h2
              className="text-lg font-bold truncate max-w-full"
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: `${18 * config.fontScale}px`,
                textShadow,
                ...gradientTextStyle
              }}
              title={currentLocation}
            >
              {currentLocation}
            </h2>
            <span
              className="text-sm opacity-80 truncate max-w-full"
              style={{ fontSize: `${14 * config.fontScale}px` }}
              title={current.condition}
            >
              {current.condition}
            </span>
          </div>

          {/* Right Cluster: All current weather metrics */}
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            {(config.currentWeatherFields || []).includes('feelsLike') && (
              <div className="text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                Feels {convertTemp(current.feelsLike)}{tempUnit}
              </div>
            )}
            {(config.currentWeatherFields || []).includes('humidity') && (
              <div className="flex items-center gap-1 text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                <Droplets size={13 * config.fontScale} />
                {current.humidity}%
              </div>
            )}
            {(config.currentWeatherFields || []).includes('wind') && (
              <div className="flex items-center gap-1 text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                <Wind size={13 * config.fontScale} />
                {current.wind} {windUnit}
              </div>
            )}
            {(config.currentWeatherFields || []).includes('uvIndex') && (
              <div className="text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                UV: {current.uvIndex}
              </div>
            )}
            {(config.currentWeatherFields || []).includes('cloudCover') && (
              <div className="flex items-center gap-1 text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                <Cloud size={13 * config.fontScale} />
                {current.cloudCover}%
              </div>
            )}
            {(config.currentWeatherFields || []).includes('pressure') && (
              <div className="flex items-center gap-1 text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                <Gauge size={13 * config.fontScale} />
                {current.pressure} hPa
              </div>
            )}
            {(config.currentWeatherFields || []).includes('visibility') && (
              <div className="flex items-center gap-1 text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                <Eye size={13 * config.fontScale} />
                {current.visibility} {config.preferredUnits === 'metric' ? 'km' : 'mi'}
              </div>
            )}
            {(config.currentWeatherFields || []).includes('sunrise') && current.sunrise && (
              <div className="flex items-center gap-1 text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                <Sunrise size={13 * config.fontScale} />
                {current.sunrise}
              </div>
            )}
            {(config.currentWeatherFields || []).includes('sunset') && current.sunset && (
              <div className="flex items-center gap-1 text-sm opacity-80 whitespace-nowrap" style={{ fontSize: `${13 * config.fontScale}px` }}>
                <Sunset size={13 * config.fontScale} />
                {current.sunset}
              </div>
            )}
          </div>
        </div>

        {/* Forecast Strip - Horizontal scrollable row */}
        {config.numberOfDays > 0 && forecastDays.length > 0 && (
          <div className="border-t pt-3" style={{ borderColor: isDark ? 'rgba(248, 249, 255, 0.1)' : 'rgba(11, 14, 18, 0.1)' }}>
            <div className="overflow-x-auto pb-2 px-2">
              <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                {forecastDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 flex-shrink-0"
                    style={{ minWidth: '120px' }}
                  >
                    <div className="text-center" style={{ minWidth: '45px' }}>
                      <div className="text-xs font-semibold opacity-70 mb-1" style={{ fontSize: `${11 * config.fontScale}px` }}>
                        {day.day}
                      </div>
                      <WeatherIcon
                        condition={day.icon}
                        animate={config.animateIcons}
                        greyscale={config.greyscaleIcons}
                        size={20 * config.fontScale}
                        theme={theme}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      {/* Temperature row */}
                      <div className="flex items-center gap-2">
                        {(config.dailyWeatherFields || []).includes('high') && (
                          <span className="text-sm font-bold" style={{ fontSize: `${14 * config.fontScale}px` }}>
                            {convertTemp(day.high)}°
                          </span>
                        )}
                        {(config.dailyWeatherFields || []).includes('low') && (
                          <span className="text-xs opacity-60" style={{ fontSize: `${12 * config.fontScale}px` }}>
                            {convertTemp(day.low)}°
                          </span>
                        )}
                      </div>

                      {/* Condition */}
                      {(config.dailyWeatherFields || []).includes('condition') && (
                        <div className="text-xs opacity-70 truncate" style={{ fontSize: `${11 * config.fontScale}px`, maxWidth: '100px' }}>
                          {day.condition}
                        </div>
                      )}

                      {/* Weather metrics row */}
                      <div className="flex items-center gap-2 flex-wrap text-xs opacity-70" style={{ fontSize: `${10 * config.fontScale}px` }}>
                        {(config.dailyWeatherFields || []).includes('precipitation') && day.precipitation > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Droplets size={10 * config.fontScale} />
                            {day.precipitation}%
                          </div>
                        )}
                        {(config.dailyWeatherFields || []).includes('wind') && (
                          <div className="flex items-center gap-0.5">
                            <Wind size={10 * config.fontScale} />
                            {day.wind}
                          </div>
                        )}
                        {(config.dailyWeatherFields || []).includes('humidity') && (
                          <div className="flex items-center gap-0.5">
                            <Droplets size={10 * config.fontScale} />
                            {day.humidity}%
                          </div>
                        )}
                        {(config.dailyWeatherFields || []).includes('uvIndex') && (
                          <div>UV: {day.uvIndex}</div>
                        )}
                      </div>

                      {/* Sunrise/Sunset if enabled */}
                      {((config.dailyWeatherFields || []).includes('sunrise') || (config.dailyWeatherFields || []).includes('sunset')) && (
                        <div className="flex items-center gap-2 text-xs opacity-70" style={{ fontSize: `${10 * config.fontScale}px` }}>
                          {(config.dailyWeatherFields || []).includes('sunrise') && day.sunrise && (
                            <div className="flex items-center gap-0.5">
                              <Sunrise size={10 * config.fontScale} />
                              {day.sunrise}
                            </div>
                          )}
                          {(config.dailyWeatherFields || []).includes('sunset') && day.sunset && (
                            <div className="flex items-center gap-0.5">
                              <Sunset size={10 * config.fontScale} />
                              {day.sunset}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== COMPACT ORIENTATION =====
  // Minimal display: icon + temp + condition, with optional mini-forecast
  const renderCompactLayout = () => {
    const { current } = currentWeather;

    return (
      <div className="space-y-2">
        {/* Main compact row */}
        <div className="flex items-center gap-3 p-2">
          <WeatherIcon
            condition={current.icon}
            animate={config.animateIcons}
            greyscale={config.greyscaleIcons}
            size={32 * config.fontScale}
            theme={theme}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl font-bold whitespace-nowrap"
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: `${28 * config.fontScale}px`,
                  textShadow,
                  ...gradientTextStyle
                }}
              >
                {convertTemp(current.temperature)}{tempUnit}
              </span>
              {config.currentWeatherFields?.includes('feelsLike') && (
                <span
                  className="text-xs opacity-60 whitespace-nowrap"
                  style={{ fontSize: `${11 * config.fontScale}px` }}
                >
                  ({convertTemp(current.feelsLike)}{tempUnit})
                </span>
              )}
            </div>
            {config.currentWeatherFields?.includes('condition') && (
              <span
                className="text-xs opacity-70 truncate"
                style={{ fontSize: `${11 * config.fontScale}px` }}
                title={current.condition}
              >
                {current.condition}
              </span>
            )}

            {/* Additional metrics */}
            <div className="flex items-center gap-2 flex-wrap mt-1 text-xs opacity-70" style={{ fontSize: `${10 * config.fontScale}px` }}>
              {(config.currentWeatherFields || []).includes('humidity') && (
                <div className="flex items-center gap-0.5">
                  <Droplets size={10 * config.fontScale} />
                  {current.humidity}%
                </div>
              )}
              {(config.currentWeatherFields || []).includes('wind') && (
                <div className="flex items-center gap-0.5">
                  <Wind size={10 * config.fontScale} />
                  {current.wind}
                </div>
              )}
              {(config.currentWeatherFields || []).includes('uvIndex') && (
                <div>UV:{current.uvIndex}</div>
              )}
              {(config.currentWeatherFields || []).includes('cloudCover') && (
                <div className="flex items-center gap-0.5">
                  <Cloud size={10 * config.fontScale} />
                  {current.cloudCover}%
                </div>
              )}
              {(config.currentWeatherFields || []).includes('pressure') && (
                <div className="flex items-center gap-0.5">
                  <Gauge size={10 * config.fontScale} />
                  {current.pressure}
                </div>
              )}
              {(config.currentWeatherFields || []).includes('visibility') && (
                <div className="flex items-center gap-0.5">
                  <Eye size={10 * config.fontScale} />
                  {current.visibility}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mini forecast - show only next 3 days */}
        {config.numberOfDays > 0 && forecastDays.length > 0 && (
          <div className="flex gap-2 px-2 overflow-x-auto">
            {forecastDays.slice(0, 3).map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center flex-shrink-0 p-1.5 rounded"
                style={{
                  minWidth: '50px',
                  backgroundColor: isDark
                    ? 'rgba(248, 249, 255, 0.05)'
                    : 'rgba(11, 14, 18, 0.03)'
                }}
              >
                <span className="text-xs font-semibold opacity-60" style={{ fontSize: `${10 * config.fontScale}px` }}>
                  {day.day}
                </span>
                <WeatherIcon
                  condition={day.icon}
                  animate={config.animateIcons}
                  greyscale={config.greyscaleIcons}
                  size={16 * config.fontScale}
                  theme={theme}
                />
                <div className="text-xs mt-0.5 space-y-0.5" style={{ fontSize: `${11 * config.fontScale}px` }}>
                  {/* Temps */}
                  <div>
                    {(config.dailyWeatherFields || []).includes('high') && (
                      <span className="font-bold">{convertTemp(day.high)}°</span>
                    )}
                    {(config.dailyWeatherFields || []).includes('low') && (
                      <span className="opacity-60 ml-0.5">{convertTemp(day.low)}°</span>
                    )}
                  </div>

                  {/* Condition */}
                  {(config.dailyWeatherFields || []).includes('condition') && (
                    <div className="opacity-70 truncate" style={{ fontSize: `${9 * config.fontScale}px`, maxWidth: '50px' }}>
                      {day.condition}
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="flex flex-col gap-0.5 items-center opacity-70" style={{ fontSize: `${9 * config.fontScale}px` }}>
                    {(config.dailyWeatherFields || []).includes('precipitation') && day.precipitation > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Droplets size={8 * config.fontScale} />
                        {day.precipitation}%
                      </div>
                    )}
                    {(config.dailyWeatherFields || []).includes('wind') && (
                      <div className="flex items-center gap-0.5">
                        <Wind size={8 * config.fontScale} />
                        {day.wind}
                      </div>
                    )}
                    {(config.dailyWeatherFields || []).includes('humidity') && (
                      <div className="flex items-center gap-0.5">
                        <Droplets size={8 * config.fontScale} />
                        {day.humidity}%
                      </div>
                    )}
                    {(config.dailyWeatherFields || []).includes('uvIndex') && (
                      <div>UV:{day.uvIndex}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ===== WIDE ORIENTATION =====
  // Rich card layout with metrics row and optional mini-forecast
  const renderWideLayout = () => {
    const { current } = currentWeather;
    
    // All available metrics for secondary row
    const metricsConfig = [
      { key: 'feelsLike', label: 'Feels Like', value: `${convertTemp(current.feelsLike)}${tempUnit}`, icon: null },
      { key: 'humidity', label: 'Humidity', value: `${current.humidity}%`, icon: Droplets },
      { key: 'wind', label: 'Wind', value: `${current.wind} ${windUnit}`, icon: Wind },
      { key: 'uvIndex', label: 'UV Index', value: current.uvIndex, icon: null },
      { key: 'pressure', label: 'Pressure', value: `${current.pressure} hPa`, icon: Gauge },
      { key: 'visibility', label: 'Visibility', value: `${current.visibility} ${config.preferredUnits === 'metric' ? 'km' : 'mi'}`, icon: Eye },
      { key: 'cloudCover', label: 'Clouds', value: `${current.cloudCover}%`, icon: Cloud },
      { key: 'sunrise', label: 'Sunrise', value: current.sunrise, icon: Sunrise },
      { key: 'sunset', label: 'Sunset', value: current.sunset, icon: Sunset },
    ];

    // Filter metrics based on config (no limit)
    const visibleMetrics = metricsConfig.filter(m =>
      (config.currentWeatherFields || []).includes(m.key) && m.value
    );
    
    return (
      <div className="w-full space-y-4">
        {/* Top Row: Location (left), Large Temp + Icon (center), Condition (right) */}
        <div className="flex items-center justify-between w-full">
          {/* Left: Location */}
          <div className="flex-1 min-w-0">
            <h2 
              className="text-xl font-bold truncate" 
              style={{ 
                fontFamily: theme.fonts.heading,
                fontSize: `${22 * config.fontScale}px`,
                textShadow,
                ...gradientTextStyle
              }}
              title={currentLocation}
            >
              {currentLocation}
            </h2>
            {config.useGeolocation && (
              <button
                onClick={() => detectLocation()}
                className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity mt-1"
                style={{ fontSize: `${11 * config.fontScale}px` }}
                aria-label="Detect your current location"
              >
                <MapPin size={10 * config.fontScale} aria-hidden="true" />
                Update
              </button>
            )}
          </div>
          
          {/* Center: Large Temp + Icon */}
          <div className="flex items-center gap-4 flex-shrink-0 px-6">
            <WeatherIcon
              condition={current.icon}
              animate={config.animateIcons}
              greyscale={config.greyscaleIcons}
              size={56 * config.fontScale}
              theme={theme}
            />
            <span 
              className="text-5xl font-bold whitespace-nowrap" 
              style={{ 
                fontFamily: theme.fonts.heading, 
                fontSize: `${52 * config.fontScale}px`,
                textShadow,
                ...gradientTextStyle
              }}
            >
              {convertTemp(current.temperature)}{tempUnit}
            </span>
          </div>
          
          {/* Right: Condition + Hi/Lo */}
          <div className="flex-1 min-w-0 text-right">
            <div 
              className="text-lg opacity-90 truncate"
              style={{ fontSize: `${18 * config.fontScale}px` }}
              title={current.condition}
            >
              {current.condition}
            </div>
            {forecastDays[0] && (
              <div 
                className="text-sm opacity-70"
                style={{ fontSize: `${14 * config.fontScale}px` }}
              >
                H: {convertTemp(forecastDays[0].high)}{tempUnit} / L: {convertTemp(forecastDays[0].low)}{tempUnit}
              </div>
            )}
          </div>
        </div>
        
        {/* Secondary Row: Metrics Grid (all selected items) */}
        {visibleMetrics.length > 0 && (
          <div
            className="grid gap-4 py-3 border-t border-b"
            style={{
              gridTemplateColumns: visibleMetrics.length <= 5
                ? `repeat(${visibleMetrics.length}, 1fr)`
                : 'repeat(auto-fit, minmax(120px, 1fr))',
              borderColor: isDark ? 'rgba(248, 249, 255, 0.1)' : 'rgba(11, 14, 18, 0.1)'
            }}
          >
            {visibleMetrics.map((metric) => (
              <div key={metric.key} className="flex flex-col items-center text-center">
                <span 
                  className="text-xs opacity-60 uppercase tracking-wider mb-1"
                  style={{ fontSize: `${10 * config.fontScale}px` }}
                >
                  {metric.label}
                </span>
                <div className="flex items-center gap-1">
                  {metric.icon && <metric.icon size={14 * config.fontScale} className="opacity-70" />}
                  <span 
                    className="font-semibold"
                    style={{ fontSize: `${14 * config.fontScale}px` }}
                  >
                    {metric.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Bottom Row: Mini-Forecast Chips (horizontal scroll if needed) */}
        {config.numberOfDays > 0 && forecastDays.length > 0 && (
          <div className="overflow-x-auto pb-2">
            <div 
              className="flex gap-3"
              style={{ minWidth: 'min-content' }}
            >
              {forecastDays.slice(0, 7).map((day, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 flex flex-col items-center p-3 rounded-lg"
                  style={{
                    minWidth: '70px',
                    backgroundColor: isDark
                      ? 'rgba(248, 249, 255, 0.08)'
                      : 'rgba(11, 14, 18, 0.04)'
                  }}
                >
                  <span 
                    className="text-xs font-semibold opacity-70 mb-1"
                    style={{ fontSize: `${11 * config.fontScale}px` }}
                  >
                    {day.day}
                  </span>
                  <WeatherIcon
                    condition={day.icon}
                    animate={config.animateIcons}
                    greyscale={config.greyscaleIcons}
                    size={20 * config.fontScale}
                    theme={theme}
                  />
                  <div className="mt-1 space-y-1">
                    {/* Temps */}
                    <div className="text-center">
                      {(config.dailyWeatherFields || []).includes('high') && (
                        <span
                          className="text-sm font-bold"
                          style={{ fontSize: `${13 * config.fontScale}px` }}
                        >
                          {convertTemp(day.high)}°
                        </span>
                      )}
                      {(config.dailyWeatherFields || []).includes('low') && (
                        <span
                          className="text-xs opacity-60 ml-1"
                          style={{ fontSize: `${11 * config.fontScale}px` }}
                        >
                          {convertTemp(day.low)}°
                        </span>
                      )}
                    </div>

                    {/* Condition */}
                    {(config.dailyWeatherFields || []).includes('condition') && (
                      <div className="text-xs opacity-70 text-center truncate" style={{ fontSize: `${10 * config.fontScale}px` }}>
                        {day.condition}
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="flex flex-col items-center gap-0.5 text-xs opacity-70" style={{ fontSize: `${10 * config.fontScale}px` }}>
                      {(config.dailyWeatherFields || []).includes('precipitation') && day.precipitation > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Droplets size={10 * config.fontScale} />
                          {day.precipitation}%
                        </div>
                      )}
                      {(config.dailyWeatherFields || []).includes('wind') && (
                        <div className="flex items-center gap-0.5">
                          <Wind size={10 * config.fontScale} />
                          {day.wind}
                        </div>
                      )}
                      {(config.dailyWeatherFields || []).includes('humidity') && (
                        <div className="flex items-center gap-0.5">
                          <Droplets size={10 * config.fontScale} />
                          {day.humidity}%
                        </div>
                      )}
                      {(config.dailyWeatherFields || []).includes('uvIndex') && (
                        <div>UV: {day.uvIndex}</div>
                      )}
                    </div>

                    {/* Sunrise/Sunset */}
                    {((config.dailyWeatherFields || []).includes('sunrise') || (config.dailyWeatherFields || []).includes('sunset')) && (
                      <div className="flex items-center gap-2 justify-center text-xs opacity-70" style={{ fontSize: `${9 * config.fontScale}px` }}>
                        {(config.dailyWeatherFields || []).includes('sunrise') && day.sunrise && (
                          <div className="flex items-center gap-0.5">
                            <Sunrise size={9 * config.fontScale} />
                            {day.sunrise}
                          </div>
                        )}
                        {(config.dailyWeatherFields || []).includes('sunset') && day.sunset && (
                          <div className="flex items-center gap-0.5">
                            <Sunset size={9 * config.fontScale} />
                            {day.sunset}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Get forecast grid columns based on orientation and number of days
  const getForecastGridClass = () => {
    switch (config.orientation) {
      case 'horizontal':
        // Side by side: show days in a single row, use inline style for exact count
        return 'auto-cols-fr grid-flow-col';
      case 'compact':
        // Stacked: 2-3 columns max
        return 'grid-cols-2 sm:grid-cols-3';
      case 'wide':
        // Wide: spread days across in a row
        return 'auto-cols-fr grid-flow-col';
      default: // auto
        return 'grid-cols-3 md:grid-cols-5';
    }
  };
  
  // Get forecast container style for orientation
  const getForecastGridStyle = () => {
    const days = Math.min(config.numberOfDays || 5, 10);
    switch (config.orientation) {
      case 'horizontal':
      case 'wide':
        return { gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` };
      default:
        return {};
    }
  };
  
  // Build background styles properly to avoid conflicts
  const backgroundStyles = useMemo(() => {
    const styles = {};
    const isGradient = typeof bgColor === 'string' && bgColor.includes('gradient');
    
    if (isGradient) {
      // For gradients, combine with texture using comma-separated backgrounds
      if (bgTexture) {
        styles.backgroundImage = `${bgTexture}, ${bgColor}`;
      } else {
        styles.backgroundImage = bgColor;
      }
    } else {
      // For solid colors, use backgroundColor and backgroundImage separately
      styles.backgroundColor = bgColor;
      if (bgTexture) {
        styles.backgroundImage = bgTexture;
      }
    }
    
    styles.backgroundSize = config.backgroundTexture === 'dots' || config.backgroundTexture === 'grid' 
      ? '20px 20px' 
      : 'auto';
    
    return styles;
  }, [bgColor, bgTexture, config.backgroundTexture]);

  // ===== DEFAULT/AUTO ORIENTATION =====
  // Standard vertical layout with current weather + forecast grid
  const renderDefaultLayout = () => {
    return (
      <div className={`flex gap-6 ${getLayoutClass()}`}>
        {/* Current Weather */}
        <div className={`text-center ${config.orientation === 'wide' ? 'flex-shrink-0 min-w-[200px]' : config.orientation === 'compact' ? 'w-full' : 'flex-shrink-0'}`}>
          <div className="flex flex-col items-center gap-3 mb-4">
            <WeatherIcon
              condition={currentWeather.current.icon}
              animate={config.animateIcons}
              greyscale={config.greyscaleIcons}
              size={48 * config.fontScale}
              theme={theme}
            />
            <div>
              <h2 className="text-xl font-bold" style={{ 
                fontFamily: theme.fonts.heading, 
                textShadow, 
                fontSize: `${20 * config.fontScale}px`,
                ...gradientTextStyle
              }}>
                {currentLocation}
              </h2>
              {config.useGeolocation && (
                <button
                  onClick={() => detectLocation()}
                  className="flex items-center justify-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity mt-1 mx-auto"
                  style={{ fontSize: `${12 * config.fontScale}px` }}
                  aria-label="Detect your current location"
                >
                  <MapPin size={12 * config.fontScale} aria-hidden="true" />
                  Detect Location
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2" style={{ textShadow }}>
            {(config.currentWeatherFields || []).slice(0, 6).map((field, idx) => (
              <div key={idx}>{renderCurrentField(field)}</div>
            ))}
          </div>
        </div>

        {/* Forecast */}
        <div className={`text-center ${config.orientation === 'compact' ? 'w-full mt-4' : 'flex-1'}`} role="region" aria-label="Weather forecast">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-3" style={{ textShadow, fontSize: `${14 * config.fontScale}px` }}>
            {config.numberOfDays}-Day Forecast
          </h3>

          <div 
            className={`grid gap-3 ${getForecastGridClass()} justify-items-center`}
            style={getForecastGridStyle()}
          >
            {forecastDays.map((day, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${config.visuallyGroupForecast ? 'bg-opacity-10 bg-current' : ''}`}
                style={{
                  textAlign: 'center',
                  textShadow,
                  ...(config.visuallyGroupForecast && {
                    backgroundColor: isDark
                      ? 'rgba(248, 249, 255, 0.1)'
                      : 'rgba(11, 14, 18, 0.05)'
                  })
                }}
              >
                <div className="text-xs font-semibold mb-2 opacity-70" style={{ fontSize: `${12 * config.fontScale}px` }}>
                  {day.day}
                  {config.displayDates && day.date && (
                    <div className="text-xs opacity-50" style={{ fontSize: `${10 * config.fontScale}px` }}>{day.date}</div>
                  )}
                </div>
                <WeatherIcon
                  condition={day.icon}
                  animate={config.animateIcons}
                  greyscale={config.greyscaleIcons}
                  size={24 * config.fontScale}
                  theme={theme}
                />
                <div className="mt-2 space-y-1">
                  {(config.dailyWeatherFields || []).includes('high') && (
                    <div className="text-sm font-bold" style={{ fontSize: `${14 * config.fontScale}px` }}>{convertTemp(day.high)}{tempUnit}</div>
                  )}
                  {(config.dailyWeatherFields || []).includes('low') && (
                    <div className="text-xs opacity-60" style={{ fontSize: `${12 * config.fontScale}px` }}>{convertTemp(day.low)}{tempUnit}</div>
                  )}
                  {(config.dailyWeatherFields || []).includes('condition') && (
                    <div className="text-xs opacity-70" style={{ fontSize: `${12 * config.fontScale}px` }}>{day.condition}</div>
                  )}
                  {(config.dailyWeatherFields || []).includes('precipitation') && (
                    <div className="text-xs flex items-center justify-center gap-1" style={{ fontSize: `${12 * config.fontScale}px` }}>
                      <Droplets size={10 * config.fontScale} aria-hidden="true" />
                      {day.precipitation}%
                    </div>
                  )}
                  {(config.dailyWeatherFields || []).includes('wind') && (
                    <div className="text-xs flex items-center justify-center gap-1 opacity-70" style={{ fontSize: `${12 * config.fontScale}px` }}>
                      <Wind size={10 * config.fontScale} aria-hidden="true" />
                      {day.wind} {windUnit}
                    </div>
                  )}
                  {(config.dailyWeatherFields || []).includes('uvIndex') && day.uvIndex !== undefined && (
                    <div className="text-xs opacity-70" style={{ fontSize: `${12 * config.fontScale}px` }}>
                      UV: {day.uvIndex}
                    </div>
                  )}
                  {(config.dailyWeatherFields || []).includes('humidity') && day.humidity !== undefined && (
                    <div className="text-xs flex items-center justify-center gap-1 opacity-70" style={{ fontSize: `${12 * config.fontScale}px` }}>
                      <Droplets size={10 * config.fontScale} aria-hidden="true" />
                      {day.humidity}%
                    </div>
                  )}
                  {(config.dailyWeatherFields || []).includes('sunrise') && day.sunrise && (
                    <div className="text-xs flex items-center justify-center gap-1 opacity-70" style={{ fontSize: `${10 * config.fontScale}px` }}>
                      <Sunrise size={10 * config.fontScale} aria-hidden="true" />
                      {day.sunrise}
                    </div>
                  )}
                  {(config.dailyWeatherFields || []).includes('sunset') && day.sunset && (
                    <div className="text-xs flex items-center justify-center gap-1 opacity-70" style={{ fontSize: `${10 * config.fontScale}px` }}>
                      <Sunset size={10 * config.fontScale} aria-hidden="true" />
                      {day.sunset}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ===== MAIN CONTENT RENDERER =====
  // Routes to the appropriate layout based on orientation
  const renderContent = () => {
    // Debug: log orientation value
    console.log('[WeatherWidget] orientation:', config.orientation);
    
    switch (config.orientation) {
      case 'horizontal':
        return renderHorizontalLayout();
      case 'compact':
        return renderCompactLayout();
      case 'wide':
        return renderWideLayout();
      default:
        return renderDefaultLayout();
    }
  };

  // Get padding based on orientation
  const getContainerPadding = () => {
    switch (config.orientation) {
      case 'horizontal':
        return 'p-3';
      case 'compact':
        return 'p-2';
      case 'wide':
        return 'p-5';
      default:
        return 'p-6';
    }
  };

  // Get scale multiplier based on widget size
  const getSizeScale = () => {
    const sizeMap = {
      small: 0.85,
      medium: 1.0,
      large: 1.15,
      xlarge: 1.3
    };
    return sizeMap[config.widgetSize] || 1.0;
  };

  const sizeScale = getSizeScale();

  return (
    <div
      className={`h-full w-full ${getContainerPadding()}`}
      style={{
        ...backgroundStyles,
        color: textColor,
        fontFamily: fontFamily,
        textAlign: config.orientation === 'horizontal' || config.orientation === 'compact' ? 'left' : config.textAlign,
        boxShadow: glowEffect,
        transform: `scale(${sizeScale})`,
        transformOrigin: 'top left',
        ...glassmorphismStyles
      }}
      role="region"
      aria-label="Weather widget"
    >
      {loading ? (
        <LoadingSkeleton orientation={config.orientation} />
      ) : (
        <>
          {/* Geolocation Error Display */}
          {geoError && (
            <div 
              className={`${config.orientation === 'compact' ? 'mb-2 p-2 text-xs' : 'mb-4 p-3 text-sm'} bg-yellow-100 text-yellow-800 rounded-lg`}
              role="alert"
              aria-live="polite"
            >
              <AlertTriangle size={config.orientation === 'compact' ? 12 : 16} className="inline mr-2" aria-hidden="true" />
              {config.orientation === 'compact' ? 'Location error' : geoError}
            </div>
          )}

          {/* Severe Weather Alerts - hide in compact mode */}
          {config.orientation !== 'compact' && config.showSevereAlerts && weatherData?.alerts && weatherData.alerts.length > 0 && (
            <div className="mb-4">
              {weatherData.alerts.slice(0, config.orientation === 'horizontal' ? 1 : 2).map((alert, idx) => (
                <SevereWeatherAlert key={idx} alert={alert} />
              ))}
            </div>
          )}

          {/* Main Content - orientation-aware */}
          {renderContent()}

          {/* Error Display */}
          {error && (
            <div 
              className={`mt-4 ${config.orientation === 'compact' ? 'p-2 text-xs' : 'p-3 text-sm'} bg-red-100 text-red-800 rounded-lg flex items-center justify-between`}
              role="alert"
              aria-live="assertive"
            >
              <span>{config.orientation === 'compact' ? 'Error' : error}</span>
              <button
                onClick={() => {
                  if (config.useGeolocation) {
                    detectLocation();
                  } else {
                    fetchWeatherData(currentLocation);
                  }
                }}
                className={`ml-3 ${config.orientation === 'compact' ? 'px-2 py-0.5' : 'px-3 py-1'} bg-red-200 hover:bg-red-300 rounded text-red-800 text-xs font-medium transition-colors`}
                aria-label="Retry fetching weather data"
              >
                Retry
              </button>
            </div>
          )}

          {/* Customize button - hide in compact mode */}
          {config.orientation !== 'compact' && config.showCustomizeButton && (
            <button
              className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: theme.colors.cosmicBlue,
                color: theme.colors.stardustWhite,
                fontFamily: theme.fonts.heading,
                fontSize: `${14 * config.fontScale}px`
              }}
              aria-label="Customize weather widget settings"
              onClick={() => onCustomizeRequest?.('appearance')}
            >
              Customize
            </button>
          )}
        </>
      )}
    </div>
  );
};

// PropTypes validation for config prop
WeatherWidget.propTypes = {
  config: PropTypes.shape({
    weatherLocation: PropTypes.string,
    useGeolocation: PropTypes.bool,
    preferredUnits: PropTypes.oneOf(['metric', 'imperial']),
    numberOfDays: PropTypes.number,
    displayDates: PropTypes.bool,
    hideTodayInForecast: PropTypes.bool,
    currentWeatherFields: PropTypes.arrayOf(PropTypes.string),
    dailyWeatherFields: PropTypes.arrayOf(PropTypes.string),
    showSevereAlerts: PropTypes.bool,
    showCustomizeButton: PropTypes.bool,
    appearanceMode: PropTypes.oneOf(['light', 'dark', 'system']),
    textColorLight: PropTypes.string,
    textColorDark: PropTypes.string,
    textFontFamily: PropTypes.oneOf(['sans', 'serif', 'mono']),
    googleFont: PropTypes.string,
    fontScale: PropTypes.number,
    textAlign: PropTypes.oneOf(['left', 'center', 'right']),
    textShadows: PropTypes.bool,
    gradientText: PropTypes.bool,
    glowEffect: PropTypes.bool,
    animateIcons: PropTypes.bool,
    greyscaleIcons: PropTypes.bool,
    useTransparentBackground: PropTypes.bool,
    setBackgroundColor: PropTypes.bool,
    backgroundColor: PropTypes.string,
    backgroundTexture: PropTypes.oneOf(['none', 'noise', 'stars', 'dots', 'grid', 'waves']),
    presetTheme: PropTypes.oneOf(['none', 'cyberpunk', 'stealth', 'ocean', 'sunset', 'forest', 'neon', 'midnight']),
    orientation: PropTypes.oneOf(['auto', 'horizontal', 'compact', 'wide']),
    visuallyGroupForecast: PropTypes.bool,
  }).isRequired,
  onCustomizeRequest: PropTypes.func,
};
