import { useState } from 'react';

const RangeDatePicker = ({ onDateRangeSelect }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      // Если нет начальной даты или уже выбран диапазон - начинаем новый выбор
      setStartDate(date);
      setEndDate(null);
    } else {
      // Если начальная дата есть, устанавливаем конечную
      if (date > startDate) {
        setEndDate(date);
        onDateRangeSelect({
          startDate: startDate.toISOString().split('T')[0],
          endDate: date.toISOString().split('T')[0]
        });
      } else {
        // Если кликнули дату раньше начальной - делаем её новой начальной
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  const isInRange = (date) => {
    if (!startDate) return false;
    if (startDate && !endDate && hoverDate) {
      return date > startDate && date <= hoverDate;
    }
    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }
    return false;
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderCalendarHeader = () => {
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    
    return (
      <div className="calendar-header">
        <button className="nav-button" onClick={() => changeMonth(-1)}>&lt;</button>
        <div className="month-year">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button className="nav-button" onClick={() => changeMonth(1)}>&gt;</button>
      </div>
    );
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days = [];
    
    // Пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`prev-${i}`} className="calendar-day empty-day"></div>);
    }
    
    // Дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      
      const today = new Date();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const dayClass = [
        'calendar-day',
        isPast ? 'past-day' : '', // Только визуальное выделение
        date.toDateString() === startDate?.toDateString() ? 'start-date' : '',
        date.toDateString() === endDate?.toDateString() ? 'end-date' : '',
        isInRange(date) ? 'in-range' : ''
        ].join(' ');

      days.push(
        <div 
          key={`day-${i}`}
          className={dayClass}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoverDate(date)}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="range-date-picker">
      {renderCalendarHeader()}
      <hr />
      <div className="weekdays">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <hr />
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default RangeDatePicker;