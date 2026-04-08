import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface MeetupDateTimePickerProps {
  onDateTimeSelect: (date: string, time: string) => void;
  selectedDate: string;
  selectedTime: string;
  className?: string;
  openingTime?: number; // hour (0-23)
  closingTime?: number; // hour (0-23)
}

export default function MeetupDateTimePicker({
  onDateTimeSelect,
  selectedDate,
  selectedTime,
  className = '',
  openingTime = 8, // 8:00 AM
  closingTime = 22, // 10:00 PM
}: MeetupDateTimePickerProps) {
  const [availableDates, setAvailableDates] = useState([] as { date: Date; fullDateStr: string; dayName: string; dayNum: string; monthName: string }[]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([] as { formatted: string; value: string; isPast: boolean }[]);
  const timeSectionRef = useRef<HTMLDivElement>(null);

  // Initialize available dates (Next 3 days)
  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      dates.push({
        date: d,
        fullDateStr: `${year}-${month}-${day}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: String(d.getDate()),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    setAvailableDates(dates);
  }, []);

  // Generate time slots based on selected date
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }

    const slots = [];
    const now = new Date();
    const isToday = selectedDate === availableDates[0]?.fullDateStr;

    for (let hour = openingTime; hour <= closingTime; hour++) {
      for (const minute of [0, 30]) {
        // Stop at exact closing time
        if (hour === closingTime && minute > 0) continue;

        const slotTime = new Date();
        slotTime.setHours(hour, minute, 0, 0);

        let isPast = false;
        if (isToday) {
          // If we are past this time today, remove it completely from visibility
          if (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)) {
            isPast = true;
          }
        }

        if (!isPast) {
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const displayMinute = minute === 0 ? '00' : '30';

          const valueHour = String(hour).padStart(2, '0');
          const valueMinute = String(minute).padStart(2, '0');

          slots.push({
            formatted: `${displayHour}:${displayMinute} ${ampm}`,
            value: `${valueHour}:${valueMinute}`,
            isPast: false
          });
        }
      }
    }
    setAvailableTimeSlots(slots);

    // If selected time is no longer in valid slots (e.g. past), clear it
    if (selectedTime && !slots.find(s => s.value === selectedTime)) {
      onDateTimeSelect(selectedDate, '');
    }
  }, [selectedDate, openingTime, closingTime, availableDates]);

  // Auto-scroll to time section when date is selected
  const handleDateSelect = (dateStr: string) => {
    onDateTimeSelect(dateStr, selectedTime);
    setTimeout(() => {
      timeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleTimeSelect = (timeStr: string) => {
    onDateTimeSelect(selectedDate, timeStr);
  };

  const getDayLabel = (index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return availableDates[index]?.dayName || '';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-['Arial:Bold',sans-serif] text-[16px] text-slate-800">
            <Calendar className="w-5 h-5 text-[#8b5943]" />
            Select Date
          </label>
          <span className="text-[12px] bg-[#be9d80]/10 text-[#8b5943] px-2 py-1 rounded-md font-medium">
            3 days advance booking
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {availableDates.map((d, idx) => {
            const isSelected = selectedDate === d.fullDateStr;
            return (
              <button
                key={d.fullDateStr}
                onClick={() => handleDateSelect(d.fullDateStr)}
                className={`flex-shrink-0 snap-start relative overflow-hidden transition-all duration-300 w-[100px] h-[115px] rounded-[18px] flex flex-col items-center justify-center border-2 ${isSelected
                  ? 'border-[#8b5943] bg-gradient-to-br from-[#8b5943] to-[#be9d80] text-white shadow-[0_8px_16px_rgba(139,89,67,0.3)] transform scale-105'
                  : 'border-[#e2e8f0] bg-white text-slate-700 hover:border-[#be9d80]/50 hover:bg-[#fdfbf9] hover:shadow-sm'
                  }`}
              >
                <span className={`text-[12px] uppercase tracking-widest font-bold mb-1 ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                  {getDayLabel(idx)}
                </span>
                <span className={`text-[36px] font-bold leading-none mb-0.5 ${isSelected ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  {d.dayNum}
                </span>
                <span className={`text-[13px] font-semibold tracking-wide uppercase ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                  {d.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div className="space-y-3" ref={timeSectionRef}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-[#8b5943]" />
          <label className="font-['Arial:Bold',sans-serif] text-[16px] text-slate-800">
            Select Time
          </label>
        </div>

        {!selectedDate ? (
          <div className="bg-white border border-slate-200/60 rounded-[16px] py-10 px-6 text-center flex flex-col items-center justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-1">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[15px] font-medium text-slate-500">Select a date to view available time slots</p>
          </div>
        ) : availableTimeSlots.length === 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded-[16px] p-8 text-center text-orange-700 shadow-sm">
            <p className="font-bold mb-2">Oops! No slots available for today.</p>
            <p className="text-[14px] opacity-80">Cafe bookings close at {closingTime > 12 ? closingTime - 12 : closingTime} {closingTime >= 12 ? 'PM' : 'AM'}. Please select tomorrow.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {availableTimeSlots.map((slot) => {
              const isSelected = selectedTime === slot.value;
              return (
                <button
                  key={slot.value}
                  onClick={() => handleTimeSelect(slot.value)}
                  className={`py-3.5 px-4 rounded-full text-[14px] font-bold transition-all duration-200 border ${isSelected
                    ? 'border-[#8b5943] bg-gradient-to-r from-[#8b5943] to-[#be9d80] text-white shadow-[0_4px_12px_rgba(139,89,67,0.3)] transform scale-105'
                    : 'border-[#e2e8f0] bg-white text-slate-700 hover:border-[#be9d80] hover:shadow-md hover:scale-[1.02]'
                    }`}
                >
                  {slot.formatted}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      <div className="h-10 mt-2 flex items-center justify-center">
        {selectedDate && selectedTime ? (
          <p className="text-[15px] font-['Arial',sans-serif] text-slate-700 font-medium bg-[#be9d80]/10 px-6 py-2 rounded-full border border-[#be9d80]/20 animate-fade-in-up">
            Selected: <span className="font-bold text-[#8b5943]">{availableDates.find(d => d.fullDateStr === selectedDate)?.dayNum} {availableDates.find(d => d.fullDateStr === selectedDate)?.monthName}</span> • <span className="font-bold text-[#8b5943]">{availableTimeSlots.find(s => s.value === selectedTime)?.formatted}</span>
          </p>
        ) : (
          <p className="text-[14px] text-slate-400 font-medium">Select a date and time</p>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
