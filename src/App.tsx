import React, { useEffect, useState, useCallback } from 'react';
import { TrainBoard } from './components/TrainBoard';

type City = {
  name: string;
  query: string;
  displayName: string;
};

const CITIES: City[] = [
  { name: 'ATL', query: 'Atlanta,GA', displayName: 'ATLANTA GA' },
  { name: 'NYC', query: 'New York,NY', displayName: 'NEW YORK NY' },
];

function App() {
  const [weatherText, setWeatherText] = useState('LOADING WEATHER...');
  const [currentCityIndex, setCurrentCityIndex] = useState(() => {
    const saved = localStorage?.getItem('lastCityIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  const switchCity = useCallback(() => {
    setCurrentCityIndex((prev) => {
      const newIndex = (prev + 1) % CITIES.length;
      localStorage?.setItem('lastCityIndex', newIndex.toString());
      return newIndex;
    });
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        switchCity();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [switchCity]);

  const getWeatherEmoji = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    
    // Map weather conditions to emojis
    if (conditionLower.includes('sunny')) return '☀️';
    if (conditionLower.includes('clear')) return '🌙';
    if (conditionLower.includes('partly cloudy')) return '⛅';
    if (conditionLower.includes('cloudy')) return '☁️';
    if (conditionLower.includes('overcast')) return '☁️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '☔︎';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('drizzle')) return '☔️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('sleet')) return '❄️';
    if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) return '⛈️';
    if (conditionLower.includes('blizzard')) return '❄️';
    
    return ''; // Default to no emoji if condition not matched
  };

  const fetchWeather = async (city: City) => {
    console.log(`Fetching weather data for ${city.name}...`);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=aa94550c74e24411af0211102253001&q=${city.query}&aqi=no`
      );
      console.log('Weather API response status:', response.status);
      const data = await response.json();
      console.log('Weather data received:', data);
      
      const temp = Math.round(data.current.temp_f);
      const condition = data.current.condition.text.toUpperCase();
      const weatherEmoji = getWeatherEmoji(data.current.condition.text);
      const time = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).toUpperCase();

      const newText = `${city.displayName}\n${temp}°F ${condition} ${weatherEmoji}\n${time}`;
      console.log('Setting weather text to:', newText);
      setWeatherText(newText);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherText('WEATHER UNAVAILABLE');
    }
  };

  useEffect(() => {
    console.log('Setting up weather fetch...');
    const currentCity = CITIES[currentCityIndex];
    
    // Initial fetch
    fetchWeather(currentCity);
    
    // Calculate time until next minute
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    
    // Set up initial timeout to sync with minute boundary
    const initialTimeout = setTimeout(() => {
      fetchWeather(currentCity);
      
      // Then set up regular interval aligned with minutes
      const interval = setInterval(() => {
        fetchWeather(currentCity);
      }, 60000);
      
      // Clean up interval on unmount
      return () => {
        console.log('Cleaning up weather fetch interval');
        clearInterval(interval);
      };
    }, msUntilNextMinute);
    
    // Clean up initial timeout if component unmounts before it fires
    return () => clearTimeout(initialTimeout);
  }, [currentCityIndex]);

  // Switch cities every 10 seconds
  useEffect(() => {
    const cityInterval = setInterval(switchCity, 10000);
    return () => clearInterval(cityInterval);
  }, [switchCity]);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <TrainBoard text={weatherText} />
    </div>
  );
}

export default App;