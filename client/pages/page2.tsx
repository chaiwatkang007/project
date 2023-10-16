import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import axios from "axios";

export default function TemperatureChart() {
  const [selectedDate, setSelectedDate] = useState("2023-09-03"); // Default date
  const [selectedTime, setSelectedTime] = useState("00:00"); // Default time
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [xAxisCategories, setXAxisCategories] = useState();


  useEffect(() => {
    // Fetch temperature and humidity data from the server when the date and time change
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/temp/daytemp", {
          day: selectedDate,
          // time: selectedTime,
        });
        const data = response.data;
        
        // Extract temperature and humidity from the response
        const temperature = data.result.map((entry) => entry.temp);
        const humidity = data.result.map((entry) => entry.humidity);
        const timeData = data.result.map((entry) => entry.time);

        // console.log(temperature)
        // console.log(humidity)
        // console.log(timeData)
        
        setTemperature(temperature);
        setHumidity(humidity);
        setXAxisCategories(timeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDate, selectedTime]);

  const options = {
    chart: {
      type: "area",
    },
    title: {
      text: "Temperature and Humidity",
    },
    xAxis: {
      categories: xAxisCategories,
    },
    yAxis: {
      title: {
        text: "value",
      },
    },
    series: [
      {
        name: "Temperature",
        data: temperature,
      },
      {
        name: "Humidity",
        data: humidity,
      },
    ],
  };

  // Function to handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Function to handle time selection
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // Function to generate time options every 15 minutes
  const generateTimeOptions = () => {
    const times = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const time = `${formattedHours}:${formattedMinutes}`;
        times.push(time);
      }
    }
    return times;
  };

  return (
    <div>
      <div className="zz">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <label htmlFor="time" className="z1">Select Time:</label>
        <select id="time" value={selectedTime} onChange={handleTimeChange}>
          {generateTimeOptions().map((timeOption) => (
            <option key={timeOption} value={timeOption}>
              {timeOption}
            </option>
          ))}
        </select>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
