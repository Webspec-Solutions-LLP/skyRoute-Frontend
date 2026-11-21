"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./TripDetails.css";

type TripType = "flight" | "train" | "bus" | "hotel";

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function TripDetailsContent() {
  const searchParams = useSearchParams();
  const qType = searchParams.get("type") as TripType | null;
  const qId = searchParams.get("id") || "";

  // Active view type: defaults to URL type, or flight
  const [activeType, setActiveType] = useState<TripType>(() => {
    if (qType === "train") return "train";
    if (qType === "bus") return "bus";
    if (qType === "hotel") return "hotel";
    return "flight";
  });

  // Track copied state for feedback
  const [copiedPnr, setCopiedPnr] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPnr(true);
      setTimeout(() => setCopiedPnr(false), 2000);
    }
  };

  // Sync if URL query changes
  useEffect(() => {
    if (qType === "train" || qType === "bus" || qType === "hotel" || qType === "flight") {
      setActiveType(qType);
    }
  }, [qType]);

  return (
    <div className="td-page">
      {/* 1320PX CONTAINER */}
      <div className="td-container">
        {/* TOP HEADER / BREADCRUMB BAR */}
        <div className="td-top-bar">
          <Link href="/myTrips" className="td-back-link" title="Return to My Trips">
            <span className="td-back-arrow-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/>
                <path d="m12 19-7-7 7-7"/>
              </svg>
            </span>
            <span className="td-back-text">Back to My Trips</span>
          </Link>

          <div className="td-top-actions">
            <span className="td-status-badge">
              <span>●</span> Confirmed
            </span>

            <div
              className="td-ref-pill"
              onClick={() => copyToClipboard(activeType === "flight" ? "IF26111275452879" : activeType === "train" ? "4447763827" : activeType === "bus" ? "BS-DOL-948123" : "HTL-PURI-821904")}
              title="Click to copy Reference ID"
            >
              <span>Booking Ref: {activeType === "flight" ? "IF26111275452879" : activeType === "train" ? "4447763827" : activeType === "bus" ? "BS-DOL-948123" : "HTL-PURI-821904"}</span>
              <span>📋</span>
              {copiedPnr && <span style={{ color: "#16a34a", fontSize: "11px" }}>Copied!</span>}
            </div>
          </div>
        </div>

        {/* TYPE SWITCHER TABS (Allows checking Flight, Train, Bus, Hotel) */}
        <div className="td-type-switcher" role="tablist">
          {[
            { id: "flight", label: "✈️ Flight Trip Details" },
            { id: "train", label: "🚆 Train Trip Details" },
            { id: "bus", label: "🚌 Bus Trip Details" },
            { id: "hotel", label: "🏨 Hotel Booking Details" },
          ].map((tab) => {
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`td-type-tab ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveType(tab.id as TripType)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TWO-COLUMN GRID LAYOUT (320px Sticky Sidebar + 1fr Main Content) */}
        <div className="td-layout-grid">
          {/* ================================================================
             LEFT STICKY SIDEBAR (Screenshots 1, 2, 3 & 5)
             ================================================================ */}
          <aside className="td-sidebar">
            {/* FARE SUMMARY CARD */}
            <div className="td-card">
              <h2 className="td-card-title">
                <span>Fare Summary</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>▲</span>
              </h2>

              <div className="td-fare-amount-row">
                <span className="td-fare-total-label">Total Amount</span>
                <span className="td-fare-total-val">
                  {activeType === "flight" ? "₹35,431" : activeType === "train" ? "₹1,614" : activeType === "bus" ? "₹1,792" : "₹8,400"}
                </span>
              </div>

              <div className="td-saving-pill">
                <span>🎉</span>
                <span>Awesome! You saved ₹821 on this booking</span>
              </div>

              <div className="td-fare-breakdown">
                <div className="td-fare-row">
                  <span>Base Ticket Fare</span>
                  <strong>{activeType === "flight" ? "₹31,580" : activeType === "train" ? "₹1,500" : activeType === "bus" ? "₹1,600" : "₹7,500"}</strong>
                </div>
                <div className="td-fare-row">
                  <span>Taxes &amp; Surcharges (GST)</span>
                  <strong>{activeType === "flight" ? "₹3,410" : activeType === "train" ? "₹36.27" : activeType === "bus" ? "₹142" : "₹900"}</strong>
                </div>
                <div className="td-fare-row">
                  <span>Travel Insurance (Incl. GST)</span>
                  <strong>{activeType === "flight" ? "₹149" : activeType === "train" ? "₹1.35" : activeType === "bus" ? "₹50" : "Included"}</strong>
                </div>
                <div className="td-fare-row">
                  <span>SkyRoute Service Convenience</span>
                  <strong>{activeType === "flight" ? "₹292" : activeType === "train" ? "₹76.38" : "₹0"}</strong>
                </div>
                <div className="td-fare-row" style={{ paddingTop: "6px", borderTop: "1px dashed #cbd5e1" }}>
                  <span style={{ fontWeight: 600 }}>Total Paid via UPI</span>
                  <strong style={{ color: "#0284c7" }}>
                    {activeType === "flight" ? "₹35,431" : activeType === "train" ? "₹1,614" : activeType === "bus" ? "₹1,792" : "₹8,400"}
                  </strong>
                </div>
              </div>
            </div>

            {/* MODIFY BOOKING CARD (Screenshot 1) */}
            <div className="td-card">
              <h2 className="td-card-title">Modify Booking</h2>
              <div className="td-action-list">
                <button
                  type="button"
                  className="td-action-item"
                  onClick={() => alert("Cancellation policy: Eligible for instant refund directly to UPI account.")}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: "#dc2626" }}>Cancel Booking</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Applicable as per airline/railway policy</div>
                  </div>
                  <span className="td-action-arrow">➔</span>
                </button>

                <button
                  type="button"
                  className="td-action-item"
                  onClick={() => alert("Fare Rules: Free cancellation window valid up to 24 hours prior to travel.")}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>View Fare Rules</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Cancellation &amp; rescheduling charges</div>
                  </div>
                  <span className="td-action-arrow">➔</span>
                </button>

                <button
                  type="button"
                  className="td-action-item"
                  onClick={() => alert("Reschedule: Change departure date or time.")}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>Change Travel Date</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Subject to seat availability</div>
                  </div>
                  <span className="td-action-arrow">➔</span>
                </button>
              </div>
            </div>

            {/* APP PROMO CARD (Screenshot 1 & 3) */}
            <div className="td-promo-box">
              <div className="td-promo-heading">
                <span>📱</span> SkyRoute App Perks
              </div>
              <p className="td-promo-text">
                Track live gate changes, platform numbers, GPS delay alerts, and automatic web check-in.
              </p>
              <button
                type="button"
                className="td-btn-blue-outline"
                style={{ width: "100%", justifyContent: "center", fontSize: "12px" }}
                onClick={() => alert("SkyRoute Mobile App download link sent to your registered mobile number!")}
              >
                Scan or Get App Link ➔
              </button>
            </div>

            {/* NEED HELP & CUSTOMER SERVICE (Screenshot 3 & 5) */}
            <div className="td-card">
              <h2 className="td-card-title">Need Help?</h2>
              <div className="td-action-list">
                <button
                  type="button"
                  className="td-action-item"
                  onClick={() => alert("Connecting to 24x7 Customer Support Live Chat...")}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>24×7 Customer Service</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Live help centre &amp; ticket support</div>
                  </div>
                  <span className="td-action-arrow">➔</span>
                </button>

                <div style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: "6px", fontSize: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ color: "#64748b", marginBottom: "2px" }}>Official Helpline:</div>
                  <strong>
                    {activeType === "flight" ? "IndiGo: 0124-6173838" : activeType === "train" ? "Railways (IRCTC): 139" : activeType === "bus" ? "Dolphin Support: 080-4910283" : "Front Desk: +91 6752-224810"}
                  </strong>
                </div>
              </div>
            </div>
          </aside>

          {/* ================================================================
             RIGHT MAIN CONTENT AREA
             ================================================================ */}
          <main className="td-main-content">
            {/* QUICK ACTIONS BAR (Screenshot 1) */}
            <div className="td-quick-actions-bar">
              <div
                className="td-quick-card"
                onClick={() => alert(`Downloading official E-Ticket PDF for ${activeType.toUpperCase()}...`)}
              >
                <div className="td-quick-left">
                  <div className="td-quick-icon-wrap">🎫</div>
                  <div>
                    <div className="td-quick-title">E-Ticket</div>
                    <div className="td-quick-sub">Download Official PDF</div>
                  </div>
                </div>
                <span className="td-action-arrow">➔</span>
              </div>

              <div
                className="td-quick-card"
                onClick={() => alert(`Viewing and downloading Official Tax Invoice for ${activeType.toUpperCase()}...`)}
              >
                <div className="td-quick-left">
                  <div className="td-quick-icon-wrap">🧾</div>
                  <div>
                    <div className="td-quick-title">Invoice</div>
                    <div className="td-quick-sub">View / Download GST Receipt</div>
                  </div>
                </div>
                <span className="td-action-arrow">➔</span>
              </div>
            </div>

            {/* ==============================================================
               1. FLIGHT VIEW (Screenshots 1, 2, 3)
               ============================================================== */}
            {activeType === "flight" && (
              <>
                <article className="td-journey-card">
                  <div className="td-journey-header">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="td-service-tag">Saver • Economy</span>
                        <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Scheduled ✓</span>
                      </div>
                      <h2 className="td-route-title" style={{ marginTop: "4px" }}>
                        Chennai (MAA) ➔ Agartala (IXA)
                      </h2>
                      <div className="td-meta-sub">
                        Sat, 14 Nov 2026 • 1 stop • 9h Total Duration • Airbus A320-200
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>IndiGo • 6E 6662, 6E 994</strong>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>PNR: Z7H5HL</div>
                    </div>
                  </div>

                  {/* FLIGHT TIMELINE */}
                  <div className="td-timeline-grid">
                    <div className="td-time-block">
                      <span className="td-sub-info">Sat, 14 Nov</span>
                      <span className="td-time-val">23:10</span>
                      <span className="td-station-title">MAA - Chennai</span>
                      <span className="td-sub-info">Chennai International Airport, Terminal 1</span>
                    </div>

                    <div className="td-track-col">
                      <span className="td-duration-pill">2h 20m</span>
                      <div className="td-track-line">
                        <span style={{ fontSize: "12px" }}>🛫</span>
                        <div className="td-track-bar" />
                        <span style={{ fontSize: "12px" }}>🛬</span>
                      </div>
                      <span style={{ fontSize: "10.5px", color: "#64748b" }}>Layover CCU (4h 10m)</span>
                    </div>

                    <div className="td-time-block is-dest">
                      <span className="td-sub-info">Sun, 15 Nov</span>
                      <span className="td-time-val">06:45</span>
                      <span className="td-station-title">IXA - Agartala</span>
                      <span className="td-sub-info">Maharaja Bir Bikram Airport, Terminal 1</span>
                    </div>
                  </div>

                  {/* BAGGAGE ALLOWANCE ROW (Screenshot 1) */}
                  <div className="td-amenities-row">
                    <div className="td-amenity-item">
                      <span>🎒</span>
                      <span>Cabin Baggage: <strong>7 kg per passenger</strong></span>
                    </div>
                    <span>•</span>
                    <div className="td-amenity-item">
                      <span>🧳</span>
                      <span>Check-in Baggage: <strong>15 kg per passenger</strong></span>
                    </div>
                  </div>

                  {/* TRAVELLER MANIFEST TABLE (Screenshot 1 - With CHANGED user names!) */}
                  <div className="td-manifest-wrap">
                    <h3 className="td-manifest-title">Traveller &amp; Seat Manifest</h3>
                    <div className="td-table-box">
                      <table className="td-table">
                        <thead>
                          <tr>
                            <th>Traveller</th>
                            <th>Airline PNR</th>
                            <th>Seat</th>
                            <th>Meal</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: "Mr Joydeep Barik", type: "Adult, M", seat: "14A (Window)", meal: "Veg Hot Meal" },
                            { name: "Ms Ananya Sen", type: "Adult, F", seat: "14B (Middle)", meal: "Snack Kit" },
                            { name: "Master Aarav Barik", type: "Child, M", seat: "14C (Aisle)", meal: "Kids Box" },
                          ].map((t, idx) => (
                            <tr key={idx}>
                              <td>
                                <strong>{t.name}</strong>
                                <div style={{ fontSize: "11px", color: "#64748b" }}>{t.type}</div>
                              </td>
                              <td>
                                <span
                                  onClick={() => copyToClipboard("Z7H5HL")}
                                  style={{ cursor: "pointer", fontWeight: 600, color: "#0284c7" }}
                                  title="Click to copy PNR"
                                >
                                  Z7H5HL 📋
                                </span>
                              </td>
                              <td><strong>{t.seat}</strong></td>
                              <td>{t.meal}</td>
                              <td><span style={{ color: "#16a34a", fontWeight: 600 }}>Confirmed ✓</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ marginTop: "8px", fontSize: "12px", color: "#64748b" }}>
                      ⚙️ Aircraft: Airbus A320-200 • Narrow-body • Standard seat pitch • In-seat USB power
                    </div>
                  </div>

                  <div className="td-note-box">
                    <strong>Note:</strong> Flight schedule, departure gate &amp; cancellation information are provided for your reference. We recommend arriving at the airport 2 hours before scheduled departure.
                  </div>
                </article>

                {/* BOOK RETURN FLIGHT CAROUSEL (Screenshots 2 & 3) */}
                <div className="td-return-strip">
                  <h3 className="td-return-header">Book Return Flight</h3>
                  <p className="td-return-sub">Choose your cheapest return flight from Agartala: IXA ➔ MAA</p>

                  <div className="td-date-cards-scroll">
                    {[
                      { date: "Sat, 21 Nov", price: 20303 },
                      { date: "Sun, 22 Nov", price: 19234 },
                      { date: "Mon, 23 Nov", price: 14851 },
                      { date: "Tue, 24 Nov", price: 12472 },
                      { date: "Wed, 25 Nov", price: 12325, cheapest: true },
                      { date: "Thu, 26 Nov", price: 12325, cheapest: true },
                      { date: "Fri, 27 Nov", price: 13326 },
                      { date: "Sat, 28 Nov", price: 14572 },
                      { date: "Sun, 29 Nov", price: 14145 },
                      { date: "Mon, 30 Nov", price: 12325, cheapest: true },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`td-date-card ${item.cheapest ? "is-cheapest" : ""}`}
                        onClick={() => alert(`Selected return flight on ${item.date} starting from ${formatInr(item.price)}`)}
                      >
                        <div className="td-date-label">{item.date}</div>
                        <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "2px" }}>Starting from</div>
                        <div className="td-date-price">{formatInr(item.price)}</div>
                        {item.cheapest && (
                          <div style={{ fontSize: "9.5px", color: "#16a34a", fontWeight: 700, marginTop: "2px" }}>
                            LOWEST
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTACT DETAILS (Screenshots 2 & 3 - With CHANGED user phone/email!) */}
                <div className="td-contact-card">
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>
                      Contact Details
                    </h4>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                      Booking confirmation and live SMS updates delivered to:
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="td-contact-item">
                      <span>📞 Phone:</span>
                      <strong>+91 9749708386</strong>
                    </div>
                    <div className="td-contact-item">
                      <span>✉️ Email:</span>
                      <strong>joydeepbarik007@gmail.com</strong>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ==============================================================
               2. TRAIN VIEW (Screenshots 4 & 5)
               ============================================================== */}
            {activeType === "train" && (
              <>
                <article className="td-journey-card">
                  <div className="td-journey-header">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="td-service-tag" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                          CC - AC Chair Car | General
                        </span>
                        <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Confirmed ✓</span>
                      </div>
                      <h2 className="td-route-title" style={{ marginTop: "4px" }}>
                        20663 Mas Vande Bharat
                      </h2>
                      <div className="td-meta-sub">
                        Wed, 11 Nov 2026 • Katpadi Jn (KPD) ➔ Mgr Chennai Ctl (MAS) • Superfast Express
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>Indian Railways IRCTC</strong>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Live Status: On Time</div>
                    </div>
                  </div>

                  {/* TRAIN TIMELINE (Screenshot 4) */}
                  <div className="td-timeline-grid">
                    <div className="td-time-block">
                      <span className="td-sub-info">Wed, 11 Nov</span>
                      <span className="td-time-val">10:40</span>
                      <span className="td-station-title">KPD - Katpadi Jn</span>
                      <span className="td-sub-info">Exp. Platform No. 2</span>
                    </div>

                    <div className="td-track-col">
                      <span className="td-duration-pill">1h 50m</span>
                      <div className="td-track-line">
                        <span style={{ fontSize: "12px" }}>🚆</span>
                        <div className="td-track-bar" style={{ background: "#7c3aed" }} />
                        <span style={{ fontSize: "12px" }}>🏁</span>
                      </div>
                      <span style={{ fontSize: "10.5px", color: "#64748b" }}>Vande Bharat Track</span>
                    </div>

                    <div className="td-time-block is-dest">
                      <span className="td-sub-info">Wed, 11 Nov</span>
                      <span className="td-time-val">12:30</span>
                      <span className="td-station-title">MAS - Mgr Chennai Ctl</span>
                      <span className="td-sub-info">Exp. Platform No. 2</span>
                    </div>
                  </div>

                  {/* PNR CARD (Screenshot 4) */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px 14px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                          PNR: 4447763827
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("4447763827")}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}
                          title="Copy PNR"
                        >
                          📋
                        </button>
                      </div>
                      <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 500, marginTop: "2px" }}>
                        Chart prepared (Synced live with IRCTC Gateway)
                      </div>
                    </div>

                    <button
                      type="button"
                      className="td-btn-blue-outline"
                      onClick={() => alert("Refreshed live PNR status from Indian Railways!")}
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      🔄 Refresh Status
                    </button>
                  </div>

                  {/* TRAIN PASSENGER MANIFEST (Screenshot 4 - With CHANGED names!) */}
                  <div className="td-manifest-wrap">
                    <h3 className="td-manifest-title">Passenger Details &amp; Berth Allocation</h3>
                    <div className="td-table-box">
                      <table className="td-table">
                        <thead>
                          <tr>
                            <th>Passenger Name</th>
                            <th>Booking Status</th>
                            <th>Coach / Seat / Berth</th>
                            <th>Quota</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: "JOYDEEP BARIK", seat: "Coach C5 / Seat 37 (Window)", quota: "General (NC)" },
                            { name: "ANANYA SEN", seat: "Coach C5 / Seat 48 (Aisle)", quota: "General (NC)" },
                            { name: "ROHAN MUKHERJEE", seat: "Coach C1 / Seat 2 (Chair)", quota: "General (NC)" },
                          ].map((p, idx) => (
                            <tr key={idx}>
                              <td><strong>{p.name}</strong></td>
                              <td><span style={{ color: "#16a34a", fontWeight: 700 }}>CNF (Confirmed)</span></td>
                              <td><strong style={{ color: "#0284c7" }}>{p.seat}</strong></td>
                              <td>{p.quota}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* BUTTONS (Screenshot 4) */}
                  <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                    <button
                      type="button"
                      className="td-btn-blue"
                      onClick={() => alert("Downloading official IRCTC E-Ticket PDF...")}
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      📥 Download E-Ticket
                    </button>
                    <button
                      type="button"
                      className="td-btn-blue-outline"
                      onClick={() => alert("Displaying Indian Railways verification QR Code for TTE checking.")}
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      📱 Show QR Code
                    </button>
                  </div>

                  {/* DISCLAIMER (Screenshot 5) */}
                  <div className="td-note-box" style={{ marginTop: "14px" }}>
                    <strong>Please note:</strong> Train timings and platform numbers are subject to operational changes without prior notice. Carrying an original Government Photo ID (Aadhaar / Voter ID / Passport) is mandatory during the journey.
                  </div>
                </article>

                {/* CONTACT DETAILS */}
                <div className="td-contact-card">
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>
                      Registered Contact
                    </h4>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                      PNR updates &amp; chart preparation alerts sent to:
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="td-contact-item">
                      <span>📞 Mobile:</span>
                      <strong>+91 9749708386</strong>
                    </div>
                    <div className="td-contact-item">
                      <span>✉️ Email:</span>
                      <strong>joydeepbarik007@gmail.com</strong>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ==============================================================
               3. BUS VIEW (Custom SkyRoute Design)
               ============================================================== */}
            {activeType === "bus" && (
              <>
                <article className="td-journey-card">
                  <div className="td-journey-header">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="td-service-tag" style={{ background: "#dcfce7", color: "#15803d" }}>
                          Volvo AC Sleeper (2+1)
                        </span>
                        <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Confirmed ✓</span>
                      </div>
                      <h2 className="td-route-title" style={{ marginTop: "4px" }}>
                        Kolkata (Babughat) ➔ Puri (Near Stand)
                      </h2>
                      <div className="td-meta-sub">
                        Mon, 30 Nov 2026 • Dolphin Tours and Travels • Overnight Journey
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>Dolphin Express</strong>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Bus No: WB-02-AK-9142</div>
                    </div>
                  </div>

                  {/* BUS TIMELINE */}
                  <div className="td-timeline-grid">
                    <div className="td-time-block">
                      <span className="td-sub-info">Mon, 30 Nov</span>
                      <span className="td-time-val">21:20</span>
                      <span className="td-station-title">Kolkata - Babughat</span>
                      <span className="td-sub-info">Gate 2 Express Pickup Bay</span>
                    </div>

                    <div className="td-track-col">
                      <span className="td-duration-pill">10h 00m</span>
                      <div className="td-track-line">
                        <span style={{ fontSize: "12px" }}>🚌</span>
                        <div className="td-track-bar" style={{ background: "#16a34a" }} />
                        <span style={{ fontSize: "12px" }}>🏁</span>
                      </div>
                      <span style={{ fontSize: "10.5px", color: "#64748b" }}>Overnight Highway</span>
                    </div>

                    <div className="td-time-block is-dest">
                      <span className="td-sub-info">Tue, 01 Dec</span>
                      <span className="td-time-val">07:20</span>
                      <span className="td-station-title">Puri - Main Stand</span>
                      <span className="td-sub-info">Platform 4 Express Terminus</span>
                    </div>
                  </div>

                  {/* BUS PASSENGER MANIFEST (With CHANGED names!) */}
                  <div className="td-manifest-wrap">
                    <h3 className="td-manifest-title">Passenger Manifest &amp; Berths</h3>
                    <div className="td-table-box">
                      <table className="td-table">
                        <thead>
                          <tr>
                            <th>Passenger</th>
                            <th>Gender &amp; Age</th>
                            <th>Seat / Berth</th>
                            <th>Boarding Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: "Joydeep Barik", meta: "Male, 26 yrs", seat: "Seat 19 (Lower Sleeper)" },
                            { name: "Ananya Sen", meta: "Female, 25 yrs", seat: "Seat 20 (Upper Sleeper)" },
                          ].map((p, idx) => (
                            <tr key={idx}>
                              <td><strong>{p.name}</strong></td>
                              <td>{p.meta}</td>
                              <td><strong style={{ color: "#16a34a" }}>{p.seat}</strong></td>
                              <td><span style={{ color: "#16a34a", fontWeight: 600 }}>Reserved ✓</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* BOARDING DETAILS & DRIVER CONTACT */}
                  <div style={{ marginTop: "14px", background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Bus Driver &amp; Conductor:</div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>Ramesh Kumar (+91 98301-22941)</strong>
                    </div>
                    <button
                      type="button"
                      className="td-btn-blue"
                      onClick={() => alert("Opening SkyRoute live GPS bus tracking map...")}
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      📍 Live GPS Bus Tracking
                    </button>
                  </div>
                </article>

                <div className="td-contact-card">
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>
                      Registered Contact
                    </h4>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                      M-Ticket SMS &amp; GPS pickup link delivered to:
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="td-contact-item">
                      <span>📞 Mobile:</span>
                      <strong>+91 9749708386</strong>
                    </div>
                    <div className="td-contact-item">
                      <span>✉️ Email:</span>
                      <strong>joydeepbarik007@gmail.com</strong>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ==============================================================
               4. HOTEL VIEW (Custom SkyRoute Design)
               ============================================================== */}
            {activeType === "hotel" && (
              <>
                <article className="td-journey-card">
                  <div className="td-journey-header">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="td-service-tag" style={{ background: "#fef3c7", color: "#b45309" }}>
                          ⭐⭐⭐⭐⭐ 5-Star Luxury
                        </span>
                        <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Booking Confirmed ✓</span>
                      </div>
                      <h2 className="td-route-title" style={{ marginTop: "4px" }}>
                        The Grand Palace Beach Resort &amp; Spa
                      </h2>
                      <div className="td-meta-sub">
                        Puri Sea Beach Road, VIP Zone, Odisha - 752001 • Check-in: 12:00 PM | Check-out: 11:00 AM
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>Room 304</strong>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Deluxe Ocean View</div>
                    </div>
                  </div>

                  {/* STAY SUMMARY GRID */}
                  <div className="td-timeline-grid">
                    <div className="td-time-block">
                      <span className="td-sub-info">Check-In</span>
                      <span className="td-time-val">12:00 PM</span>
                      <span className="td-station-title">Tue, 10 Nov 2026</span>
                      <span className="td-sub-info">Front Desk Welcome Drink</span>
                    </div>

                    <div className="td-track-col">
                      <span className="td-duration-pill">3 Nights Stay</span>
                      <div className="td-track-line">
                        <span style={{ fontSize: "12px" }}>🏨</span>
                        <div className="td-track-bar" style={{ background: "#d97706" }} />
                        <span style={{ fontSize: "12px" }}>🌊</span>
                      </div>
                      <span style={{ fontSize: "10.5px", color: "#64748b" }}>2 Adults • 1 Room</span>
                    </div>

                    <div className="td-time-block is-dest">
                      <span className="td-sub-info">Check-Out</span>
                      <span className="td-time-val">11:00 AM</span>
                      <span className="td-station-title">Fri, 13 Nov 2026</span>
                      <span className="td-sub-info">Express Key Drop</span>
                    </div>
                  </div>

                  {/* GUEST MANIFEST TABLE (With CHANGED names!) */}
                  <div className="td-manifest-wrap">
                    <h3 className="td-manifest-title">Guest Details</h3>
                    <div className="td-table-box">
                      <table className="td-table">
                        <thead>
                          <tr>
                            <th>Guest Name</th>
                            <th>Role</th>
                            <th>Special Inclusions</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: "Joydeep Barik", role: "Primary Guest", inc: "Free Continental Breakfast" },
                            { name: "Ananya Sen", role: "Accompanying Guest", inc: "Beach Access & Pool" },
                          ].map((g, idx) => (
                            <tr key={idx}>
                              <td><strong>{g.name}</strong></td>
                              <td>{g.role}</td>
                              <td><strong style={{ color: "#d97706" }}>{g.inc}</strong></td>
                              <td><span style={{ color: "#16a34a", fontWeight: 600 }}>Confirmed ✓</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                    <button
                      type="button"
                      className="td-btn-blue"
                      onClick={() => alert("Downloading official Hotel Stay Voucher...")}
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      📥 Download Hotel Voucher
                    </button>
                    <button
                      type="button"
                      className="td-btn-blue-outline"
                      onClick={() => alert("Resort reception direct phone: +91 6752-224810")}
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      📞 Call Front Desk
                    </button>
                  </div>
                </article>

                <div className="td-contact-card">
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>
                      Registered Contact
                    </h4>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                      Check-in voucher &amp; digital room key delivered to:
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div className="td-contact-item">
                      <span>📞 Mobile:</span>
                      <strong>+91 9749708386</strong>
                    </div>
                    <div className="td-contact-item">
                      <span>✉️ Email:</span>
                      <strong>joydeepbarik007@gmail.com</strong>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function TripDetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "100px 20px", textAlign: "center" }}>Loading trip details...</div>}>
      <TripDetailsContent />
    </Suspense>
  );
}
