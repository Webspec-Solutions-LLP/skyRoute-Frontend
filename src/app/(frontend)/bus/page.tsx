import type { Metadata } from "next";
import Image from "next/image";
import Hero from "@/components/hero/Hero";
import BusRoute from "@/components/busRoute/BusRoute";
import GovtBus from "@/components/govtBus/GovtBus";
import OfferLayout from "@/components/offerLayout2/OfferLayout";
import Hotel from "@/components/hotel/Hotel";
import Faq from "@/components/faq/Faq";
import "../page.css";
import "./Bus.css";

export const metadata: Metadata = {
  title: "Bus Booking | SkyRoute",
  description: "Search and book AC sleeper, seater, and Volvo luxury buses across India with SkyRoute.",
};

export default function BusPage() {
  return (
    <div className="homepage-background">
      <Hero defaultTab="bus" />
      <BusRoute />
      <GovtBus />
      <OfferLayout />

      {/* =====================================================================
          SkyRoute Bus Booking Complete Guide Section (Directly on Bus Page)
          ===================================================================== */}
      <section className="skyroute-bus-info-section">
        <div className="skyroute-bus-info-container">

          {/* ---------------------------------------------------------------
              BLOCK 1: How to Book Bus Tickets Online on SkyRoute
              --------------------------------------------------------------- */}
          <div className="bus-info-block">
            <div className="bus-info-header">
              <h2 className="bus-info-heading">
                How to Book Bus Tickets Online on <span className="bus-info-highlight">SkyRoute</span>
              </h2>
              <p className="bus-info-subtitle">
                Booking bus tickets on SkyRoute is fast, simple, and secure. Follow these 6 quick steps to complete your reservation in minutes.
              </p>
            </div>

            {/* 6 Steps Grid */}
            <div className="bus-steps-grid">
              {/* Step 1 */}
              <div className="bus-step-card">
                <div className="bus-step-top">
                  <span className="bus-step-badge">STEP 01</span>
                  <div className="bus-step-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
                <h3 className="bus-step-title">Enter Route Cities</h3>
                <p className="bus-step-desc">
                  Type your starting city and destination in the search fields to discover all active intercity and express corridors.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bus-step-card">
                <div className="bus-step-top">
                  <span className="bus-step-badge">STEP 02</span>
                  <div className="bus-step-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
                <h3 className="bus-step-title">Pick Travel Date</h3>
                <p className="bus-step-desc">
                  Select your journey date using the live calendar and click &ldquo;Search Buses&rdquo; to view real-time seat availability.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bus-step-card">
                <div className="bus-step-top">
                  <span className="bus-step-badge">STEP 03</span>
                  <div className="bus-step-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                    </svg>
                  </div>
                </div>
                <h3 className="bus-step-title">Choose Preferred Bus</h3>
                <p className="bus-step-desc">
                  Browse Volvo Multi-Axle, AC Sleeper, Electric, or State RTC buses. Compare user ratings, ticket fares, and schedules.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bus-step-card">
                <div className="bus-step-top">
                  <span className="bus-step-badge">STEP 04</span>
                  <div className="bus-step-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
                      <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
                      <path d="M5 18v2"></path>
                      <path d="M19 18v2"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="bus-step-title">Select Seats & Stops</h3>
                <p className="bus-step-desc">
                  Pick your favorite single berth or window seat on the interactive seat layout, then choose your pickup and drop points.
                </p>
              </div>

              {/* Step 5 */}
              <div className="bus-step-card">
                <div className="bus-step-top">
                  <span className="bus-step-badge">STEP 05</span>
                  <div className="bus-step-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <h3 className="bus-step-title">Enter Passenger Info</h3>
                <p className="bus-step-desc">
                  Fill in primary passenger details, mobile number, and email. Apply promotional coupon codes for instant discounts.
                </p>
              </div>

              {/* Step 6 */}
              <div className="bus-step-card">
                <div className="bus-step-top">
                  <span className="bus-step-badge">STEP 06</span>
                  <div className="bus-step-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                </div>
                <h3 className="bus-step-title">Instant Payment & Ticket</h3>
                <p className="bus-step-desc">
                  Pay with UPI, credit/debit card, or net banking. Receive confirmed M-Ticket with QR code directly via WhatsApp, SMS, and email.
                </p>
              </div>
            </div>

            {/* Dual Showcase Cards with process2.png & process4.png */}
            <div className="bus-steps-showcase-row">
              <div className="bus-feature-card">
                <div className="bus-feature-media">
                  <Image
                    src="/images/bus/process2.png"
                    alt="Interactive Seat Layout Selection on SkyRoute"
                    fill
                    sizes="140px"
                  />
                </div>
                <div className="bus-feature-content">
                  <span className="bus-feature-tag">Interactive Seat Selector</span>
                  <h4 className="bus-feature-title">Live 2D Deck & Berths Preview</h4>
                  <p className="bus-feature-desc">
                    Choose single sleeper berths, ladies reserved seats, or deck positions with live real-time visual seat layouts.
                  </p>
                </div>
              </div>

              <div className="bus-feature-card">
                <div className="bus-feature-media">
                  <Image
                    src="/images/bus/process4.png"
                    alt="Instant Confirmed Bus Ticket on SkyRoute"
                    fill
                    sizes="140px"
                  />
                </div>
                <div className="bus-feature-content">
                  <span className="bus-feature-tag">Instant M-Ticket Confirmation</span>
                  <h4 className="bus-feature-title">Verified QR Pass & Safety Shield</h4>
                  <p className="bus-feature-desc">
                    Receive your confirmed boarding pass instantly with QR code and emergency contact details for contactless travel.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              BLOCK 2: Last Hour Bus Ticket Booking (Hero Split Card)
              --------------------------------------------------------------- */}
          <div className="bus-info-block">
            <div className="bus-info-header">
              <h2 className="bus-info-heading">
                Last Hour <span className="bus-info-highlight">Bus Ticket Booking</span>
              </h2>
            </div>

            <div className="bus-lasthour-card">
              <div className="bus-lasthour-content">
                <div className="bus-lasthour-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Instant Travel Ready</span>
                </div>

                <p className="bus-lasthour-text">
                  Many travellers book buses at the very last moment, and SkyRoute makes this effortless by showing real-time seat availability across multiple bus operators. Since travel plans often change suddenly, SkyRoute provides buses running throughout the day and night so users can quickly check seats, timings, and ticket prices even minutes before journey time.
                </p>

                <p className="bus-lasthour-text">
                  If there are empty seats close to departure, some operators offer lower prices, helping you save money when booking at the last moment — including options for luxury Volvo Multi-Axle, BharatBenz, and AC sleeper coaches. With thousands of private and government bus operators listed, you can pick flexible pick-up and drop-off points directly along your route.
                </p>

                <div className="bus-lasthour-pills">
                  <span className="bus-lasthour-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Real-Time Seat Availability
                  </span>
                  <span className="bus-lasthour-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Last-Minute Fare Drops
                  </span>
                  <span className="bus-lasthour-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                    </svg>
                    24/7 Overnight Fleets
                  </span>
                  <span className="bus-lasthour-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Flexible Boarding Spots
                  </span>
                </div>

                <div className="bus-lasthour-stats">
                  <div className="bus-stat-item">
                    <span className="bus-stat-number">50,000+</span>
                    <span className="bus-stat-label">Daily Intercity Departures</span>
                  </div>
                  <div className="bus-stat-item">
                    <span className="bus-stat-number">Up to 30% Off</span>
                    <span className="bus-stat-label">Last-Hour Seat Discounts</span>
                  </div>
                  <div className="bus-stat-item">
                    <span className="bus-stat-number">&lt; 60 Sec</span>
                    <span className="bus-stat-label">Instant Ticket Delivery</span>
                  </div>
                </div>
              </div>

              {/* Visual featuring process1.png */}
              <div className="bus-lasthour-visual">
                <div className="bus-lasthour-image-wrap">
                  <Image
                    src="/images/bus/process1.png"
                    alt="Last Hour Bus Ticket Booking on SkyRoute"
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                  />
                </div>
                <div className="bus-lasthour-visual-tag">
                  Fast &amp; Reliable Last-Minute Bus Boarding
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              BLOCK 3: Bus Ticket Booking Tips for a Better Travel Experience
              --------------------------------------------------------------- */}
          <div className="bus-info-block">
            <div className="bus-info-header">
              <h2 className="bus-info-heading">
                Bus Ticket Booking Tips for a <span className="bus-info-highlight">Better Travel Experience</span>
              </h2>
              <p className="bus-info-subtitle">
                Keep these essential travel points in mind to secure the best seats, avoid rush-hour delays, and travel with peace of mind.
              </p>
            </div>

            <div className="bus-tips-wrapper">
              {/* Visual Featuring process3.png */}
              <div className="bus-tips-visual-card">
                <div className="bus-tips-visual-media">
                  <Image
                    src="/images/bus/process3.png"
                    alt="SkyRoute Smart Travel Tips and Boarding Experience"
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
                <div className="bus-tips-visual-info">
                  <h4 className="bus-tips-visual-title">Smart Travel Checklist</h4>
                  <p className="bus-tips-visual-desc">
                    Arrive at your pickup stop 15 minutes early with your digital M-Ticket and government ID handy for smooth verification.
                  </p>
                </div>
              </div>

              {/* 8-Tip Structured Grid */}
              <div className="bus-tips-grid">
                <div className="bus-tip-card">
                  <div className="bus-tip-icon blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Book Early for Peak Dates</h4>
                    <p className="bus-tip-desc">Reserve early during weekends, holidays, and festival rush to grab the cheapest fares.</p>
                  </div>
                </div>

                <div className="bus-tip-card">
                  <div className="bus-tip-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Inspect Bus Photos &amp; Layout</h4>
                    <p className="bus-tip-desc">Preview verified bus photos and seat configurations to confirm comfort before booking.</p>
                  </div>
                </div>

                <div className="bus-tip-card">
                  <div className="bus-tip-icon amber">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Check Onboard Amenities</h4>
                    <p className="bus-tip-desc">Verify charging sockets, blankets, water bottles, and reading lights for overnight trips.</p>
                  </div>
                </div>

                <div className="bus-tip-card">
                  <div className="bus-tip-icon blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="4" y1="21" x2="4" y2="14"></line>
                      <line x1="4" y1="10" x2="4" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="3"></line>
                      <line x1="20" y1="21" x2="20" y2="16"></line>
                      <line x1="20" y1="12" x2="20" y2="3"></line>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Use Smart Time Filters</h4>
                    <p className="bus-tip-desc">Filter buses by morning, evening, or late-night departures and compare operator ratings.</p>
                  </div>
                </div>

                <div className="bus-tip-card">
                  <div className="bus-tip-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Review Cancellation Rules</h4>
                    <p className="bus-tip-desc">Always check refund slabs and free cancellation deadlines in case your plans change.</p>
                  </div>
                </div>

                <div className="bus-tip-card">
                  <div className="bus-tip-icon amber">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Track Mid-Week Fare Drops</h4>
                    <p className="bus-tip-desc">Ticket prices on select routes often drop closer to departure on Tuesdays and Wednesdays.</p>
                  </div>
                </div>

                <div className="bus-tip-card">
                  <div className="bus-tip-icon blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Keep Valid ID Handy</h4>
                    <p className="bus-tip-desc">Keep your Aadhaar, Voter ID, or Driving License ready for rapid verification during boarding.</p>
                  </div>
                </div>

                <div className="bus-tip-card">
                  <div className="bus-tip-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="bus-tip-body">
                    <h4 className="bus-tip-title">Arrive at Pick-Up Early</h4>
                    <p className="bus-tip-desc">Reach your designated boarding point 15 to 20 minutes early to avoid peak-hour traffic delays.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              BLOCK 4: Online Bus Booking Overview & SkyRoute Key Advantages
              --------------------------------------------------------------- */}
          <div className="bus-info-block">
            <div className="bus-info-header">
              <h2 className="bus-info-heading">
                Online Bus Booking on SkyRoute: <span className="bus-info-highlight">Key Advantages</span>
              </h2>
            </div>

            <div className="bus-overview-intro">
              <p className="bus-overview-intro-text">
                SkyRoute helps more than <strong>5 Crore+ travellers</strong> search, compare, and book bus tickets across major routes in India. Travellers can check timings, compare fares, view seat layouts, and choose from different bus types based on route, budget, and comfort level. Whether you are planning a short city trip or a long overnight journey, SkyRoute provides private operators as well as official government buses with clear details on amenities, boarding points, and drop locations.
              </p>
              <p className="bus-overview-intro-text">
                With <strong>1 Lakh+ buses</strong> offering discounts, smart departure filters, and official partnerships with leading State Road Transport Corporations (APSRTC, TSRTC, GSRTC, UPSRTC, HRTC, Kerala RTC, and more), booking your journey is simple, safe, and transparent.
              </p>
            </div>

            {/* 3 Advantage Showcase Cards with process5.png & process6.png */}
            <div className="bus-advantages-grid">
              {/* Card 1: Official RTC & Private Fleet */}
              <div className="bus-advantage-card">
                <div className="bus-advantage-rtc-showcase">
                  <div className="bus-rtc-tags">
                    <span className="bus-rtc-pill">APSRTC</span>
                    <span className="bus-rtc-pill">TSRTC</span>
                    <span className="bus-rtc-pill">GSRTC</span>
                    <span className="bus-rtc-pill">UPSRTC</span>
                    <span className="bus-rtc-pill">HRTC</span>
                    <span className="bus-rtc-pill">OSRTC</span>
                    <span className="bus-rtc-pill">Kerala RTC</span>
                    <span className="bus-rtc-pill">BSRTC</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#006ce4", fontWeight: 600 }}>
                    Official Government RTC Partner
                  </span>
                </div>
                <div className="bus-advantage-body">
                  <span className="bus-advantage-tag">State RTC &amp; Private Network</span>
                  <h4 className="bus-advantage-title">Pan-India Bus Network</h4>
                  <p className="bus-advantage-desc">
                    Book official government RTC services alongside top private luxury fleets including VRL, SRS, and IntrCity with verified fares and guaranteed departures.
                  </p>
                </div>
              </div>

              {/* Card 2: Live GPS Bus Tracking (with process5.png) */}
              <div className="bus-advantage-card">
                <div className="bus-advantage-media">
                  <Image
                    src="/images/bus/process5.png"
                    alt="Live Bus GPS Tracking on SkyRoute"
                    fill
                    sizes="(max-width: 1024px) 50vw, 380px"
                  />
                </div>
                <div className="bus-advantage-body">
                  <span className="bus-advantage-tag">Satellite Navigation</span>
                  <h4 className="bus-advantage-title">Live Bus Tracking &amp; ETA</h4>
                  <p className="bus-advantage-desc">
                    Track your bus in real time on interactive maps. Receive live traffic updates, estimated arrival times, and turn-by-turn boarding point directions.
                  </p>
                </div>
              </div>

              {/* Card 3: 24/7 Dedicated Support (with process6.png) */}
              <div className="bus-advantage-card">
                <div className="bus-advantage-media">
                  <Image
                    src="/images/bus/process6.png"
                    alt="24/7 Customer Support and Travel Assistance on SkyRoute"
                    fill
                    sizes="(max-width: 1024px) 50vw, 380px"
                  />
                </div>
                <div className="bus-advantage-body">
                  <span className="bus-advantage-tag">Round-the-Clock Support</span>
                  <h4 className="bus-advantage-title">24/7 Travel Assistance</h4>
                  <p className="bus-advantage-desc">
                    Our dedicated support team is available 24/7 to assist with boarding location queries, schedule changes, and instant cancellation refunds to your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Hotel />
      <Faq />
    </div>
  );
}
