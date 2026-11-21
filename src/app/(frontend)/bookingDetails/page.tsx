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

function FlightBookingView() {
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

/* ==========================================================================
   2. BUS BOOKING VIEW (Differentiated Modern SkyRoute Theme)
   ========================================================================== */

interface BusStopPoint {
  time: string;
  name: string;
  landmark: string;
}

interface BusBookingData {
  busId: string;
  operator: string;
  coachName: string;
  isGovt: boolean;
  assured: boolean;
  rating: number;
  reviews: number;
  departTime: string;
  arriveTime: string;
  durationMinutes: number;
  price: number;
  originalPrice?: number;
  seats: string[];
  boarding: string;
  dropping: string;
  boardingTime?: string;
  droppingTime?: string;
  boardingLandmark?: string;
  droppingLandmark?: string;
  boardingPoints?: BusStopPoint[];
  droppingPoints?: BusStopPoint[];
  from: string;
  to: string;
  departDate: string;
  total: number;
}

interface BusPassenger {
  seat: string;
  fullName: string;
  age: string;
  gender: "Male" | "Female";
  isPrimary?: boolean;
}

const INDIAN_STATES = [
  "West Bengal",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Odisha",
  "Telangana",
  "Gujarat",
  "Uttar Pradesh",
  "Rajasthan",
  "Kerala",
  "Punjab",
  "Goa",
  "Haryana",
  "Bihar",
  "Assam",
];

function formatBusDate(isoDate: string): string {
  if (!isoDate) return "Mon, 30 Nov 2026";
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getUTCDay()]}, ${parts[2]} ${months[parts[1] - 1]} ${parts[0]}`;
}

function BusBookingView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query fallbacks
  const qBusId = searchParams.get("busId") || "sky-navigator-01";
  const qOperator = searchParams.get("operator") || "SkyLine Navigator Express";
  const qCoach = searchParams.get("coach") || "Volvo Multi-Axle AC Sleeper (2+1)";
  const qFrom = searchParams.get("from") || "Kolkata";
  const qTo = searchParams.get("to") || "Digha";
  const qDepartDate = searchParams.get("depart") || "2026-11-30";
  const qSeats = searchParams.get("seats") ? searchParams.get("seats")!.split(",") : ["L1"];
  const qFare = Number(searchParams.get("fare") || 896);
  const qBoarding = searchParams.get("boarding") || `${qFrom} Central Hub (Babughat Stand)`;
  const qDropping = searchParams.get("dropping") || `${qTo} Main Bus Terminus (Near Stand)`;
  const qDepartTime = searchParams.get("boardingTime") || searchParams.get("departTime") || "21:20";
  const qArriveTime = searchParams.get("droppingTime") || searchParams.get("arriveTime") || "07:20";
  const qDuration = Number(searchParams.get("duration") || 600);
  const qIsGovt = searchParams.get("isGovt") === "1";
  const qAssured = searchParams.get("assured") !== "0";

  // Hydrated bus data state
  const [busData, setBusData] = useState<BusBookingData>({
    busId: qBusId,
    operator: qOperator,
    coachName: qCoach,
    isGovt: qIsGovt,
    assured: qAssured,
    rating: 4.7,
    reviews: 312,
    departTime: qDepartTime,
    arriveTime: qArriveTime,
    durationMinutes: qDuration,
    price: qFare,
    originalPrice: qFare + 150,
    seats: qSeats,
    boarding: qBoarding,
    dropping: qDropping,
    boardingTime: qDepartTime,
    droppingTime: qArriveTime,
    boardingLandmark: "Gate 2 Express Pickup Bay",
    droppingLandmark: "City Center Platform 4",
    boardingPoints: [
      { time: qDepartTime, name: qBoarding, landmark: "Gate 2 Express Pickup Bay" },
      { time: "21:50", name: `${qFrom} Highway Bypass`, landmark: "Near SkyRoute Counter" },
    ],
    droppingPoints: [
      { time: "06:50", name: `${qTo} City Entry Plaza`, landmark: "Near Highway Crossing" },
      { time: qArriveTime, name: qDropping, landmark: "City Center Platform 4" },
    ],
    from: qFrom,
    to: qTo,
    departDate: qDepartDate,
    total: qSeats.length * qFare,
  });

  // Read from sessionStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("skyroute_bus_booking");
        if (stored) {
          const parsed = JSON.parse(stored) as BusBookingData;
          if (parsed && parsed.seats && parsed.seats.length > 0) {
            setBusData(parsed);
          }
        }
      } catch (err) {
        console.error("Error loading bus booking from sessionStorage:", err);
      }
    }
  }, []);

  // Boarding & Dropping Point selection
  const [selectedBoarding, setSelectedBoarding] = useState<string>(busData.boarding);
  const [selectedDropping, setSelectedDropping] = useState<string>(busData.dropping);

  useEffect(() => {
    setSelectedBoarding(busData.boarding);
    setSelectedDropping(busData.dropping);
  }, [busData.boarding, busData.dropping]);

  // Passengers list initialized per seat
  const [passengers, setPassengers] = useState<BusPassenger[]>(() => {
    return busData.seats.map((seatCode, idx) => ({
      seat: seatCode,
      fullName: idx === 0 ? "Joydeep Barik" : "",
      age: idx === 0 ? "26" : "",
      gender: "Male",
      isPrimary: idx === 0,
    }));
  });

  // Re-sync passengers when seats change
  useEffect(() => {
    if (busData.seats && busData.seats.length > 0) {
      setPassengers((prev) => {
        return busData.seats.map((seatCode, idx) => {
          const existing = prev.find((p) => p.seat === seatCode);
          if (existing) return existing;
          return {
            seat: seatCode,
            fullName: idx === 0 ? "Joydeep Barik" : "",
            age: idx === 0 ? "26" : "",
            gender: "Male",
            isPrimary: idx === 0,
          };
        });
      });
    }
  }, [busData.seats]);

  // SafeRide Protection state (default: true)
  const [withProtection, setWithProtection] = useState<boolean>(true);

  // Contact Details
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [mobileNumber, setMobileNumber] = useState<string>("9749708386");
  const [emailAddress, setEmailAddress] = useState<string>("joydeepbarik007@gmail.com");
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

  // Billing Address & State
  const [billingAddress, setBillingAddress] = useState<string>("Block AC, Sector 1, Salt Lake City");
  const [pincode, setPincode] = useState<string>("700052");
  const [billingState, setBillingState] = useState<string>("West Bengal");
  const [tripType, setTripType] = useState<"personal" | "business">("personal");
  const [gstin, setGstin] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [saveBillingProfile, setSaveBillingProfile] = useState<boolean>(true);

  // Offers & Promo Codes
  const [appliedPromo, setAppliedPromo] = useState<string | null>("SKYBUS");
  const [customPromoInput, setCustomPromoInput] = useState<string>("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>({
    text: "Code 'SKYBUS' applied! Flat ₹150 OFF",
    isError: false,
  });

  // Modals
  const [policyModalOpen, setPolicyModalOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<string>("upi");
  const [isProcessingPay, setIsProcessingPay] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedPnr, setConfirmedPnr] = useState<string>("");

  // Live Fare Calculations
  const seatCount = busData.seats.length || 1;
  const rawBaseFare = busData.price * seatCount;
  const protectionFee = withProtection ? 25 * seatCount : 0;
  const busGstAndService = Math.round(rawBaseFare * 0.05); // 5% GST

  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === "SKYBUS") return Math.min(150, rawBaseFare);
    if (appliedPromo === "GOPNB") return Math.round(rawBaseFare * 0.08);
    if (appliedPromo === "INDBANKVISACC") return Math.min(500, Math.round(rawBaseFare * 0.08));
    if (appliedPromo === "WBTC300" || appliedPromo === "RTC300") return 100;
    return 0;
  }, [appliedPromo, rawBaseFare]);

  const finalPayable = Math.max(0, rawBaseFare + protectionFee + busGstAndService - promoDiscount);

  // Passenger Update handler
  const handleUpdatePassenger = (
    index: number,
    field: keyof BusPassenger,
    value: string
  ) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Quick Autofill
  const handleAutofillPrimary = () => {
    setPassengers((prev) => {
      const copy = [...prev];
      if (copy[0]) {
        copy[0] = {
          ...copy[0],
          fullName: "Joydeep Barik",
          age: "26",
          gender: "Male",
        };
      }
      return copy;
    });
  };

  // Promo Code Apply
  const handleApplyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (["SKYBUS", "GOPNB", "INDBANKVISACC", "WBTC300", "RTC300"].includes(clean)) {
      setAppliedPromo(clean);
      setCustomPromoInput("");
      setPromoMessage({ text: `Code '${clean}' applied successfully!`, isError: false });
    } else {
      setPromoMessage({
        text: "Invalid promo code. Try SKYBUS, GOPNB, or WBTC300.",
        isError: true,
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoMessage(null);
  };

  // Submit and open payment modal
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.fullName.trim()) {
        alert(`Please enter the full name for Traveller ${i + 1} (Seat ${p.seat}).`);
        return;
      }
      if (!p.age.trim() || Number(p.age) < 1 || Number(p.age) > 110) {
        alert(`Please enter a valid age for Traveller ${i + 1} (Seat ${p.seat}).`);
        return;
      }
    }

    if (!mobileNumber || mobileNumber.trim().length < 10) {
      alert("Please provide a valid 10-digit mobile number for e-ticket delivery.");
      return;
    }

    if (!emailAddress || !emailAddress.includes("@")) {
      alert("Please enter a valid email address for e-ticket delivery.");
      return;
    }

    if (tripType === "business" && !gstin.trim()) {
      alert("Please enter your Company GSTIN or switch to Personal Trip.");
      return;
    }

    setCheckoutModalOpen(true);
  };

  // Complete Payment Action
  const handleConfirmPay = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      setBookingConfirmed(true);
      const generatedPnr = `SRB-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedPnr(generatedPnr);
    }, 1200);
  };

  return (
    <div className="skb-page-wrapper">
      {/* 1. TOP STICKY STEPPER & BACK NAVIGATION */}
      <section className="skb-top-nav">
        <div className="skb-container">
          <div className="skb-nav-bar">
            <Link
              href={`/allBus?from=${encodeURIComponent(busData.from)}&to=${encodeURIComponent(
                busData.to
              )}&depart=${encodeURIComponent(busData.departDate)}`}
              className="skb-back-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Buses</span>
            </Link>

            <div className="skb-stepper">
              <div className="skb-step-item is-done">
                <span className="skb-step-circle">✓</span>
                <span>Seat Selection</span>
              </div>
              <span className="skb-step-line" />
              <div className="skb-step-item is-active">
                <span className="skb-step-circle">2</span>
                <span>Passenger &amp; Review</span>
              </div>
              <span className="skb-step-line" />
              <div className="skb-step-item">
                <span className="skb-step-circle">3</span>
                <span>Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN WORKSPACE */}
      <div className="skb-container">
        <form onSubmit={handleProceedToPayment} className="skb-layout">
          {/* LEFT STACK */}
          <div className="skb-left-stack">
            {/* CARD 1: BUS TRIP & BOARDING PASS SUMMARY */}
            <article className="skb-card skb-bus-ticket-card">
              <div className="skb-ticket-banner">
                <div className="skb-bus-brand">
                  <div className="skb-bus-icon-wrap" aria-hidden="true">
                    🚍
                  </div>
                  <div>
                    <h1 className="skb-operator-title">
                      {busData.operator}
                      {busData.isGovt && <span className="skb-badge-govt">Official RTC</span>}
                    </h1>
                    <p className="skb-coach-subtitle">{busData.coachName}</p>
                  </div>
                </div>

                <div className="skb-ticket-meta-right">
                  {busData.assured && <span className="skb-badge-assured">SkyRoute Assured</span>}
                  <span className="skb-rating-pill">★ {busData.rating.toFixed(1)} ({busData.reviews})</span>
                </div>
              </div>

              {/* Seats strip with Cancellation Link */}
              <div className="skb-seats-strip">
                <div className="skb-seats-info">
                  <span>Seats Selected:</span>
                  {busData.seats.map((s) => (
                    <span key={s} className="skb-seat-chip">
                      💺 {s}
                    </span>
                  ))}
                  <span style={{ color: "#64748b", fontWeight: 400 }}>
                    ({busData.seats.length} {busData.seats.length === 1 ? "Seat" : "Seats"})
                  </span>
                </div>

                <button
                  type="button"
                  className="skb-policy-btn"
                  onClick={() => setPolicyModalOpen(true)}
                >
                  Cancellation Policy
                </button>
              </div>

              {/* Journey Route & Visual Timeline */}
              <div className="skb-journey-grid">
                {/* Boarding info */}
                <div className="skb-station-box">
                  <span className="skb-time-tag">
                    {busData.boardingTime || busData.departTime}, {formatBusDate(busData.departDate)}
                  </span>
                  <strong className="skb-station-name">{selectedBoarding}</strong>
                  <span className="skb-station-landmark">
                    {busData.boardingLandmark || "Main Bay / Counter"}
                  </span>
                </div>

                {/* Duration indicator */}
                <div className="skb-journey-duration">
                  <span className="skb-dur-pill">
                    {Math.floor(busData.durationMinutes / 60)}h {busData.durationMinutes % 60}m
                  </span>
                  <div className="skb-dur-track">
                    <span className="skb-dur-dot" />
                    <span className="skb-dur-icon">➔</span>
                    <span className="skb-dur-dot is-end" />
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Direct Express</span>
                </div>

                {/* Dropping info */}
                <div className="skb-station-box is-dest">
                  <span className="skb-time-tag is-arrive">
                    {busData.droppingTime || busData.arriveTime}, Next Day
                  </span>
                  <strong className="skb-station-name">{selectedDropping}</strong>
                  <span className="skb-station-landmark">
                    {busData.droppingLandmark || "Main Arrival Terminal"}
                  </span>
                </div>
              </div>

              {/* Interactive Pickup & Drop Selectors */}
              <div className="skb-station-selectors">
                <div className="skb-picker-field">
                  <label className="skb-picker-label">Boarding Point ({busData.from})</label>
                  <select
                    className="skb-picker-select"
                    value={selectedBoarding}
                    onChange={(e) => setSelectedBoarding(e.target.value)}
                  >
                    {busData.boardingPoints?.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.time} — {p.name} ({p.landmark})
                      </option>
                    ))}
                    {!busData.boardingPoints?.some((p) => p.name === selectedBoarding) && (
                      <option value={selectedBoarding}>{selectedBoarding}</option>
                    )}
                  </select>
                </div>

                <div className="skb-picker-field">
                  <label className="skb-picker-label">Dropping Point ({busData.to})</label>
                  <select
                    className="skb-picker-select"
                    value={selectedDropping}
                    onChange={(e) => setSelectedDropping(e.target.value)}
                  >
                    {busData.droppingPoints?.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.time} — {p.name} ({p.landmark})
                      </option>
                    ))}
                    {!busData.droppingPoints?.some((p) => p.name === selectedDropping) && (
                      <option value={selectedDropping}>{selectedDropping}</option>
                    )}
                  </select>
                </div>
              </div>
            </article>

            {/* CARD 2: TRAVEL STRESS FREE / SAFERIDE PROTECTION */}
            <article className="skb-card skb-protection-card">
              <div className="skb-card-header">
                <div className="skb-card-title-group">
                  <div className="skb-title-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
                    🛡️
                  </div>
                  <div>
                    <h2 className="skb-card-title">SkyRoute SafeRide Protection</h2>
                    <p className="skb-card-subtitle">
                      20 Lakh+ people secured their journeys • Travel Stress Free
                    </p>
                  </div>
                </div>
                <span className="skb-shield-badge">100% Peace of Mind</span>
              </div>

              <div className="skb-card-body">
                {/* 3 Protection Perks */}
                <div className="skb-perks-grid">
                  <div className="skb-perk-box">
                    <div className="skb-perk-icon">🔄</div>
                    <div className="skb-perk-title">2x Refund Guarantee</div>
                    <div className="skb-perk-desc">
                      100% Original Paymode + 100% SkyRoute Travel Wallet if operator cancels
                    </div>
                  </div>

                  <div className="skb-perk-box">
                    <div className="skb-perk-icon">🏥</div>
                    <div className="skb-perk-title">Upto ₹75,000</div>
                    <div className="skb-perk-desc">
                      Accidental medical treatment &amp; emergency hospitalisation cover
                    </div>
                  </div>

                  <div className="skb-perk-box">
                    <div className="skb-perk-icon">♿</div>
                    <div className="skb-perk-title">Upto ₹5,00,000</div>
                    <div className="skb-perk-desc">
                      Accidental demise or permanent disability cover during travel
                    </div>
                  </div>
                </div>

                {/* Radio selection */}
                <div className="skb-protect-options">
                  <label
                    className={`skb-radio-card ${withProtection ? "is-selected" : ""}`}
                    onClick={() => setWithProtection(true)}
                  >
                    <div className="skb-radio-left">
                      <input
                        type="radio"
                        name="safeRidePlan"
                        className="skb-radio-input"
                        checked={withProtection}
                        onChange={() => setWithProtection(true)}
                      />
                      <div>
                        <div className="skb-radio-label">
                          Add SafeRide Protection for ₹25 / passenger
                        </div>
                        <div className="skb-radio-sub">
                          Full coverage for {seatCount} {seatCount === 1 ? "passenger" : "passengers"}
                        </div>
                      </div>
                    </div>
                    <span className="skb-radio-price">{formatInr(25 * seatCount)}</span>
                  </label>

                  <label
                    className={`skb-radio-card ${!withProtection ? "is-selected" : ""}`}
                    onClick={() => setWithProtection(false)}
                  >
                    <div className="skb-radio-left">
                      <input
                        type="radio"
                        name="safeRidePlan"
                        className="skb-radio-input"
                        checked={!withProtection}
                        onChange={() => setWithProtection(false)}
                      />
                      <div>
                        <div className="skb-radio-label" style={{ color: "#64748b" }}>
                          No, I will risk my journey
                        </div>
                        <div className="skb-radio-sub">
                          Opt out of cancellation, medical and accidental assistance
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>₹0</span>
                  </label>
                </div>
              </div>
            </article>

            {/* CARD 3: TRAVELLER DETAILS */}
            <article className="skb-card">
              <div className="skb-card-header">
                <div className="skb-card-title-group">
                  <div className="skb-title-icon-box">👤</div>
                  <div>
                    <h2 className="skb-card-title">Traveller Details</h2>
                    <p className="skb-card-subtitle">
                      Please enter names as per Government photo ID (Aadhaar / Voter ID / Passport)
                    </p>
                  </div>
                </div>
              </div>

              <div className="skb-card-body">
                {/* Fast Autofill Bar */}
                <div className="skb-autofill-banner">
                  <span className="skb-autofill-text">
                    ⚡ Quick Speedup: Autofill Primary Passenger as <strong>Joydeep Barik</strong>
                  </span>
                  <button
                    type="button"
                    className="skb-autofill-btn"
                    onClick={handleAutofillPrimary}
                  >
                    Apply Details
                  </button>
                </div>

                <div className="skb-traveller-list">
                  {passengers.map((passenger, idx) => (
                    <div key={passenger.seat} className="skb-passenger-unit">
                      <div className="skb-unit-head">
                        <div className="skb-unit-title">
                          <span>
                            Traveller {idx + 1} {passenger.isPrimary ? "(Primary Passenger)" : ""}
                          </span>
                          <span className="skb-seat-tag">Seat {passenger.seat}</span>
                        </div>
                      </div>

                      <div className="skb-passenger-fields">
                        <div className="skb-field-group">
                          <label className="skb-field-label">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter Full Name"
                            className="skb-input-text"
                            value={passenger.fullName}
                            onChange={(e) =>
                              handleUpdatePassenger(idx, "fullName", e.target.value)
                            }
                          />
                        </div>

                        <div className="skb-field-group">
                          <label className="skb-field-label">Age</label>
                          <input
                            type="number"
                            min="1"
                            max="115"
                            required
                            placeholder="Age"
                            className="skb-input-text"
                            value={passenger.age}
                            onChange={(e) =>
                              handleUpdatePassenger(idx, "age", e.target.value)
                            }
                          />
                        </div>

                        <div className="skb-field-group">
                          <label className="skb-field-label">Gender</label>
                          <div className="skb-gender-toggle">
                            <button
                              type="button"
                              className={`skb-gender-btn ${
                                passenger.gender === "Male" ? "is-active" : ""
                              }`}
                              onClick={() => handleUpdatePassenger(idx, "gender", "Male")}
                            >
                              <span>👨</span>
                              <span>Male</span>
                            </button>
                            <button
                              type="button"
                              className={`skb-gender-btn ${
                                passenger.gender === "Female" ? "is-active" : ""
                              }`}
                              onClick={() => handleUpdatePassenger(idx, "gender", "Female")}
                            >
                              <span>👩</span>
                              <span>Female</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* CARD 4: CONTACT DETAILS */}
            <article className="skb-card">
              <div className="skb-card-header">
                <div className="skb-card-title-group">
                  <div className="skb-title-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
                    📱
                  </div>
                  <div>
                    <h2 className="skb-card-title">Contact Details</h2>
                    <p className="skb-card-subtitle">
                      Your E-ticket, live GPS tracking link &amp; bus number will be sent here
                    </p>
                  </div>
                </div>
              </div>

              <div className="skb-card-body">
                <div className="skb-contact-grid">
                  <div className="skb-field-group">
                    <label className="skb-field-label">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter Email Address"
                      className="skb-input-text"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                    />
                  </div>

                  <div className="skb-field-group">
                    <label className="skb-field-label">Mobile Number</label>
                    <div className="skb-phone-wrap">
                      <select
                        className="skb-country-select"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+971">+971</option>
                      </select>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="10-digit mobile number"
                        className="skb-input-text"
                        value={mobileNumber}
                        onChange={(e) =>
                          setMobileNumber(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>
                  </div>
                </div>

                <label className="skb-whatsapp-opt">
                  <input
                    type="checkbox"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  />
                  <span>
                    Send booking confirmation, boarding bay info and driver GPS link via <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>
            </article>

            {/* CARD 5: GST BILLING ADDRESS & TRIP TYPE */}
            <article className="skb-card">
              <div className="skb-card-header">
                <div className="skb-card-title-group">
                  <div className="skb-title-icon-box" style={{ background: "#f1f5f9", color: "#475569" }}>
                    🏢
                  </div>
                  <div>
                    <h2 className="skb-card-title">Billing Address &amp; State</h2>
                    <p className="skb-card-subtitle">
                      Required for GST tax invoice as per state transport authority norms
                    </p>
                  </div>
                </div>
              </div>

              <div className="skb-card-body">
                {/* Trip Type Selector */}
                <div className="skb-trip-type-toggle">
                  <label
                    className={`skb-type-pill ${tripType === "personal" ? "is-active" : ""}`}
                    onClick={() => setTripType("personal")}
                  >
                    <input
                      type="radio"
                      name="busTripType"
                      checked={tripType === "personal"}
                      onChange={() => setTripType("personal")}
                      style={{ accentColor: "#0284c7" }}
                    />
                    <span>Personal Trip</span>
                  </label>

                  <label
                    className={`skb-type-pill ${tripType === "business" ? "is-active" : ""}`}
                    onClick={() => setTripType("business")}
                  >
                    <input
                      type="radio"
                      name="busTripType"
                      checked={tripType === "business"}
                      onChange={() => setTripType("business")}
                      style={{ accentColor: "#0284c7" }}
                    />
                    <span>Business / Corporate (GST Invoice)</span>
                  </label>
                </div>

                {/* Business GST details if business */}
                {tripType === "business" && (
                  <div className="skb-contact-grid" style={{ marginBottom: "14px" }}>
                    <div className="skb-field-group">
                      <label className="skb-field-label">Company GSTIN (15 Digits)</label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="e.g. 19AAAAA0000A1Z5"
                        className="skb-input-text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="skb-field-group">
                      <label className="skb-field-label">Company Registered Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Tech Private Limited"
                        className="skb-input-text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="skb-billing-grid">
                  <div className="skb-field-group">
                    <label className="skb-field-label">Billing Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Billing Address"
                      className="skb-input-text"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                    />
                  </div>

                  <div className="skb-field-group">
                    <label className="skb-field-label">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Pincode"
                      className="skb-input-text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <div className="skb-field-group">
                    <label className="skb-field-label">State</label>
                    <select
                      className="skb-input-text"
                      value={billingState}
                      onChange={(e) => setBillingState(e.target.value)}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="skb-whatsapp-opt" style={{ marginTop: "14px" }}>
                  <input
                    type="checkbox"
                    checked={saveBillingProfile}
                    onChange={(e) => setSaveBillingProfile(e.target.checked)}
                  />
                  <span>Confirm and save billing details to your profile</span>
                </label>
              </div>
            </article>
          </div>

          {/* RIGHT RAIL: FARE DETAILS & OFFERS */}
          <aside className="skb-right-rail">
            {/* FARE SUMMARY CARD */}
            <div className="skb-card skb-fare-card">
              <div className="skb-fare-head">
                <h3 className="skb-fare-title">Fare Details</h3>
                <span className="skb-fare-tag">
                  {seatCount} {seatCount === 1 ? "Seat" : "Seats"}
                </span>
              </div>

              <div className="skb-fare-breakdown">
                <div className="skb-fare-row">
                  <span>
                    Base Fare ({formatInr(busData.price)} × {seatCount})
                  </span>
                  <strong>{formatInr(rawBaseFare)}</strong>
                </div>

                {withProtection && (
                  <div className="skb-fare-row">
                    <span>SafeRide Protection ({seatCount} × ₹25)</span>
                    <strong style={{ color: "#059669" }}>+{formatInr(protectionFee)}</strong>
                  </div>
                )}

                <div className="skb-fare-row">
                  <span>Operator Service &amp; Bus GST (5%)</span>
                  <strong>+{formatInr(busGstAndService)}</strong>
                </div>

                {promoDiscount > 0 && (
                  <div className="skb-fare-row is-discount">
                    <span>Coupon Discount ({appliedPromo})</span>
                    <strong>-{formatInr(promoDiscount)}</strong>
                  </div>
                )}

                <div className="skb-fare-divider" />

                <div className="skb-fare-total-row">
                  <span className="skb-total-label">Total Amount</span>
                  <strong className="skb-total-amount">{formatInr(finalPayable)}</strong>
                </div>
              </div>

              <div className="skb-fare-footer">
                <p className="skb-terms-note">
                  By clicking Pay, you agree to SkyRoute&#39;s Bus Terms of Service and Operator
                  cancellation rules.
                </p>

                <button type="submit" className="skb-pay-cta">
                  <span>Pay {formatInr(finalPayable)}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* OFFERS & COUPONS CARD */}
            <div className="skb-card skb-offers-card">
              <div className="skb-offers-head">
                <span>🏷️</span>
                <span>Offers &amp; Promo Codes</span>
              </div>

              <div className="skb-offers-list">
                {[
                  {
                    code: "SKYBUS",
                    desc: "Flat ₹150 OFF on first SkyRoute bus booking",
                  },
                  {
                    code: "GOPNB",
                    desc: "FLAT 8% OFF using PNB credit/debit cards",
                  },
                  {
                    code: "INDBANKVISACC",
                    desc: "Flat 8% instant discount (Up to ₹500)",
                  },
                  {
                    code: "WBTC300",
                    desc: "Save ₹100 on official State RTC routes",
                  },
                ].map((offer) => {
                  const isCurrent = appliedPromo === offer.code;
                  return (
                    <div
                      key={offer.code}
                      className={`skb-coupon-item ${isCurrent ? "is-applied" : ""}`}
                      onClick={() =>
                        isCurrent ? handleRemovePromo() : handleApplyPromoCode(offer.code)
                      }
                    >
                      <div className="skb-coupon-info">
                        <strong className="skb-coupon-code">{offer.code}</strong>
                        <span className="skb-coupon-sub">{offer.desc}</span>
                      </div>
                      <button type="button" className="skb-apply-pill">
                        {isCurrent ? "Applied ✓" : "Apply"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Custom coupon input */}
              <div className="skb-promo-box">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  className="skb-promo-input"
                  value={customPromoInput}
                  onChange={(e) => setCustomPromoInput(e.target.value)}
                />
                <button
                  type="button"
                  className="skb-promo-btn"
                  onClick={() => handleApplyPromoCode(customPromoInput)}
                >
                  Apply
                </button>
              </div>

              {promoMessage && (
                <div
                  style={{
                    padding: "0 18px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: promoMessage.isError ? "#ef4444" : "#059669",
                  }}
                >
                  {promoMessage.text}
                </div>
              )}
            </div>

            {/* TRUST & SECURITY BADGES */}
            <div className="skb-trust-box">
              <div>🔒 256-Bit SSL Bank Grade Security</div>
              <div>⚡ Instant M-Ticket WhatsApp &amp; SMS Dispatch</div>
              <div>📞 24x7 SkyRoute Bus Helpdesk Assistance</div>
            </div>
          </aside>
        </form>
      </div>

      {/* 3. CANCELLATION POLICY MODAL */}
      {policyModalOpen && (
        <div
          className="skb-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setPolicyModalOpen(false)}
        >
          <div className="skb-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="skb-modal-head">
              <h3>{busData.operator} — Cancellation Policy</h3>
              <button
                type="button"
                className="skb-close-x"
                onClick={() => setPolicyModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="skb-modal-body">
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                Refund percentage is calculated on the base fare amount excluding GST and insurance.
              </p>
              <table className="skb-policy-table">
                <thead>
                  <tr>
                    <th>Cancellation Window</th>
                    <th>Refund %</th>
                    <th>Deduction</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>More than 24 hours before departure</td>
                    <td style={{ color: "#059669", fontWeight: 700 }}>90% Refund</td>
                    <td>10% Fee</td>
                  </tr>
                  <tr>
                    <td>Between 12 to 24 hours before departure</td>
                    <td style={{ color: "#0284c7", fontWeight: 700 }}>75% Refund</td>
                    <td>25% Fee</td>
                  </tr>
                  <tr>
                    <td>Between 4 to 12 hours before departure</td>
                    <td style={{ color: "#d97706", fontWeight: 700 }}>50% Refund</td>
                    <td>50% Fee</td>
                  </tr>
                  <tr>
                    <td>Less than 4 hours before departure</td>
                    <td style={{ color: "#ef4444", fontWeight: 700 }}>0% (Non-Refundable)</td>
                    <td>100% Fee</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: "16px", fontSize: "12px", color: "#64748b" }}>
                <strong>Note:</strong> In case of bus cancellation by {busData.operator}, you will receive a
                full 100% cash refund to your original source of payment plus 100% travel credit under
                SafeRide protection.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAYMENT & CONFIRMATION MODAL */}
      {checkoutModalOpen && (
        <div
          className="skb-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => !isProcessingPay && setCheckoutModalOpen(false)}
        >
          <div className="skb-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="skb-modal-head">
              <h3>
                {bookingConfirmed
                  ? "🎉 Bus Ticket Confirmed!"
                  : `Complete Payment: ${formatInr(finalPayable)}`}
              </h3>
              {!isProcessingPay && (
                <button
                  type="button"
                  className="skb-close-x"
                  onClick={() => setCheckoutModalOpen(false)}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="skb-modal-body">
              {bookingConfirmed ? (
                /* CONFIRMED TICKET VIEW */
                <div className="skb-confirmed-ticket">
                  <div className="skb-success-icon">✓</div>
                  <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 800 }}>
                    Booking Successful!
                  </h2>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Your bus e-ticket has been sent to <strong>{emailAddress}</strong> and WhatsApp at{" "}
                    <strong>{mobileNumber}</strong>.
                  </p>

                  <div className="skb-pnr-badge">PNR: {confirmedPnr}</div>

                  <div className="skb-confirmed-summary">
                    <div className="skb-confirmed-row">
                      <span>Operator &amp; Bus:</span>
                      <strong>{busData.operator}</strong>
                    </div>
                    <div className="skb-confirmed-row">
                      <span>Coach Type:</span>
                      <strong>{busData.coachName}</strong>
                    </div>
                    <div className="skb-confirmed-row">
                      <span>Route:</span>
                      <strong>
                        {busData.from} ➔ {busData.to}
                      </strong>
                    </div>
                    <div className="skb-confirmed-row">
                      <span>Boarding Point:</span>
                      <strong>{selectedBoarding} ({busData.boardingTime || busData.departTime})</strong>
                    </div>
                    <div className="skb-confirmed-row">
                      <span>Dropping Point:</span>
                      <strong>{selectedDropping} ({busData.droppingTime || busData.arriveTime})</strong>
                    </div>
                    <div className="skb-confirmed-row">
                      <span>Seats Booked:</span>
                      <strong style={{ color: "#0284c7" }}>{busData.seats.join(", ")}</strong>
                    </div>
                    <div className="skb-confirmed-row">
                      <span>Primary Traveller:</span>
                      <strong>{passengers[0]?.fullName || "Joydeep Barik"}</strong>
                    </div>
                    <div className="skb-confirmed-row">
                      <span>Amount Paid:</span>
                      <strong style={{ color: "#059669", fontSize: "15px" }}>
                        {formatInr(finalPayable)}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className="skb-pay-cta"
                      onClick={() => alert("Downloading official SkyRoute Bus M-Ticket PDF...")}
                      style={{ flex: 1, padding: "12px 14px", fontSize: "14px" }}
                    >
                      <span>📥 Download Ticket PDF</span>
                    </button>
                    <button
                      type="button"
                      className="skb-pay-cta"
                      onClick={() => router.push("/allBus")}
                      style={{
                        flex: 1,
                        background: "#0284c7",
                        padding: "12px 14px",
                        fontSize: "14px",
                      }}
                    >
                      <span>Book Another Bus</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* PAYMENT METHODS */
                <div>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#64748b" }}>
                    Select your preferred secure payment method for <strong>{busData.operator}</strong>:
                  </p>

                  <div className="skb-pay-methods">
                    {[
                      {
                        id: "upi",
                        title: "UPI (Google Pay, PhonePe, Paytm, BHIM)",
                        icon: "📱",
                        desc: "Instant authorization with zero gateway surcharge",
                      },
                      {
                        id: "card",
                        title: "Credit / Debit Cards (Visa, MasterCard, RuPay)",
                        icon: "💳",
                        desc: "Save card details securely for 1-click checkout",
                      },
                      {
                        id: "netbanking",
                        title: "Net Banking (SBI, HDFC, ICICI, Axis, PNB)",
                        icon: "🏦",
                        desc: "Direct login to all Indian scheduled banks",
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`skb-method-card ${
                          selectedPayMethod === method.id ? "is-active" : ""
                        }`}
                        onClick={() => setSelectedPayMethod(method.id)}
                      >
                        <div className="skb-method-left">
                          <span style={{ fontSize: "20px" }}>{method.icon}</span>
                          <div>
                            <div>{method.title}</div>
                            <small style={{ color: "#64748b", fontWeight: 400 }}>
                              {method.desc}
                            </small>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payMethod"
                          checked={selectedPayMethod === method.id}
                          onChange={() => setSelectedPayMethod(method.id)}
                          style={{ accentColor: "#0284c7" }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "22px" }}>
                    <button
                      type="button"
                      disabled={isProcessingPay}
                      className="skb-pay-cta"
                      onClick={handleConfirmPay}
                    >
                      {isProcessingPay ? (
                        <span>Securing Your Bus Seats...</span>
                      ) : (
                        <span>Pay {formatInr(finalPayable)} &amp; Confirm Booking</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. TRAIN BOOKING VIEW (IRCTC Partnered SkyRoute Theme)
   ========================================================================== */

interface TrainPassenger {
  id: string;
  name: string;
  age: string;
  gender: "Male" | "Female" | "Transgender";
  berthPreference: string;
  foodPreference?: string;
  isSelected: boolean;
}

interface StoredTrainBooking {
  type: string;
  trainNo: string;
  trainName: string;
  trainType?: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  fromCity?: string;
  toCity?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distanceKm?: number;
  departDate: string;
  classCode: string;
  className: string;
  quota: string;
  fare: number;
  statusText: string;
  confirmationProbability?: number;
  isAlternate?: boolean;
}

function TrainBookingView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search params fallbacks
  const qTrainNo = searchParams.get("trainNo") || "12863";
  const qTrainName = searchParams.get("trainName") || "Hwh Smvb Exp";
  const qFrom = searchParams.get("from") || "Howrah (HWH)";
  const qTo = searchParams.get("to") || "Smvt Bengaluru (SMVB)";
  const qFromCode = searchParams.get("fromCode") || "HWH";
  const qToCode = searchParams.get("toCode") || "SMVB";
  const qDepart = searchParams.get("depart") || "2026-12-03";
  const qClass = searchParams.get("class") || "Sleeper (SL)";
  const qClassCode = searchParams.get("classCode") || "SL";
  const qQuota = searchParams.get("quota") || "General Quota";
  const qFare = Number(searchParams.get("fare") || 830);
  const qDepartTime = searchParams.get("departTime") || "10:45 PM";
  const qArriveTime = searchParams.get("arriveTime") || "07:00 AM";
  const qDuration = searchParams.get("duration") || "1d 8h 15m";
  const qStatus = searchParams.get("status") || "GNWL 100";
  const qConfirmChance = Number(searchParams.get("confirmChance") || 60);

  // Train data state hydrated from sessionStorage or params
  const [trainData, setTrainData] = useState<StoredTrainBooking>({
    type: "train",
    trainNo: qTrainNo,
    trainName: qTrainName,
    trainType: "Superfast Express",
    fromCode: qFromCode,
    fromName: qFrom.replace(/\s*\([A-Z0-9]+\)/, "") || "Howrah",
    toCode: qToCode,
    toName: qTo.replace(/\s*\([A-Z0-9]+\)/, "") || "Smvt Bengaluru",
    fromCity: "Kolkata",
    toCity: "Bengaluru",
    departureTime: qDepartTime,
    arrivalTime: qArriveTime,
    duration: qDuration,
    departDate: qDepart,
    classCode: qClassCode,
    className: qClass,
    quota: qQuota,
    fare: qFare,
    statusText: qStatus,
    confirmationProbability: qConfirmChance,
    isAlternate: false,
  });

  // Guarantee / Protection Plans
  const [alternatePlan, setAlternatePlan] = useState<"yes" | "no">("no");
  const [freeCancellation, setFreeCancellation] = useState<"yes" | "no">("no");

  // Load from sessionStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("skyroute_train_booking");
        if (stored) {
          const parsed = JSON.parse(stored) as StoredTrainBooking;
          if (parsed && parsed.trainNo) {
            setTrainData(parsed);
            if (parsed.isAlternate) {
              setAlternatePlan("yes");
            }
          }
        }
      } catch (err) {
        console.error("Error reading train booking from sessionStorage", err);
      }
    }
  }, []);

  // IRCTC ID State
  const [irctcUser, setIrctcUser] = useState<string>("joydeepbarik_irctc");
  const [irctcInputTemp, setIrctcInputTemp] = useState<string>("joydeepbarik_irctc");
  const [isIrctcValidated, setIsIrctcValidated] = useState<boolean>(true);
  const [isEditingIrctc, setIsEditingIrctc] = useState<boolean>(false);
  const [showCreateIrctcModal, setShowCreateIrctcModal] = useState<boolean>(false);

  // Boarding Station state & modal
  const [boardingStation, setBoardingStation] = useState<string>(
    `${trainData.fromName} (${trainData.fromCode})`
  );
  const [showBoardingModal, setShowBoardingModal] = useState<boolean>(false);

  useEffect(() => {
    setBoardingStation(`${trainData.fromName} (${trainData.fromCode})`);
  }, [trainData.fromName, trainData.fromCode]);

  // Passengers list (Max 6)
  const [passengers, setPassengers] = useState<TrainPassenger[]>([
    {
      id: "p-1",
      name: "Joydeep Barik",
      age: "26",
      gender: "Male",
      berthPreference: "No Preference",
      isSelected: true,
    },
  ]);

  // Add/Edit passenger modal state
  const [showPassengerModal, setShowPassengerModal] = useState<boolean>(false);
  const [editingPassengerId, setEditingPassengerId] = useState<string | null>(null);
  const [passengerForm, setPassengerForm] = useState<{
    name: string;
    age: string;
    gender: "Male" | "Female" | "Transgender";
    berthPreference: string;
  }>({
    name: "",
    age: "",
    gender: "Male",
    berthPreference: "No Preference",
  });

  // Contact details
  const [contactNumber, setContactNumber] = useState<string>("9749708386");
  const [emailId, setEmailId] = useState<string>("joydeepbarik007@gmail.com");
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

  // Additional Preferences
  const [travelInsurance, setTravelInsurance] = useState<boolean>(true);
  const [autoUpgradation, setAutoUpgradation] = useState<boolean>(true);
  const [confirmBerthsOnly, setConfirmBerthsOnly] = useState<boolean>(false);
  const [hasGst, setHasGst] = useState<boolean>(false);
  const [gstin, setGstin] = useState<string>("");
  const [gstCompanyName, setGstCompanyName] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("WEST BENGAL");

  // Offers & Promo Codes
  const [promoCodeInput, setPromoCodeInput] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  // Payment & Booking Confirmation State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmedPnr, setConfirmedPnr] = useState<string>("");

  // Passenger counts & calculations
  const selectedPassengers = passengers.filter((p) => p.isSelected);
  const selectedCount = Math.max(1, selectedPassengers.length);

  const baseFareTotal = trainData.fare * selectedCount;
  const alternateFee = alternatePlan === "yes" ? 1009 * selectedCount : 0;
  const freeCancelFee = freeCancellation === "yes" ? 149 * selectedCount : 0;
  const insuranceFee = travelInsurance ? 0.45 * selectedCount : 0;
  const irctcServiceFee = 17.7; // Standard IRCTC convenience fee ₹15 + 18% GST
  const promoDiscount = appliedPromo ? appliedPromo.discount : 0;

  const totalPayable = Math.max(
    0,
    baseFareTotal + alternateFee + freeCancelFee + insuranceFee + irctcServiceFee - promoDiscount
  );

  const maxRefund = baseFareTotal * 3;
  const sourceRefund = baseFareTotal;
  const couponRefund = baseFareTotal * 2;

  // Handlers
  const handleValidateIrctc = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!irctcInputTemp.trim()) {
      alert("Please enter a valid IRCTC User ID");
      return;
    }
    setIrctcUser(irctcInputTemp.trim());
    setIsIrctcValidated(true);
    setIsEditingIrctc(false);
  };

  const handleTogglePassenger = (id: string) => {
    setPassengers((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isSelected: !p.isSelected } : p));
      if (!updated.some((p) => p.isSelected)) {
        return prev;
      }
      return updated;
    });
  };

  const handleOpenAddPassenger = () => {
    if (passengers.length >= 6) {
      alert("Maximum 6 passengers allowed per IRCTC booking.");
      return;
    }
    setEditingPassengerId(null);
    setPassengerForm({
      name: "",
      age: "",
      gender: "Male",
      berthPreference: "No Preference",
    });
    setShowPassengerModal(true);
  };

  const handleOpenEditPassenger = (p: TrainPassenger) => {
    setEditingPassengerId(p.id);
    setPassengerForm({
      name: p.name,
      age: p.age,
      gender: p.gender,
      berthPreference: p.berthPreference,
    });
    setShowPassengerModal(true);
  };

  const handleSavePassenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerForm.name.trim()) {
      alert("Please enter traveller full name as per Govt Photo ID.");
      return;
    }
    const ageNum = parseInt(passengerForm.age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      alert("Please enter a valid age (1 to 120).");
      return;
    }

    if (editingPassengerId) {
      setPassengers((prev) =>
        prev.map((p) =>
          p.id === editingPassengerId
            ? {
                ...p,
                name: passengerForm.name.trim(),
                age: String(ageNum),
                gender: passengerForm.gender,
                berthPreference: passengerForm.berthPreference,
              }
            : p
        )
      );
    } else {
      const newId = `p-${Date.now()}`;
      setPassengers((prev) => [
        ...prev,
        {
          id: newId,
          name: passengerForm.name.trim(),
          age: String(ageNum),
          gender: passengerForm.gender,
          berthPreference: passengerForm.berthPreference,
          isSelected: true,
        },
      ]);
    }
    setShowPassengerModal(false);
  };

  const handleDeletePassenger = (id: string) => {
    if (passengers.length <= 1) {
      alert("At least one passenger is required.");
      return;
    }
    setPassengers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "RAILSAFE") {
      setAppliedPromo({ code: "RAILSAFE", discount: 150 });
      setPromoCodeInput("RAILSAFE");
    } else if (clean === "SKYTRAIN") {
      const disc = Math.min(300, Math.round(baseFareTotal * 0.1));
      setAppliedPromo({ code: "SKYTRAIN", discount: disc });
      setPromoCodeInput("SKYTRAIN");
    } else {
      alert("Invalid promo code. Try 'RAILSAFE' or 'SKYTRAIN'.");
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIrctcValidated || !irctcUser.trim()) {
      alert("Please validate your IRCTC User ID before proceeding.");
      return;
    }
    if (selectedPassengers.length === 0) {
      alert("Please select at least 1 passenger.");
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!emailId.trim() || !emailId.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      const pnrFirst = Math.floor(600 + Math.random() * 300);
      const pnrMid = Math.floor(1000 + Math.random() * 9000);
      const pnrLast = Math.floor(10 + Math.random() * 90);
      const generatedPnr = `${pnrFirst}-${pnrMid}-${pnrLast}`;
      setConfirmedPnr(generatedPnr);
      setIsSuccess(true);
    }, 1400);
  };

  return (
    <div className="skb-page-wrapper">
      {/* TOP NAVIGATION & STEPPER */}
      <section className="skb-top-nav">
        <div className="skb-container">
          <div className="skb-nav-bar">
            <Link href="/allTrains" className="skb-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Trains</span>
            </Link>

            <div className="skb-stepper">
              <div className="skb-step-item is-done">
                <span className="skb-step-circle">✓</span>
                <span>Train Select</span>
              </div>
              <span className="skb-step-line" />
              <div className="skb-step-item is-active">
                <span className="skb-step-circle">2</span>
                <span>Passenger &amp; IRCTC</span>
              </div>
              <span className="skb-step-line" />
              <div className="skb-step-item">
                <span className="skb-step-circle">3</span>
                <span>Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="skb-container">
        {isSuccess ? (
          /* ====================================================================
             CONFIRMED TICKET VIEW
             ==================================================================== */
          <div className="skt-confirmed-container">
            <div className="skt-confirmed-header">
              <div className="skt-confirmed-icon">✓</div>
              <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 6px" }}>
                Train Ticket Confirmed &amp; IRCTC PNR Issued!
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#e0f2fe" }}>
                Official IRCTC e-ticket and SMS confirmation sent to <strong>{contactNumber}</strong> and{" "}
                <strong>{emailId}</strong>.
              </p>
              <div className="skt-pnr-pill">PNR: {confirmedPnr}</div>
            </div>

            <div className="skt-confirmed-body">
              <div className="skt-confirmed-row">
                <span>Train Details:</span>
                <strong>
                  {trainData.trainNo} — {trainData.trainName}
                </strong>
              </div>
              <div className="skt-confirmed-row">
                <span>Route:</span>
                <strong>
                  {boardingStation} ➔ {trainData.toName} ({trainData.toCode})
                </strong>
              </div>
              <div className="skt-confirmed-row">
                <span>Departure:</span>
                <strong>
                  {trainData.departureTime}, {formatDisplayDate(trainData.departDate) || trainData.departDate}
                </strong>
              </div>
              <div className="skt-confirmed-row">
                <span>Arrival:</span>
                <strong>{trainData.arrivalTime} (Destination)</strong>
              </div>
              <div className="skt-confirmed-row">
                <span>Class &amp; Quota:</span>
                <strong>
                  {trainData.className} ({trainData.classCode}) • {trainData.quota}
                </strong>
              </div>
              <div className="skt-confirmed-row">
                <span>Coach &amp; Berths Allotted:</span>
                <strong style={{ color: "#0284c7" }}>
                  Coach S4 — {selectedPassengers.map((_, idx) => `Berth ${32 + idx} (${idx % 2 === 0 ? "Lower" : "Middle"})`).join(", ")} [CNF]
                </strong>
              </div>
              <div className="skt-confirmed-row">
                <span>IRCTC User ID:</span>
                <strong>{irctcUser} (Verified)</strong>
              </div>
              <div className="skt-confirmed-row">
                <span>Passengers ({selectedCount}):</span>
                <strong>
                  {selectedPassengers.map((p) => `${p.name} (${p.gender[0]}, ${p.age})`).join(", ")}
                </strong>
              </div>
              <div className="skt-confirmed-row" style={{ borderBottom: "none", marginTop: "8px" }}>
                <span>Total Amount Paid:</span>
                <strong style={{ color: "#16a34a", fontSize: "18px" }}>{formatInr(totalPayable)}</strong>
              </div>

              {/* ACTION BUTTONS (ALL BLUE!) */}
              <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="skt-btn-blue"
                  onClick={() => alert("Downloading official IRCTC E-Ticket PDF...")}
                  style={{ flex: 1, padding: "13px 18px", fontSize: "14px" }}
                >
                  📥 Download E-Ticket (PDF)
                </button>
                <button
                  type="button"
                  className="skt-btn-blue-outline"
                  onClick={() => alert(`Official ticket link and PNR ${confirmedPnr} shared to WhatsApp +91 ${contactNumber}!`)}
                  style={{ flex: 1, padding: "13px 18px", fontSize: "14px" }}
                >
                  📱 Share on WhatsApp
                </button>
                <button
                  type="button"
                  className="skt-btn-blue"
                  onClick={() => router.push("/allTrains")}
                  style={{ flex: 1, padding: "13px 18px", fontSize: "14px" }}
                >
                  🚆 Book Another Train
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
             MAIN TRAIN BOOKING FORM
             ==================================================================== */
          <form onSubmit={handleProceedToPayment} className="skb-layout">
            <div className="skb-left-stack">
              {/* 1. TRAIN BANNER & JOURNEY DETAILS (Screenshot 2) */}
              <article className="skt-train-banner">
                <div className="skt-train-banner-header">
                  <div className="skt-train-identity">
                    <div className="skt-train-icon-circle">🚆</div>
                    <div>
                      <h1 className="skt-train-title">
                        {trainData.trainNo}, {trainData.trainName}
                      </h1>
                      <p className="skt-train-subtitle">
                        <span>{trainData.className}</span>
                        <span>•</span>
                        <span>{trainData.quota}</span>
                      </p>
                    </div>
                  </div>
                  <div className="skt-train-badges">
                    <span className="skt-badge-quota">IRCTC Partner</span>
                    <span className={`skt-badge-status ${trainData.statusText.includes("AVL") ? "is-available" : ""}`}>
                      {trainData.statusText}
                    </span>
                  </div>
                </div>

                <div className="skt-train-journey-card">
                  <div className="skt-station-block">
                    <span style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 500 }}>Boarding from</span>
                    <div className="skt-time-row">
                      <span className="skt-time-val">{trainData.departureTime}</span>
                      <span className="skt-date-val">
                        {formatDisplayDate(trainData.departDate) || trainData.departDate}
                      </span>
                    </div>
                    <div className="skt-station-code">{trainData.fromCode}</div>
                    <div className="skt-station-name">{boardingStation}</div>
                    <button
                      type="button"
                      className="skt-station-change-btn"
                      onClick={() => setShowBoardingModal(true)}
                    >
                      Change Boarding station
                    </button>
                  </div>

                  <div className="skt-duration-bar">
                    <span className="skt-duration-val">⏳ {trainData.duration}</span>
                    <div className="skt-duration-track">
                      <span className="skt-duration-dot" />
                      <div className="skt-duration-line" />
                      <span style={{ color: "#ffffff", fontSize: "12px" }}>➔</span>
                      <div className="skt-duration-line" />
                      <span className="skt-duration-dot" />
                    </div>
                  </div>

                  <div className="skt-station-block is-dest">
                    <span style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 500 }}>Destination to</span>
                    <div className="skt-time-row">
                      <span className="skt-time-val">{trainData.arrivalTime}</span>
                      <span className="skt-date-val">Next Arrival</span>
                    </div>
                    <div className="skt-station-code">{trainData.toCode}</div>
                    <div className="skt-station-name">{trainData.toName}</div>
                  </div>
                </div>
              </article>

              {/* 2. IRCTC ID SECTION (Screenshot 2) */}
              <article className="skt-card">
                <div className="skt-card-header">
                  <div className="skt-card-title-group">
                    <div className="skt-icon-box">🔐</div>
                    <div>
                      <h2 className="skt-card-title">Your IRCTC ID</h2>
                      <p className="skt-card-subtitle">
                        IRCTC ID is mandatory to complete a booking. Your password will be required after payment.
                      </p>
                    </div>
                  </div>
                </div>

                {isIrctcValidated && !isEditingIrctc ? (
                  <div className="skt-irctc-verified-box">
                    <div className="skt-irctc-verified-text">
                      <span className="skt-irctc-verified-icon">✓</span>
                      <div>
                        <div>
                          IRCTC Username: <strong>{irctcUser}</strong>
                        </div>
                        <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 500 }}>
                          Account Active &amp; Validated with Indian Railways
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="skt-btn-blue-outline"
                      onClick={() => setIsEditingIrctc(true)}
                      style={{ padding: "8px 14px", fontSize: "12.5px" }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="skt-irctc-row">
                    <div className="skt-irctc-input-wrap">
                      <input
                        type="text"
                        placeholder="Enter IRCTC Username"
                        className="skt-input-text"
                        value={irctcInputTemp}
                        onChange={(e) => setIrctcInputTemp(e.target.value)}
                      />
                    </div>
                    {/* BLUE VALIDATE BUTTON */}
                    <button
                      type="button"
                      className="skt-btn-blue"
                      onClick={handleValidateIrctc}
                    >
                      VALIDATE &amp; SAVE
                    </button>
                  </div>
                )}

                <div className="skt-irctc-helper-links">
                  <span>
                    Don&apos;t have an IRCTC account?{" "}
                    <button
                      type="button"
                      className="skt-blue-link"
                      onClick={() => setShowCreateIrctcModal(true)}
                    >
                      Create IRCTC ID
                    </button>
                  </span>
                  <span>
                    Your IRCTC password will be required after payment to complete this booking.{" "}
                    <button
                      type="button"
                      className="skt-blue-link"
                      onClick={() => alert("To reset your IRCTC password, please visit https://irctc.co.in or open IRCTC Rail Connect app.")}
                    >
                      Forgot Password?
                    </button>
                  </span>
                </div>
              </article>

              {/* 3. SELECT PASSENGERS (Screenshots 2 & 5) */}
              <article className="skt-card">
                <div className="skt-card-header">
                  <div className="skt-card-title-group">
                    <div className="skt-icon-box">👥</div>
                    <div>
                      <h2 className="skt-card-title">Select Passengers</h2>
                      <p className="skt-card-subtitle">
                        Select travellers for this journey (max 6 per ticket)
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#0284c7",
                      background: "#f0f9ff",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      border: "1px solid #bae6fd",
                    }}
                  >
                    {selectedCount}/6 Selected
                  </span>
                </div>

                <div style={{ marginTop: "12px" }}>
                  {passengers.map((p) => (
                    <div
                      key={p.id}
                      className={`skt-passenger-item ${p.isSelected ? "is-selected" : ""}`}
                    >
                      <div className="skt-passenger-info-col">
                        <input
                          type="checkbox"
                          className="skt-checkbox-custom"
                          checked={p.isSelected}
                          onChange={() => handleTogglePassenger(p.id)}
                        />
                        <div>
                          <div className="skt-passenger-name">{p.name}</div>
                          <div className="skt-passenger-meta">
                            {p.gender} • {p.age} yrs • {p.berthPreference}
                          </div>
                        </div>
                      </div>

                      <div className="skt-passenger-actions">
                        <button
                          type="button"
                          className="skt-btn-blue-outline"
                          onClick={() => handleOpenEditPassenger(p)}
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Edit
                        </button>
                        {passengers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeletePassenger(p.id)}
                            style={{
                              background: "#fee2e2",
                              color: "#dc2626",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* BLUE ADD PASSENGER BUTTON */}
                <div style={{ marginTop: "14px" }}>
                  <button
                    type="button"
                    className="skt-btn-blue-outline"
                    onClick={handleOpenAddPassenger}
                  >
                    + Add New Passenger
                  </button>
                </div>
              </article>

              {/* 4. ALTERNATE TRAVEL PLAN GUARANTEE CARD (Screenshot 4) */}
              <article className="skt-guarantee-card">
                <div className="skt-guarantee-header">
                  <span className="skt-guarantee-badge">
                    <span>🛡️</span> Alternate Travel Plan
                  </span>
                  <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#15803d" }}>
                    SkyRoute Assured
                  </span>
                </div>

                <h3 className="skt-guarantee-title">Confirmed Ticket or 3X Refund*</h3>
                <p className="skt-guarantee-subtitle">
                  if your ticket remains waitlisted after chart preparation
                </p>

                <div style={{ margin: "10px 0 4px", fontSize: "14px", fontWeight: 600, color: "#15803d" }}>
                  Max. Refund: {formatInr(maxRefund)}{" "}
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>
                    *(3X for flight / 3X for bus / 2X for train)
                  </span>
                </div>

                {/* VISUAL SPLIT PILLS */}
                <div className="skt-refund-split-box">
                  <div className="skt-refund-pill">
                    <div className="skt-refund-pill-icon">💵</div>
                    <div>
                      <div className="skt-refund-pill-amount">{formatInr(sourceRefund)}</div>
                      <div className="skt-refund-pill-label">To Source Account</div>
                    </div>
                  </div>

                  <div className="skt-refund-plus">+</div>

                  <div className="skt-refund-pill">
                    <div className="skt-refund-pill-icon">🎟️</div>
                    <div>
                      <div className="skt-refund-pill-amount">Up to {formatInr(couponRefund)}</div>
                      <div className="skt-refund-pill-label">As SkyRoute Travel Coupon</div>
                    </div>
                  </div>
                </div>

                {/* RADIO OPTIONS */}
                <div>
                  <label
                    className={`skt-radio-option ${alternatePlan === "yes" ? "is-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="alternatePlan"
                      checked={alternatePlan === "yes"}
                      onChange={() => setAlternatePlan("yes")}
                    />
                    <div>
                      <div className="skt-radio-label">
                        Yes, I want Alternate Travel Plan
                      </div>
                      <div className="skt-radio-sublabel">
                        Guaranteed confirmed alternate seat or 3X refund @₹1009/person
                      </div>
                    </div>
                  </label>

                  <label
                    className={`skt-radio-option ${alternatePlan === "no" ? "is-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="alternatePlan"
                      checked={alternatePlan === "no"}
                      onChange={() => setAlternatePlan("no")}
                    />
                    <div>
                      <div className="skt-radio-label">No, I don&apos;t want this</div>
                      <div className="skt-radio-sublabel">Standard railway waitlist refund rules apply</div>
                    </div>
                  </label>
                </div>

                <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#64748b", lineHeight: 1.4 }}>
                  Note: The coupon must be claimed &amp; redeemed within <strong>7 days</strong> from the date of chart preparation of the train.
                </p>
              </article>

              {/* 5. FREE CANCELLATION CARD (Screenshot 3) */}
              <article className="skt-card skt-cancel-card">
                <div className="skt-card-header">
                  <div className="skt-card-title-group">
                    <div className="skt-icon-box" style={{ background: "#dcfce7", color: "#16a34a", borderColor: "#86efac" }}>
                      🛡️
                    </div>
                    <div>
                      <h2 className="skt-card-title">Get full refund on cancellation</h2>
                      <p className="skt-card-subtitle">Cancel anytime before chart preparation and avail full refund</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`skt-radio-option ${freeCancellation === "yes" ? "is-active" : ""}`}>
                    <input
                      type="radio"
                      name="freeCancellation"
                      checked={freeCancellation === "yes"}
                      onChange={() => setFreeCancellation("yes")}
                    />
                    <div>
                      <div className="skt-radio-label">
                        Zero cancellation charges when the ticket is cancelled
                      </div>
                      <div className="skt-radio-sublabel">
                        ₹149/person • Approx instant refund: {formatInr(baseFareTotal)}
                      </div>
                    </div>
                  </label>

                  <label className={`skt-radio-option ${freeCancellation === "no" ? "is-active" : ""}`}>
                    <input
                      type="radio"
                      name="freeCancellation"
                      checked={freeCancellation === "no"}
                      onChange={() => setFreeCancellation("no")}
                    />
                    <div>
                      <div className="skt-radio-label">No, I don&apos;t want free cancellation.</div>
                      <div className="skt-radio-sublabel">IRCTC standard cancellation deductions will apply</div>
                    </div>
                  </label>
                </div>

                <div style={{ marginTop: "10px", fontSize: "12.5px", color: "#64748b" }}>
                  Free cancellation valid before chart preparation.{" "}
                  <button
                    type="button"
                    className="skt-blue-link"
                    onClick={() => alert("Full refund is credited directly to your bank account within 2 hours of ticket cancellation before chart preparation.")}
                  >
                    Know More
                  </button>
                </div>
              </article>

              {/* 6. CONTACT DETAILS (Screenshots 3 & 5) */}
              <article className="skt-card">
                <div className="skt-card-header">
                  <div className="skt-card-title-group">
                    <div className="skt-icon-box">📱</div>
                    <div>
                      <h2 className="skt-card-title">Your booking details will be sent to</h2>
                      <p className="skt-card-subtitle">
                        E-ticket PDF, PNR updates, and chart confirmation will be delivered here
                      </p>
                    </div>
                  </div>
                </div>

                <div className="skt-grid-2">
                  <div className="skt-field-group">
                    <label className="skt-field-label">Mobile Number</label>
                    <div className="skt-phone-wrap">
                      <span className="skt-phone-prefix">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        className="skt-input-text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter 10-digit mobile"
                      />
                    </div>
                  </div>

                  <div className="skt-field-group">
                    <label className="skt-field-label">Email ID</label>
                    <input
                      type="email"
                      required
                      className="skt-input-text"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <label className="skt-checkbox-row" style={{ marginTop: "12px" }}>
                  <input
                    type="checkbox"
                    className="skt-checkbox-custom"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  />
                  <span>
                    💬 Send booking details &amp; live PNR status updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </article>

              {/* 7. ADDITIONAL PREFERENCES & GST (Screenshots 3, 5 & 6) */}
              <article className="skt-card">
                <div className="skt-card-header">
                  <div className="skt-card-title-group">
                    <div className="skt-icon-box">⚙️</div>
                    <div>
                      <h2 className="skt-card-title">Additional Preferences &amp; Tax Invoice</h2>
                      <p className="skt-card-subtitle">Custom railway choices and GST billing state</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="skt-checkbox-row">
                    <input
                      type="checkbox"
                      className="skt-checkbox-custom"
                      checked={travelInsurance}
                      onChange={(e) => setTravelInsurance(e.target.checked)}
                    />
                    <span>
                      Do you want to take Travel Insurance (<strong>₹0.45/person</strong>)? (Recommended)
                    </span>
                  </label>

                  <label className="skt-checkbox-row">
                    <input
                      type="checkbox"
                      className="skt-checkbox-custom"
                      checked={autoUpgradation}
                      onChange={(e) => setAutoUpgradation(e.target.checked)}
                    />
                    <span>Consider for auto upgradation (Get free AC coach upgrade if berths become available)</span>
                  </label>

                  <label className="skt-checkbox-row">
                    <input
                      type="checkbox"
                      className="skt-checkbox-custom"
                      checked={confirmBerthsOnly}
                      onChange={(e) => setConfirmBerthsOnly(e.target.checked)}
                    />
                    <span>Book only if confirm berths are allotted</span>
                  </label>

                  <label className="skt-checkbox-row" style={{ marginTop: "4px" }}>
                    <input
                      type="checkbox"
                      className="skt-checkbox-custom"
                      checked={hasGst}
                      onChange={(e) => setHasGst(e.target.checked)}
                    />
                    <span>I have a GSTIN Number (Add GST for Tax Benefits)</span>
                  </label>

                  {hasGst && (
                    <div className="skt-grid-2" style={{ marginTop: "12px", background: "#f8fafc", padding: "14px", borderRadius: "10px" }}>
                      <div className="skt-field-group">
                        <label className="skt-field-label">GSTIN Number</label>
                        <input
                          type="text"
                          maxLength={15}
                          className="skt-input-text"
                          placeholder="e.g. 19AAAAA0000A1Z5"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="skt-field-group">
                        <label className="skt-field-label">Company Name</label>
                        <input
                          type="text"
                          className="skt-input-text"
                          placeholder="Registered Enterprise Name"
                          value={gstCompanyName}
                          onChange={(e) => setGstCompanyName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* STATE SELECTION (Screenshot 5) */}
                  <div className="skt-field-group" style={{ marginTop: "14px" }}>
                    <label className="skt-field-label">
                      State (Required for GST compliance on tax invoice)
                    </label>
                    <select
                      className="skt-input-text"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="WEST BENGAL">WEST BENGAL</option>
                      <option value="MAHARASHTRA">MAHARASHTRA</option>
                      <option value="DELHI">DELHI</option>
                      <option value="KARNATAKA">KARNATAKA</option>
                      <option value="TAMIL NADU">TAMIL NADU</option>
                      <option value="UTTAR PRADESH">UTTAR PRADESH</option>
                      <option value="BIHAR">BIHAR</option>
                      <option value="ODISHA">ODISHA</option>
                      <option value="GUJARAT">GUJARAT</option>
                      <option value="RAJASTHAN">RAJASTHAN</option>
                    </select>
                  </div>
                </div>
              </article>
            </div>

            {/* ====================================================================
               RIGHT RAIL: OFFERS & FARE SUMMARY (Screenshot 2)
               ==================================================================== */}
            <aside className="skb-right-rail">
              {/* OFFERS & DISCOUNTS */}
              <div className="skt-offers-box">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                    🎟️ Offers &amp; Discounts
                  </h3>
                  {appliedPromo && (
                    <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Applied ✓</span>
                  )}
                </div>

                <div className="skt-promo-input-row">
                  <input
                    type="text"
                    placeholder="Enter Promo Code"
                    className="skt-input-text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    style={{ textTransform: "uppercase" }}
                  />
                  {/* BLUE APPLY BUTTON */}
                  <button
                    type="button"
                    className="skt-btn-blue"
                    onClick={() => handleApplyPromo(promoCodeInput)}
                    style={{ padding: "10px 16px" }}
                  >
                    APPLY
                  </button>
                </div>

                <div className="skt-promo-chips">
                  <span
                    className="skt-promo-chip"
                    onClick={() => handleApplyPromo("RAILSAFE")}
                  >
                    RAILSAFE (₹150 off)
                  </span>
                  <span
                    className="skt-promo-chip"
                    onClick={() => handleApplyPromo("SKYTRAIN")}
                  >
                    SKYTRAIN (10% off)
                  </span>
                </div>
              </div>

              {/* FARE BREAKDOWN CARD */}
              <div className="skt-fare-card">
                <div className="skt-fare-head">
                  <h3 className="skt-fare-title">Base Fare</h3>
                  <span className="skt-fare-badge">
                    {selectedCount} Passenger{selectedCount > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="skt-fare-row">
                  <span>
                    Base Train Ticket ({trainData.classCode}) × {selectedCount}
                  </span>
                  <strong>{formatInr(baseFareTotal)}</strong>
                </div>

                <div className="skt-fare-row">
                  <span>IRCTC Convenience Fee (incl. GST)</span>
                  <strong>+{formatInr(irctcServiceFee)}</strong>
                </div>

                {alternatePlan === "yes" && (
                  <div className="skt-fare-row">
                    <span>Alternate Travel Plan Guarantee</span>
                    <strong>+{formatInr(alternateFee)}</strong>
                  </div>
                )}

                {freeCancellation === "yes" && (
                  <div className="skt-fare-row">
                    <span>Zero Cancellation Charge Option</span>
                    <strong>+{formatInr(freeCancelFee)}</strong>
                  </div>
                )}

                {travelInsurance && (
                  <div className="skt-fare-row">
                    <span>Travel Insurance (₹0.45/pax)</span>
                    <strong>+{formatInr(insuranceFee)}</strong>
                  </div>
                )}

                {appliedPromo && (
                  <div className="skt-fare-row is-green">
                    <span>Coupon Discount ({appliedPromo.code})</span>
                    <strong>-{formatInr(promoDiscount)}</strong>
                  </div>
                )}

                <div className="skt-fare-total">
                  <span className="skt-total-label">Total Payable</span>
                  <span className="skt-total-amount">{formatInr(totalPayable)}</span>
                </div>

                {/* SOLID BLUE PROCEED BUTTON (NO BLACK BUTTON!) */}
                <button type="submit" className="skt-cta-btn">
                  Proceed to Payment ➔
                </button>

                <p style={{ margin: "12px 0 0", fontSize: "11.5px", color: "#64748b", lineHeight: 1.4, textAlign: "center" }}>
                  By proceeding to payment, I confirm that I agree to the IRCTC Cancellation Policy and SkyRoute Terms of Service.
                </p>

                <div className="skt-trust-badge">
                  <span>🛡️ Official IRCTC Authorized Principal Service Partner</span>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>

      {/* ====================================================================
         MODAL 1: CHANGE BOARDING STATION
         ==================================================================== */}
      {showBoardingModal && (
        <div className="skt-modal-overlay">
          <div className="skt-modal-card">
            <div className="skt-modal-header">
              <h3 className="skt-modal-title">Select Boarding Station</h3>
              <button
                type="button"
                className="skt-modal-close-btn"
                onClick={() => setShowBoardingModal(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px" }}>
              Choose from designated intermediate boarding stops for train <strong>{trainData.trainNo}</strong>:
            </p>
            {[
              { code: "HWH", name: "Howrah Junction", time: "10:45 PM", day: "Day 1" },
              { code: "SRC", name: "Santragachi Junction", time: "11:05 PM", day: "Day 1" },
              { code: "KGP", name: "Kharagpur Junction", time: "12:35 AM", day: "Day 2" },
              { code: "BLS", name: "Baleshwar", time: "02:10 AM", day: "Day 2" },
              { code: "BBS", name: "Bhubaneswar", time: "05:40 AM", day: "Day 2" },
            ].map((stn) => (
              <div
                key={stn.code}
                onClick={() => {
                  setBoardingStation(`${stn.name} (${stn.code})`);
                  setShowBoardingModal(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: boardingStation.includes(stn.code) ? "2px solid #0284c7" : "1.5px solid #e2e8f0",
                  background: boardingStation.includes(stn.code) ? "#f0f9ff" : "#ffffff",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
              >
                <div>
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>{stn.name}</strong>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Code: {stn.code} • {stn.day}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0284c7" }}>{stn.time}</div>
                  {boardingStation.includes(stn.code) && (
                    <span style={{ fontSize: "11.5px", color: "#16a34a", fontWeight: 600 }}>Selected ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL 2: ADD / EDIT PASSENGER
         ==================================================================== */}
      {showPassengerModal && (
        <div className="skt-modal-overlay">
          <div className="skt-modal-card">
            <div className="skt-modal-header">
              <h3 className="skt-modal-title">
                {editingPassengerId ? "Edit Passenger Details" : "Add New Traveller"}
              </h3>
              <button
                type="button"
                className="skt-modal-close-btn"
                onClick={() => setShowPassengerModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePassenger}>
              <div className="skt-field-group" style={{ marginBottom: "14px" }}>
                <label className="skt-field-label">Full Name (As on Govt Photo ID)</label>
                <input
                  type="text"
                  required
                  className="skt-input-text"
                  placeholder="Enter full legal name"
                  value={passengerForm.name}
                  onChange={(e) => setPassengerForm({ ...passengerForm, name: e.target.value })}
                />
              </div>

              <div className="skt-field-group" style={{ marginBottom: "14px" }}>
                <label className="skt-field-label">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  className="skt-input-text"
                  placeholder="e.g. 26"
                  value={passengerForm.age}
                  onChange={(e) => setPassengerForm({ ...passengerForm, age: e.target.value })}
                />
              </div>

              <div className="skt-field-group" style={{ marginBottom: "14px" }}>
                <label className="skt-field-label">Gender</label>
                <div className="skt-gender-toggle">
                  {(["Male", "Female", "Transgender"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`skt-gender-btn ${passengerForm.gender === g ? "is-active" : ""}`}
                      onClick={() => setPassengerForm({ ...passengerForm, gender: g })}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="skt-field-group" style={{ marginBottom: "20px" }}>
                <label className="skt-field-label">Berth Preference</label>
                <select
                  className="skt-input-text"
                  value={passengerForm.berthPreference}
                  onChange={(e) => setPassengerForm({ ...passengerForm, berthPreference: e.target.value })}
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Lower Berth">Lower Berth</option>
                  <option value="Middle Berth">Middle Berth</option>
                  <option value="Upper Berth">Upper Berth</option>
                  <option value="Side Lower">Side Lower</option>
                  <option value="Side Upper">Side Upper</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="skt-btn-blue-outline"
                  onClick={() => setShowPassengerModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="skt-btn-blue" style={{ flex: 2 }}>
                  {editingPassengerId ? "Update Passenger" : "Save & Add Passenger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL 3: CREATE IRCTC ID HELP
         ==================================================================== */}
      {showCreateIrctcModal && (
        <div className="skt-modal-overlay">
          <div className="skt-modal-card">
            <div className="skt-modal-header">
              <h3 className="skt-modal-title">Create IRCTC Account</h3>
              <button
                type="button"
                className="skt-modal-close-btn"
                onClick={() => setShowCreateIrctcModal(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.5, margin: "0 0 12px" }}>
              To book tickets on Indian Railways, having an authentic IRCTC User Account is mandatory per Govt regulations:
            </p>
            <ol style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, paddingLeft: "18px", margin: "0 0 16px" }}>
              <li>Visit the official IRCTC portal at <strong>https://irctc.co.in</strong></li>
              <li>Click on &ldquo;Register&rdquo; and enter your username, password, and security question.</li>
              <li>Provide your mobile number and email address for OTP verification.</li>
              <li>Once verified, return here and enter your verified IRCTC Username to book instantly!</li>
            </ol>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="skt-btn-blue"
                onClick={() => setShowCreateIrctcModal(false)}
                style={{ width: "100%" }}
              >
                I Understand, Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL 4: PAYMENT CHECKOUT MODAL
         ==================================================================== */}
      {showPaymentModal && (
        <div className="skt-modal-overlay">
          <div className="skt-modal-card">
            <div className="skt-modal-header">
              <h3 className="skt-modal-title">Complete Train Ticket Payment</h3>
              <button
                type="button"
                className="skt-modal-close-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "14px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", color: "#0369a1", fontWeight: 600 }}>Amount Due</span>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#0284c7" }}>{formatInr(totalPayable)}</div>
              </div>
              <div style={{ textAlign: "right", fontSize: "12.5px", color: "#475569" }}>
                <div>{trainData.trainNo} ({trainData.classCode})</div>
                <div>{selectedCount} Passenger{selectedCount > 1 ? "s" : ""}</div>
              </div>
            </div>

            <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a", margin: "0 0 10px" }}>
              Select Payment Method:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {[
                { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm, QR)", icon: "⚡" },
                { id: "card", label: "Debit / Credit Card (Visa, MasterCard, RuPay)", icon: "💳" },
                { id: "netbanking", label: "Net Banking (SBI, HDFC, ICICI, Axis)", icon: "🏦" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`skt-radio-option ${paymentMethod === m.id ? "is-active" : ""}`}
                  onClick={() => setPaymentMethod(m.id as any)}
                >
                  <input
                    type="radio"
                    name="trainPaymentMethod"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id as any)}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{m.icon}</span>
                    <span className="skt-radio-label">{m.label}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* BLUE PAY BUTTON */}
            <button
              type="button"
              className="skt-cta-btn"
              disabled={isProcessingPayment}
              onClick={handleExecutePayment}
              style={{ marginTop: 0 }}
            >
              {isProcessingPayment ? (
                <span>Connecting to IRCTC Gateway...</span>
              ) : (
                <span>Pay {formatInr(totalPayable)} Securely ➔</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingDetailsContent() {
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");
  const busIdParam = searchParams.get("busId");
  const trainIdParam = searchParams.get("trainId");

  const [bookingMode, setBookingMode] = useState<"flight" | "bus" | "train">(() => {
    if (typeParam === "bus" || Boolean(busIdParam)) return "bus";
    if (typeParam === "train" || Boolean(trainIdParam)) return "train";
    return "flight";
  });

  useEffect(() => {
    if (typeParam === "bus" || Boolean(busIdParam)) {
      setBookingMode("bus");
      return;
    }
    if (typeParam === "train" || Boolean(trainIdParam)) {
      setBookingMode("train");
      return;
    }
    if (typeParam === "flight") {
      setBookingMode("flight");
      return;
    }
    if (typeof window !== "undefined") {
      const storedBus = sessionStorage.getItem("skyroute_bus_booking");
      const storedTrain = sessionStorage.getItem("skyroute_train_booking");
      const storedFlight = sessionStorage.getItem("skyroute_booking_details");

      if (storedBus && !storedFlight) {
        setBookingMode("bus");
      } else if (storedTrain && !storedFlight) {
        setBookingMode("train");
      } else {
        setBookingMode("flight");
      }
    }
  }, [typeParam, busIdParam, trainIdParam]);

  if (bookingMode === "bus") {
    return <BusBookingView />;
  }

  if (bookingMode === "train") {
    return <TrainBookingView />;
  }

  return <FlightBookingView />;
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
