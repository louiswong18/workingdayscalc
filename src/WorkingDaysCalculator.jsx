import React, { useState, useEffect } from "react";
import holidaysData from "./holidays.json"; // Adjust the path as needed

const WorkingDaysCalculator = () => {
  const [countries, setCountries] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [skippedDates, setSkippedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState("2023-12-24");
  const [workingDaysToAdd, setWorkingDaysToAdd] = useState(10);

  useEffect(() => {
    setCountries(holidaysData);
    if (!selectedCountry && Object.keys(holidaysData).length > 0) {
      setSelectedCountry(Object.keys(holidaysData)[0]);
    }
  }, [selectedCountry, holidaysData]);

  const countryHolidays = countries[selectedCountry] || [];

  useEffect(() => {
    let startOfWorkWeek;
    let endOfWorkWeek;

    switch (selectedCountry) {
      case "US USA en.usa#holiday@group.v.calendar.google.com":
        startOfWorkWeek = 1; // work week in USA starts on Monday
        break;
      case "BD Bangladesh en.bd#holiday@group.v.calendar.google.com": // for Bangladesh
        startOfWorkWeek = 0; // work week in Bangladesh starts on Sunday
        break;
      case "AE United Arab Emirates en.ae#holiday@group.v.calendar.google.com": // for UAE
        startOfWorkWeek = 0; // work week in UAE starts on Sunday
        break;
      case "SA Saudi Arabia en.saudiarabian#holiday@group.v.calendar.google.com": // for Saudi Arabia
        startOfWorkWeek = 0; // work week in Saudi Arabia starts on Sunday
        break;
      case "IL Israel en.jewish#holiday@group.v.calendar.google.com": // for Israel
        startOfWorkWeek = 0; // work week in Israel starts on Sunday
        break;
      case "MV Maldives en.mv#holiday@group.v.calendar.google.com": // for Maldives
        startOfWorkWeek = 0; // work week in Maldives starts on Sunday
        break;
      case "KW Kuwait en.kw#holiday@group.v.calendar.google.com": // for Kuwait
        startOfWorkWeek = 0; // work week in  starts on Sunday
        break;
      case "QM Oman en.om#holiday@group.v.calendar.google.com": // for Oman
        startOfWorkWeek = 0; // work week in  starts on Sunday
        break;
      case "QA Qatar en.qa#holiday@group.v.calendar.google.com": // for Qatar
        startOfWorkWeek = 0; // work week in  starts on Sunday
        break;
      case "BN Brunei en.bn#holiday@group.v.calendar.google.com": // for Brunei
        startOfWorkWeek = 1; // work week in Brunei starts on Monday, but includes a break on Friday
        endOfWorkWeek = 4; // Thursday
        break;
      default:
        startOfWorkWeek = 1; // Default to Monday if countryCode is unrecognized
    }

    let workingDate = new Date(currentDate);
    let daysToAdd = workingDaysToAdd;
    let newSkippedDates = [];

    for (let i = 0; i < daysToAdd; i++) {
      workingDate.setDate(workingDate.getDate() + 1);
      while (
        isWeekend(workingDate, startOfWorkWeek, endOfWorkWeek) ||
        isHoliday(workingDate, countryHolidays)
      ) {
        const reason = isWeekend(workingDate, startOfWorkWeek, endOfWorkWeek)
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

  const isWeekend = (date, startOfWorkWeek, endOfWorkWeek) => {
    const day = date.getDay();
    if (endOfWorkWeek === undefined) {
      endOfWorkWeek = (startOfWorkWeek + 4) % 7;
    }
    return day < startOfWorkWeek || day > endOfWorkWeek;
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
          {Object.keys(countries).map((countryCode) => (
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
