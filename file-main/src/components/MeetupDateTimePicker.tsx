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
          const timeStartStr = minute === 0 ? `${displayHour}${ampm}` : `${displayHour}:${minute}${ampm}`;

          let nextHour = hour;
          let nextMinute = minute + 30;
          if (nextMinute === 60) {
            nextHour++;
            nextMinute = 0;
          }
          const nextAmpm = nextHour >= 12 ? 'PM' : 'AM';
          const nextDisplayHour = nextHour % 12 || 12;
          const timeEndStr = nextMinute === 0 ? `${nextDisplayHour}${nextAmpm}` : `${nextDisplayHour}:${nextMinute}${nextAmpm}`;

          const valueHour = String(hour).padStart(2, '0');
          const valueMinute = String(minute).padStart(2, '0');

          slots.push({
            formatted: `${timeStartStr} - ${timeEndStr}`,
            value: `${valueHour}:${valueMinute}`,
            isPast: false
          });
        }
      }
    }
    setAvailableTimeSlots(slots);

    // If selected time is no longer in valid slots (e.g. past), clear it
    if (selectedTime && !slots.find((s: any) => s.value === selectedTime)) {
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Pick a date
          </label>
          <span className="text-[10px] font-bold tracking-wider text-[#e87c3e] uppercase cursor-pointer hover:underline">
            Show all
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {availableDates.map((d, idx) => {
            const isSelected = selectedDate === d.fullDateStr;
            return (
              <button
                key={d.fullDateStr}
                onClick={() => handleDateSelect(d.fullDateStr)}
                className={`flex-shrink-0 snap-start bg-white flex flex-col items-center justify-center transition-all w-[100px] h-[90px] ${isSelected
                  ? 'border-2 border-[#e87c3e]'
                  : 'border border-slate-200 hover:border-slate-300'
                  }`}
              >
                <span className={`text-[10px] uppercase font-bold tracking-wide mb-1 ${isSelected ? 'text-slate-600' : 'text-slate-400'}`}>
                  {getDayLabel(idx)}
                </span>
                <span className="text-[32px] font-light text-slate-800 leading-none">
                  {d.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div className="space-y-4" ref={timeSectionRef}>
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mt-2">
            Pick a time
          </label>
        </div>

        {!selectedDate ? (
          <div className="bg-white border border-slate-200 p-6 text-center text-slate-500 flex flex-col items-center justify-center">
            <p className="text-[14px]">Please select a date first</p>
          </div>
        ) : availableTimeSlots.length === 0 ? (
          <div className="bg-white border border-slate-200 p-6 text-center text-slate-500">
            <p className="font-medium text-[14px]">No slots available for today.</p>
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x">
            {availableTimeSlots.map((slot: any) => {
              const isSelected = selectedTime === slot.value;
              return (
                <button
                  key={slot.value}
                  onClick={() => handleTimeSelect(slot.value)}
                  className={`flex-shrink-0 snap-start bg-white flex items-center justify-center transition-all min-w-[110px] h-[90px] ${isSelected
                    ? 'border-2 border-[#e87c3e] text-slate-800'
                    : 'border border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                >
                  <span className="text-[13px] font-medium whitespace-nowrap px-2">
                    {slot.formatted}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedDate && selectedTime && (
        <div className="mt-6 bg-[#be9d80]/10 border border-[#be9d80]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#8b5943]" />
            </div>
            <div>
              <p className="text-[12px] text-slate-500 font-medium uppercase tracking-wider">Meetup Scheduled For</p>
              <p className="text-[15px] font-bold text-slate-800">
                {availableDates.find(d => d.fullDateStr === selectedDate)?.dayNum} {availableDates.find(d => d.fullDateStr === selectedDate)?.monthName} at {availableTimeSlots.find(s => s.value === selectedTime)?.formatted}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#8b5943] flex items-center justify-center shadow-md">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

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
