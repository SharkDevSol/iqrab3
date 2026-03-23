// Ethiopian Calendar Utilities for Backend

const ethiopianMonths = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

// Convert Gregorian date to Ethiopian date
function convertToEthiopian(gregorianDate) {
  const date = new Date(gregorianDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Ethiopian New Year = Sept 11 (Sept 12 in Gregorian leap year)
  const isGregorianLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  let ethYear, ethMonth, ethDay;

  if (month > 9 || (month === 9 && day >= (isGregorianLeapYear(year) ? 12 : 11))) {
    // On or after Ethiopian New Year in this Gregorian year
    ethYear = year - 7;
    const newYearDay = isGregorianLeapYear(year) ? 12 : 11;
    // Days since Ethiopian New Year
    const newYear = new Date(year, 8, newYearDay); // Sept
    const current = new Date(year, month - 1, day);
    const diff = Math.round((current - newYear) / 86400000);
    ethMonth = Math.floor(diff / 30) + 1;
    ethDay = (diff % 30) + 1;
  } else {
    // Before Ethiopian New Year — previous Ethiopian year
    ethYear = year - 8;
    const prevNewYearDay = isGregorianLeapYear(year - 1) ? 12 : 11;
    const newYear = new Date(year - 1, 8, prevNewYearDay); // Sept of previous year
    const current = new Date(year, month - 1, day);
    const diff = Math.round((current - newYear) / 86400000);
    ethMonth = Math.floor(diff / 30) + 1;
    ethDay = (diff % 30) + 1;
  }

  return { year: ethYear, month: ethMonth, day: ethDay };
}

// Get Ethiopian month name
function getEthiopianMonthName(monthNumber) {
  return ethiopianMonths[monthNumber - 1] || 'Unknown';
}

// Get current Ethiopian date
function getCurrentEthiopianDate() {
  return convertToEthiopian(new Date());
}

// Convert Ethiopian date to Gregorian and get day of week
function getEthiopianDayOfWeek(ethYear, ethMonth, ethDay) {
  // Accurate Ethiopian to Gregorian conversion
  // Ethiopian New Year (Meskerem 1) = September 11 (or Sept 12 in leap years before Gregorian leap year)
  
  // Calculate the Gregorian year
  let gregYear = ethYear + 7;
  
  // Check if it's a leap year in Gregorian calendar
  const isGregorianLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };
  
  // Ethiopian New Year offset (Sept 11 or Sept 12)
  const ethNewYearDay = isGregorianLeapYear(gregYear) ? 12 : 11;
  
  // Calculate total days from Ethiopian New Year
  let totalDays = 0;
  
  // Add days from complete months
  for (let m = 1; m < ethMonth; m++) {
    if (m <= 12) {
      totalDays += 30; // First 12 months have 30 days each
    } else {
      // Pagume (13th month) has 5 or 6 days
      totalDays += isGregorianLeapYear(gregYear + 1) ? 6 : 5;
    }
  }
  
  // Add days in current month
  totalDays += ethDay - 1; // -1 because Meskerem 1 = day 0
  
  // Create date starting from Ethiopian New Year
  const ethNewYear = new Date(gregYear, 8, ethNewYearDay); // Month 8 = September
  
  // Add the total days
  const gregorianDate = new Date(ethNewYear);
  gregorianDate.setDate(ethNewYear.getDate() + totalDays);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return days[gregorianDate.getDay()];
}

module.exports = {
  convertToEthiopian,
  getEthiopianMonthName,
  getCurrentEthiopianDate,
  getEthiopianDayOfWeek,
  ethiopianMonths
};
