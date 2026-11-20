"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "./BookingDetails.css";

type TripType = "one-way" | "round-trip";
type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";
type FareTier = "GO_SPECIAL" | "SAVER" | "FLEXI_PLUS";
type FlexibilityPlan = "none" | "zero_cancellation" | "assured_flex";

interface Passenger {
  id: string;
  type: "adult" | "child" | "infant";
  title: "Mr" | "Mrs" | "Ms" | "Master";
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  isSaved?: boolean;
  wheelchair: boolean;
}

interface StoredFlight {
  id: string;
  airlineName: string;
  airlineCode: string;
  airlineImage: string;
  flightNumber: string;
  aircraft: string;
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  durationMinutes: number;
  stops: number;
  stopCity?: string;
  basePrice: number;
  cabinBaggage: string;
  checkInBaggage: string;
  terminalFrom: string;
  terminalTo: string;
}

const DEFAULT_ONWARD: StoredFlight = {
  id: "onward-6E-2122",
  airlineName: "IndiGo",
  airlineCode: "6E",
  airlineImage: "/images/airline1.png",
  flightNumber: "6E 2122",
  aircraft: "Airbus A320neo",
  fromCode: "CCU",
  toCode: "NMI",
  departTime: "05:00",
  arriveTime: "07:50",
  durationMinutes: 170,
  stops: 0,
  basePrice: 4300,
  cabinBaggage: "7 kg per piece, 1 piece per adult",
  checkInBaggage: "15 kg per piece, 1 piece per adult",
  terminalFrom: "T1",
  terminalTo: "T1",
};

const AIRPORT_NAMES: Record<string, { city: string; full: string }> = {
  CCU: { city: "Kolkata", full: "Netaji Subhas Chandra Bose Intl Airport" },
  NMI: { city: "Navi Mumbai", full: "Navi Mumbai International Airport" },
  BOM: { city: "Mumbai", full: "Chhatrapati Shivaji Maharaj Intl Airport" },
  DEL: { city: "New Delhi", full: "Indira Gandhi International Airport" },
  BLR: { city: "Bengaluru", full: "Kempegowda International Airport" },
  HYD: { city: "Hyderabad", full: "Rajiv Gandhi International Airport" },
  MAA: { city: "Chennai", full: "Chennai International Airport" },
  GOI: { city: "Goa", full: "Manohar International Airport" },
  DXB: { city: "Dubai", full: "Dubai International Airport" },
  SIN: { city: "Singapore", full: "Singapore Changi Airport" },
};

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateStr;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getUTCDay()]}, ${parts[2]} ${months[parts[1] - 1]} ${parts[0]}`;
}

function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Route & search parameters
  const tripParam = (searchParams.get("trip") as TripType) || "one-way";
  const fromParam = searchParams.get("from") || "Kolkata (CCU)";
  const toParam = searchParams.get("to") || "Navi Mumbai (NMI)";
  const departParam = searchParams.get("depart") || "2026-12-14";
  const returnParam = searchParams.get("return") || "";
  const adultsParam = Math.max(1, Number(searchParams.get("adults") || "1") || 1);
  const childrenParam = Math.max(0, Number(searchParams.get("children") || "0") || 0);
  const infantsParam = Math.max(0, Number(searchParams.get("infants") || "0") || 0);
  const cabinParam = (searchParams.get("cabin") as CabinClass) || "Economy";
  const lockParam = searchParams.get("lock") === "1";

  // Hydrated flight data
  const [onwardFlight, setOnwardFlight] = useState<StoredFlight>(DEFAULT_ONWARD);
  const [returnFlight, setReturnFlight] = useState<StoredFlight | null>(null);

  // Fare options
  const [cabinCategory, setCabinCategory] = useState<"Economy" | "Upfront">("Economy");
  const [selectedFareTier, setSelectedFareTier] = useState<FareTier>("GO_SPECIAL");

  // Flexibility & Protection
  const [flexibilityPlan, setFlexibilityPlan] = useState<FlexibilityPlan>("none");
  const [priceDropProtection, setPriceDropProtection] = useState<boolean>(false);
  const [treeDonation, setTreeDonation] = useState<boolean>(false);
  const [priceLocked, setPriceLocked] = useState<boolean>(lockParam);

  // Promo code & Offers
  const [promoInput, setPromoInput] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>("SALE");
  const [promoError, setPromoError] = useState<string>("");

  // Saved passengers
  const [isSavedPassengerSelected, setIsSavedPassengerSelected] = useState<boolean>(true);

  // Passengers list state
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: "p-1",
      type: "adult",
      title: "Mr",
      firstName: "Joydeep",
      lastName: "Barik",
      gender: "Male",
      isSaved: true,
      wheelchair: false,
    },
  ]);

  // Contact Details
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [mobileNumber, setMobileNumber] = useState<string>("9749708386");
  const [email, setEmail] = useState<string>("joydeepbarik007@gmail.com");
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

  // GST details
  const [hasGst, setHasGst] = useState<boolean>(false);
  const [gstin, setGstin] = useState<string>("");
  const [gstCompanyName, setGstCompanyName] = useState<string>("");
  const [gstAddress, setGstAddress] = useState<string>("");

  // Billing address
  const [pincode, setPincode] = useState<string>("700052");
  const [billingAddress, setBillingAddress] = useState<string>("Block AC, Sector 1, Salt Lake City");
  const [billingCity, setBillingCity] = useState<string>("Kolkata");
  const [billingState, setBillingState] = useState<string>("West Bengal");

  // Modals & Drawers
  const [policyModalOpen, setPolicyModalOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Hydrate from sessionStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("skyroute_booking_details");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.selectedOnward) {
            setOnwardFlight({
              id: parsed.selectedOnward.id,
              airlineName: parsed.selectedOnward.airlineName,
              airlineCode: parsed.selectedOnward.airlineCode,
              airlineImage: parsed.selectedOnward.airlineImage,
              flightNumber: parsed.selectedOnward.flightNumber,
              aircraft: parsed.selectedOnward.aircraft,
              fromCode: parsed.selectedOnward.fromCode,
              toCode: parsed.selectedOnward.toCode,
              departTime: parsed.selectedOnward.departTime,
              arriveTime: parsed.selectedOnward.arriveTime,
              durationMinutes: parsed.selectedOnward.durationMinutes,
              stops: parsed.selectedOnward.stops,
              stopCity: parsed.selectedOnward.stopCity,
              basePrice: parsed.selectedOnward.basePrice || 4300,
              cabinBaggage: parsed.selectedOnward.cabinBaggage || "7 kg",
              checkInBaggage: parsed.selectedOnward.checkInBaggage || "15 kg",
              terminalFrom: parsed.selectedOnward.terminalFrom || "T1",
              terminalTo: parsed.selectedOnward.terminalTo || "T1",
            });
          }
          if (parsed.selectedReturn) {
            setReturnFlight({
              id: parsed.selectedReturn.id,
              airlineName: parsed.selectedReturn.airlineName,
              airlineCode: parsed.selectedReturn.airlineCode,
              airlineImage: parsed.selectedReturn.airlineImage,
              flightNumber: parsed.selectedReturn.flightNumber,
              aircraft: parsed.selectedReturn.aircraft,
              fromCode: parsed.selectedReturn.fromCode,
              toCode: parsed.selectedReturn.toCode,
              departTime: parsed.selectedReturn.departTime,
              arriveTime: parsed.selectedReturn.arriveTime,
              durationMinutes: parsed.selectedReturn.durationMinutes,
              stops: parsed.selectedReturn.stops,
              stopCity: parsed.selectedReturn.stopCity,
              basePrice: parsed.selectedReturn.basePrice || 4500,
              cabinBaggage: parsed.selectedReturn.cabinBaggage || "7 kg",
              checkInBaggage: parsed.selectedReturn.checkInBaggage || "15 kg",
              terminalFrom: parsed.selectedReturn.terminalFrom || "T2",
              terminalTo: parsed.selectedReturn.terminalTo || "T1",
            });
          }
          if (parsed.priceLockEnabled) {
            setPriceLocked(true);
          }
        }
      } catch (e) {
        console.error("Failed parsing stored flight", e);
      }
    }
  }, []);

  // Sync passengers count with adultsParam
  useEffect(() => {
    const totalRequired = adultsParam + childrenParam;
    if (totalRequired > 1 && passengers.length < totalRequired) {
      const extraList: Passenger[] = [];
      for (let i = passengers.length; i < totalRequired; i++) {
        const isChild = i >= adultsParam;
        extraList.push({
          id: `p-${i + 1}`,
          type: isChild ? "child" : "adult",
          title: isChild ? "Master" : "Mr",
          firstName: "",
          lastName: "",
          gender: "Male",
          wheelchair: false,
        });
      }
      setPassengers((prev) => [...prev, ...extraList]);
    }
  }, [adultsParam, childrenParam, passengers.length]);

  // Airport helpers
  const originInfo = useMemo(() => {
    return AIRPORT_NAMES[onwardFlight.fromCode] || { city: "Kolkata", full: "Netaji Subhas Chandra Bose Intl Airport" };
  }, [onwardFlight.fromCode]);

  const destInfo = useMemo(() => {
    return AIRPORT_NAMES[onwardFlight.toCode] || { city: "Navi Mumbai", full: "Navi Mumbai International Airport" };
  }, [onwardFlight.toCode]);

  // Dynamic Fare calculation
  const totalSeated = adultsParam + childrenParam;
  const baseTicket = onwardFlight.basePrice;
  const returnTicket = returnFlight ? returnFlight.basePrice : 0;
  const rawBase = (baseTicket + returnTicket) * totalSeated;

  // Fare Tier Delta
  const tierPriceDelta = useMemo(() => {
    if (selectedFareTier === "SAVER") return 23 * totalSeated;
    if (selectedFareTier === "FLEXI_PLUS") return 621 * totalSeated;
    return 0; // GO_SPECIAL is baseline
  }, [selectedFareTier, totalSeated]);

  const upfrontDelta = cabinCategory === "Upfront" ? 892 * totalSeated : 0;

  // Flexibility add-on
  const flexibilityCost = useMemo(() => {
    if (flexibilityPlan === "zero_cancellation") return 1219 * totalSeated;
    if (flexibilityPlan === "assured_flex") return 1519 * totalSeated;
    return 0;
  }, [flexibilityPlan, totalSeated]);

  // Add-ons
  const priceDropCost = priceDropProtection ? 299 : 0;
  const treeCost = treeDonation ? 10 : 0;
  const lockCost = priceLocked ? 719 : 0;

  // Taxes & Surcharges (standard aviation regulatory & airport charges)
  const taxesAndFees = Math.round(rawBase * 0.38 + 989 * totalSeated);

  // Discount from applied promo
  const promoDiscount = useMemo(() => {
    if (appliedPromo === "SALE") return 400;
    if (appliedPromo === "IXRBLD") return 692;
    if (appliedPromo === "IDFCEMI6") return 750;
    if (appliedPromo === "SKYROUTE") return 500;
    return 0;
  }, [appliedPromo]);

  // Grand Total
  const finalPayable = Math.max(
    0,
    rawBase + tierPriceDelta + upfrontDelta + taxesAndFees + flexibilityCost + priceDropCost + treeCost + lockCost - promoDiscount
  );

  // Handle Saved Passenger Toggle
  const handleToggleSavedPassenger = (checked: boolean) => {
    setIsSavedPassengerSelected(checked);
    setPassengers((prev) => {
      const copy = [...prev];
      if (checked) {
        copy[0] = {
          ...copy[0],
          title: "Mr",
          firstName: "Joydeep",
          lastName: "Barik",
          gender: "Male",
          isSaved: true,
        };
      } else {
        copy[0] = {
          ...copy[0],
          firstName: "",
          lastName: "",
          isSaved: false,
        };
      }
      return copy;
    });
  };

  // Passenger update handler
  const updatePassenger = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Add new passenger
  const handleAddPassenger = () => {
    const nextIdx = passengers.length + 1;
    setPassengers((prev) => [
      ...prev,
      {
        id: `p-${nextIdx}`,
        type: "adult",
        title: "Mr",
        firstName: "",
        lastName: "",
        gender: "Male",
        wheelchair: false,
      },
    ]);
  };

  // Remove passenger
  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Promo code apply
  const handleApplyPromo = (code: string) => {
    setPromoError("");
    const clean = code.trim().toUpperCase();
    if (["SALE", "IXRBLD", "IDFCEMI6", "SKYROUTE"].includes(clean)) {
      setAppliedPromo(clean);
      setPromoInput("");
    } else {
      setPromoError("Invalid promo code. Try SALE, IXRBLD, IDFCEMI6 or SKYROUTE.");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengers[0].firstName || !passengers[0].lastName) {
      alert("Please enter the primary passenger's full name as per Govt ID.");
      return;
    }
    if (!mobileNumber || mobileNumber.length < 10) {
      alert("Please provide a valid 10-digit mobile number.");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Please provide a valid email address.");
      return;
    }
    setCheckoutModalOpen(true);
  };

  return (
    <div className="sr-booking-page">
      {/* 1. Header Navigation Bar / Step Indicator */}
      <section className="sr-booking-header">
        <div className="sr-booking-container">
          <div className="sr-stepper-row">
            <Link href="/allFlights" className="sr-back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Flights</span>
            </Link>

            <div className="sr-flow-steps">
              <div className="sr-step is-complete">
                <span className="sr-step-badge">✓</span>
                <span className="sr-step-text">Flight Select</span>
              </div>
              <span className="sr-step-divider" />
              <div className="sr-step is-active">
                <span className="sr-step-badge">2</span>
                <span className="sr-step-text">Passenger &amp; Review</span>
              </div>
              <span className="sr-step-divider" />
              <div className="sr-step">
                <span className="sr-step-badge">3</span>
                <span className="sr-step-text">Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Content Layout (Left: Review & Forms, Right: Live Fare Breakdown) */}
      <div className="sr-booking-container sr-main-layout">
        {/* LEFT COLUMN */}
        <div className="sr-left-column">
          {/* Smart Airport Advisory Alert */}
          <div className="sr-airport-alert">
            <div className="sr-alert-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>
            <div className="sr-alert-body">
              <strong>Airport Advisory</strong>
              <p>
                You searched for a flight to <strong>BOM (Mumbai Chhatrapati Shivaji International Airport)</strong>, but you have selected <strong>NMI (Navi Mumbai International Airport)</strong> as your destination airport.
              </p>
            </div>
          </div>

          {/* Section 1: Flight Summary Card */}
          <section className="sr-card sr-flight-recap-card">
            <div className="sr-card-head">
              <div className="sr-head-left">
                <h2>{originInfo.city} → {destInfo.city}</h2>
                <div className="sr-head-meta">
                  <span>{formatDisplayDate(departParam)}</span>
                  <span className="sr-dot-sep">•</span>
                  <span>{onwardFlight.stops === 0 ? "Non-stop" : `${onwardFlight.stops} Stop`}</span>
                  <span className="sr-dot-sep">•</span>
                  <span>{formatDuration(onwardFlight.durationMinutes)}</span>
                  <span className="sr-dot-sep">•</span>
                  <span className="sr-cabin-tag">{cabinCategory} • {selectedFareTier.replace("_", " ")}</span>
                </div>
              </div>
              <div className="sr-head-right">
                <span className="sr-badge-cancel">Cancellation Fees Apply</span>
                <button
                  type="button"
                  className="sr-link-policy"
                  onClick={() => setPolicyModalOpen(true)}
                >
                  View Fare Rules
                </button>
              </div>
            </div>

            {/* Flight Segment Details */}
            <div className="sr-flight-segment">
              <div className="sr-airline-row">
                <div className="sr-airline-meta">
                  <Image
                    src={onwardFlight.airlineImage}
                    alt={onwardFlight.airlineName}
                    width={32}
                    height={32}
                    className="sr-airline-logo"
                  />
                  <div className="sr-airline-name-box">
                    <strong>{onwardFlight.airlineName}</strong>
                    <span>{onwardFlight.flightNumber}</span>
                  </div>
                  <span className="sr-ontime-pill">100% On-time</span>
                </div>
                <div className="sr-aircraft-spec">
                  <span>{onwardFlight.aircraft}</span>
                  <span className="sr-dot-sep">•</span>
                  <span>Standard Pitch (30&quot;)</span>
                </div>
              </div>

              {/* Boarding times and path */}
              <div className="sr-segment-times">
                <div className="sr-time-block">
                  <span className="sr-time-val">{onwardFlight.departTime}</span>
                  <strong className="sr-port-code">{onwardFlight.fromCode} — {originInfo.city}</strong>
                  <span className="sr-port-name">{originInfo.full} (Terminal {onwardFlight.terminalFrom})</span>
                </div>

                <div className="sr-duration-path">
                  <span className="sr-duration-label">{formatDuration(onwardFlight.durationMinutes)}</span>
                  <div className="sr-path-graphic">
                    <span className="sr-circle" />
                    <span className="sr-bar" />
                    <span className="sr-plane-icon">✈</span>
                    <span className="sr-bar" />
                    <span className="sr-circle is-fill" />
                  </div>
                  <span className="sr-stop-label">
                    {onwardFlight.stops === 0 ? "Direct Flight" : `${onwardFlight.stops} Stop`}
                  </span>
                </div>

                <div className="sr-time-block sr-time-end">
                  <span className="sr-time-val">{onwardFlight.arriveTime}</span>
                  <strong className="sr-port-code">{onwardFlight.toCode} — {destInfo.city}</strong>
                  <span className="sr-port-name">{destInfo.full} (Terminal {onwardFlight.terminalTo})</span>
                </div>
              </div>

              {/* Baggage allowance row */}
              <div className="sr-baggage-strip">
                <div className="sr-bag-item">
                  <span className="sr-bag-icon">🧳</span>
                  <span>Cabin: <strong>{onwardFlight.cabinBaggage}</strong></span>
                </div>
                <div className="sr-bag-item">
                  <span className="sr-bag-icon">💼</span>
                  <span>Check-in: <strong>{onwardFlight.checkInBaggage}</strong></span>
                </div>
              </div>
            </div>

            {/* Visual Cancellation & Date Change Policy Timeline Bar (Screenshots 1 & 6) */}
            <div className="sr-cancellation-policy-box">
              <div className="sr-policy-head">
                <div className="sr-policy-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Refund on Cancellation &amp; Date Change Policy</span>
                </div>
                <button
                  type="button"
                  className="sr-view-policy-btn"
                  onClick={() => setPolicyModalOpen(true)}
                >
                  Cancellation &amp; Rescheduling Policy &gt;
                </button>
              </div>

              <div className="sr-sector-label">{onwardFlight.fromCode} – {onwardFlight.toCode}</div>

              {/* Stepped Timeline */}
              <div className="sr-timeline-container">
                <div className="sr-timeline-track">
                  <div className="sr-track-segment is-green" />
                  <div className="sr-track-segment is-amber" />
                  <div className="sr-track-segment is-red" />
                </div>

                <div className="sr-timeline-nodes">
                  <div className="sr-time-node">
                    <span className="sr-node-pin is-green" />
                    <div className="sr-node-refund">₹1,924 refund</div>
                    <div className="sr-node-date">Now</div>
                    <div className="sr-node-penalty">(₹4,699 fee)</div>
                  </div>

                  <div className="sr-time-node">
                    <span className="sr-node-pin is-amber" />
                    <div className="sr-node-refund">₹1,224 refund</div>
                    <div className="sr-node-date">3 Days Before</div>
                    <div className="sr-node-penalty">(₹5,399 fee)</div>
                  </div>

                  <div className="sr-time-node">
                    <span className="sr-node-pin is-red" />
                    <div className="sr-node-refund is-none">Non Refundable</div>
                    <div className="sr-node-date">&lt; 2h / Departure</div>
                    <div className="sr-node-penalty">(₹6,573 fee)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Fare Options / Fare Tier Selector (Screenshot 5) */}
          <section className="sr-card sr-fare-tiers-card">
            <div className="sr-fare-tabs-header">
              <div>
                <h2>Fare Options &amp; Amenities</h2>
                <p>Choose the fare tier that best fits your schedule and baggage needs</p>
              </div>
              <div className="sr-category-pill-group">
                <button
                  type="button"
                  className={`sr-cat-pill ${cabinCategory === "Economy" ? "is-active" : ""}`}
                  onClick={() => setCabinCategory("Economy")}
                >
                  Economy
                </button>
                <button
                  type="button"
                  className={`sr-cat-pill ${cabinCategory === "Upfront" ? "is-active" : ""}`}
                  onClick={() => setCabinCategory("Upfront")}
                >
                  <span className="sr-pill-star">★</span> IndiGo Upfront
                </button>
              </div>
            </div>

            {/* 3 Tier Cards */}
            <div className="sr-tiers-grid">
              {/* Card 1: GO SPECIAL */}
              <div
                className={`sr-tier-card ${selectedFareTier === "GO_SPECIAL" ? "is-selected" : ""}`}
                onClick={() => setSelectedFareTier("GO_SPECIAL")}
              >
                <div className="sr-tier-top">
                  <span className="sr-tier-badge">GO SPECIAL</span>
                  <div className="sr-tier-price">
                    <span className="sr-cut-price">₹7,272</span>
                    <strong>{formatInr(6922 + upfrontDelta)}</strong>
                    <small>per adult</small>
                  </div>
                </div>

                <div className="sr-tier-feature-list">
                  <div className="sr-feat">
                    <span className="sr-feat-check">✓</span>
                    <span>7 kg Cabin Baggage included</span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-check">✓</span>
                    <span>15 kg Check-in Baggage</span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-bullet">•</span>
                    <span>Cancellation fee from ₹4,299 (up to 3 days)</span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-bullet">•</span>
                    <span>Date change fee from ₹3,499 (up to 3 hrs)</span>
                  </div>
                </div>

                <div className="sr-tier-perk-banner">
                  <span className="sr-sparkle">✦</span>
                  <span>Benefits Worth ₹349 Included: Trip Secure</span>
                </div>

                <button
                  type="button"
                  className={`sr-tier-select-btn ${selectedFareTier === "GO_SPECIAL" ? "is-active" : ""}`}
                >
                  {selectedFareTier === "GO_SPECIAL" ? "Selected ✓" : "Select Go Special"}
                </button>
              </div>

              {/* Card 2: SAVER */}
              <div
                className={`sr-tier-card ${selectedFareTier === "SAVER" ? "is-selected" : ""}`}
                onClick={() => setSelectedFareTier("SAVER")}
              >
                <div className="sr-tier-top">
                  <span className="sr-tier-badge is-neutral">SAVER</span>
                  <div className="sr-tier-price">
                    <strong>{formatInr(6923 + upfrontDelta)}</strong>
                    <small>per adult</small>
                  </div>
                </div>

                <div className="sr-tier-feature-list">
                  <div className="sr-feat">
                    <span className="sr-feat-check">✓</span>
                    <span>7 kg Cabin Baggage</span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-check">✓</span>
                    <span>15 kg Check-in Baggage</span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-bullet">•</span>
                    <span>Standard cancellation fee ₹4,299</span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-bullet">•</span>
                    <span>Date change fee starts at ₹3,499</span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-bullet">•</span>
                    <span>Chargeable Standard Seats</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`sr-tier-select-btn ${selectedFareTier === "SAVER" ? "is-active" : ""}`}
                >
                  {selectedFareTier === "SAVER" ? "Selected ✓" : "Select Saver"}
                </button>
              </div>

              {/* Card 3: FLEXI PLUS */}
              <div
                className={`sr-tier-card is-recommended ${selectedFareTier === "FLEXI_PLUS" ? "is-selected" : ""}`}
                onClick={() => setSelectedFareTier("FLEXI_PLUS")}
              >
                <div className="sr-tier-top">
                  <span className="sr-tier-badge is-gold">FLEXI PLUS</span>
                  <div className="sr-tier-price">
                    <strong>{formatInr(7543 + upfrontDelta)}</strong>
                    <small>per adult</small>
                  </div>
                </div>

                <div className="sr-tier-feature-list">
                  <div className="sr-feat">
                    <span className="sr-feat-check">✓</span>
                    <span>7 kg Cabin + 15 kg Check-in</span>
                  </div>
                  <div className="sr-feat is-highlight">
                    <span className="sr-feat-check">✓</span>
                    <span><strong>Lower Cancellation Fee: ₹2,499</strong></span>
                  </div>
                  <div className="sr-feat is-highlight">
                    <span className="sr-feat-check">✓</span>
                    <span><strong>Lower Date Change Fee: ₹299</strong></span>
                  </div>
                  <div className="sr-feat is-highlight">
                    <span className="sr-feat-check">✓</span>
                    <span><strong>Complimentary Seat Selection</strong></span>
                  </div>
                  <div className="sr-feat">
                    <span className="sr-feat-check">✓</span>
                    <span>Complimentary In-flight Snack</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`sr-tier-select-btn ${selectedFareTier === "FLEXI_PLUS" ? "is-active" : ""}`}
                >
                  {selectedFareTier === "FLEXI_PLUS" ? "Selected ✓" : "Select Flexi Plus"}
                </button>
              </div>
            </div>

            {/* Price Drop Protection Checkbox (Screenshot 5) */}
            <div className="sr-protection-strip">
              <label className="sr-checkbox-row">
                <input
                  type="checkbox"
                  checked={priceDropProtection}
                  onChange={(e) => setPriceDropProtection(e.target.checked)}
                />
                <div className="sr-prot-content">
                  <div className="sr-prot-title">
                    <strong>Add Price Drop Protection</strong>
                    <span className="sr-prot-price">@ ₹299 per trip</span>
                  </div>
                  <p>See a fare drop before departure? SkyRoute automatically refunds the difference!</p>
                </div>
              </label>
            </div>
          </section>

          {/* Section 3: Add Free Cancellation / Rescheduling (Screenshots 2 & 7) */}
          <section className="sr-card sr-flexibility-card">
            <div className="sr-flex-head">
              <div>
                <h2>Add Flexibility &amp; Free Cancellation</h2>
                <p>Trusted by over 4 million Indian travellers</p>
              </div>
              <span className="sr-flex-badge">SkyRoute Assured</span>
            </div>

            <div className="sr-flex-options-grid">
              {/* Option 1: Standard / None */}
              <label className={`sr-flex-option ${flexibilityPlan === "none" ? "is-active" : ""}`}>
                <div className="sr-option-radio">
                  <input
                    type="radio"
                    name="flex-plan"
                    checked={flexibilityPlan === "none"}
                    onChange={() => setFlexibilityPlan("none")}
                  />
                </div>
                <div className="sr-option-body">
                  <strong>Standard Fare</strong>
                  <span>Standard cancellation &amp; reschedule fees apply as per airline policy</span>
                  <div className="sr-option-cost">₹0 extra</div>
                </div>
              </label>

              {/* Option 2: Free Cancellation (Zero Cancellation) */}
              <label className={`sr-flex-option ${flexibilityPlan === "zero_cancellation" ? "is-active" : ""}`}>
                <div className="sr-option-radio">
                  <input
                    type="radio"
                    name="flex-plan"
                    checked={flexibilityPlan === "zero_cancellation"}
                    onChange={() => setFlexibilityPlan("zero_cancellation")}
                  />
                </div>
                <div className="sr-option-body">
                  <div className="sr-flex-popular-tag">MOST POPULAR</div>
                  <strong>Free Cancellation (Zero Penalty)</strong>
                  <div className="sr-option-cost">@ ₹1,219 <small>/ traveller</small></div>
                  <ul className="sr-flex-list">
                    <li>✓ Instant refund of {formatInr(rawBase)}</li>
                    <li>✓ Cancel up to 24 hrs before departure</li>
                    <li>✓ No-questions-asked refund</li>
                    <li>✓ 24x7 priority customer service</li>
                  </ul>
                </div>
              </label>

              {/* Option 3: Free Cancellation + Rescheduling (Assured Flex) */}
              <label className={`sr-flex-option ${flexibilityPlan === "assured_flex" ? "is-active" : ""}`}>
                <div className="sr-option-radio">
                  <input
                    type="radio"
                    name="flex-plan"
                    checked={flexibilityPlan === "assured_flex"}
                    onChange={() => setFlexibilityPlan("assured_flex")}
                  />
                </div>
                <div className="sr-option-body">
                  <div className="sr-flex-flex-tag">ASSURED FLEX</div>
                  <strong>Free Cancellation + Rescheduling</strong>
                  <div className="sr-option-cost">@ ₹1,519 <small>/ traveller</small></div>
                  <ul className="sr-flex-list">
                    <li>✓ Instant full refund of {formatInr(rawBase)}</li>
                    <li>✓ Change date, airline &amp; sector for FREE up to 24 hrs before departure</li>
                    <li>✓ Save up to ₹3,899 in airline penalties</li>
                    <li>✓ 24x7 priority customer support</li>
                  </ul>
                </div>
              </label>
            </div>
          </section>

          {/* Section 4: Traveller Details Form (Screenshot 3) */}
          <section className="sr-card sr-travellers-card">
            <div className="sr-card-head">
              <div>
                <h2>Traveller Details</h2>
                <p>Choose from saved travellers or add a new passenger</p>
              </div>
              <span className="sr-trav-counter">{passengers.length} Traveller{passengers.length > 1 ? "s" : ""}</span>
            </div>

            {/* Govt ID notice alert */}
            <div className="sr-id-alert">
              <span className="sr-id-icon">🪪</span>
              <span>
                Please enter your full name exactly as it appears on your government-issued ID (such as Aadhaar, Passport, or Voter ID).
              </span>
            </div>

            {/* Saved Passengers Quick Select Checkbox */}
            <div className="sr-saved-passengers-box">
              <span className="sr-saved-title">Adults (12 yrs or above)</span>
              <label className="sr-saved-checkbox-item">
                <input
                  type="checkbox"
                  checked={isSavedPassengerSelected}
                  onChange={(e) => handleToggleSavedPassenger(e.target.checked)}
                />
                <div className="sr-saved-name-pill">
                  <strong>Mr Joydeep Barik</strong>
                  <span className="sr-saved-sub">Aadhaar Verified</span>
                </div>
              </label>
            </div>

            {/* Passenger Forms */}
            <div className="sr-passenger-forms-list">
              {passengers.map((p, idx) => (
                <div key={p.id} className="sr-passenger-block">
                  <div className="sr-pass-header-row">
                    <div className="sr-pass-title">
                      <span className="sr-pass-num-pill">{idx + 1}</span>
                      <strong>{p.type === "adult" ? `Adult ${idx + 1}` : `Child ${idx - adultsParam + 1}`}</strong>
                      {p.isSaved && <span className="sr-pass-saved-chip">Saved Profile</span>}
                    </div>
                    {idx > 0 && (
                      <button
                        type="button"
                        className="sr-remove-pass-btn"
                        onClick={() => handleRemovePassenger(idx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="sr-pass-grid">
                    {/* Gender Title */}
                    <div className="sr-field-box sr-title-field">
                      <label className="sr-label">Title</label>
                      <select
                        className="sr-input"
                        value={p.title}
                        onChange={(e) => updatePassenger(idx, "title", e.target.value)}
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>

                    {/* First & Middle Name */}
                    <div className="sr-field-box">
                      <label className="sr-label">First &amp; Middle Name</label>
                      <input
                        type="text"
                        className="sr-input"
                        placeholder="Enter first and middle name"
                        value={p.firstName}
                        onChange={(e) => updatePassenger(idx, "firstName", e.target.value)}
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div className="sr-field-box">
                      <label className="sr-label">Last Name</label>
                      <input
                        type="text"
                        className="sr-input"
                        placeholder="Enter last name"
                        value={p.lastName}
                        onChange={(e) => updatePassenger(idx, "lastName", e.target.value)}
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="sr-field-box sr-gender-field">
                      <label className="sr-label">Gender</label>
                      <div className="sr-gender-pills">
                        <button
                          type="button"
                          className={`sr-gender-btn ${p.gender === "Male" ? "is-active" : ""}`}
                          onClick={() => updatePassenger(idx, "gender", "Male")}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`sr-gender-btn ${p.gender === "Female" ? "is-active" : ""}`}
                          onClick={() => updatePassenger(idx, "gender", "Female")}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Wheelchair option */}
                  <label className="sr-wheelchair-check">
                    <input
                      type="checkbox"
                      checked={p.wheelchair}
                      onChange={(e) => updatePassenger(idx, "wheelchair", e.target.checked)}
                    />
                    <span>Request Wheelchair Assistance at Airport</span>
                  </label>
                </div>
              ))}

              <button
                type="button"
                className="sr-add-pass-btn"
                onClick={handleAddPassenger}
              >
                + Add Another Passenger
              </button>
            </div>
          </section>

          {/* Section 5: Contact Details (Screenshot 3) */}
          <section className="sr-card sr-contact-card">
            <div className="sr-card-head">
              <div>
                <h2>Contact Details</h2>
                <p>Your ticket, invoice, and real-time flight updates will be sent here</p>
              </div>
            </div>

            <div className="sr-contact-grid">
              <div className="sr-field-box sr-code-box">
                <label className="sr-label">Country Code</label>
                <select
                  className="sr-input"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">India (+91)</option>
                  <option value="+1">USA / Canada (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+971">UAE (+971)</option>
                  <option value="+65">Singapore (+65)</option>
                </select>
              </div>

              <div className="sr-field-box sr-phone-box">
                <label className="sr-label">Mobile Number</label>
                <input
                  type="tel"
                  className="sr-input"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <div className="sr-field-box sr-email-box">
                <label className="sr-label">Email Address</label>
                <input
                  type="email"
                  className="sr-input"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <label className="sr-whatsapp-toggle">
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => setWhatsappUpdates(e.target.checked)}
              />
              <span className="sr-whatsapp-label">
                <span className="sr-wa-icon">💬</span>
                <span>Send booking confirmation &amp; boarding pass updates via WhatsApp</span>
              </span>
            </label>
          </section>

          {/* Section 6: GST Details (Screenshot 4) */}
          <section className="sr-card sr-gst-card">
            <div className="sr-toggle-row">
              <div className="sr-toggle-info">
                <h2>GST Details (Optional)</h2>
                <p>To claim credit of GST charged by airlines, enter your GST details</p>
              </div>
              <label className="sr-switch">
                <input
                  type="checkbox"
                  checked={hasGst}
                  onChange={(e) => setHasGst(e.target.checked)}
                />
                <span className="sr-slider" />
              </label>
            </div>

            {hasGst && (
              <div className="sr-gst-form-grid">
                <div className="sr-field-box">
                  <label className="sr-label">GSTIN Number</label>
                  <input
                    type="text"
                    className="sr-input"
                    placeholder="e.g. 19AAECB1234F1Z8"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    maxLength={15}
                  />
                </div>
                <div className="sr-field-box">
                  <label className="sr-label">Registered Company Name</label>
                  <input
                    type="text"
                    className="sr-input"
                    placeholder="e.g. SkyRoute Enterprises Ltd."
                    value={gstCompanyName}
                    onChange={(e) => setGstCompanyName(e.target.value)}
                  />
                </div>
                <div className="sr-field-box sr-full-width">
                  <label className="sr-label">Company Address</label>
                  <input
                    type="text"
                    className="sr-input"
                    placeholder="Registered address for tax invoice"
                    value={gstAddress}
                    onChange={(e) => setGstAddress(e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Section 7: Mandatory Billing Address (Screenshot 4) */}
          <section className="sr-card sr-billing-card">
            <div className="sr-card-head">
              <div>
                <h2>Billing Address</h2>
                <p>As per the latest Indian aviation regulations, it is mandatory to provide your address</p>
              </div>
            </div>

            <div className="sr-billing-grid">
              <div className="sr-field-box">
                <label className="sr-label">Pincode</label>
                <input
                  type="text"
                  className="sr-input"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <div className="sr-field-box sr-address-long">
                <label className="sr-label">Street / House Address</label>
                <input
                  type="text"
                  className="sr-input"
                  placeholder="Enter street or house address"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  required
                />
              </div>

              <div className="sr-field-box">
                <label className="sr-label">City</label>
                <input
                  type="text"
                  className="sr-input"
                  placeholder="Enter city"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                  required
                />
              </div>

              <div className="sr-field-box">
                <label className="sr-label">State</label>
                <input
                  type="text"
                  className="sr-input"
                  placeholder="Enter state"
                  value={billingState}
                  onChange={(e) => setBillingState(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Fare Summary & Promocodes */}
        <aside className="sr-right-column">
          <div className="sr-sticky-rail">
            {/* 1. Fare Summary Card (Screenshots 1 & 6) */}
            <div className="sr-card sr-fare-summary-card">
              <div className="sr-fare-card-head">
                <div>
                  <h3>Fare Summary</h3>
                  <span className="sr-pax-count">{totalSeated} Traveller{totalSeated > 1 ? "s" : ""}</span>
                </div>
                <span className="sr-fare-type-badge">
                  {flexibilityPlan !== "none" ? "100% Refundable" : "Partially Refundable"}
                </span>
              </div>

              <div className="sr-fare-breakdown-list">
                <div className="sr-break-row">
                  <span>Base Fare ({totalSeated} adult{totalSeated > 1 ? "s" : ""})</span>
                  <strong>{formatInr(rawBase)}</strong>
                </div>

                {tierPriceDelta > 0 && (
                  <div className="sr-break-row">
                    <span>{selectedFareTier.replace("_", " ")} Upgrade</span>
                    <strong>+{formatInr(tierPriceDelta)}</strong>
                  </div>
                )}

                {upfrontDelta > 0 && (
                  <div className="sr-break-row">
                    <span>IndiGo Upfront Seats</span>
                    <strong>+{formatInr(upfrontDelta)}</strong>
                  </div>
                )}

                <div className="sr-break-row">
                  <span>Taxes &amp; Airport Surcharges</span>
                  <strong>{formatInr(taxesAndFees)}</strong>
                </div>

                {flexibilityCost > 0 && (
                  <div className="sr-break-row">
                    <span>
                      {flexibilityPlan === "zero_cancellation" ? "Free Cancellation" : "Assured Flex Reschedule"}
                    </span>
                    <strong>+{formatInr(flexibilityCost)}</strong>
                  </div>
                )}

                {priceDropCost > 0 && (
                  <div className="sr-break-row">
                    <span>Price Drop Protection</span>
                    <strong>+{formatInr(priceDropCost)}</strong>
                  </div>
                )}

                {treeCost > 0 && (
                  <div className="sr-break-row">
                    <span>Green Tree Donation</span>
                    <strong>+{formatInr(treeCost)}</strong>
                  </div>
                )}

                {lockCost > 0 && (
                  <div className="sr-break-row">
                    <span>24h Fare Lock Guarantee</span>
                    <strong>+{formatInr(lockCost)}</strong>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="sr-break-row is-savings">
                    <span>Coupon Discount ({appliedPromo})</span>
                    <strong>−{formatInr(promoDiscount)}</strong>
                  </div>
                )}

                <div className="sr-fare-grand-row">
                  <div className="sr-grand-label">
                    <span>Total Amount</span>
                    <small>All taxes &amp; fees included</small>
                  </div>
                  <strong className="sr-grand-val">{formatInr(finalPayable)}</strong>
                </div>
              </div>

              {/* Price Lock button & Continue CTA */}
              <div className="sr-action-stack">
                <button
                  type="button"
                  className={`sr-lock-fare-btn ${priceLocked ? "is-active" : ""}`}
                  onClick={() => setPriceLocked((p) => !p)}
                >
                  <span className="sr-lock-icon">🔒</span>
                  <span>{priceLocked ? "Price Locked for 24h ✓" : "Lock Price @ ₹719"}</span>
                </button>

                <button
                  type="button"
                  className="sr-continue-btn"
                  onClick={handleCheckoutSubmit}
                >
                  <span>Continue to Payment</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="sr-security-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Safe &amp; Secure 256-Bit SSL Encrypted Payment</span>
              </div>
            </div>

            {/* 2. Offers For You / Promo Codes Card (Screenshots 1 & 6) */}
            <div className="sr-card sr-offers-card">
              <div className="sr-offers-head">
                <span className="sr-offer-tag-icon">🏷️</span>
                <h3>Offers &amp; Discounts</h3>
              </div>

              <div className="sr-coupon-input-group">
                <input
                  type="text"
                  placeholder="Have a promocode? Enter here"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="sr-coupon-input"
                />
                <button
                  type="button"
                  className="sr-apply-btn"
                  onClick={() => handleApplyPromo(promoInput)}
                >
                  Apply
                </button>
              </div>

              {promoError && <div className="sr-coupon-error">{promoError}</div>}

              {/* Promo choices list */}
              <div className="sr-coupon-choices">
                {/* Coupon SALE */}
                <label className={`sr-coupon-choice ${appliedPromo === "SALE" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="promo"
                    checked={appliedPromo === "SALE"}
                    onChange={() => handleApplyPromo("SALE")}
                  />
                  <div className="sr-coupon-text">
                    <div className="sr-coupon-code-row">
                      <strong>SALE</strong>
                      <span className="sr-coupon-save">₹400 Off</span>
                    </div>
                    <p>Coupon applied! Enjoy an instant discount of ₹400 on this booking.</p>
                  </div>
                </label>

                {/* Coupon IXRBLD */}
                <label className={`sr-coupon-choice ${appliedPromo === "IXRBLD" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="promo"
                    checked={appliedPromo === "IXRBLD"}
                    onChange={() => handleApplyPromo("IXRBLD")}
                  />
                  <div className="sr-coupon-text">
                    <div className="sr-coupon-code-row">
                      <strong>IXRBLD</strong>
                      <span className="sr-coupon-save">₹692 Off</span>
                    </div>
                    <p>Flat 10% Off up to ₹1,000 with RBL Bank Credit Card.</p>
                  </div>
                </label>

                {/* Coupon IDFCEMI6 */}
                <label className={`sr-coupon-choice ${appliedPromo === "IDFCEMI6" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="promo"
                    checked={appliedPromo === "IDFCEMI6"}
                    onChange={() => handleApplyPromo("IDFCEMI6")}
                  />
                  <div className="sr-coupon-text">
                    <div className="sr-coupon-code-row">
                      <strong>IDFCEMI6</strong>
                      <span className="sr-coupon-save">₹750 Off</span>
                    </div>
                    <p>Up to ₹5,000 Off with IDFC FIRST Bank Credit Card EMI.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Eco Tree Plantation Contribution (Screenshot 6) */}
            <div className="sr-card sr-eco-card">
              <label className="sr-eco-toggle">
                <input
                  type="checkbox"
                  checked={treeDonation}
                  onChange={(e) => setTreeDonation(e.target.checked)}
                />
                <div className="sr-eco-icon">🌱</div>
                <div className="sr-eco-text">
                  <strong>Plant a Tree Initiative</strong>
                  <span>Tap to contribute ₹10 towards plantation of 4 million trees</span>
                </div>
                <span className="sr-eco-cost">+₹10</span>
              </label>
            </div>
          </div>
        </aside>
      </div>

      {/* 3. Sticky Bottom Mobile Bar */}
      <div className="sr-mobile-bottom-bar">
        <div className="sr-mob-left">
          <div className="sr-mob-total">{formatInr(finalPayable)}</div>
          <span className="sr-mob-promo">Saved {formatInr(promoDiscount)}</span>
        </div>
        <button
          type="button"
          className="sr-mob-cta-btn"
          onClick={handleCheckoutSubmit}
        >
          Continue &gt;
        </button>
      </div>

      {/* Modal 1: Cancellation & Rescheduling Policy Modal */}
      {policyModalOpen && (
        <div className="sr-modal-overlay" onClick={() => setPolicyModalOpen(false)}>
          <div className="sr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sr-modal-top">
              <h3>Cancellation &amp; Rescheduling Policy</h3>
              <button
                type="button"
                className="sr-modal-close"
                onClick={() => setPolicyModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="sr-modal-content">
              <h4>{onwardFlight.fromCode} → {onwardFlight.toCode} ({onwardFlight.airlineName})</h4>
              <p>Review the airline refund guidelines and rescheduling slabs below:</p>

              <div className="sr-policy-table">
                <div className="sr-table-row sr-table-head">
                  <span>Timeframe Before Departure</span>
                  <span>Cancellation Penalty</span>
                  <span>Reschedule Penalty</span>
                </div>
                <div className="sr-table-row">
                  <span>More than 3 days (&gt;72 hrs)</span>
                  <strong>₹4,299 per passenger</strong>
                  <strong>₹3,499 + Fare Difference</strong>
                </div>
                <div className="sr-table-row">
                  <span>Within 72 hrs to 2 hrs</span>
                  <strong>₹5,399 per passenger</strong>
                  <strong>₹3,999 + Fare Difference</strong>
                </div>
                <div className="sr-table-row is-warn">
                  <span>Less than 2 hrs (No Show)</span>
                  <strong>Non-refundable (Only taxes refunded)</strong>
                  <strong>Not Permitted</strong>
                </div>
              </div>

              <div className="sr-modal-tip">
                💡 <strong>Tip:</strong> You can add <em>SkyRoute Assured Free Cancellation</em> to receive 100% instant refund with zero cancellation fee!
              </div>
            </div>
            <div className="sr-modal-bottom">
              <button
                type="button"
                className="sr-modal-done-btn"
                onClick={() => setPolicyModalOpen(false)}
              >
                Close &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Payment & Booking Confirmation Checkout Modal */}
      {checkoutModalOpen && (
        <div className="sr-modal-overlay" onClick={() => setCheckoutModalOpen(false)}>
          <div className="sr-modal-card sr-checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sr-modal-top">
              <h3>{bookingSuccess ? "Booking Confirmed!" : "Confirm & Pay"}</h3>
              <button
                type="button"
                className="sr-modal-close"
                onClick={() => {
                  setCheckoutModalOpen(false);
                  if (bookingSuccess) router.push("/allFlights");
                }}
              >
                ✕
              </button>
            </div>

            <div className="sr-modal-content">
              {bookingSuccess ? (
                <div className="sr-success-box">
                  <div className="sr-success-icon">✓</div>
                  <h4>Ticket Successfully Booked!</h4>
                  <p>
                    Your booking reference <strong>#SKR-{Math.floor(100000 + Math.random() * 900000)}</strong> has been confirmed.
                    E-ticket and invoice sent to <strong>{email}</strong>.
                  </p>
                  <div className="sr-confirmed-recap">
                    <div>
                      <span>Flight</span>
                      <strong>{onwardFlight.airlineName} {onwardFlight.flightNumber}</strong>
                    </div>
                    <div>
                      <span>Route</span>
                      <strong>{originInfo.city} ({onwardFlight.fromCode}) → {destInfo.city} ({onwardFlight.toCode})</strong>
                    </div>
                    <div>
                      <span>Passenger</span>
                      <strong>{passengers[0].firstName} {passengers[0].lastName}</strong>
                    </div>
                    <div>
                      <span>Amount Paid</span>
                      <strong>{formatInr(finalPayable)}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sr-checkout-flow">
                  <div className="sr-checkout-recap-bar">
                    <div>
                      <span>Flight Itinerary</span>
                      <strong>{originInfo.city} ({onwardFlight.fromCode}) → {destInfo.city} ({onwardFlight.toCode})</strong>
                    </div>
                    <div>
                      <span>Total Amount</span>
                      <strong className="sr-highlight-amt">{formatInr(finalPayable)}</strong>
                    </div>
                  </div>

                  <div className="sr-payment-methods">
                    <h4>Select Payment Method</h4>
                    <label className="sr-pay-option is-active">
                      <input type="radio" name="pay-method" defaultChecked />
                      <div className="sr-pay-label">
                        <strong>Instant UPI (Google Pay, PhonePe, Paytm)</strong>
                        <span>Zero payment gateway transaction fee</span>
                      </div>
                    </label>

                    <label className="sr-pay-option">
                      <input type="radio" name="pay-method" />
                      <div className="sr-pay-label">
                        <strong>Credit / Debit Card (Visa, Mastercard, RuPay)</strong>
                        <span>Safe &amp; fast bank checkout</span>
                      </div>
                    </label>

                    <label className="sr-pay-option">
                      <input type="radio" name="pay-method" />
                      <div className="sr-pay-label">
                        <strong>Net Banking</strong>
                        <span>All Indian major banks supported</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="sr-modal-bottom">
              {bookingSuccess ? (
                <button
                  type="button"
                  className="sr-modal-done-btn"
                  onClick={() => router.push("/allFlights")}
                >
                  Book Another Flight
                </button>
              ) : (
                <button
                  type="button"
                  className="sr-modal-pay-btn"
                  onClick={() => setBookingSuccess(true)}
                >
                  Pay {formatInr(finalPayable)} &amp; Issue Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="sr-booking-page">
          <div className="sr-booking-container sr-loading-state">
            Loading SkyRoute booking details…
          </div>
        </div>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}
