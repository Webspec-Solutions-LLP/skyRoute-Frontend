"use client";

import React, { useState } from "react";
import Link from "next/link";
import OtherSection from "@/components/otherSection/OtherSection";
import "./ContactUs.css";

export default function ContactUsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pnr, setPnr] = useState("");
  const [category, setCategory] = useState("Flight Booking");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMsg("Thank you! Your inquiry has been submitted. A SkyRoute travel specialist will reach out within 15 minutes.");
      setFullName("");
      setEmail("");
      setPhone("");
      setPnr("");
      setSubject("");
      setMessage("");
      setTimeout(() => setToastMsg(null), 5000);
    }, 800);
  };

  return (
    <div className="sky-contact-page">
      <div className="sky-contact-container">
        {/* ==========================================================================
            1. Hero Header Banner
            ========================================================================== */}
        <section className="contact-hero-card">
          <div className="contact-hero-content">
            <div className="contact-hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>24/7 Priority Support • We&apos;re Here For Your Journey</span>
            </div>

            <h1 className="contact-hero-title">
              Get in Touch with <span>SkyRoute</span>
            </h1>

            <p className="contact-hero-desc">
              Whether you need urgent help with flight rescheduling, baggage policies, airline cancellations, or corporate bookings, our dedicated passenger support specialists are on standby around the clock.
            </p>

            <div className="contact-hero-badges">
              <span className="contact-trust-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Toll-Free: 1800-SKY-ROUTE
              </span>
              <span className="contact-trust-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                support@skyroute.com
              </span>
              <span className="contact-trust-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Average Response: &lt; 15 mins
              </span>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. Quick Channels Grid
            ========================================================================== */}
        <section className="contact-channels-grid">
          {/* Card 1: 24/7 Phone */}
          <a href="tel:+919876543210" className="contact-channel-card">
            <div className="contact-channel-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="contact-channel-title">Priority Phone Desk</h3>
            <p className="contact-channel-meta">+91 98765 43210</p>
            <p className="contact-channel-desc">Direct hotline for live flight changes, airport check-in emergencies and cancellations.</p>
          </a>

          {/* Card 2: Email Desk */}
          <a href="mailto:support@skyroute.com" className="contact-channel-card">
            <div className="contact-channel-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="contact-channel-title">Email Customer Care</h3>
            <p className="contact-channel-meta">support@skyroute.com</p>
            <p className="contact-channel-desc">Send ticket itineraries, refund claims, GST invoicing and feedback requests.</p>
          </a>

          {/* Card 3: WhatsApp Support */}
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="contact-channel-card">
            <div className="contact-channel-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <h3 className="contact-channel-title">WhatsApp Assistant</h3>
            <p className="contact-channel-meta">+91 98765 43210</p>
            <p className="contact-channel-desc">Instant boarding pass delivery, flight delay alerts and live chat assistance.</p>
          </a>

          {/* Card 4: Corporate Office */}
          <div className="contact-channel-card">
            <div className="contact-channel-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="contact-channel-title">Corporate Headquarters</h3>
            <p className="contact-channel-meta">Salt Lake, Kolkata</p>
            <p className="contact-channel-desc">Sector V, Bidhannagar, Kolkata, West Bengal 700091, India.</p>
          </div>
        </section>

        {/* ==========================================================================
            3. Main 2-Column Section (Form + Sidebar Info)
            ========================================================================== */}
        <section className="contact-main-grid">
          {/* Left: Message Inquiry Form */}
          <div className="contact-form-card">
            <div className="contact-form-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and our flight resolution team will respond promptly.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="contact-fields-grid">
                {/* Full Name */}
                <div className="contact-field-group">
                  <label className="contact-label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="e.g. Joydeep Barik"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="contact-field-group">
                  <label className="contact-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    className="contact-input"
                    placeholder="e.g. joydeep@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="contact-field-group">
                  <label className="contact-label">
                    Mobile Number <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    className="contact-input"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                {/* Booking PNR */}
                <div className="contact-field-group">
                  <label className="contact-label">Booking Reference / PNR (Optional)</label>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="e.g. SK9821 or 6-digit PNR"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.toUpperCase())}
                  />
                </div>

                {/* Inquiry Category */}
                <div className="contact-field-group full-width">
                  <label className="contact-label">Inquiry Category</label>
                  <select
                    className="contact-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Flight Booking">Flight Booking &amp; Schedule Enquiry</option>
                    <option value="Cancellation & Refund">Cancellation, Rescheduling &amp; Refund</option>
                    <option value="Baggage & Web Check-in">Baggage Allowance &amp; Web Check-in</option>
                    <option value="SkyPass & Gift Cards">SkyPass Rewards &amp; Travel Gift Cards</option>
                    <option value="GST & Tax Invoice">GST Details &amp; Tax Invoices</option>
                    <option value="Partnership & Business">Airline Alliances &amp; Business Inquiries</option>
                  </select>
                </div>

                {/* Subject */}
                <div className="contact-field-group full-width">
                  <label className="contact-label">
                    Subject <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="Brief summary of your inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                {/* Message */}
                <div className="contact-field-group full-width">
                  <label className="contact-label">
                    Message <span className="req">*</span>
                  </label>
                  <textarea
                    className="contact-textarea"
                    placeholder="Please describe your query with relevant flight numbers or dates..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Quick Assistance Cards */}
          <div className="contact-sidebar-stream">
            {/* Urgent Support Box */}
            <div className="contact-info-card">
              <div className="contact-info-card-header">
                <div className="contact-info-icon-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="contact-info-card-title">Urgent Flight Assistance</h3>
              </div>
              <ul className="contact-help-list">
                <li className="contact-help-item">
                  <span className="contact-help-bullet" />
                  <span><strong>Flight departing within 4 hours?</strong> Call our 24/7 priority line directly at <strong>+91 98765 43210</strong> for immediate gate assistance.</span>
                </li>
                <li className="contact-help-item">
                  <span className="contact-help-bullet" />
                  <span><strong>Web Check-In:</strong> Available 48 hours to 60 minutes prior to domestic departures.</span>
                </li>
                <li className="contact-help-item">
                  <span className="contact-help-bullet" />
                  <span><strong>Instant Refunds:</strong> Eligible automated cancellations are processed back to your original payment source or SkyWallet within 2 hours.</span>
                </li>
              </ul>
            </div>

            {/* Operating Hours Box */}
            <div className="contact-info-card">
              <div className="contact-info-card-header">
                <div className="contact-info-icon-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="contact-info-card-title">Operating Hours</h3>
              </div>
              <div className="contact-hours-table">
                <div className="contact-hour-row">
                  <span className="contact-hour-lbl">24x7 Emergency Phone Desk</span>
                  <span className="contact-hour-val">Round The Clock (24/7)</span>
                </div>
                <div className="contact-hour-row">
                  <span className="contact-hour-lbl">Ticketing &amp; Refund Escalations</span>
                  <span className="contact-hour-val">24/7 Live Support</span>
                </div>
                <div className="contact-hour-row">
                  <span className="contact-hour-lbl">Corporate Headquarters</span>
                  <span className="contact-hour-val">Mon – Sat (9:00 AM – 7:00 PM)</span>
                </div>
                <div className="contact-hour-row">
                  <span className="contact-hour-lbl">WhatsApp Automated Assistant</span>
                  <span className="contact-hour-val">Always Active (24/7)</span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="contact-info-card">
              <div className="contact-info-card-header">
                <div className="contact-info-icon-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="contact-info-card-title">Helpful Quick Links</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <Link href="/myTrips" style={{ color: "#075bd5", textDecoration: "none", fontWeight: 600 }}>
                  ➔ Manage Your Bookings &amp; Tickets
                </Link>
                <Link href="/giftCard" style={{ color: "#075bd5", textDecoration: "none", fontWeight: 600 }}>
                  ➔ Redeem or Purchase Travel Gift Cards
                </Link>
                <Link href="/privacyPolicy" style={{ color: "#075bd5", textDecoration: "none", fontWeight: 600 }}>
                  ➔ Read SkyRoute Privacy &amp; Data Security Policy
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            4. Newsletter / Other Section
            ========================================================================== */}
        <OtherSection />

        {/* Toast */}
        {toastMsg && (
          <div className="contact-toast">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
