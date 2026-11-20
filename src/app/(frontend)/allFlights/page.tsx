"use client";

import React, { Suspense, useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import "./AllFlights.css";

type TripType = "one-way" | "round-trip";
type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";
type SortMode = "best" | "cheapest" | "fastest" | "earliest";
type SpecialFareId = "none" | "student" | "senior" | "armed" | "doctors";
type TimeSlotId = "morning" | "afternoon" | "evening" | "night";

interface AirlineMeta {
  id: string;
  name: string;
  code: string;
  image: string;
  aircraft: string;
  seatLayout: string;
  cabinBody: string;
  hasWifi: boolean;
  hasPower: boolean;
  hasEntertainment: boolean;
}

interface FlightItem {
  id: string;
  leg: "onward" | "return";
  airlineId: string;
  airlineName: string;
  airlineCode: string;
  airlineImage: string;
  flightNumber: string;
  aircraft: string;
  seatLayout: string;
  cabinBody: string;
  hasWifi: boolean;
  hasPower: boolean;
  hasEntertainment: boolean;
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  departMinutes: number;
  durationMinutes: number;
  stops: 0 | 1 | 2;
  stopCity?: string;
  basePrice: number;
  freeMeal: boolean;
  refundable: boolean;
  seatsLeft: number;
  cabinBaggage: string;
  checkInBaggage: string;
  terminalFrom: string;
  terminalTo: string;
}

interface AirportChoice {
  city: string;
  code: string;
  airportName: string;
}

const AIRPORTS: AirportChoice[] = [
  { city: "New Delhi", code: "DEL", airportName: "Indira Gandhi International Airport" },
  { city: "Mumbai", code: "BOM", airportName: "Chhatrapati Shivaji Maharaj Intl Airport" },
  { city: "Bengaluru", code: "BLR", airportName: "Kempegowda International Airport" },
  { city: "Kolkata", code: "CCU", airportName: "Netaji Subhas Chandra Bose Intl Airport" },
  { city: "Hyderabad", code: "HYD", airportName: "Rajiv Gandhi International Airport" },
  { city: "Chennai", code: "MAA", airportName: "Chennai International Airport" },
  { city: "Goa", code: "GOI", airportName: "Manohar International Airport" },
  { city: "Dubai", code: "DXB", airportName: "Dubai International Airport" },
  { city: "Singapore", code: "SIN", airportName: "Singapore Changi Airport" },
];

const AIRLINES: AirlineMeta[] = [
  { id: "indigo", name: "IndiGo", code: "6E", image: "/images/airline1.png", aircraft: "Airbus A320neo", seatLayout: "3-3 Layout", cabinBody: "Narrow-body", hasWifi: false, hasPower: true, hasEntertainment: false },
  { id: "air-india", name: "Air India", code: "AI", image: "/images/airline2.png", aircraft: "Airbus A321neo", seatLayout: "3-3 Layout", cabinBody: "Full-service Cabin", hasWifi: true, hasPower: true, hasEntertainment: true },
  { id: "air-india-express", name: "Air India Express", code: "IX", image: "/images/airline3.png", aircraft: "Boeing 737 MAX", seatLayout: "3-3 Layout", cabinBody: "Narrow-body", hasWifi: false, hasPower: true, hasEntertainment: false },
  { id: "akasa-air", name: "Akasa Air", code: "QP", image: "/images/airline4.png", aircraft: "Boeing 737-8", seatLayout: "3-3 Layout", cabinBody: "Modern Cabin", hasWifi: false, hasPower: true, hasEntertainment: false },
  { id: "spicejet", name: "SpiceJet", code: "SG", image: "/images/airline5.png", aircraft: "Boeing 737-800", seatLayout: "3-3 Layout", cabinBody: "Narrow-body", hasWifi: false, hasPower: false, hasEntertainment: false },
  { id: "alliance-air", name: "Alliance Air", code: "9I", image: "/images/airline6.png", aircraft: "ATR 72-600", seatLayout: "2-2 Layout", cabinBody: "Regional Turboprop", hasWifi: false, hasPower: false, hasEntertainment: false },
];

const TIME_SLOTS: { id: TimeSlotId; label: string; range: string; startMin: number; endMin: number }[] = [
  { id: "morning", label: "Morning", range: "05:00 - 12:00", startMin: 300, endMin: 720 },
  { id: "afternoon", label: "Afternoon", range: "12:00 - 17:00", startMin: 720, endMin: 1020 },
  { id: "evening", label: "Evening", range: "17:00 - 21:00", startMin: 1020, endMin: 1260 },
  { id: "night", label: "Night", range: "21:00 - 05:00", startMin: 1260, endMin: 1740 },
];

const SPECIAL_FARES: { id: Exclude<SpecialFareId, "none">; label: string; discountPct: number; badge: string }[] = [
  { id: "student", label: "Student", discountPct: 6, badge: "6% off" },
  { id: "senior", label: "Senior Citizen", discountPct: 8, badge: "8% off" },
  { id: "armed", label: "Armed Forces", discountPct: 10, badge: "10% off" },
  { id: "doctors", label: "Doctors & Nurses", discountPct: 7, badge: "7% off" },
];

const CABIN_OPTIONS: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];

const CABIN_MULTIPLIER: Record<CabinClass, number> = {
  Economy: 1,
  "Premium Economy": 1.4,
  Business: 2.25,
  First: 3.3,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseLocation(raw: string, fallbackCity: string, fallbackCode: string): { city: string; code: string; display: string } {
  const cleaned = raw.trim();
  if (!cleaned) {
    return { city: fallbackCity, code: fallbackCode, display: `${fallbackCity} (${fallbackCode})` };
  }

  const parenMatch = cleaned.match(/^(.+?)\s*\(([A-Za-z]{3})\)$/);
  if (parenMatch) {
    const city = parenMatch[1].trim();
    const code = parenMatch[2].toUpperCase();
    return { city, code, display: `${city} (${code})` };
  }

  const dashMatch = cleaned.match(/^([A-Za-z]{3})\s*-\s*(.+)$/);
  if (dashMatch) {
    const code = dashMatch[1].toUpperCase();
    const city = dashMatch[2].trim();
    return { city, code, display: `${city} (${code})` };
  }

  const known = AIRPORTS.find(
    (a) => a.city.toLowerCase() === cleaned.toLowerCase() || a.code.toLowerCase() === cleaned.toLowerCase()
  );
  if (known) {
    return { city: known.city, code: known.code, display: `${known.city} (${known.code})` };
  }

  const code = cleaned.slice(0, 3).toUpperCase();
  return { city: cleaned, code, display: `${cleaned} (${code})` };
}

function addDaysIso(isoDate: string, delta: number): string {
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + delta));
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatShortDate(isoDate: string): string {
  if (!isoDate) return "";
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return `${WEEKDAYS[d.getUTCDay()]}, ${parts[2]} ${MONTHS[parts[1] - 1]}`;
}

function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function getAirportInfo(code: string, fallbackCity: string): { city: string; airportName: string } {
  const found = AIRPORTS.find((a) => a.code === code);
  if (found) return { city: found.city, airportName: found.airportName };
  return { city: fallbackCity, airportName: `${fallbackCity} International Airport` };
}

function getSeatPitchLabel(cabin: CabinClass): string {
  if (cabin === "Premium Economy") return 'Extra Legroom (34" pitch)';
  if (cabin === "Business") return "Recliner / Lie-flat Seat";
  if (cabin === "First") return "Private First Suite";
  return 'Standard Seat (30" pitch)';
}

function matchesTimeSlot(departMinutes: number, slot: TimeSlotId): boolean {
  if (slot === "morning") return departMinutes >= 300 && departMinutes < 720;
  if (slot === "afternoon") return departMinutes >= 720 && departMinutes < 1020;
  if (slot === "evening") return departMinutes >= 1020 && departMinutes < 1260;
  return departMinutes >= 1260 || departMinutes < 300;
}

function buildFlightsForLeg(
  leg: "onward" | "return",
  fromCode: string,
  toCode: string,
  dateOffset: number,
  cabin: CabinClass,
  discountPct: number
): FlightItem[] {
  const mult = CABIN_MULTIPLIER[cabin];
  const dateFactor = 1 + (Math.abs(dateOffset % 3) * 0.045);
  const discountFactor = 1 - discountPct / 100;
  const adjust = (base: number) => Math.round((base * mult * dateFactor * discountFactor) / 10) * 10;

  const stopHub = fromCode === "HYD" || toCode === "HYD" ? "BLR" : "HYD";

  const templates =
    leg === "onward"
      ? [
          { airlineIdx: 0, flightNumber: "6E 2122", departTime: "05:30", arriveTime: "08:05", departMinutes: 330, durationMinutes: 155, stops: 0 as const, rawPrice: 6420, freeMeal: false, refundable: true, seatsLeft: 5, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T1", terminalTo: "T2" },
          { airlineIdx: 3, flightNumber: "QP 1418", departTime: "07:45", arriveTime: "10:05", departMinutes: 465, durationMinutes: 140, stops: 0 as const, rawPrice: 6890, freeMeal: false, refundable: true, seatsLeft: 7, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T2", terminalTo: "T1" },
          { airlineIdx: 1, flightNumber: "AI 865", departTime: "10:15", arriveTime: "12:55", departMinutes: 615, durationMinutes: 160, stops: 0 as const, rawPrice: 7540, freeMeal: true, refundable: true, seatsLeft: 4, cabinBaggage: "8 kg", checkInBaggage: "20 kg", terminalFrom: "T3", terminalTo: "T2" },
          { airlineIdx: 2, flightNumber: "IX 1094", departTime: "12:40", arriveTime: "15:25", departMinutes: 760, durationMinutes: 165, stops: 0 as const, rawPrice: 6690, freeMeal: false, refundable: false, seatsLeft: 9, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T3", terminalTo: "T2" },
          { airlineIdx: 4, flightNumber: "SG 8169", departTime: "15:10", arriveTime: "17:50", departMinutes: 910, durationMinutes: 160, stops: 0 as const, rawPrice: 7180, freeMeal: false, refundable: false, seatsLeft: 6, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T1", terminalTo: "T1" },
          { airlineIdx: 0, flightNumber: "6E 5031", departTime: "17:35", arriveTime: "20:15", departMinutes: 1055, durationMinutes: 160, stops: 0 as const, rawPrice: 7390, freeMeal: false, refundable: true, seatsLeft: 8, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T2", terminalTo: "T2" },
          { airlineIdx: 1, flightNumber: "AI 624", departTime: "18:50", arriveTime: "23:15", departMinutes: 1130, durationMinutes: 265, stops: 1 as const, stopCity: stopHub, rawPrice: 8190, freeMeal: true, refundable: true, seatsLeft: 3, cabinBaggage: "8 kg", checkInBaggage: "20 kg", terminalFrom: "T3", terminalTo: "T2" },
          { airlineIdx: 5, flightNumber: "9I 614", departTime: "20:15", arriveTime: "00:55", departMinutes: 1215, durationMinutes: 280, stops: 1 as const, stopCity: stopHub, rawPrice: 7850, freeMeal: true, refundable: false, seatsLeft: 5, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T1", terminalTo: "T1" },
          { airlineIdx: 2, flightNumber: "IX 2742", departTime: "21:45", arriveTime: "04:25", departMinutes: 1305, durationMinutes: 400, stops: 2 as const, stopCity: `${stopHub}, JAI`, rawPrice: 9320, freeMeal: false, refundable: false, seatsLeft: 4, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T3", terminalTo: "T2" },
        ]
      : [
          { airlineIdx: 0, flightNumber: "6E 2121", departTime: "06:20", arriveTime: "08:50", departMinutes: 380, durationMinutes: 150, stops: 0 as const, rawPrice: 6740, freeMeal: false, refundable: true, seatsLeft: 6, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T2", terminalTo: "T1" },
          { airlineIdx: 3, flightNumber: "QP 1419", departTime: "08:55", arriveTime: "11:10", departMinutes: 535, durationMinutes: 135, stops: 0 as const, rawPrice: 7190, freeMeal: false, refundable: true, seatsLeft: 8, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T1", terminalTo: "T2" },
          { airlineIdx: 1, flightNumber: "AI 866", departTime: "11:40", arriveTime: "14:20", departMinutes: 700, durationMinutes: 160, stops: 0 as const, rawPrice: 7890, freeMeal: true, refundable: true, seatsLeft: 5, cabinBaggage: "8 kg", checkInBaggage: "20 kg", terminalFrom: "T2", terminalTo: "T3" },
          { airlineIdx: 4, flightNumber: "SG 8170", departTime: "14:25", arriveTime: "17:05", departMinutes: 865, durationMinutes: 160, stops: 0 as const, rawPrice: 7080, freeMeal: false, refundable: false, seatsLeft: 7, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T1", terminalTo: "T1" },
          { airlineIdx: 2, flightNumber: "IX 1095", departTime: "16:45", arriveTime: "19:35", departMinutes: 1005, durationMinutes: 170, stops: 0 as const, rawPrice: 7420, freeMeal: false, refundable: true, seatsLeft: 4, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T2", terminalTo: "T3" },
          { airlineIdx: 0, flightNumber: "6E 5032", departTime: "19:10", arriveTime: "21:45", departMinutes: 1150, durationMinutes: 155, stops: 0 as const, rawPrice: 7620, freeMeal: false, refundable: true, seatsLeft: 9, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T2", terminalTo: "T2" },
          { airlineIdx: 5, flightNumber: "9I 615", departTime: "20:05", arriveTime: "00:40", departMinutes: 1205, durationMinutes: 275, stops: 1 as const, stopCity: stopHub, rawPrice: 8090, freeMeal: true, refundable: false, seatsLeft: 5, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T1", terminalTo: "T1" },
          { airlineIdx: 1, flightNumber: "AI 625", departTime: "21:30", arriveTime: "01:55", departMinutes: 1290, durationMinutes: 265, stops: 1 as const, stopCity: stopHub, rawPrice: 8590, freeMeal: true, refundable: true, seatsLeft: 3, cabinBaggage: "8 kg", checkInBaggage: "20 kg", terminalFrom: "T2", terminalTo: "T3" },
          { airlineIdx: 4, flightNumber: "SG 4021", departTime: "22:25", arriveTime: "05:15", departMinutes: 1345, durationMinutes: 410, stops: 2 as const, stopCity: `${stopHub}, PNQ`, rawPrice: 9580, freeMeal: false, refundable: false, seatsLeft: 2, cabinBaggage: "7 kg", checkInBaggage: "15 kg", terminalFrom: "T1", terminalTo: "T1" },
        ];

  return templates.map((tpl, idx) => {
    const airline = AIRLINES[tpl.airlineIdx];
    return {
      id: `${leg}-${airline.code}-${idx}`,
      leg,
      airlineId: airline.id,
      airlineName: airline.name,
      airlineCode: airline.code,
      airlineImage: airline.image,
      flightNumber: tpl.flightNumber,
      aircraft: airline.aircraft,
      seatLayout: airline.seatLayout,
      cabinBody: airline.cabinBody,
      hasWifi: airline.hasWifi || cabin === "Business" || cabin === "First",
      hasPower: airline.hasPower || cabin !== "Economy",
      hasEntertainment: airline.hasEntertainment || cabin === "Business" || cabin === "First",
      fromCode,
      toCode,
      departTime: tpl.departTime,
      arriveTime: tpl.arriveTime,
      departMinutes: tpl.departMinutes,
      durationMinutes: tpl.durationMinutes,
      stops: tpl.stops,
      stopCity: tpl.stopCity,
      basePrice: adjust(tpl.rawPrice),
      freeMeal: tpl.freeMeal,
      refundable: tpl.refundable,
      seatsLeft: tpl.seatsLeft,
      cabinBaggage: tpl.cabinBaggage,
      checkInBaggage: tpl.checkInBaggage,
      terminalFrom: tpl.terminalFrom,
      terminalTo: tpl.terminalTo,
    };
  });
}

function AllFlightsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFrom = searchParams.get("from") || "New Delhi (DEL)";
  const initialTo = searchParams.get("to") || "Mumbai (BOM)";
  const initialTripParam = searchParams.get("trip");
  const initialDepart = searchParams.get("depart") || "2026-12-02";
  const initialReturnParam = searchParams.get("return") || "";
  const initialTrip: TripType = initialTripParam === "one-way" ? "one-way" : "round-trip";
  const initialReturn = initialTrip === "round-trip" ? initialReturnParam || addDaysIso(initialDepart, 6) : "";
  const initialAdults = Math.max(1, Number(searchParams.get("adults") || "1") || 1);
  const initialChildren = Math.max(0, Number(searchParams.get("children") || "0") || 0);
  const initialInfants = Math.max(0, Number(searchParams.get("infants") || "0") || 0);
  const rawCabin = searchParams.get("cabin") as CabinClass | null;
  const initialCabin: CabinClass = rawCabin && CABIN_OPTIONS.includes(rawCabin) ? rawCabin : "Economy";
  const initialBundle = searchParams.get("bundle") === "1";

  // Top search bar states
  const [fromInput, setFromInput] = useState(initialFrom);
  const [toInput, setToInput] = useState(initialTo);
  const [tripType, setTripType] = useState<TripType>(initialTrip);
  const [departDate, setDepartDate] = useState(initialDepart);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [adults, setAdults] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);
  const [cabinClass, setCabinClass] = useState<CabinClass>(initialCabin);
  const [specialFare, setSpecialFare] = useState<SpecialFareId>("none");
  const [isTravellerOpen, setIsTravellerOpen] = useState(false);

  // Active applied route
  const [activeFrom, setActiveFrom] = useState(initialFrom);
  const [activeTo, setActiveTo] = useState(initialTo);

  // Active browsing leg (Step 1: Outbound | Step 2: Return)
  const [activeStep, setActiveStep] = useState<"onward" | "return">("onward");
  const [onwardDateOffset, setOnwardDateOffset] = useState(0);
  const [returnDateOffset, setReturnDateOffset] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("best");

  // Clean Sidebar Filters (No Smart Filter box)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlotId[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [freeMealOnly, setFreeMealOnly] = useState(false);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(45000);
  const [maxDurationHours, setMaxDurationHours] = useState<number>(8);

  // Selected itinerary & card details states
  const [selectedOnwardId, setSelectedOnwardId] = useState<string>("");
  const [selectedReturnId, setSelectedReturnId] = useState<string>("");
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [priceLockEnabled, setPriceLockEnabled] = useState(false);

  const travellerPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (travellerPopoverRef.current && !travellerPopoverRef.current.contains(e.target as Node)) {
        setIsTravellerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const parsedFrom = useMemo(() => parseLocation(activeFrom, "New Delhi", "DEL"), [activeFrom]);
  const parsedTo = useMemo(() => parseLocation(activeTo, "Mumbai", "BOM"), [activeTo]);

  const activeDiscountPct = useMemo(() => {
    const found = SPECIAL_FARES.find((f) => f.id === specialFare);
    return found ? found.discountPct : 0;
  }, [specialFare]);

  const totalTravellers = adults + childrenCount + infants;
  const totalSeated = adults + childrenCount;

  const currentLeg: "onward" | "return" = tripType === "one-way" ? "onward" : activeStep;

  // Build flight catalogs
  const onwardCatalog = useMemo(
    () => buildFlightsForLeg("onward", parsedFrom.code, parsedTo.code, onwardDateOffset, cabinClass, activeDiscountPct),
    [parsedFrom.code, parsedTo.code, onwardDateOffset, cabinClass, activeDiscountPct]
  );

  const returnCatalog = useMemo(
    () => buildFlightsForLeg("return", parsedTo.code, parsedFrom.code, returnDateOffset, cabinClass, activeDiscountPct),
    [parsedTo.code, parsedFrom.code, returnDateOffset, cabinClass, activeDiscountPct]
  );

  const activeCatalog = currentLeg === "onward" ? onwardCatalog : returnCatalog;

  const priceBounds = useMemo(() => {
    const prices = activeCatalog.map((f) => f.basePrice);
    return {
      min: prices.length ? Math.min(...prices) : 5000,
      max: prices.length ? Math.max(...prices) : 20000,
    };
  }, [activeCatalog]);

  const effectiveMaxPrice = Math.min(Math.max(maxPrice, priceBounds.min), priceBounds.max);

  // Quick stats for sidebar
  const stopStats = useMemo(() => {
    const getMin = (stopVal: 0 | 1 | 2) => {
      const list = activeCatalog.filter((f) => f.stops === stopVal);
      return list.length ? Math.min(...list.map((f) => f.basePrice)) : null;
    };
    return { 0: getMin(0), 1: getMin(1), 2: getMin(2) };
  }, [activeCatalog]);

  const airlineStats = useMemo(() => {
    return AIRLINES.map((airline) => {
      const matching = activeCatalog.filter((f) => f.airlineId === airline.id);
      const minFare = matching.length ? Math.min(...matching.map((f) => f.basePrice)) : null;
      return { ...airline, count: matching.length, minFare };
    });
  }, [activeCatalog]);

  // Filter & sort active list
  const visibleFlights = useMemo(() => {
    const filtered = activeCatalog.filter((f) => {
      if (selectedTimeSlots.length > 0 && !selectedTimeSlots.some((slot) => matchesTimeSlot(f.departMinutes, slot))) {
        return false;
      }
      if (selectedStops.length > 0 && !selectedStops.includes(f.stops)) return false;
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airlineId)) return false;
      if (freeMealOnly && !f.freeMeal) return false;
      if (refundableOnly && !f.refundable) return false;
      if (f.basePrice > effectiveMaxPrice) return false;
      if (f.durationMinutes > maxDurationHours * 60) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "cheapest") return a.basePrice - b.basePrice;
      if (sortMode === "fastest") return a.durationMinutes - b.durationMinutes;
      if (sortMode === "earliest") return a.departMinutes - b.departMinutes;
      const scoreA = a.basePrice + a.durationMinutes * 18 + a.stops * 1600;
      const scoreB = b.basePrice + b.durationMinutes * 18 + b.stops * 1600;
      return scoreA - scoreB;
    });
  }, [
    activeCatalog,
    selectedTimeSlots,
    selectedStops,
    selectedAirlines,
    freeMealOnly,
    refundableOnly,
    effectiveMaxPrice,
    maxDurationHours,
    sortMode,
  ]);

  // Quick-Pick Highlights for center summary strip
  const highlights = useMemo(() => {
    if (visibleFlights.length === 0) return null;
    const cheapest = [...visibleFlights].sort((a, b) => a.basePrice - b.basePrice)[0];
    const fastest = [...visibleFlights].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
    const best = [...visibleFlights].sort(
      (a, b) =>
        a.basePrice + a.durationMinutes * 18 + a.stops * 1600 -
        (b.basePrice + b.durationMinutes * 18 + b.stops * 1600)
    )[0];
    return { cheapest, fastest, best };
  }, [visibleFlights]);

  // Selected onward & return flights (for live right-side Boarding Pass panel)
  const selectedOnward =
    onwardCatalog.find((f) => f.id === selectedOnwardId) || onwardCatalog[0] || null;
  const selectedReturn =
    tripType === "round-trip"
      ? returnCatalog.find((f) => f.id === selectedReturnId) || returnCatalog[0] || null
      : null;

  const effectiveReturnBaseDate = returnDate || addDaysIso(departDate, 6);
  const activeBaseDate = currentLeg === "onward" ? departDate : effectiveReturnBaseDate;
  const activeDateOffset = currentLeg === "onward" ? onwardDateOffset : returnDateOffset;

  const dateRibbonItems = useMemo(() => {
    const baseFare = currentLeg === "onward" ? 6420 : 6740;
    return [-2, -1, 0, 1, 2].map((delta) => {
      const iso = addDaysIso(activeBaseDate, delta);
      const lowest =
        Math.round(
          (baseFare *
            CABIN_MULTIPLIER[cabinClass] *
            (1 + Math.abs(delta % 3) * 0.045) *
            (1 - activeDiscountPct / 100)) /
            10
        ) * 10;
      return { delta, iso, label: formatShortDate(iso), lowest };
    });
  }, [activeBaseDate, currentLeg, cabinClass, activeDiscountPct]);

  // Fare calculations for Right Boarding Pass
  const onwardFare = selectedOnward ? selectedOnward.basePrice : 0;
  const returnFare = selectedReturn ? selectedReturn.basePrice : 0;
  const baseSubtotal = (onwardFare + returnFare) * totalSeated;
  const instantDiscount = (tripType === "round-trip" ? 650 : 300) + (initialBundle ? 900 : 0);
  const priceLockFee = priceLockEnabled ? 499 : 0;
  const grandTotal = Math.max(0, baseSubtotal - instantDiscount + priceLockFee);

  const activeFilterCount =
    selectedTimeSlots.length +
    selectedStops.length +
    selectedAirlines.length +
    (freeMealOnly ? 1 : 0) +
    (refundableOnly ? 1 : 0) +
    (effectiveMaxPrice < priceBounds.max ? 1 : 0) +
    (maxDurationHours < 8 ? 1 : 0);

  const resetFilters = () => {
    setSelectedTimeSlots([]);
    setSelectedStops([]);
    setSelectedAirlines([]);
    setFreeMealOnly(false);
    setRefundableOnly(false);
    setMaxPrice(priceBounds.max);
    setMaxDurationHours(8);
  };

  const toggleTimeSlot = (slot: TimeSlotId) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const toggleStop = (stopVal: number) => {
    setSelectedStops((prev) =>
      prev.includes(stopVal) ? prev.filter((s) => s !== stopVal) : [...prev, stopVal]
    );
  };

  const toggleAirline = (airlineId: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airlineId) ? prev.filter((a) => a !== airlineId) : [...prev, airlineId]
    );
  };

  const handleSelectFlight = (flight: FlightItem) => {
    if (flight.leg === "onward") {
      setSelectedOnwardId(flight.id);
      if (tripType === "round-trip") {
        setActiveStep("return");
      }
    } else {
      setSelectedReturnId(flight.id);
    }
  };

  const handleContinueToBook = () => {
    if (!selectedOnward) return;

    const bookingPayload = {
      tripType,
      from: activeFrom,
      to: activeTo,
      fromCity: parsedFrom.city,
      fromCode: parsedFrom.code,
      toCity: parsedTo.city,
      toCode: parsedTo.code,
      departDate,
      returnDate: tripType === "round-trip" ? effectiveReturnBaseDate : "",
      adults,
      children: childrenCount,
      infants,
      cabinClass,
      selectedOnward,
      selectedReturn: tripType === "round-trip" ? selectedReturn : null,
      priceLockEnabled,
      instantDiscount,
      grandTotal,
      baseSubtotal,
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("skyroute_booking_details", JSON.stringify(bookingPayload));
      } catch (err) {
        console.error("Failed to save booking details to sessionStorage", err);
      }
    }

    const q = new URLSearchParams({
      trip: tripType,
      from: activeFrom,
      to: activeTo,
      depart: departDate,
      adults: String(adults),
      children: String(childrenCount),
      infants: String(infants),
      cabin: cabinClass,
      onwardId: selectedOnward.id,
    });
    if (tripType === "round-trip" && selectedReturn) {
      q.set("return", effectiveReturnBaseDate);
      q.set("returnId", selectedReturn.id);
    }
    if (priceLockEnabled) {
      q.set("lock", "1");
    }

    router.push(`/bookingDetails?${q.toString()}`);
  };

  const handleSwapRoute = () => {
    setFromInput(toInput);
    setToInput(fromInput);
  };

  const handleTopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextFrom = fromInput.trim() || "New Delhi (DEL)";
    const nextTo = toInput.trim() || "Mumbai (BOM)";
    setActiveFrom(nextFrom);
    setActiveTo(nextTo);
    setOnwardDateOffset(0);
    setReturnDateOffset(0);
    setActiveStep("onward");
    setIsTravellerOpen(false);

    const params = new URLSearchParams({
      from: nextFrom,
      to: nextTo,
      trip: tripType,
      depart: departDate,
      adults: String(adults),
      children: String(childrenCount),
      infants: String(infants),
      cabin: cabinClass,
      bundle: initialBundle ? "1" : "0",
    });
    if (tripType === "round-trip" && returnDate) {
      params.set("return", returnDate);
    }
    router.replace(`/allFlights?${params.toString()}`, { scroll: false });
  };

  const lowestVisiblePrice = highlights?.cheapest.basePrice;
  const fastestVisibleDuration = highlights?.fastest.durationMinutes;

  return (
    <div className="sr-flights-page">
      {/* 1. SkyRoute Clean Command Bar (White Elevated Card with Top Accent) */}
      <section className="sr-command-section" aria-label="Modify flight search">
        <div className="sr-container">
          <div className="sr-command-card">
            <form onSubmit={handleTopSearchSubmit} className="sr-search-grid">
              {/* Trip Toggle */}
              <div className="sr-trip-switch" role="radiogroup" aria-label="Trip type">
                <button
                  type="button"
                  className={tripType === "round-trip" ? "active" : ""}
                  onClick={() => {
                    setTripType("round-trip");
                    if (!returnDate) setReturnDate(addDaysIso(departDate, 6));
                  }}
                >
                  Round-Trip
                </button>
                <button
                  type="button"
                  className={tripType === "one-way" ? "active" : ""}
                  onClick={() => {
                    setTripType("one-way");
                    setActiveStep("onward");
                  }}
                >
                  One-Way
                </button>
              </div>

              {/* From / Swap / To */}
              <div className="sr-route-group">
                <label className="sr-field">
                  <span className="sr-field-label">From</span>
                  <input
                    type="text"
                    list="sr-airports"
                    className="sr-field-input"
                    value={fromInput}
                    onChange={(e) => setFromInput(e.target.value)}
                    placeholder="Departure city"
                  />
                </label>

                <button
                  type="button"
                  className="sr-swap-btn"
                  onClick={handleSwapRoute}
                  aria-label="Swap departure and destination"
                >
                  ⇄
                </button>

                <label className="sr-field">
                  <span className="sr-field-label">To</span>
                  <input
                    type="text"
                    list="sr-airports"
                    className="sr-field-input"
                    value={toInput}
                    onChange={(e) => setToInput(e.target.value)}
                    placeholder="Destination city"
                  />
                </label>

                <datalist id="sr-airports">
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={`${a.city} (${a.code})`} />
                  ))}
                </datalist>
              </div>

              {/* Departure Date */}
              <label className="sr-field sr-date-field">
                <span className="sr-field-label">Departure</span>
                <input
                  type="date"
                  className="sr-field-input"
                  value={departDate}
                  onChange={(e) => {
                    setDepartDate(e.target.value);
                    setOnwardDateOffset(0);
                  }}
                />
              </label>

              {/* Return Date */}
              <div className={`sr-field sr-date-field ${tripType === "one-way" ? "is-muted" : ""}`}>
                <span className="sr-field-label">Return</span>
                {tripType === "one-way" ? (
                  <button
                    type="button"
                    className="sr-add-return"
                    onClick={() => {
                      setTripType("round-trip");
                      setReturnDate(addDaysIso(departDate, 6));
                    }}
                  >
                    + Add Return
                  </button>
                ) : (
                  <input
                    type="date"
                    className="sr-field-input"
                    min={departDate}
                    value={returnDate || addDaysIso(departDate, 6)}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      setReturnDateOffset(0);
                    }}
                  />
                )}
              </div>

              {/* Travellers & Cabin */}
              <div className="sr-traveller-anchor" ref={travellerPopoverRef}>
                <button
                  type="button"
                  className="sr-field sr-traveller-btn"
                  onClick={() => setIsTravellerOpen((prev) => !prev)}
                  aria-expanded={isTravellerOpen}
                >
                  <span className="sr-field-label">Travellers &amp; Class</span>
                  <span className="sr-traveller-text">
                    {totalTravellers} {totalTravellers === 1 ? "Guest" : "Guests"} • {cabinClass}
                  </span>
                </button>

                {isTravellerOpen && (
                  <div className="sr-traveller-pop">
                    <div className="sr-pop-row">
                      <span>Adults <small>(12+ yrs)</small></span>
                      <div className="sr-stepper">
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(1, adults - 1);
                            setAdults(next);
                            if (infants > next) setInfants(next);
                          }}
                          disabled={adults <= 1}
                        >
                          −
                        </button>
                        <strong>{adults}</strong>
                        <button
                          type="button"
                          onClick={() => setAdults(Math.min(9 - childrenCount, adults + 1))}
                          disabled={totalSeated >= 9}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="sr-pop-row">
                      <span>Children <small>(2–11 yrs)</small></span>
                      <div className="sr-stepper">
                        <button
                          type="button"
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          disabled={childrenCount <= 0}
                        >
                          −
                        </button>
                        <strong>{childrenCount}</strong>
                        <button
                          type="button"
                          onClick={() => setChildrenCount(Math.min(9 - adults, childrenCount + 1))}
                          disabled={totalSeated >= 9}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="sr-pop-row">
                      <span>Infants <small>(&lt;2 yrs)</small></span>
                      <div className="sr-stepper">
                        <button
                          type="button"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          disabled={infants <= 0}
                        >
                          −
                        </button>
                        <strong>{infants}</strong>
                        <button
                          type="button"
                          onClick={() => setInfants(Math.min(adults, infants + 1))}
                          disabled={infants >= adults}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="sr-pop-cabins">
                      {CABIN_OPTIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={cabinClass === c ? "active" : ""}
                          onClick={() => setCabinClass(c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="sr-pop-done"
                      onClick={() => setIsTravellerOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" className="sr-update-btn">
                Search
              </button>
            </form>

            {/* Special Fares Strip */}
            <div className="sr-fares-strip">
              <div className="sr-fares-left">
                <span className="sr-fares-title">Special Fares:</span>
                {SPECIAL_FARES.map((fare) => {
                  const active = specialFare === fare.id;
                  return (
                    <button
                      key={fare.id}
                      type="button"
                      className={`sr-fare-chip ${active ? "active" : ""}`}
                      onClick={() => setSpecialFare(active ? "none" : fare.id)}
                    >
                      <span>{fare.label}</span>
                      <em>{fare.badge}</em>
                    </button>
                  );
                })}
              </div>
              {initialBundle && (
                <span className="sr-bundle-badge">Hotel Bundle Active • Save ₹900</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main 1320px 3-Column SkyRoute Trip Builder */}
      <section className="sr-main-section">
        <div className="sr-container sr-three-col">
          {/* LEFT COLUMN: Clean Filters (Smart Filter Deleted) */}
          <aside className="sr-filters-panel" aria-label="Flight filters">
            <div className="sr-panel-head">
              <div className="sr-panel-title-wrap">
                <h2>Filters</h2>
                {activeFilterCount > 0 && <span className="sr-count-pill">{activeFilterCount}</span>}
              </div>
              {activeFilterCount > 0 && (
                <button type="button" className="sr-link-btn" onClick={resetFilters}>
                  Reset
                </button>
              )}
            </div>

            {/* Departure Time Window */}
            <div className="sr-filter-block">
              <h3>Departure Time</h3>
              <div className="sr-time-grid">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedTimeSlots.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      className={`sr-time-tile ${active ? "active" : ""}`}
                      onClick={() => toggleTimeSlot(slot.id)}
                    >
                      <strong>{slot.label}</strong>
                      <span>{slot.range}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stops */}
            <div className="sr-filter-block">
              <h3>Stops</h3>
              <div className="sr-stops-list">
                {([0, 1, 2] as const).map((stopVal) => {
                  const label = stopVal === 0 ? "Non-Stop" : stopVal === 1 ? "1 Stop" : "2+ Stops";
                  const minPrice = stopStats[stopVal];
                  const active = selectedStops.includes(stopVal);
                  return (
                    <button
                      key={stopVal}
                      type="button"
                      className={`sr-stop-row ${active ? "active" : ""}`}
                      onClick={() => toggleStop(stopVal)}
                      disabled={minPrice === null}
                    >
                      <span>{label}</span>
                      <strong>{minPrice !== null ? formatInr(minPrice) : "--"}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Airlines (airline1.png .. airline6.png) */}
            <div className="sr-filter-block">
              <div className="sr-block-head">
                <h3>Airlines</h3>
                <button
                  type="button"
                  className="sr-link-btn"
                  onClick={() =>
                    setSelectedAirlines((prev) =>
                      prev.length === AIRLINES.length ? [] : AIRLINES.map((a) => a.id)
                    )
                  }
                >
                  {selectedAirlines.length === AIRLINES.length ? "Clear" : "All"}
                </button>
              </div>
              <div className="sr-airlines-list">
                {airlineStats.map((airline) => {
                  const checked = selectedAirlines.includes(airline.id);
                  return (
                    <label key={airline.id} className="sr-airline-item">
                      <span className="sr-airline-meta">
                        <span className="sr-logo-frame">
                          <Image
                            src={airline.image}
                            alt={airline.name}
                            width={26}
                            height={26}
                            className="sr-logo-img"
                          />
                        </span>
                        <span className="sr-airline-label">
                          {airline.name} <small>({airline.count})</small>
                        </span>
                      </span>
                      <span className="sr-airline-right">
                        <span className="sr-airline-fare">
                          {airline.minFare ? formatInr(airline.minFare) : "--"}
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAirline(airline.id)}
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Fare Perks */}
            <div className="sr-filter-block">
              <h3>Fare Perks</h3>
              <label className="sr-check-item">
                <span>Free Meal Included</span>
                <input
                  type="checkbox"
                  checked={freeMealOnly}
                  onChange={(e) => setFreeMealOnly(e.target.checked)}
                />
              </label>
              <label className="sr-check-item">
                <span>Refundable Fares</span>
                <input
                  type="checkbox"
                  checked={refundableOnly}
                  onChange={(e) => setRefundableOnly(e.target.checked)}
                />
              </label>
            </div>

            {/* Price & Duration Sliders */}
            <div className="sr-filter-block">
              <div className="sr-block-head">
                <h3>Max Price</h3>
                <span className="sr-range-val">{formatInr(effectiveMaxPrice)}</span>
              </div>
              <input
                type="range"
                className="sr-slider"
                min={priceBounds.min}
                max={priceBounds.max}
                step={100}
                value={effectiveMaxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum ticket price"
              />
              <div className="sr-slider-ends">
                <span>{formatInr(priceBounds.min)}</span>
                <span>{formatInr(priceBounds.max)}</span>
              </div>
            </div>

            <div className="sr-filter-block sr-filter-last">
              <div className="sr-block-head">
                <h3>Max Duration</h3>
                <span className="sr-range-val">{maxDurationHours} hrs</span>
              </div>
              <input
                type="range"
                className="sr-slider"
                min={3}
                max={8}
                step={1}
                value={maxDurationHours}
                onChange={(e) => setMaxDurationHours(Number(e.target.value))}
                aria-label="Maximum duration in hours"
              />
              <div className="sr-slider-ends">
                <span>3h</span>
                <span>8h</span>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: Step-Based Journey Feed (Spacious & Readable) */}
          <div className="sr-feed-column">
            {/* Step Switcher for Round-Trip */}
            {tripType === "round-trip" && (
              <div className="sr-step-bar" role="tablist" aria-label="Select flight leg">
                <button
                  type="button"
                  role="tab"
                  aria-selected={currentLeg === "onward"}
                  className={`sr-step-tab ${currentLeg === "onward" ? "active" : ""}`}
                  onClick={() => setActiveStep("onward")}
                >
                  <span className="sr-step-num">1</span>
                  <div className="sr-step-info">
                    <strong>Outbound: {parsedFrom.code} → {parsedTo.code}</strong>
                    <span>
                      {formatShortDate(addDaysIso(departDate, onwardDateOffset))}
                      {selectedOnward ? ` • ${selectedOnward.airlineName} ${selectedOnward.departTime}` : ""}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={currentLeg === "return"}
                  className={`sr-step-tab ${currentLeg === "return" ? "active" : ""}`}
                  onClick={() => setActiveStep("return")}
                >
                  <span className="sr-step-num">2</span>
                  <div className="sr-step-info">
                    <strong>Return: {parsedTo.code} → {parsedFrom.code}</strong>
                    <span>
                      {formatShortDate(addDaysIso(effectiveReturnBaseDate, returnDateOffset))}
                      {selectedReturn ? ` • ${selectedReturn.airlineName} ${selectedReturn.departTime}` : ""}
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* 5-Day Date Fare Ribbon */}
            <div className="sr-date-ribbon">
              <button
                type="button"
                className="sr-ribbon-arrow"
                onClick={() =>
                  currentLeg === "onward"
                    ? setOnwardDateOffset((p) => p - 1)
                    : setReturnDateOffset((p) => p - 1)
                }
                aria-label="Previous dates"
              >
                ‹
              </button>
              <div className="sr-ribbon-cells">
                {dateRibbonItems.map((item) => (
                  <button
                    key={item.iso}
                    type="button"
                    className={`sr-ribbon-cell ${activeDateOffset === item.delta ? "active" : ""}`}
                    onClick={() =>
                      currentLeg === "onward"
                        ? setOnwardDateOffset(item.delta)
                        : setReturnDateOffset(item.delta)
                    }
                  >
                    <span className="sr-ribbon-day">{item.label}</span>
                    <span className="sr-ribbon-fare">{formatInr(item.lowest)}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="sr-ribbon-arrow"
                onClick={() =>
                  currentLeg === "onward"
                    ? setOnwardDateOffset((p) => p + 1)
                    : setReturnDateOffset((p) => p + 1)
                }
                aria-label="Next dates"
              >
                ›
              </button>
            </div>

            {/* Quick-Sort Highlight Cards (Best / Cheapest / Fastest / Earliest) */}
            {highlights && (
              <div className="sr-sort-cards" role="tablist" aria-label="Sort flights">
                <button
                  type="button"
                  role="tab"
                  aria-selected={sortMode === "best"}
                  className={`sr-sort-card ${sortMode === "best" ? "active" : ""}`}
                  onClick={() => setSortMode("best")}
                >
                  <span className="sr-sort-label">Best Overall</span>
                  <strong>{formatInr(highlights.best.basePrice)}</strong>
                  <small>{formatDuration(highlights.best.durationMinutes)}</small>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sortMode === "cheapest"}
                  className={`sr-sort-card ${sortMode === "cheapest" ? "active" : ""}`}
                  onClick={() => setSortMode("cheapest")}
                >
                  <span className="sr-sort-label">Cheapest</span>
                  <strong>{formatInr(highlights.cheapest.basePrice)}</strong>
                  <small>{formatDuration(highlights.cheapest.durationMinutes)}</small>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sortMode === "fastest"}
                  className={`sr-sort-card ${sortMode === "fastest" ? "active" : ""}`}
                  onClick={() => setSortMode("fastest")}
                >
                  <span className="sr-sort-label">Fastest</span>
                  <strong>{formatInr(highlights.fastest.basePrice)}</strong>
                  <small>{formatDuration(highlights.fastest.durationMinutes)}</small>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sortMode === "earliest"}
                  className={`sr-sort-card ${sortMode === "earliest" ? "active" : ""}`}
                  onClick={() => setSortMode("earliest")}
                >
                  <span className="sr-sort-label">Earliest</span>
                  <strong>{visibleFlights[0]?.departTime || "--"}</strong>
                  <small>{visibleFlights.length} flights</small>
                </button>
              </div>
            )}

            {/* Wide Boarding-Pass Flight Cards */}
            <div className="sr-ticket-list">
              {visibleFlights.length === 0 ? (
                <div className="sr-empty-box">
                  <p>No flights match your selected filters.</p>
                  <button type="button" onClick={resetFilters}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                visibleFlights.map((flight) => {
                  const isSelected =
                    currentLeg === "onward"
                      ? selectedOnward?.id === flight.id
                      : selectedReturn?.id === flight.id;
                  const isExpanded = expandedFlightId === flight.id;
                  const isLowest = lowestVisiblePrice === flight.basePrice;
                  const isFastest = fastestVisibleDuration === flight.durationMinutes;

                  return (
                    <article
                      key={flight.id}
                      className={`sr-ticket-card ${isSelected ? "selected" : ""}`}
                    >
                      <div className="sr-ticket-main">
                        {/* Left Airline Identity */}
                        <div className="sr-ticket-carrier">
                          <span className="sr-ticket-logo">
                            <Image
                              src={flight.airlineImage}
                              alt={flight.airlineName}
                              width={34}
                              height={34}
                              className="sr-logo-img"
                            />
                          </span>
                          <div className="sr-ticket-carrier-text">
                            <strong>{flight.airlineName}</strong>
                            <span>{flight.flightNumber} • {flight.aircraft}</span>
                          </div>
                        </div>

                        {/* Middle Flight Path */}
                        <div className="sr-ticket-route">
                          <div className="sr-time-col">
                            <span className="sr-big-time">{flight.departTime}</span>
                            <span className="sr-airport-code">{flight.fromCode} ({flight.terminalFrom})</span>
                          </div>

                          <div className="sr-path-col">
                            <span className="sr-path-duration">{formatDuration(flight.durationMinutes)}</span>
                            <div className="sr-path-bar">
                              <span className="sr-dot" />
                              <span className="sr-dashed-line" />
                              <span className="sr-plane-mark">✈</span>
                            </div>
                            <span className={`sr-path-stop ${flight.stops === 0 ? "direct" : ""}`}>
                              {flight.stops === 0
                                ? "Non-stop"
                                : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}${flight.stopCity ? ` via ${flight.stopCity}` : ""}`}
                            </span>
                          </div>

                          <div className="sr-time-col sr-time-end">
                            <span className="sr-big-time">{flight.arriveTime}</span>
                            <span className="sr-airport-code">{flight.toCode} ({flight.terminalTo})</span>
                          </div>
                        </div>

                        {/* Right Price & Select Stub */}
                        <div className="sr-ticket-stub">
                          <div className="sr-price-wrap">
                            <span className="sr-ticket-price">{formatInr(flight.basePrice)}</span>
                            <span className="sr-price-note">per adult</span>
                          </div>
                          <button
                            type="button"
                            className={`sr-select-btn ${isSelected ? "selected" : ""}`}
                            onClick={() => handleSelectFlight(flight)}
                          >
                            {isSelected
                              ? "Selected ✓"
                              : currentLeg === "onward" && tripType === "round-trip"
                                ? "Select Outbound"
                                : "Select Flight"}
                          </button>
                        </div>
                      </div>

                      {/* Bottom Perks & Expandable Details Strip */}
                      <div className="sr-ticket-foot">
                        <div className="sr-perks-row">
                          {isLowest && <span className="sr-badge badge-emerald">Cheapest</span>}
                          {isFastest && <span className="sr-badge badge-sky">Fastest</span>}
                          {flight.freeMeal && <span className="sr-badge badge-teal">Free Meal</span>}
                          {flight.refundable && <span className="sr-badge badge-slate">Refundable</span>}
                          <span className="sr-perk-plain">
                            Baggage: {flight.checkInBaggage} + {flight.cabinBaggage} cabin
                          </span>
                          {flight.seatsLeft <= 5 && (
                            <span className="sr-seats-warn">{flight.seatsLeft} seats left</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className={`sr-details-toggle ${isExpanded ? "is-open" : ""}`}
                          onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                          aria-expanded={isExpanded}
                        >
                          <span>{isExpanded ? "Hide Details" : "Flight Details"}</span>
                          <span className="sr-toggle-arrow" aria-hidden="true">▼</span>
                        </button>
                      </div>

                      {(() => {
                        const legDateLabel = formatShortDate(addDaysIso(activeBaseDate, activeDateOffset));
                        const originInfo = getAirportInfo(
                          flight.fromCode,
                          flight.leg === "onward" ? parsedFrom.city : parsedTo.city
                        );
                        const destInfo = getAirportInfo(
                          flight.toCode,
                          flight.leg === "onward" ? parsedTo.city : parsedFrom.city
                        );
                        const hasFreeMeal = flight.freeMeal || cabinClass === "Business" || cabinClass === "First";

                        return (
                          <div
                            className={`sr-details-collapse ${isExpanded ? "is-open" : ""}`}
                            aria-hidden={!isExpanded}
                          >
                            <div className="sr-details-collapse-inner">
                              <div className="sr-details-drawer">
                                {/* Top Spec Header */}
                                <div className="sr-details-head">
                                  <div className="sr-details-flight-id">
                                    <strong>{flight.airlineName} {flight.flightNumber}</strong>
                                    <span>• {flight.aircraft}</span>
                                  </div>
                                  <div className="sr-details-policy">
                                    <span className="sr-policy-chip">{cabinClass}</span>
                                    <span className={`sr-policy-chip ${flight.refundable ? "is-green" : ""}`}>
                                      {flight.refundable ? "Refundable Fare" : "Standard Fare"}
                                    </span>
                                  </div>
                                </div>

                                {/* Main 2-Zone Grid: Left Vertical Timeline | Right Bento Cards */}
                                <div className="sr-details-grid">
                                  {/* Left: Vertical Boarding Timeline */}
                                  <div className="sr-vtimeline">
                                    <div className="sr-vnode">
                                      <span className="sr-vdot is-start" aria-hidden="true" />
                                      <div className="sr-vnode-content">
                                        <div className="sr-vnode-time-row">
                                          <strong>{flight.departTime}</strong>
                                          <span>{legDateLabel}</span>
                                        </div>
                                        <div className="sr-vnode-city">
                                          {flight.fromCode} — {originInfo.city}
                                        </div>
                                        <div className="sr-vnode-airport">
                                          {originInfo.airportName} • Terminal {flight.terminalFrom}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="sr-vconnector">
                                      <span className="sr-vline" aria-hidden="true" />
                                      <span className="sr-vduration-pill">
                                        ✈ {formatDuration(flight.durationMinutes)} •{" "}
                                        {flight.stops === 0
                                          ? "Non-stop"
                                          : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}${flight.stopCity ? ` (${flight.stopCity})` : ""}`}
                                      </span>
                                    </div>

                                    <div className="sr-vnode">
                                      <span className="sr-vdot is-end" aria-hidden="true" />
                                      <div className="sr-vnode-content">
                                        <div className="sr-vnode-time-row">
                                          <strong>{flight.arriveTime}</strong>
                                          <span>{legDateLabel}</span>
                                        </div>
                                        <div className="sr-vnode-city">
                                          {flight.toCode} — {destInfo.city}
                                        </div>
                                        <div className="sr-vnode-airport">
                                          {destInfo.airportName} • Terminal {flight.terminalTo}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right: Baggage & Cabin Spec Bento Cards */}
                                  <div className="sr-bento-stack">
                                    <div className="sr-bento-card">
                                      <div className="sr-bento-title">Baggage Allowance</div>
                                      <div className="sr-bento-rows">
                                        <div className="sr-bento-row">
                                          <span className="sr-bento-icon" aria-hidden="true">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <rect x="6" y="7" width="12" height="14" rx="2" />
                                              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                                            </svg>
                                          </span>
                                          <span>Cabin: <strong>{flight.cabinBaggage} per adult</strong></span>
                                        </div>
                                        <div className="sr-bento-row">
                                          <span className="sr-bento-icon is-teal" aria-hidden="true">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <rect x="4" y="6" width="16" height="14" rx="2" />
                                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                              <line x1="9" y1="10" x2="9" y2="16" />
                                              <line x1="15" y1="10" x2="15" y2="16" />
                                            </svg>
                                          </span>
                                          <span>Check-in: <strong>{flight.checkInBaggage} (1 piece / adult)</strong></span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="sr-bento-card">
                                      <div className="sr-bento-title">Aircraft &amp; Seating</div>
                                      <div className="sr-seat-specs">
                                        <span>{flight.cabinBody}</span>
                                        <span>•</span>
                                        <span>{flight.seatLayout}</span>
                                        <span>•</span>
                                        <span>{getSeatPitchLabel(cabinClass)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom Color-Coded Amenity Chips */}
                                <div className="sr-amenity-bar">
                                  <span className={`sr-amenity-chip ${hasFreeMeal ? "is-included" : "is-unavailable"}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                                      <path d="M7 2v20" />
                                      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                                    </svg>
                                    <span>{hasFreeMeal ? "Complimentary Meal" : "Paid Meal"}</span>
                                  </span>

                                  <span className={`sr-amenity-chip ${flight.hasWifi ? "is-included" : "is-unavailable"}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                                      <line x1="12" y1="20" x2="12.01" y2="20" />
                                    </svg>
                                    <span>{flight.hasWifi ? "Onboard Wi-Fi" : "No Wi-Fi"}</span>
                                  </span>

                                  <span className={`sr-amenity-chip ${flight.hasPower ? "is-included" : "is-unavailable"}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    <span>{flight.hasPower ? "USB / Power Port" : "No Power Outlet"}</span>
                                  </span>

                                  <span className={`sr-amenity-chip ${flight.hasEntertainment ? "is-included" : "is-unavailable"}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <rect x="2" y="4" width="20" height="14" rx="2" />
                                      <line x1="8" y1="21" x2="16" y2="21" />
                                      <line x1="12" y1="18" x2="12" y2="21" />
                                    </svg>
                                    <span>{flight.hasEntertainment ? "In-flight Screen" : "No Seat Screen"}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Live SkyRoute Trip Boarding Pass */}
          <aside className="sr-trip-summary" aria-label="Selected trip summary">
            <div className="sr-pass-card">
              <div className="sr-pass-header">
                <div>
                  <h3>Your SkyRoute Trip</h3>
                  <span>
                    {totalTravellers} {totalTravellers === 1 ? "Traveller" : "Travellers"} • {cabinClass}
                  </span>
                </div>
                <span className="sr-pass-type">
                  {tripType === "round-trip" ? "Round-Trip" : "One-Way"}
                </span>
              </div>

              <div className="sr-pass-body">
                {/* Outbound Summary Stub */}
                {selectedOnward && (
                  <div className={`sr-pass-leg ${currentLeg === "onward" ? "is-focused" : ""}`}>
                    <div className="sr-pass-leg-head">
                      <span className="sr-leg-pill">OUTBOUND</span>
                      <span className="sr-leg-date">
                        {formatShortDate(addDaysIso(departDate, onwardDateOffset))}
                      </span>
                      {tripType === "round-trip" && (
                        <button
                          type="button"
                          className="sr-change-leg"
                          onClick={() => setActiveStep("onward")}
                        >
                          Change
                        </button>
                      )}
                    </div>
                    <div className="sr-pass-leg-row">
                      <span className="sr-logo-frame sr-pass-logo">
                        <Image
                          src={selectedOnward.airlineImage}
                          alt={selectedOnward.airlineName}
                          width={26}
                          height={26}
                          className="sr-logo-img"
                        />
                      </span>
                      <div className="sr-pass-leg-mid">
                        <strong>
                          {selectedOnward.fromCode} {selectedOnward.departTime} → {selectedOnward.toCode} {selectedOnward.arriveTime}
                        </strong>
                        <span>
                          {selectedOnward.airlineName} {selectedOnward.flightNumber} • {formatDuration(selectedOnward.durationMinutes)}
                        </span>
                      </div>
                      <span className="sr-pass-leg-fare">{formatInr(selectedOnward.basePrice)}</span>
                    </div>
                  </div>
                )}

                {/* Return Summary Stub */}
                {tripType === "round-trip" && selectedReturn && (
                  <div className={`sr-pass-leg ${currentLeg === "return" ? "is-focused" : ""}`}>
                    <div className="sr-pass-leg-head">
                      <span className="sr-leg-pill is-return">RETURN</span>
                      <span className="sr-leg-date">
                        {formatShortDate(addDaysIso(effectiveReturnBaseDate, returnDateOffset))}
                      </span>
                      <button
                        type="button"
                        className="sr-change-leg"
                        onClick={() => setActiveStep("return")}
                      >
                        Change
                      </button>
                    </div>
                    <div className="sr-pass-leg-row">
                      <span className="sr-logo-frame sr-pass-logo">
                        <Image
                          src={selectedReturn.airlineImage}
                          alt={selectedReturn.airlineName}
                          width={26}
                          height={26}
                          className="sr-logo-img"
                        />
                      </span>
                      <div className="sr-pass-leg-mid">
                        <strong>
                          {selectedReturn.fromCode} {selectedReturn.departTime} → {selectedReturn.toCode} {selectedReturn.arriveTime}
                        </strong>
                        <span>
                          {selectedReturn.airlineName} {selectedReturn.flightNumber} • {formatDuration(selectedReturn.durationMinutes)}
                        </span>
                      </div>
                      <span className="sr-pass-leg-fare">{formatInr(selectedReturn.basePrice)}</span>
                    </div>
                  </div>
                )}

                {/* Fare Lock Add-on */}
                <label className={`sr-lock-box ${priceLockEnabled ? "active" : ""}`}>
                  <input
                    type="checkbox"
                    checked={priceLockEnabled}
                    onChange={(e) => setPriceLockEnabled(e.target.checked)}
                  />
                  <div className="sr-lock-text">
                    <strong>Lock Fare for 24 hrs</strong>
                    <span>Protect against price hike</span>
                  </div>
                  <span className="sr-lock-fee">+₹499</span>
                </label>

                {/* Fare Breakdown */}
                <div className="sr-fare-breakdown">
                  <div className="sr-fare-line">
                    <span>Base Fare ({totalSeated} seated)</span>
                    <span>{formatInr(baseSubtotal)}</span>
                  </div>
                  <div className="sr-fare-line is-discount">
                    <span>SkyRoute Instant Savings</span>
                    <span>−{formatInr(instantDiscount)}</span>
                  </div>
                  {priceLockEnabled && (
                    <div className="sr-fare-line">
                      <span>24h Fare Lock</span>
                      <span>{formatInr(priceLockFee)}</span>
                    </div>
                  )}
                  <div className="sr-fare-total-row">
                    <span>Total Payable</span>
                    <strong>{formatInr(grandTotal)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="sr-book-cta"
                  onClick={handleContinueToBook}
                >
                  Continue to Book
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default function AllFlightsPage() {
  return (
    <Suspense
      fallback={
        <div className="sr-flights-page">
          <div className="sr-container sr-loading">Loading SkyRoute flights…</div>
        </div>
      }
    >
      <AllFlightsContent />
    </Suspense>
  );
}
