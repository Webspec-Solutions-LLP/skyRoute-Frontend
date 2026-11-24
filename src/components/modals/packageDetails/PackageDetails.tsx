"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./PackageDetails.css";

export interface PackageItem {
  id: string;
  title: string;
  destination: string;
  stateOrCountry: string;
  category: "hills" | "beach" | "international" | "honeymoon" | "heritage" | "adventure";
  duration: string;
  nights: number;
  days: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  badgeType?: "bestseller" | "trending" | "luxury" | "international";
  image: string;
  originalPrice: number;
  price: number;
  inclusions: {
    flights: boolean;
    hotels: string;
    meals: string;
    transfers: string;
    sightseeing: boolean;
  };
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
}

interface PackageDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: PackageItem | null;
  originCity?: string;
  onBookNow: (pkg: PackageItem) => void;
}

export default function PackageDetails({
  isOpen,
  onClose,
  packageData,
  originCity = "Kolkata",
  onBookNow,
}: PackageDetailsProps) {
  const [activeTab, setActiveTab] = useState<"itinerary" | "inclusions" | "hotels" | "policies">("itinerary");

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !packageData) return null;

  return (
    <div className="pkgd-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pkgd-modal" onClick={(e) => e.stopPropagation()}>
        {/* ===================================================================
            HERO HEADER WITH COVER IMAGE & QUICK INFO
            =================================================================== */}
        <div className="pkgd-hero">
          <Image
            src={packageData.image}
            alt={packageData.title}
            fill
            sizes="(max-width: 768px) 100vw, 750px"
            className="pkgd-hero-img"
            priority
          />
          <div className="pkgd-hero-overlay" />

          {/* Close Button */}
          <button
            type="button"
            className="pkgd-close-btn"
            onClick={onClose}
            aria-label="Close Package Details Modal"
          >
            ✕
          </button>

          {/* Badges and Duration */}
          <div className="pkgd-hero-top-meta">
            {packageData.badge && (
              <span className={`pkgd-badge ${packageData.badgeType || "bestseller"}`}>
                {packageData.badge}
              </span>
            )}
            <span className="pkgd-duration-tag">
              ⏱️ {packageData.duration}
            </span>
          </div>

          {/* Title & Location in Hero */}
          <div className="pkgd-hero-bottom-content">
            <span className="pkgd-hero-location">
              📍 {packageData.destination}, {packageData.stateOrCountry} • Ex-{originCity}
            </span>
            <h2 className="pkgd-hero-title">{packageData.title}</h2>
            <div className="pkgd-hero-ratings">
              <span className="pkgd-hero-star">★</span>
              <strong>{packageData.rating}</strong>
              <span>({packageData.reviewsCount} verified traveler reviews)</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            NAVIGATION TABS (Itinerary, Inclusions, Hotels & Transfers, Policies)
            =================================================================== */}
        <div className="pkgd-tabs-nav">
          <button
            type="button"
            className={`pkgd-tab-btn ${activeTab === "itinerary" ? "active" : ""}`}
            onClick={() => setActiveTab("itinerary")}
          >
            🗓️ Day-wise Itinerary
          </button>
          <button
            type="button"
            className={`pkgd-tab-btn ${activeTab === "inclusions" ? "active" : ""}`}
            onClick={() => setActiveTab("inclusions")}
          >
            ✨ What&apos;s Included
          </button>
          <button
            type="button"
            className={`pkgd-tab-btn ${activeTab === "hotels" ? "active" : ""}`}
            onClick={() => setActiveTab("hotels")}
          >
            🏨 Stays &amp; Transfers
          </button>
          <button
            type="button"
            className={`pkgd-tab-btn ${activeTab === "policies" ? "active" : ""}`}
            onClick={() => setActiveTab("policies")}
          >
            📋 Policies &amp; Terms
          </button>
        </div>

        {/* ===================================================================
            MODAL SCROLLABLE BODY (Scrollbar completely hidden as requested)
            =================================================================== */}
        <div className="pkgd-body-content">
          {/* TAB 1: ITINERARY */}
          {activeTab === "itinerary" && (
            <div className="pkgd-tab-panel">
              <div className="pkgd-panel-lead">
                <span className="pkgd-lead-badge">TOUR SCHEDULE</span>
                <h3>{packageData.days} Days / {packageData.nights} Nights Detailed Plan</h3>
                <p>Every activity, sightseeing transfer, and stay is coordinated by your SkyRoute trip manager.</p>
              </div>

              <div className="pkgd-timeline">
                {packageData.itinerary.map((dayItem) => (
                  <div key={dayItem.day} className="pkgd-timeline-step">
                    <div className="pkgd-step-marker">
                      <span className="pkgd-marker-text">D{dayItem.day}</span>
                    </div>
                    <div className="pkgd-step-card">
                      <div className="pkgd-step-header">
                        <span className="pkgd-day-pill">Day {dayItem.day}</span>
                        <h4 className="pkgd-step-title">{dayItem.title}</h4>
                      </div>
                      <p className="pkgd-step-desc">{dayItem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INCLUSIONS & EXCLUSIONS */}
          {activeTab === "inclusions" && (
            <div className="pkgd-tab-panel">
              <div className="pkgd-inclusions-grid">
                {/* Included Box */}
                <div className="pkgd-inc-box included">
                  <div className="pkgd-inc-box-header">
                    <span className="pkgd-inc-box-icon">✓</span>
                    <h4>What is Included in This Package</h4>
                  </div>
                  <ul className="pkgd-inc-list">
                    <li>
                      <span className="pkgd-check-dot">✓</span>
                      <div>
                        <strong>Roundtrip Flight Tickets</strong>
                        <p>Economy class confirmed return airfare from {originCity} with baggage.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-check-dot">✓</span>
                      <div>
                        <strong>Verified Hotel Accommodation</strong>
                        <p>{packageData.inclusions.hotels}.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-check-dot">✓</span>
                      <div>
                        <strong>Daily Meal Plan</strong>
                        <p>{packageData.inclusions.meals}.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-check-dot">✓</span>
                      <div>
                        <strong>Private Transportation</strong>
                        <p>{packageData.inclusions.transfers}.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-check-dot">✓</span>
                      <div>
                        <strong>Guided Sightseeing &amp; Tolls</strong>
                        <p>All driver allowances, parking charges, fuel, and state entry taxes included.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-check-dot">✓</span>
                      <div>
                        <strong>24/7 Dedicated Trip Concierge</strong>
                        <p>Personal on-ground support executive throughout the trip duration.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Excluded Box */}
                <div className="pkgd-inc-box excluded">
                  <div className="pkgd-inc-box-header">
                    <span className="pkgd-inc-box-icon red">✕</span>
                    <h4>What is Not Included</h4>
                  </div>
                  <ul className="pkgd-inc-list">
                    <li>
                      <span className="pkgd-cross-dot">✕</span>
                      <div>
                        <strong>Personal Expenses</strong>
                        <p>Laundry, telephone calls, room service, alcoholic beverages.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-cross-dot">✕</span>
                      <div>
                        <strong>Optional Adventure Activities</strong>
                        <p>Scuba diving, paragliding, hot air ballooning unless specified in inclusions.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-cross-dot">✕</span>
                      <div>
                        <strong>Monument Entrance Fees</strong>
                        <p>Camera tickets and personal guide charges at historical monuments.</p>
                      </div>
                    </li>
                    <li>
                      <span className="pkgd-cross-dot">✕</span>
                      <div>
                        <strong>Early Check-in / Late Check-out</strong>
                        <p>Subject to hotel room availability at time of check-in.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STAYS & TRANSFERS */}
          {activeTab === "hotels" && (
            <div className="pkgd-tab-panel">
              <div className="pkgd-stay-cards-wrap">
                <div className="pkgd-stay-card">
                  <div className="pkgd-stay-lead">
                    <span className="pkgd-stay-type-icon">🏨</span>
                    <div>
                      <h4>Accommodation Standards</h4>
                      <p className="pkgd-stay-sub">Selected and audited by SkyRoute Quality Team</p>
                    </div>
                  </div>
                  <div className="pkgd-stay-features-grid">
                    <div className="pkgd-feature-box">
                      <span>Room Type</span>
                      <strong>Deluxe / Premium Mountain or Sea View</strong>
                    </div>
                    <div className="pkgd-feature-box">
                      <span>Meal Plan</span>
                      <strong>{packageData.inclusions.meals}</strong>
                    </div>
                    <div className="pkgd-feature-box">
                      <span>Hotel Rating</span>
                      <strong>4★ &amp; 5★ Verified Hospitality</strong>
                    </div>
                    <div className="pkgd-feature-box">
                      <span>Amenities</span>
                      <strong>Wi-Fi, AC, Heated Water, Swimming Pool</strong>
                    </div>
                  </div>
                </div>

                <div className="pkgd-stay-card">
                  <div className="pkgd-stay-lead">
                    <span className="pkgd-stay-type-icon">🚗</span>
                    <div>
                      <h4>Vehicle &amp; Transfer Specifications</h4>
                      <p className="pkgd-stay-sub">Safe, comfortable and sanitized travel</p>
                    </div>
                  </div>
                  <div className="pkgd-stay-features-grid">
                    <div className="pkgd-feature-box">
                      <span>Vehicle Type</span>
                      <strong>{packageData.inclusions.transfers}</strong>
                    </div>
                    <div className="pkgd-feature-box">
                      <span>Service Mode</span>
                      <strong>Dedicated Private Cab (No Sharing)</strong>
                    </div>
                    <div className="pkgd-feature-box">
                      <span>Chauffeur</span>
                      <strong>Police Verified &amp; Tourist Guide Certified</strong>
                    </div>
                    <div className="pkgd-feature-box">
                      <span>Tolls &amp; Parking</span>
                      <strong>100% Pre-paid by SkyRoute</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: POLICIES & TERMS */}
          {activeTab === "policies" && (
            <div className="pkgd-tab-panel">
              <div className="pkgd-policy-cards">
                <div className="pkgd-policy-card">
                  <h4>Cancellation &amp; Refund Policy</h4>
                  <ul className="pkgd-policy-bullets">
                    <li><strong>30+ Days Prior:</strong> 100% full refund with zero cancellation penalty.</li>
                    <li><strong>15 - 29 Days Prior:</strong> 80% refund of the total booking value.</li>
                    <li><strong>07 - 14 Days Prior:</strong> 50% refund or free date rescheduling option.</li>
                    <li><strong>Under 07 Days:</strong> Non-refundable due to airline and hotel blockages.</li>
                  </ul>
                </div>

                <div className="pkgd-policy-card">
                  <h4>Documents Required for Travel</h4>
                  <ul className="pkgd-policy-bullets">
                    <li>Government issued photo ID (Aadhaar / Voter ID / Passport) for all travelers.</li>
                    <li>Valid Passport &amp; UAE/Indonesian Visa for international packages (SkyRoute assists with processing).</li>
                  </ul>
                </div>

                <div className="pkgd-policy-card">
                  <h4>Payment &amp; EMI Options</h4>
                  <p>
                    Reserve today with just <strong>₹5,000 token advance</strong>. The remaining balance can be paid 10 days before travel or converted to convenient <strong>0% Interest EMI</strong> starting at ₹1,999/month.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================
            STICKY BOTTOM ACTION BAR (Price, Inclusions Summary, Book Button)
            =================================================================== */}
        <div className="pkgd-footer">
          <div className="pkgd-footer-price-block">
            <span className="pkgd-footer-original">₹{packageData.originalPrice.toLocaleString()}</span>
            <div className="pkgd-footer-price-row">
              <strong className="pkgd-footer-price-val">₹{packageData.price.toLocaleString()}</strong>
              <span className="pkgd-footer-unit">/ person</span>
            </div>
            <span className="pkgd-footer-tax-note">✓ Roundtrip Flights + Luxury Stay Included</span>
          </div>

          <div className="pkgd-footer-actions">
            <button
              type="button"
              className="pkgd-footer-cancel-btn"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="pkgd-footer-book-btn"
              onClick={() => onBookNow(packageData)}
            >
              <span>Book This Package</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
