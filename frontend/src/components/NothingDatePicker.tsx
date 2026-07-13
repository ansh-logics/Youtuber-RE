import { useState, useRef, useEffect } from "react";
import { ArrowLeftDoticon, ArrowRightDoticon, GcalendarDoticon } from "doticons/16";

interface NothingDatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
}

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function NothingDatePicker({ value, onChange, placeholder = "Select Date" }: NothingDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date value or default to current date
  const initialDate = value ? new Date(value) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-11
  
  // Year selector page base year
  const [yearRangeStart, setYearRangeStart] = useState(initialDate.getFullYear() - 7);

  // Handle clicking outside to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode("days"); // Reset mode on close
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update calendar view when value changes from parent
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setCurrentYear(date.getFullYear());
        setCurrentMonth(date.getMonth());
      }
    }
  }, [value]);

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const startDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 (Sunday) to 6 (Saturday)
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    // Format: YYYY-MM-DD local format
    const selectedDate = new Date(currentYear, currentMonth, day);
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
    setViewMode("days");
  };

  const handleToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setCurrentYear(yyyy);
    setCurrentMonth(today.getMonth());
    setViewMode("days");
    setIsOpen(false);
  };

  // Generate calendar days grid
  const days = [];
  const totalDays = daysInMonth(currentYear, currentMonth);
  const startDay = startDayOfMonth(currentYear, currentMonth);
  
  // Previous month days padding
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthTotalDays = daysInMonth(prevYear, prevMonth);
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthTotalDays - i, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  // Next month days padding to make it a full grid row (multiple of 7)
  const remaining = 42 - days.length; // Standard 6-row calendar
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  // Check if a day is selected
  const isSelected = (day: number) => {
    if (!value) return false;
    const date = new Date(value);
    return (
      date.getDate() === day &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="relative w-full text-left" ref={containerRef}>
      {/* Selector Input Field */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-[16px] border border-black/5 bg-black/[0.02] p-3 text-black text-sm outline-none focus-within:border-black/20 focus-within:bg-black/[0.04] transition-all font-grotesk cursor-pointer select-none"
      >
        <span className={value ? "text-black" : "text-black/30"}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <GcalendarDoticon className="w-4 h-4 text-black/40 hover:text-black transition-colors" />
      </div>

      {/* Glassmorphic Dropdown Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-xl border border-black/5 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-4 w-full max-w-[320px] mx-auto select-none">
          
          {/* Header Area */}
          {viewMode === "days" ? (
            <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-2">
              <button 
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-black/5 active:scale-95 transition-all rounded-full cursor-pointer"
              >
                <ArrowLeftDoticon className="w-4 h-4 text-black" />
              </button>
              <div className="flex items-center gap-1.5 flex-1 justify-center font-ndot57 text-sm tracking-[0.1em] uppercase">
                <button
                  type="button"
                  onClick={() => setViewMode("months")}
                  className="text-black hover:text-black/55 transition-colors cursor-pointer"
                >
                  {MONTH_NAMES[currentMonth]}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setYearRangeStart(currentYear - 7);
                    setViewMode("years");
                  }}
                  className="text-black hover:text-black/55 transition-colors cursor-pointer"
                >
                  {currentYear}
                </button>
              </div>
              <button 
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-black/5 active:scale-95 transition-all rounded-full cursor-pointer"
              >
                <ArrowRightDoticon className="w-4 h-4 text-black" />
              </button>
            </div>
          ) : viewMode === "months" ? (
            <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-2">
              <button 
                type="button"
                onClick={() => setViewMode("days")}
                className="p-1 hover:bg-black/5 active:scale-95 transition-all rounded-full cursor-pointer"
              >
                <ArrowLeftDoticon className="w-4 h-4 text-black" />
              </button>
              <span className="font-ndot57 text-sm text-black tracking-[0.1em] text-center flex-1 pr-6 uppercase">
                SELECT MONTH
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-2">
              <button 
                type="button"
                onClick={() => setYearRangeStart(prev => prev - 16)}
                className="p-1 hover:bg-black/5 active:scale-95 transition-all rounded-full cursor-pointer"
              >
                <ArrowLeftDoticon className="w-4 h-4 text-black" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("days")}
                className="font-ndot57 text-sm text-black tracking-[0.1em] text-center flex-1 hover:text-black/55 cursor-pointer uppercase"
              >
                {yearRangeStart} - {yearRangeStart + 15}
              </button>
              <button 
                type="button"
                onClick={() => setYearRangeStart(prev => prev + 16)}
                className="p-1 hover:bg-black/5 active:scale-95 transition-all rounded-full cursor-pointer"
              >
                <ArrowRightDoticon className="w-4 h-4 text-black" />
              </button>
            </div>
          )}

          {/* Render content based on active viewMode */}
          {viewMode === "days" ? (
            <>
              {/* Weekdays Grid */}
              <div className="grid grid-cols-7 text-center mb-2 font-lettera text-[10px] tracking-widest text-black/40 font-bold">
                {WEEKDAYS.map((day, idx) => (
                  <span key={idx}>{day}</span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 text-center gap-y-1 gap-x-1 font-lettera text-xs">
                {days.map((item, idx) => {
                  const currentDayIsSelected = item.isCurrentMonth && isSelected(item.day);
                  const currentDayIsToday = item.isCurrentMonth && isToday(item.day);

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!item.isCurrentMonth}
                      onClick={() => handleDaySelect(item.day)}
                      className={`
                        w-8 h-8 rounded-full flex flex-col items-center justify-center relative transition-all cursor-pointer select-none
                        ${!item.isCurrentMonth ? "text-black/10 cursor-default" : "text-black hover:bg-black/5"}
                        ${currentDayIsSelected ? "bg-black text-white font-bold hover:bg-black" : ""}
                      `}
                    >
                      <span>{item.day}</span>
                      {currentDayIsToday && !currentDayIsSelected && (
                        <span className="absolute bottom-1 w-1 h-1 bg-black rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : viewMode === "months" ? (
            /* Months 3x4 Grid View */
            <div className="grid grid-cols-3 gap-2.5 text-center py-1">
              {MONTH_NAMES.map((name, idx) => {
                const isCurrent = idx === currentMonth;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentMonth(idx);
                      setViewMode("days");
                    }}
                    className={`
                      py-3 rounded-[12px] font-lettera text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer hover:bg-black/5
                      ${isCurrent ? "bg-black text-white hover:bg-black" : "text-black/75"}
                    `}
                  >
                    {name.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Years 4x4 Grid View */
            <div className="grid grid-cols-4 gap-2 text-center py-1">
              {Array.from({ length: 16 }, (_, i) => yearRangeStart + i).map((year) => {
                const isCurrent = year === currentYear;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setCurrentYear(year);
                      setViewMode("days");
                    }}
                    className={`
                      py-2.5 rounded-[12px] font-lettera text-xs transition-all cursor-pointer hover:bg-black/5
                      ${isCurrent ? "bg-black text-white font-bold hover:bg-black" : "text-black/75"}
                    `}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-3 text-[10px] font-lettera tracking-widest font-bold">
            <button
              type="button"
              onClick={handleClear}
              className="text-black/40 hover:text-black transition-colors cursor-pointer"
            >
              CLEAR
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-black hover:underline transition-all cursor-pointer"
            >
              TODAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NothingDatePicker;
