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
  
  // Ethiopian year is 7-8 years behind Gregorian
  let ethYear = year - 8;
  
  // Ethiopian New Year (Meskerem 1) = September 11 (Gregorian)
  let ethMonth, ethDay;
  
  if (month >= 9) {
    // September to December
    if (month === 9 && day < 11) {
      // Before Sept 11: previous Ethiopian year
      ethYear = year - 9;
      ethMonth = 13; // Pagume
      ethDay = day + 25;
    } else {
      ethMonth = month - 8; // Sept=1, Oct=2, Nov=3, Dec=4
      ethDay = day - 10;
      if (ethDay <= 0) {
        ethDay += 30;
        ethMonth -= 1;
      }
    }
  } else {
    // January to August
    ethMonth = month + 4; // Jan=5, Feb=6, Mar=7, Apr=8, May=9, Jun=10, Jul=11, Aug=12
    ethDay = day - 7; // Offset for Ethiopian calendar
    
    if (ethDay <= 0) {
      ethDay += 30;
      ethMonth -= 1;
    }
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
