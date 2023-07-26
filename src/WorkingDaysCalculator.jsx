import React, { useState, useEffect } from "react";
import holidaysData from "./holidays.json"; // Adjust the path as necessary

const WorkingDaysCalculator = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [skippedDates, setSkippedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState("2023-12-24");
  const [workingDaysToAdd, setWorkingDaysToAdd] = useState(10);

  const countryHolidays = holidaysData[selectedCountry] || [];

  useEffect(() => {
    let workDays;
    
    switch (selectedCountry) {
      case "BD Bangladesh en.bd#holiday@group.v.calendar.google.com":
      case "SA Saudi Arabia en.sa#holiday@group.v.calendar.google.com":
      case "AE United Arab Emirates en.ae#holiday@group.v.calendar.google.com":
      case "IL Israel en.il#holiday@group.v.calendar.google.com":
      case "MV Maldives en.mv#holiday@group.v.calendar.google.com":
      case "KW Kuwait en.kw#holiday@group.v.calendar.google.com":
      case "OM Oman en.om#holiday@group.v.calendar.google.com":
      case "QA Qatar en.qa#holiday@group.v.calendar.google.com":
        workDays = [0, 1, 2, 3, 4]; // Sunday to Thursday
        break;
      case "BN Brunei en.bn#holiday@group.v.calendar.google.com":
        workDays = [1, 2, 3, 4, 6]; // Monday to Thursday & Saturday
        break;
      default:
        workDays = [1, 2, 3, 4, 5]; // Monday to Friday
    }

    let workingDate = new Date(currentDate);
    let daysToAdd = workingDaysToAdd;
    let newSkippedDates = [];

    for (let i = 0; i < daysToAdd; i++) {
      workingDate.setDate(workingDate.getDate() + 1);
      while (
        isWeekend(workingDate, workDays) ||
        isHoliday(workingDate, countryHolidays)
      ) {
        const reason = isWeekend(workingDate, workDays)
          ? "Weekend"
          : `Holiday: ${getHolidayName(workingDate, countryHolidays)}`;
        newSkippedDates.push(`${workingDate.toDateString()} - ${reason}`);
        workingDate.setDate(workingDate.getDate() + 1);
      }
    }

    setCalculatedDate(workingDate);
    setSkippedDates(newSkippedDates);
  }, [selectedCountry, countryHolidays, currentDate, workingDaysToAdd]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleDateChange = (event) => {
    setCurrentDate(event.target.value);
  };

  const handleDaysChange = (event) => {
    setWorkingDaysToAdd(parseInt(event.target.value, 10));
  };

  const isWeekend = (date, workDays) => {
    const day = date.getDay();
    return !workDays.includes(day);
  };

  const isHoliday = (date, holidays) => {
    const dateString = date.toISOString().split("T")[0];
    return holidays.some((holiday) => holiday.date === dateString);
  };

  const getHolidayName = (date, holidays) => {
    const dateString = date.toISOString().split("T")[0];
    const holiday = holidays.find((holiday) => holiday.date === dateString);
    return holiday ? holiday.name : "Unknown";
  };

  return (
    <div>
      <label>
        Country:
        <select value={selectedCountry} onChange={handleCountryChange}>
          {Object.keys(holidaysData).map((countryCode) => (
            <option key={countryCode} value={countryCode}>
              {countryCode}
            </option>
          ))}
        </select>
      </label>

      <label>
        Start Date:
        <input type="date" value={currentDate} onChange={handleDateChange} />
      </label>

      <label>
        Working Days to Add:
        <input
          type="number"
          min="0"
          value={workingDaysToAdd}
          onChange={handleDaysChange}
        />
      </label>

      <p>
        Date after {workingDaysToAdd} working days is:{" "}
        {calculatedDate ? calculatedDate.toDateString() : "Calculating..."}
      </p>

     <p>Dates skipped:</p>

      <ul>
        {skippedDates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkingDaysCalculator;
