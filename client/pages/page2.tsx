import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Row } from "antd";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TemperatureChart() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [chartData, setChartData] = useState(null);

  const timeOptions = [];
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const time = `${formattedHours}:${formattedMinutes}`;
      timeOptions.push(time);
    }
  }

  return (
    <div className="zz">
      <div>
        <h1>Temperature Data Chart</h1>
        <div className="DT">
          <label htmlFor="dayInput">Select Day:</label>
          <DatePicker
            id="dayInput"
            selected={selectedDay}
            onChange={(date) => setSelectedDay(date)}
          />
          <label htmlFor="timeInput">Select Time:</label>
          <select
            id="timeInput"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Select Time</option>
            {timeOptions.map((timeOption) => (
              <option key={timeOption} value={timeOption}>
                {timeOption}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>
    
  );
}
