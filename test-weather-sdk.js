import { fetchWeatherApi } from 'openmeteo';

async function testWeatherAPI() {
  try {
    const params = {
      latitude: 40.7128,
      longitude: -74.0060,
      current: ['temperature_2m', 'weather_code'],
      timezone: 'auto'
    };
    
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    
    const current = response.current();
    console.log('✅ SDK Test Successful!');
    console.log('Temperature:', current.variables(0).value());
    console.log('Weather Code:', current.variables(1).value());
  } catch (error) {
    console.error('❌ SDK Test Failed:', error);
  }
}

testWeatherAPI();
