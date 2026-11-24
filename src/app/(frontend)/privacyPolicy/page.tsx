"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./privacyPolicy.css";

interface PolicySection {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: "section-1",
    number: "01",
    title: "Introduction & Scope",
    content: (
      <div className="privacy-prose">
        <p>
          Welcome to <strong>SkyRoute</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We are deeply dedicated to safeguarding your personal privacy and protecting the confidential information you share while using our flight booking engine, mobile portals, web services, and customer support channels.
        </p>
        <p>
          This Privacy Policy outlines how SkyRoute gathers, processes, encrypts, and retains your personal information when you search, book, or manage domestic and international airline reservations, travel gift cards, and related travel services.
        </p>
        <div className="privacy-callout-info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            By browsing SkyRoute, creating an account, or reserving flights, you acknowledge and accept the data handling practices described in this policy.
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "section-2",
    number: "02",
    title: "Information We Collect",
    content: (
      <div className="privacy-prose">
        <p>
          To deliver seamless flight booking and ticketing services, we collect information you provide directly to us as well as automated diagnostic metrics:
        </p>
        <div className="privacy-data-grid">
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">Personal Identifiers</h4>
            <p className="privacy-data-card-desc">
              Full name (First, Middle, Last), Gender, Date of Birth, and nationality as printed on your government photo ID.
            </p>
          </div>
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">Contact Information</h4>
            <p className="privacy-data-card-desc">
              Verified mobile phone number, email address, WhatsApp notification consent, and billing residential address.
            </p>
          </div>
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">Travel Documents</h4>
            <p className="privacy-data-card-desc">
              Passport number, expiry date, issuing country, and PAN card number (mandated by RBI for cross-border bookings).
            </p>
          </div>
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">Technical Diagnostics</h4>
            <p className="privacy-data-card-desc">
              IP address, browser version, operating system, device identifiers, language preferences, and referral flight URLs.
            </p>
          </div>
        </div>
        <ul className="privacy-list">
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Co-traveller Information:</strong> When you book on behalf of family members or colleagues, you confirm that you have obtained their prior consent to furnish their travel details.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Special Assistance Requests:</strong> Meal preferences, wheelchair assistance, or medical accommodations submitted for airline clearance.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "section-3",
    number: "03",
    title: "How We Use Your Personal Data",
    content: (
      <div className="privacy-prose">
        <p>We process your personal information exclusively for sanctioned, legitimate travel operational purposes:</p>
        <ul className="privacy-list">
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Ticket Issuance &amp; PNR Generation:</strong> Generating valid airline tickets, transmitting passenger manifests (APIS), and communicating flight boarding passes.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Flight Status &amp; Schedule Alerts:</strong> Sending timely SMS, email, and WhatsApp notifications regarding gate changes, delays, cancellations, and web check-in windows.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Customer Support &amp; Dispute Resolution:</strong> Assisting you through 24x7 helpline channels, processing ticket refunds, cancellations, and baggage claims.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Fraud Prevention &amp; Payment Security:</strong> Detecting unauthorized card usage, identity impersonation, and maintaining a secure travel ecosystem.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "section-4",
    number: "04",
    title: "Airlines & Partner Sharing",
    content: (
      <div className="privacy-prose">
        <p>
          SkyRoute does <strong>not sell, rent, or trade</strong> your personal contact or travel information to third-party telemarketers or advertisers under any circumstances.
        </p>
        <p>Your details are shared solely with necessary travel fulfillment partners:</p>
        <ul className="privacy-list">
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Partner Airlines:</strong> Carrier partners (e.g. IndiGo, Air India, Emirates, Singapore Airlines) receive flyer names, date of birth, and passport details required for flight manifest compilation.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Global Distribution Systems (GDS):</strong> Certified aviation booking networks (Amadeus, Sabre, Travelport) facilitating real-time seat inventory and ticketing.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Government &amp; Aviation Authorities:</strong> Bureau of Immigration, DGCA, TSA, and customs agencies as required by mandatory international aviation safety protocols.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "section-5",
    number: "05",
    title: "Data Security & 256-Bit Encryption",
    content: (
      <div className="privacy-prose">
        <p>
          We employ state-of-the-art technological and organizational safeguards to ensure that your travel data is shielded from unauthorized interception, alteration, or disclosure:
        </p>
        <div className="privacy-data-grid">
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">TLS 1.3 Encryption</h4>
            <p className="privacy-data-card-desc">
              All communications between your web browser and SkyRoute servers are encrypted using high-grade 256-bit SSL/TLS protocol certificates.
            </p>
          </div>
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">Encrypted at Rest</h4>
            <p className="privacy-data-card-desc">
              Sensitive identifiers including passport numbers and PAN cards are tokenized and stored in AES-256 encrypted relational vaults.
            </p>
          </div>
        </div>
        <p>
          Our cloud architecture undergoes periodic automated penetration testing, vulnerability evaluations, and strict role-based access control (RBAC) governance.
        </p>
      </div>
    ),
  },
  {
    id: "section-6",
    number: "06",
    title: "Cookies & Tracking Technologies",
    content: (
      <div className="privacy-prose">
        <p>
          SkyRoute uses session and persistent cookies to preserve your flight search preferences, active route filters, currency selections, and authentication sessions:
        </p>
        <ul className="privacy-list">
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Essential Cookies:</strong> Critical for account login verification, session security, and maintaining items during checkout.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Preference Cookies:</strong> Remembers your departure airport, seat tier, and recent flight searches for swift subsequent bookings.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Performance Diagnostics:</strong> Anonymous analytics enabling our engineering team to enhance page load speeds and route discovery efficiency.</span>
          </li>
        </ul>
        <p>You can adjust or disable cookies at any time via your browser settings, though certain interactive features may be limited.</p>
      </div>
    ),
  },
  {
    id: "section-7",
    number: "07",
    title: "Payment Security & Financial Information",
    content: (
      <div className="privacy-prose">
        <p>
          SkyRoute does <strong>not store</strong> full credit card numbers, debit card PINs, CVV codes, or net banking passwords on our internal systems.
        </p>
        <div className="privacy-callout-info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
          </svg>
          <span>
            All payment transactions are processed through RBI-approved, PCI-DSS Level 1 compliant payment gateways (UPI, Visa, Mastercard, RuPay, NetBanking) with mandatory two-factor authentication (OTP/3D Secure).
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "section-8",
    number: "08",
    title: "Your Privacy Rights & Consent Control",
    content: (
      <div className="privacy-prose">
        <p>Depending on your jurisdiction and under applicable data protection laws, you retain explicit rights over your information:</p>
        <ul className="privacy-list">
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Right to Access:</strong> You can request an electronic summary of all personal travel data linked to your account.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Right to Rectification:</strong> Edit or correct your name, phone number, address, or email directly from your Profile settings.</span>
          </li>
          <li className="privacy-list-item">
            <span className="privacy-list-bullet" />
            <span><strong>Marketing Opt-Out:</strong> Unsubscribe from fare promotion newsletters and promotional SMS notifications with one click.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "section-9",
    number: "09",
    title: "Data Retention & Account Deletion",
    content: (
      <div className="privacy-prose">
        <p>
          We retain your personal booking records only for as long as required to fulfill travel itineraries, satisfy statutory tax and GST audit obligations, and comply with civil aviation regulations.
        </p>
        <p>
          You may request permanent deletion of your SkyRoute user account at any time by contacting our privacy team. Past completed flight tax invoices are retained in anonymized archives for the statutory period mandated by law.
        </p>
      </div>
    ),
  },
  {
    id: "section-10",
    number: "10",
    title: "RBI & International Regulations (LRS)",
    content: (
      <div className="privacy-prose">
        <div className="privacy-callout-warning">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>
            <strong>Statutory Compliance:</strong> In accordance with Reserve Bank of India (RBI) directives under the Liberalised Remittance Scheme (LRS) and Tax Collected at Source (TCS) provisions, collection of the Primary Booker&apos;s PAN card number is legally mandatory for all international outbound flight bookings.
          </span>
        </div>
        <p>
          Your PAN information is utilized exclusively for tax reporting and cross-border currency compliance and is never leveraged for commercial profiling.
        </p>
      </div>
    ),
  },
  {
    id: "section-11",
    number: "11",
    title: "Policy Amendments & Updates",
    content: (
      <div className="privacy-prose">
        <p>
          SkyRoute reserves the right to revise or modify this Privacy Policy in response to emerging aviation security directives, legal amendments, or service expansions.
        </p>
        <p>
          Whenever substantial modifications take place, we will display an alert banner on our platform or transmit a direct notification to your registered email address before updates take effect.
        </p>
      </div>
    ),
  },
  {
    id: "section-12",
    number: "12",
    title: "Contact SkyRoute Data Privacy Officer",
    content: (
      <div className="privacy-prose">
        <p>
          If you have any questions, feedback, or grievance requests concerning this Privacy Policy or your personal travel records, please reach out to our dedicated Data Protection Officer:
        </p>
        <div className="privacy-data-grid">
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">Email Privacy Desk</h4>
            <p className="privacy-data-card-desc">
              privacy@skyroute.com<br />
              grievance@skyroute.com
            </p>
          </div>
          <div className="privacy-data-card">
            <h4 className="privacy-data-card-title">Corporate Office</h4>
            <p className="privacy-data-card-desc">
              SkyRoute Travel Technologies Ltd.<br />
              Sector V, Salt Lake, Kolkata, West Bengal 700091
            </p>
          </div>
        </div>
        <p>
          Our privacy team investigates all legitimate inquiries within 48 business hours.
        </p>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
  const [activeSectionId, setActiveSectionId] = useState<string>("section-1");

  // Smooth scroll handler when clicking a point in the left sidebar
  const handlePointClick = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scrollspy to automatically highlight the current section as the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for navbar and header

      for (let i = POLICY_SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(POLICY_SECTIONS[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(POLICY_SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sky-privacy-page">
      <div className="sky-privacy-container">
        {/* ==========================================================================
            Top Hero Banner
            ========================================================================== */}
        <section className="privacy-hero-banner">
          <div className="privacy-hero-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>SkyRoute Trust &amp; Transparency • Updated November 2026</span>
          </div>

          <h1 className="privacy-hero-title">Privacy &amp; Data Protection Policy</h1>
          <p className="privacy-hero-subtitle">
            Learn how SkyRoute collects, secures, encrypts, and handles your personal identifiers, flight reservations, and travel documents in accordance with global aviation and RBI regulations.
          </p>

          <div className="privacy-hero-badges">
            <span className="privacy-trust-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              256-Bit SSL/TLS Encryption
            </span>
            <span className="privacy-trust-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              RBI &amp; DGCA Aviation Compliant
            </span>
            <span className="privacy-trust-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              Zero Unsolicited Data Sharing
            </span>
          </div>
        </section>

        {/* ==========================================================================
            Main 2-Column Layout
            ========================================================================== */}
        <div className="privacy-layout">
          {/* Left Sticky Sidebar: Table of Contents / Points */}
          <aside className="privacy-sidebar">
            <div className="privacy-sidebar-header">
              <h3>Table of Contents</h3>
              <p>Click any point to jump to its description</p>
            </div>

            {POLICY_SECTIONS.map((section) => {
              const isActive = activeSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`privacy-toc-btn ${isActive ? "is-active" : ""}`}
                  onClick={() => handlePointClick(section.id)}
                  title={section.title}
                >
                  <div className="privacy-toc-left">
                    <span className="privacy-toc-num">{section.number}</span>
                    <span className="privacy-toc-label">{section.title}</span>
                  </div>
                  {isActive && <span className="privacy-toc-indicator" />}
                </button>
              );
            })}

            <div className="privacy-sidebar-footer">
              <strong>Need Data Assistance?</strong>
              Have questions regarding your personal data? Reach our privacy desk at{" "}
              <a href="mailto:privacy@skyroute.com">privacy@skyroute.com</a>.
            </div>
          </aside>

          {/* Right Main Content Stream: Point Descriptions */}
          <main className="privacy-content-stream">
            {POLICY_SECTIONS.map((section) => (
              <article key={section.id} id={section.id} className="privacy-section-card">
                <div className="privacy-section-header">
                  <span className="privacy-section-num-tag">Point {section.number}</span>
                  <h2 className="privacy-section-title">{section.title}</h2>
                </div>
                {section.content}
              </article>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
