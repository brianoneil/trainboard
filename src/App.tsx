import React, { useEffect, useState } from 'react';
import { TrainBoard } from './components/TrainBoard';

function App() {
  const [weatherText, setWeatherText] = useState('LOADING WEATHER...');

  useEffect(() => {
    const fetchWeather = async () => {
      console.log('Fetching weather data...');
      try {
        const response = await fetch(
          'https://api.weatherapi.com/v1/current.json?key=aa94550c74e24411af0211102253001&q=Atlanta,GA&aqi=no'
        );
        console.log('Weather API response status:', response.status);
        const data = await response.json();
        console.log('Weather data received:', data);
        
        const temp = Math.round(data.current.temp_f);
        const condition = data.current.condition.text.toUpperCase();
        const time = new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }).toUpperCase();

        const newText = `ATLANTA GA\n${temp}°F ${condition}\n${time}`;
        console.log('Setting weather text to:', newText);
        setWeatherText(newText);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherText('WEATHER UNAVAILABLE');
      }
    };

    console.log('Setting up weather fetch...');
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Update every minute
    console.log('Weather fetch interval set');

    return () => {
      console.log('Cleaning up weather fetch interval');
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <TrainBoard text={weatherText} />
    </div>
  );
}

export default App;