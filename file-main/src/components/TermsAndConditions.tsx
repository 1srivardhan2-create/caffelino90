import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface TermsAndConditionsProps {
  onBack: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center">
      <header className="w-full max-w-4xl p-6 flex items-center justify-between sticky top-0 bg-[#FFFDF8]/90 backdrop-blur-sm z-10 border-b border-[#E8DCC4]">
        <Button variant="ghost" onClick={onBack} className="p-2 -ml-2 hover:bg-[#F3E5D8] rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#3E2723]" />
        </Button>
        <h1 className="text-xl font-bold text-[#3E2723]">Terms & Conditions</h1>
        <div className="w-10"></div>
      </header>

      <main className="w-full max-w-4xl px-6 py-8 flex-1">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E8DCC4]">
          <h2 className="text-3xl font-bold text-[#3E2723] mb-4">Terms & Conditions</h2>
          <p className="text-sm text-[#8D6E63] mb-8 font-medium">Last Updated: June 19, 2026</p>
          
          <div className="space-y-8 text-[#5C4033]">
            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">1. Acceptance of Terms</h3>
              <p className="leading-relaxed">
                By accessing or using the Caffelino platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access our service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">2. User Eligibility</h3>
              <p className="leading-relaxed">
                You must be at least 18 years old to use the Caffelino application. By creating an account, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">3. Account Responsibilities</h3>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account. You must provide accurate and complete information during registration.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">4. Meetup Rules</h3>
              <p className="leading-relaxed mb-2">When attending a Caffelino meetup, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Arrive on time for your scheduled reservations.</li>
                <li>Respect other members and maintain a safe, welcoming environment.</li>
                <li>Pay for your portion of the cafe bill via our split-billing feature or directly at the venue.</li>
                <li>Not engage in harassment, hate speech, or inappropriate behavior.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">5. Cafe Partner Rules</h3>
              <p className="leading-relaxed">
                Cafe partners ("Admins") are responsible for managing their venue profiles, accurately listing available slots, and fulfilling accepted meetup bookings. Caffelino acts solely as a platform connecting users and cafes, and is not responsible for any disputes between users or cafes regarding service quality.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">6. Payments & Refunds</h3>
              <p className="leading-relaxed">
                Certain meetups may require a reservation fee or ticket purchase. All payments are subject to cafe availability. Refunds are strictly governed by the cancellation policy of the specific meetup and cafe. Caffelino is not liable for transactions made outside of our official billing system.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">7. User Conduct</h3>
              <p className="leading-relaxed">
                Misuse of the platform, harassment of other members, creation of fake profiles, or any illegal activity will not be tolerated. We reserve the right to report illegal activities to the appropriate law enforcement authorities.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">8. Suspension & Termination</h3>
              <p className="leading-relaxed">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">9. Limitation of Liability</h3>
              <p className="leading-relaxed">
                In no event shall Caffelino, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">10. Contact Information</h3>
              <p className="leading-relaxed">
                If you have any questions about these Terms, please contact us at: <br/><br/>
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

export default TermsAndConditions;
