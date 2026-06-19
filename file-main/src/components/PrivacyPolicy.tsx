import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center">
      <header className="w-full max-w-4xl p-6 flex items-center justify-between sticky top-0 bg-[#FFFDF8]/90 backdrop-blur-sm z-10 border-b border-[#E8DCC4]">
        <Button variant="ghost" onClick={onBack} className="p-2 -ml-2 hover:bg-[#F3E5D8] rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#3E2723]" />
        </Button>
        <h1 className="text-xl font-bold text-[#3E2723]">Privacy Policy</h1>
        <div className="w-10"></div>
      </header>

      <main className="w-full max-w-4xl px-6 py-8 flex-1">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E8DCC4]">
          <h2 className="text-3xl font-bold text-[#3E2723] mb-4">Privacy Policy</h2>
          <p className="text-sm text-[#8D6E63] mb-8 font-medium">Last Updated: June 19, 2026</p>
          
          <div className="space-y-8 text-[#5C4033]">
            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">1. Introduction</h3>
              <p className="leading-relaxed">
                Welcome to Caffelino. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">2. Information We Collect</h3>
              <p className="leading-relaxed mb-2">We may collect information about you in a variety of ways, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, profile photo, gender, and date of birth that you voluntarily give to us.</li>
                <li><strong>Contact Data:</strong> Phone number and email address used for authentication and communications.</li>
                <li><strong>Preference Data:</strong> Your cafe vibes, cuisine preferences, favorite beverages, and personal interests.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">3. How We Use Information</h3>
              <p className="leading-relaxed mb-2">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your account.</li>
                <li>Match you with relevant meetups and groups based on your preferences.</li>
                <li>Process your cafe reservations and bookings.</li>
                <li>Improve our matching algorithm and application functionality.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">4. Account & Phone Authentication</h3>
              <p className="leading-relaxed">
                Caffelino relies heavily on phone number verification (via OTP) and Google Authentication to ensure the safety and authenticity of our community. We securely store your authentication tokens and do not expose your raw passwords or secure credentials.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">5. Meetup Data</h3>
              <p className="leading-relaxed">
                To facilitate community connections, certain information such as your first name, profile picture, and interests will be visible to other members of groups you join or meetups you attend. Your exact location is only used to show nearby cafes and is not permanently tracked.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">6. Payments & Billing</h3>
              <p className="leading-relaxed">
                When you make a reservation fee payment or split a bill, we collect data necessary to process your payment. However, all payment processing is handled by secure third-party payment processors (such as Razorpay). We do not store your full credit card numbers or bank account details on our servers.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">7. Data Security</h3>
              <p className="leading-relaxed">
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">8. User Rights</h3>
              <p className="leading-relaxed">
                You have the right to request access to the personal data we hold about you, to request that we correct any inaccuracies, and to request the deletion of your account and associated data. You can delete your account directly through the app settings or by contacting our support team.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">9. Contact Information</h3>
              <p className="leading-relaxed">
                If you have questions or comments about this Privacy Policy, please contact us at: <br/><br/>
                <a href="mailto:caffelino.9@gmail.com" className="text-[#C68E58] hover:underline font-semibold text-lg">caffelino.9@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 mt-auto text-center border-t border-[#E8DCC4] bg-white">
        <p className="text-sm text-[#8D6E63]">&copy; {new Date().getFullYear()} Caffelino. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
