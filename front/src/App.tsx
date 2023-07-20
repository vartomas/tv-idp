import { useEffect, useState } from 'react';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

const fetchWeather = async () => {
  const response = await fetch('/api/WeatherForecast');
  return (await response.json()) as WeatherForecast[];
};

const App = () => {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);

  useEffect(() => {
    const setForecastsFromApi = async () => {
      const forecasts = await fetchWeather();
      setForecasts(forecasts);
    };
    setForecastsFromApi();
  }, []);

  return (
    <>
      {forecasts.map((x) => (
        <div key={x.date}>
          {x.date} {x.temperatureC} {x.temperatureF} {x.summary}
        </div>
      ))}
    </>
  );
};

export default App;
