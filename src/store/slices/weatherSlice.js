import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, host_name } from "../../config/config";

const initialState = {
  current: null,
  forecast: [],
  city: "",
};

export const getCityData = createAsyncThunk("city", async (obj) => {
  try {
    const request = await axios.get(
      `${host_name}/data/2.5/weather?q=${obj.city}&units=${obj.unit}&APPID=${API_KEY}`
    );
    const response = await request.data;
    return {
      data: response,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data.message,
    };
  }
});


export const get5DaysForecast = createAsyncThunk("5days", async (obj) => {
  const request = await axios.get(
    `${host_name}/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&units=${obj.unit}&APPID=${API_KEY}`
  );
  const response = await request.data;
  console.log(request.data);

  return response;
});

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    citySearchLoading: false,
    citySearchData: null,
    forecastLoading: false,
    forecastData: null,
    forecastError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityData.pending, (state) => {
        state.citySearchLoading = true;
        state.citySearchData = null;
      })
      .addCase(getCityData.fulfilled, (state, action) => {
        state.citySearchLoading = false;
        state.citySearchData = action.payload;
      })

      // forecast

      .addCase(get5DaysForecast.pending, (state) => {
        state.forecastLoading = true;
        state.forecastData = null;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.fulfilled, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = action.payload;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.rejected, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = null;
        state.forecastError = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
