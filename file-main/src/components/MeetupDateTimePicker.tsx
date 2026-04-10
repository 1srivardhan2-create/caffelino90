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
                className={`anim-btn date-btn flex-shrink-0 snap-start flex flex-col items-center justify-center transition-all bg-white w-[88px] h-[88px] rounded-2xl ${isSelected
                    ? 'active border-[1px] border-transparent shadow-md'
                    : 'border border-slate-200 hover:border-slate-300'
                  }`}
              >
                <span className={`z-10 text-[10px] uppercase font-bold tracking-wide mb-1 pointer-events-none transition-colors ${isSelected ? 'text-white' : 'text-slate-400'
                  }`}>
                  {getDayLabel(idx)}
                </span>
                <span className={`z-10 text-[32px] font-semibold leading-none pointer-events-none transition-colors ${isSelected ? 'text-white' : 'text-slate-800'
                  }`}>
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
            {availableTimeSlots.map((slot: any, idx: number) => {
              const isSelected = selectedTime === slot.value;
              return (
                <button
                  key={slot.value}
                  onClick={() => handleTimeSelect(slot.value)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={`anim-btn time-btn time-btn-animated flex-shrink-0 snap-start flex items-center justify-center transition-all bg-white min-w-[124px] h-[52px] rounded-full px-4 ${isSelected
                      ? 'active border-[1px] border-transparent shadow-md'
                      : 'border border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <span className={`z-10 text-[14px] font-semibold whitespace-nowrap pointer-events-none transition-colors ${isSelected ? 'text-white' : 'text-slate-600'
                    }`}>
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

        /* ─── ANIMATION BUTTON BASE ─── */
        .anim-btn {
          position: relative;
          isolation: isolate; /* KEY: Creates stacking context */
          overflow: hidden;
        }
        .anim-btn::before,
        .anim-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          transition: clip-path 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s;
          opacity: 0;
        }
        /* Using the exact purple-to-red gradient the user provided previously */
        .anim-btn::after {
          background: linear-gradient(135deg, #a855f7, #ef4444); 
          clip-path: inset(0 50% 0 50%); /* center-out-x hidden */
        }
        .anim-btn.active::after {
          clip-path: inset(0 0 0 0); /* center-out-x revealed */
          opacity: 1;
        }
        
        .date-btn::before, .date-btn::after { border-radius: 16px; }
        .time-btn::before, .time-btn::after { border-radius: 9999px; }

        .date-btn:hover { transform: scale(1.03); }
        .time-btn:hover { transform: scale(1.05); }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .time-btn-animated {
          opacity: 0;
          animation: fadeSlideUp 0.35s ease forwards;
        }
      `}</style>
    </div>
  );
}
