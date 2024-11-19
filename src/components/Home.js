import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-icons-kit";
import { get5DaysForecast, getCityData } from "../store/slices/weatherSlice";
import { SphereSpinner } from "react-spinners-kit";
import { arrowDown } from "react-icons-kit/feather";
import { arrowUp } from "react-icons-kit/feather";
import { droplet } from "react-icons-kit/feather";
import { wind } from "react-icons-kit/feather";
import { activity } from "react-icons-kit/feather";
import { search } from "react-icons-kit/feather";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../themes/Themes";
import { moon } from "react-icons-kit/feather";
import { sun } from "react-icons-kit/feather";
import { zap } from "react-icons-kit/feather";

const Container = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
`;
const DarkModeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 0;
  margin: 0;
  font-size: 24px;
`;
const Home = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const {
    citySearchloading,
    citySearchData,
    forecastData,
    forecastLoading,
    forecastError,
  } = useSelector((state) => state.weather);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const allLoadings = [citySearchloading, forecastLoading];
  useEffect(() => {
    const isAnyChildLoadings = allLoadings.some((state) => state);
    setLoading(isAnyChildLoadings);
  }, [allLoadings]);
  const [city, setCity] = useState("Bishkek");
  const [unit, setUnit] = useState("metric");

  const toggleUnit = () => {
    setLoading(true);
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const dispatch = useDispatch();

  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      if (!res.payload.error) {
        dispatch(
          get5DaysForecast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        );
      }
    });
  };

  // initial render
  useEffect(() => {
    fetchData();
  }, [unit]);
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  // filter time

  const filterForecastByFirstObjTime = (forecastData) => {
    if (!forecastData) {
      return [];
    }

    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];

    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  };

  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);
  console.log(filteredForecast);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Container>
        <div className="background">
          <div className="box">
            <form
              style={{
                position: "sticky",
              }}
              autoComplete="off"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                className="city-input"
                placeholder=" search city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                readOnly={loading}
              />
              <button
                style={{
                  background: "#2fa5ed",
                  color: "white",
                }}
              >
                GO
              </button>
              <DarkModeToggle onClick={toggleTheme}>
                {theme === "light" ? (
                  <Icon icon={moon} size={25} className="icon" />
                ) : (
                  <Icon icon={sun} size={25} className="icon" />
                )}
              </DarkModeToggle>
            </form>
            <div className="current-weather-details-box">
              <div className="details-box-header">
                <h1>Current Weather</h1>

                <div className="switch" onClick={toggleUnit}>
                  <div
                    className={`switch-toggle ${unit === "metric" ? "c" : "f"}`}
                  ></div>
                  <span className="c">C</span>
                  <span className="f">F</span>
                </div>
              </div>
              {loading ? (
                <div className="loader">
                  <SphereSpinner loadings={loading} color="#2fa5ed" size={30} />
                </div>
              ) : (
                <>
                  {citySearchData && citySearchData.error ? (
                    <div className="error-msg">{citySearchData.error}</div>
                  ) : (
                    <>
                      {forecastError ? (
                        <div className="error-msg">{forecastError}</div>
                      ) : (
                        <>
                          {citySearchData && citySearchData.data ? (
                            <>
                              <div className="weather-details-container">
                                <div className="details">
                                  <h1 className="city-name">
                                    {citySearchData.data.name}
                                  </h1>

                                  <div className="icon-and-temp">
                                    <img
                                      src={`https://openweathermap.org/img/wn/${citySearchData.data.weather[0].icon}@2x.png`}
                                      alt="icon"
                                    />
                                    <h1>
                                      {citySearchData.data.main.temp}&deg;
                                    </h1>
                                  </div>

                                  <h3 className="description">
                                    {citySearchData.data.weather[0].description}
                                  </h3>
                                </div>

                                <div className="metrices">
                                  <h3>
                                    Feels like{" "}
                                    {citySearchData.data.main.feels_like}
                                    &deg;C
                                  </h3>

                                  <div className="key-value-box">
                                    <div className="key">
                                      <Icon
                                        icon={arrowUp}
                                        size={25}
                                        className="icon"
                                      />
                                      <span className="value">
                                        {citySearchData.data.main.temp_max}
                                        &deg;C
                                      </span>
                                    </div>
                                    <div className="key">
                                      <Icon
                                        icon={arrowDown}
                                        size={25}
                                        className="icon"
                                      />
                                      <span className="value">
                                        {citySearchData.data.main.temp_min}
                                        &deg;C
                                      </span>
                                    </div>
                                  </div>

                                  <div className="key-value-box">
                                    <div className="key">
                                      <Icon
                                        icon={droplet}
                                        size={25}
                                        className="icon"
                                      />
                                      <span>Humidity</span>
                                    </div>
                                    <div className="value">
                                      <span>
                                        {citySearchData.data.main.humidity}%
                                      </span>
                                    </div>
                                  </div>

                                  <div className="key-value-box">
                                    <div className="key">
                                      <Icon
                                        icon={wind}
                                        size={25}
                                        className="icon"
                                      />
                                      <span>Wind</span>
                                    </div>
                                    <div className="value">
                                      <span>
                                        {citySearchData.data.wind.speed}kph
                                      </span>
                                    </div>
                                  </div>
                                  <div className="key-value-box">
                                    <div className="key">
                                      <Icon
                                        icon={activity}
                                        size={25}
                                        className="icon"
                                      />
                                      <span>Pressure</span>
                                    </div>
                                    <div className="value">
                                      <span>
                                        {citySearchData.data.main.pressure}
                                        hPa
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="error-msg">No Data Found</div>
                          )}
                          <h3 className="extended-forecast-heading">
                            Extended Forecast
                          </h3>
                          {filteredForecast.length > 0 ? (
                            <div className="extended-forecasts-container">
                              {filteredForecast.map((data, index) => {
                                const date = new Date(data.dt_txt);
                                const day = date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                });
                                return (
                                  <div className="forecast-box" key={index}>
                                    <h2>{day}</h2>
                                    <img
                                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                      alt="icon"
                                    />
                                    <h4 className="min-max-temp">
                                      {data.main.temp_min}&deg;
                                      {data.main.temp_max}&deg;
                                    </h4>
                                    <h4>{data.weather[0].description}</h4>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="error-msg">No Data Found</div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
