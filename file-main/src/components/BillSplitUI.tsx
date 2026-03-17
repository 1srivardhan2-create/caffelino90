import { useState } from 'react';
import { DollarSign, Users, User } from 'lucide-react';
import { cn } from './ui/utils';

interface BillSplitUIProps {
  totalBill: number;
  numberOfPeople: number;
  onSplitMethodChange?: (method: 'split' | 'single') => void;
  onAmountCalculated?: (amount: number) => void;
}

export default function BillSplitUI({ 
  totalBill, 
  numberOfPeople,
  onSplitMethodChange,
  onAmountCalculated 
}: BillSplitUIProps) {
  const [splitMethod, setSplitMethod] = useState<'split' | 'single'>('split');

  // Calculate amount per person
  const amountPerPerson = splitMethod === 'split' 
    ? Math.round((totalBill / numberOfPeople) * 100) / 100 
    : totalBill;

  // Handle split method change
  const handleMethodChange = (method: 'split' | 'single') => {
    setSplitMethod(method);
    onSplitMethodChange?.(method);
    
    // Calculate and pass the amount
    const calculatedAmount = method === 'split' 
      ? Math.round((totalBill / numberOfPeople) * 100) / 100 
      : totalBill;
    onAmountCalculated?.(calculatedAmount);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8b5943] to-[#a67c5d] px-6 py-4">
        <h3 className="text-white text-[18px] font-['Arial:Regular',_sans-serif]">
          Bill Payment
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Total Bill Display */}
        <div className="bg-gradient-to-br from-[#8b5943]/5 to-[#d9bf9d]/10 rounded-[12px] p-4 border border-[#8b5943]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <DollarSign className="w-5 h-5 text-[#8b5943]" />
              </div>
              <span className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                Total Bill
              </span>
            </div>
            <span className="text-[24px] text-[#8b5943] font-['Arial:Regular',_sans-serif]">
              {formatCurrency(totalBill)}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="block text-[15px] text-neutral-700 font-['Arial:Regular',_sans-serif] mb-3">
            Choose Payment Method
          </label>

          {/* Split Between Everyone */}
          <button
            onClick={() => handleMethodChange('split')}
            className={cn(
              "w-full p-4 rounded-[12px] border-2 transition-all duration-200 text-left",
              splitMethod === 'split'
                ? "border-[#8b5943] bg-[#8b5943]/5 shadow-sm"
                : "border-neutral-200 bg-white hover:border-[#8b5943]/30 hover:bg-[#8b5943]/5"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all",
                splitMethod === 'split'
                  ? "border-[#8b5943] bg-[#8b5943]"
                  : "border-neutral-300 bg-white"
              )}>
                {splitMethod === 'split' && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#8b5943]" />
                  <span className="text-[15px] text-neutral-900 font-['Arial:Regular',_sans-serif]">
                    Split Between Everyone
                  </span>
                </div>
                <p className="text-[13px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                  Divide the bill equally among all {numberOfPeople} members
                </p>
              </div>
            </div>
          </button>

          {/* One Person Pays Everything */}
          <button
            onClick={() => handleMethodChange('single')}
            className={cn(
              "w-full p-4 rounded-[12px] border-2 transition-all duration-200 text-left",
              splitMethod === 'single'
                ? "border-[#8b5943] bg-[#8b5943]/5 shadow-sm"
                : "border-neutral-200 bg-white hover:border-[#8b5943]/30 hover:bg-[#8b5943]/5"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all",
                splitMethod === 'single'
                  ? "border-[#8b5943] bg-[#8b5943]"
                  : "border-neutral-300 bg-white"
              )}>
                {splitMethod === 'single' && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[#8b5943]" />
                  <span className="text-[15px] text-neutral-900 font-['Arial:Regular',_sans-serif]">
                    One Person Pays Everything (No Split)
                  </span>
                </div>
                <p className="text-[13px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                  One member pays the full bill amount
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-br from-[#030213] to-[#1a1a2e] rounded-[12px] p-5 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-white/60 font-['Arial:Regular',_sans-serif] mb-1">
                {splitMethod === 'split' ? 'Amount Per Person' : 'Total Amount'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] text-white font-['Arial:Regular',_sans-serif]">
                  {formatCurrency(amountPerPerson)}
                </span>
                {splitMethod === 'split' && (
                  <span className="text-[14px] text-white/60 font-['Arial:Regular',_sans-serif]">
                    / person
                  </span>
                )}
              </div>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
              {splitMethod === 'split' ? (
                <Users className="w-7 h-7 text-white" />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
            </div>
          </div>

          {/* Additional Info for Split */}
          {splitMethod === 'split' && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/60 font-['Arial:Regular',_sans-serif]">
                  Total Members
                </span>
                <span className="text-white font-['Arial:Regular',_sans-serif]">
                  {numberOfPeople} people
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] mt-2">
                <span className="text-white/60 font-['Arial:Regular',_sans-serif]">
                  Total Bill
                </span>
                <span className="text-white font-['Arial:Regular',_sans-serif]">
                  {formatCurrency(totalBill)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Info Message */}
        <div className="bg-[#d9bf9d]/20 rounded-[8px] p-3 border border-[#8b5943]/20">
          <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif] text-center">
            {splitMethod === 'split' 
              ? '💡 Each person will pay their calculated share'
              : '💡 One person will pay the complete bill amount'}
          </p>
        </div>
      </div>
    </div>
  );
}
