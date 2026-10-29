import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMobile('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191919] border border-[#D4AF6A]/30 text-xs text-[#E8C786] font-semibold">
          <Phone className="w-3.5 h-3.5 text-[#D4AF6A]" />
          24/7 Concierge &amp; Dispatch
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5F0E8]">
          Contact <span className="gold-gradient-text">Shiva Car &amp; Bike Rental</span>
        </h1>
        <p className="text-sm text-[#A6A6A6]">
          Have questions regarding vehicle availability, long-term luxury rentals, or doorstep delivery? We are here to assist 24 hours a day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#191919] border border-[#35312A] space-y-5">
            <h3 className="font-serif text-xl font-bold text-[#F5F0E8]">
              Central Headquarters &amp; Hubs
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#D4AF6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8] block text-sm">Hyderabad Main Hub:</strong>
                  <span className="text-[#A6A6A6] leading-relaxed">
                    Plot No. 42, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#D4AF6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8] block text-sm">Vijayawada Regional Office:</strong>
                  <span className="text-[#A6A6A6] leading-relaxed">
                    MG Road, Governorpet, Vijayawada, Andhra Pradesh 520002
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#D4AF6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8] block text-sm">Phone Hotlines:</strong>
                  <span className="text-[#E8C786] block font-mono font-medium">+91 98490 12345 (VIP Fleet Bookings)</span>
                  <span className="text-[#E8C786] block font-mono font-medium">+91 98888 77777 (24x7 Roadside Assistance)</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#D4AF6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8] block text-sm">Email Inquiries:</strong>
                  <span className="text-[#A6A6A6]">bookings@royalride.in</span>
                  <br />
                  <span className="text-[#A6A6A6]">support@shivacarandbikerental.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#D4AF6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8] block text-sm">Operating Hours:</strong>
                  <span className="text-[#A6A6A6]">24 Hours / 7 Days a Week, 365 Days a Year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ note */}
          <div className="p-5 rounded-2xl bg-[#151515] border border-[#D4AF6A]/30 space-y-2 text-xs">
            <div className="font-bold text-[#E8C786] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF6A]" />
              Security Deposit Refund Policy
            </div>
            <p className="text-[#A6A6A6] leading-relaxed">
              All deposits are automatically credited back to your original source of payment within 24 hours of successful vehicle check-in.
            </p>
          </div>
        </div>

        {/* Inquiry Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#191919] border border-[#35312A] rounded-2xl p-6 sm:p-8 space-y-5">
          <h3 className="font-serif text-2xl font-bold text-[#F5F0E8]">
            Send an Inquiry or Custom Fleet Request
          </h3>
          <p className="text-xs text-[#A6A6A6]">
            Planning a multi-city tour, wedding convoy, or long-term executive lease? Leave your details below and our senior fleet manager will contact you within 30 minutes.
          </p>

          {submitted && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Thank you, {name}! Your message has been received by Shiva Car &amp; Bike Rental concierge. We will call you shortly.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A6A6A6] mb-1 font-medium">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shiva Rama Krishna"
                  className="w-full px-3 py-2.5 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A6A6A6] mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. shiva@example.com"
                  className="w-full px-3 py-2.5 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A6A6A6] mb-1 font-medium">Mobile Number (+91)</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 98490 12345"
                  className="w-full px-3 py-2.5 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A6A6A6] mb-1 font-medium">Preferred Hub City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Kurnool">Kurnool</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Tirupati">Tirupati</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#A6A6A6] mb-1 font-medium">Message &amp; Requirements</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the vehicle you wish to rent, dates, or specific requests..."
                className="w-full px-3 py-2.5 bg-[#101010] border border-[#35312A] rounded-xl text-xs text-[#F5F0E8] focus:border-[#D4AF6A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#E8C786] text-[#101010] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF6A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Concierge Request</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
