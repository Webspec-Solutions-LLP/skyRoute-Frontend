"use client";

import React from "react";
import Link from "next/link";
import TeamMember from "@/components/teamMember/TeamMember";
import "./AboutUs.css";

export default function AboutUsPage() {
  return (
    <div className="sky-about-page">
      <div className="sky-about-container">
        {/* ==========================================================================
            1. Hero Banner with Stats
            ========================================================================== */}
        <section className="about-hero-card">
          <div className="about-hero-content">
            <div className="about-hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
              <span>SkyRoute Technologies • Innovating Flight Travel</span>
            </div>

            <h1 className="about-hero-title">
              Reimagining How The World <span>Takes Flight</span>
            </h1>

            <p className="about-hero-desc">
              SkyRoute was founded with a singular, clear obsession: to bring total transparency, unmatched speed, and complete peace of mind to air travel. Today, we empower over 5 million flyers with real-time airline fares, automated check-in, transparent pricing, and 24/7 priority customer support.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="about-hero-stats">
            <div className="about-stat-box">
              <div className="about-stat-number">5M+</div>
              <div className="about-stat-label">Happy Flyers</div>
            </div>
            <div className="about-stat-box">
              <div className="about-stat-number">500+</div>
              <div className="about-stat-label">Partner Airlines</div>
            </div>
            <div className="about-stat-box">
              <div className="about-stat-number">120+</div>
              <div className="about-stat-label">Global Destinations</div>
            </div>
            <div className="about-stat-box">
              <div className="about-stat-number">99.8%</div>
              <div className="about-stat-label">On-Time Ticketing</div>
            </div>
            <div className="about-stat-box">
              <div className="about-stat-number">4.8★</div>
              <div className="about-stat-label">Customer Rating</div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. Our Mission & Vision
            ========================================================================== */}
        <section className="about-mission-grid">
          <div className="about-mission-card">
            <div className="about-card-icon-pill">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h3>Our Mission</h3>
            <p>
              To eliminate hidden charges, reduce booking friction, and empower every traveler with intelligent, transparent fare algorithms. We believe air travel should be accessible, predictable, and stress-free for families, solo voyagers, and business travelers alike.
            </p>
          </div>

          <div className="about-mission-card">
            <div className="about-card-icon-pill">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2 12h20" />
                <path d="M20 12v8H4v-8" />
                <path d="m4 4 8 8 8-8" />
                <path d="M12 2v10" />
              </svg>
            </div>
            <h3>Our Vision</h3>
            <p>
              To become the world&apos;s most trusted and intuitive aviation technology ecosystem—connecting every city, airport, and traveler through human-centric design, predictive intelligence, and uncompromised safety standards.
            </p>
          </div>
        </section>

        {/* ==========================================================================
            3. The SkyRoute Advantage (Key Pillars)
            ========================================================================== */}
        <section className="about-section">
          <div className="about-section-header">
            <span className="about-section-tag">Why Choose Us</span>
            <h2 className="about-section-title">The SkyRoute Travel Advantage</h2>
            <p className="about-section-sub">
              Built on cutting-edge aviation infrastructure and genuine flyer care to make every step of your journey extraordinary.
            </p>
          </div>

          <div className="about-features-grid">
            {/* 1. Fare Engine */}
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h4 className="about-feature-title">Smart Fare Discovery</h4>
              <p className="about-feature-desc">
                Our proprietary pricing engine scans thousands of carrier schedules in milliseconds to unearth the best value itineraries with zero rate markups.
              </p>
            </div>

            {/* 2. Zero Hidden Fees */}
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 className="about-feature-title">Zero Hidden Fees</h4>
              <p className="about-feature-desc">
                What you see is exactly what you pay. Fuel surcharges, airport taxes, and convenience fees are clearly broken down upfront before you confirm.
              </p>
            </div>

            {/* 3. Instant Digital Issuance */}
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect width="18" height="14" x="3" y="5" rx="2" />
                  <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
                </svg>
              </div>
              <h4 className="about-feature-title">Instant Digital PNR</h4>
              <p className="about-feature-desc">
                Receive confirmed airline PNRs, automated WhatsApp boarding reminders, and real-time terminal gate alerts right in your pocket.
              </p>
            </div>

            {/* 4. SkyPass & Gift Cards */}
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect width="20" height="5" x="2" y="7" />
                  <line x1="12" x2="12" y1="22" y2="7" />
                </svg>
              </div>
              <h4 className="about-feature-title">SkyPass &amp; Gift Cards</h4>
              <p className="about-feature-desc">
                Enjoy members-only travel perks, digital SkyWallet credits, and gift cards with 365-day extended validity across partner airlines.
              </p>
            </div>

            {/* 5. 24/7 Human-First Care */}
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h4 className="about-feature-title">24/7 Human Support</h4>
              <p className="about-feature-desc">
                Real flight specialists ready 24/7 to assist with emergency reschedules, airline cancellations, baggage queries, and instant refunds.
              </p>
            </div>

            {/* 6. Bank-Grade Security */}
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h4 className="about-feature-title">Bank-Grade Encryption</h4>
              <p className="about-feature-desc">
                256-bit SSL encryption, tokenized payment credentials, and strict RBI/DGCA aviation data protection safeguards your identity at all times.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            4. Milestones & Journey
            ========================================================================== */}
        <section className="about-timeline-card">
          <div className="about-section-header" style={{ marginBottom: "16px" }}>
            <span className="about-section-tag">Our Growth</span>
            <h2 className="about-section-title">The SkyRoute Journey</h2>
            <p className="about-section-sub">
              From an ambitious idea in Kolkata to one of India&apos;s fastest growing travel technology platforms.
            </p>
          </div>

          <div className="about-timeline-grid">
            <div className="about-timeline-item">
              <span className="about-timeline-year">2024 • Inception</span>
              <h4 className="about-timeline-title">The Genesis</h4>
              <p className="about-timeline-text">
                Founded with a mission to simplify flight bookings. Rolled out our proprietary low-fare discovery engine covering top domestic metro sectors.
              </p>
            </div>

            <div className="about-timeline-item">
              <span className="about-timeline-year">2025 • Expansion</span>
              <h4 className="about-timeline-title">Global Connectivity</h4>
              <p className="about-timeline-text">
                Expanded into 120+ international destinations, partnered with 500+ world-class airlines, and introduced SkyWallet and Travel Gift Cards.
              </p>
            </div>

            <div className="about-timeline-item">
              <span className="about-timeline-year">2026 • 5M Milestone</span>
              <h4 className="about-timeline-title">Empowering Millions</h4>
              <p className="about-timeline-text">
                Celebrated over 5 million happy travelers, achieving an industry-leading 99.8% on-time ticketing rate and 4.8★ customer trust index.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            5. Leadership Team Members
            ========================================================================== */}
        <TeamMember />

        {/* ==========================================================================
            6. Core Values
            ========================================================================== */}
        <section className="about-section">
          <div className="about-section-header">
            <span className="about-section-tag">Our Culture</span>
            <h2 className="about-section-title">Values That Guide Us</h2>
            <p className="about-section-sub">
              Principles that steer our engineering, design, and customer care decisions every single day.
            </p>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="about-value-title">Transparency First</h4>
              <p className="about-value-desc">
                Zero deceptive add-ons. Clear fare policies, upfront cancellation rules, and honest communications.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h4 className="about-value-title">Flyer Obsession</h4>
              <p className="about-value-desc">
                Every tool, button, and notification is crafted around the human traveler experience and real needs.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h4 className="about-value-title">Speed &amp; Precision</h4>
              <p className="about-value-desc">
                Sub-second search results, automated web check-in, and instant refund processing through secure rails.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h4 className="about-value-title">Global Connectivity</h4>
              <p className="about-value-desc">
                Uniting destinations worldwide with accessible fares and multicultural customer assistance.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            6. Call to Action Banner
            ========================================================================== */}
        <section className="about-cta-card">
          <div className="about-cta-text">
            <h3>Ready to Experience Smarter Flight Travel?</h3>
            <p>
              Join over 5 million satisfied flyers. Discover the best airline deals with guaranteed zero hidden fees and instant confirmed ticketing.
            </p>
          </div>

          <div className="about-cta-buttons">
            <Link href="/" className="about-cta-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
              <span>Search Flights</span>
            </Link>

            <Link href="/giftCard" className="about-cta-btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect width="20" height="5" x="2" y="7" />
                <line x1="12" x2="12" y1="22" y2="7" />
              </svg>
              <span>Explore Gift Cards</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
