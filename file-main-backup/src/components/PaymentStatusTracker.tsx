// Shared state for payment tracking across components
export const PAYMENT_STATUS: {
  [meetupCode: string]: {
    [memberId: string]: {
      memberId: string;
      memberName: string;
      amount: number;
      status: 'pending' | 'paid';
      paidAt: Date | null;
    };
  };
} = {};
