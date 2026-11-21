"use client";

import React, { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import "./AllBus.css";

type BusCategory = "ac" | "non-ac" | "sleeper" | "seater";
type BusFeature = "live-gps" | "new-fleet" | "offers";
type TimeWindow = "morning" | "afternoon" | "evening" | "night";
type SortOption = "recommended" | "cheapest" | "fastest" | "top-rated" | "earliest";
type DetailTab = "points" | "amenities" | "policy";

interface StopPoint {
  time: string;
  name: string;
  landmark: string;
}

interface BusItem {
  id: string;
  operator: string;
  coachName: string;
  isGovt: boolean;
  assured: boolean;
  isNewFleet: boolean;
  liveTracking: boolean;
  hasWashroom: boolean;
  rating: number;
  reviews: number;
  departTime: string;
  arriveTime: string;
  departMinutes: number;
  durationMinutes: number;
  price: number;
  originalPrice?: number;
  flashOffer?: string;
  seatsLeft: number;
  singleBerths: number;
  isAc: boolean;
  isSleeper: boolean;
  isSeater: boolean;
  fleetAge: string;
  amenities: string[];
  boardingPoints: StopPoint[];
  droppingPoints: StopPoint[];
  bookedSeats: string[];
  ladiesSeats: string[];
}

const POPULAR_CITIES = [
  "Kolkata",
  "Digha",
  "Siliguri",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Mumbai",
  "Pune",
  "New Delhi",
  "Jaipur",
  "Ahmedabad",
  "Goa",
];

const TODAY_ISO = "2026-11-18";
const TOMORROW_ISO = "2026-11-19";
const DAY_AFTER_ISO = "2026-11-20";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_WINDOWS: { id: TimeWindow; label: string; sub: string }[] = [
  { id: "morning", label: "Before 10 AM", sub: "Early" },
  { id: "afternoon", label: "10 AM – 5 PM", sub: "Day" },
  { id: "evening", label: "5 PM – 11 PM", sub: "Evening" },
  { id: "night", label: "After 11 PM", sub: "Late Night" },
];

const LOWER_DECK_SEATS = [
  ["L1", "L2", null, "L3"],
  ["L4", "L5", null, "L6"],
  ["L7", "L8", null, "L9"],
  ["L10", "L11", null, "L12"],
];

const UPPER_DECK_SEATS = [
  ["U1", "U2", null, "U3"],
  ["U4", "U5", null, "U6"],
  ["U7", "U8", null, "U9"],
  ["U10", "U11", null, "U12"],
];

function formatReadableDate(iso: string): string {
  if (!iso) return "18 Nov 2026";
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return iso;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return `${WEEKDAYS[d.getUTCDay()]}, ${parts[2]} ${MONTHS[parts[1] - 1]} ${parts[0]}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function matchesTimeWindow(departMinutes: number, win: TimeWindow): boolean {
  if (win === "morning") return departMinutes >= 300 && departMinutes < 600;
  if (win === "afternoon") return departMinutes >= 600 && departMinutes < 1020;
  if (win === "evening") return departMinutes >= 1020 && departMinutes < 1380;
  return departMinutes >= 1380 || departMinutes < 300;
}

function getRtcMeta(fromCity: string): {
  code: string;
  name: string;
  logo: string;
  rating: string;
  reviews: string;
  promoCode: string;
  busCount: number;
  seatsAvail: number;
} {
  const key = fromCity.toLowerCase();
  if (key.includes("kolkata") || key.includes("digha") || key.includes("siliguri")) {
    return {
      code: "WBTC",
      name: "West Bengal Transport Corporation",
      logo: "/images/bus/busStateLogo5.png",
      rating: "4.4",
      reviews: "42.6K",
      promoCode: "WBTC300",
      busCount: 24,
      seatsAvail: 618,
    };
  }
  if (key.includes("delhi") || key.includes("chandigarh") || key.includes("amritsar")) {
    return {
      code: "PRTC",
      name: "PEPSU Road Transport Corporation",
      logo: "/images/bus/busStateLogo1.png",
      rating: "4.3",
      reviews: "31.2K",
      promoCode: "PRTC300",
      busCount: 19,
      seatsAvail: 492,
    };
  }
  if (key.includes("shimla") || key.includes("manali") || key.includes("himachal")) {
    return {
      code: "HRTC",
      name: "Himachal Road Transport Corporation",
      logo: "/images/bus/busStateLogo4.png",
      rating: "4.5",
      reviews: "54.1K",
      promoCode: "HRTC300",
      busCount: 28,
      seatsAvail: 710,
    };
  }
  return {
    code: "OSRTC",
    name: "State Road Transport Corporation",
    logo: "/images/bus/busStateLogo3.png",
    rating: "4.3",
    reviews: "38.4K",
    promoCode: "RTC300",
    busCount: 21,
    seatsAvail: 661,
  };
}

function buildBusCatalog(fromCity: string, toCity: string): BusItem[] {
  const from = fromCity.trim() || "Kolkata";
  const to = toCity.trim() || "Digha";
  const rtc = getRtcMeta(from);

  return [
    {
      id: "sky-navigator-01",
      operator: "SkyLine Navigator",
      coachName: "Bharat Benz AC Sleeper (2+1)",
      isGovt: false,
      assured: true,
      isNewFleet: true,
      liveTracking: true,
      hasWashroom: true,
      rating: 4.7,
      reviews: 312,
      departTime: "22:05",
      arriveTime: "07:35",
      departMinutes: 1325,
      durationMinutes: 570,
      price: 1299,
      originalPrice: 1449,
      flashOffer: "Flash Deal • Save ₹150",
      seatsLeft: 15,
      singleBerths: 3,
      isAc: true,
      isSleeper: true,
      isSeater: false,
      fleetAge: "2 Months Old",
      amenities: ["Live GPS", "Washroom", "USB Charging", "Blanket", "Reading Light", "Water Bottle"],
      boardingPoints: [
        { time: "21:40", name: `${from} Central Hub`, landmark: "Gate 2 Express Lounge" },
        { time: "22:05", name: `${from} Highway Plaza`, landmark: "Opposite Metro Pillar 14" },
        { time: "22:25", name: `${from} Bypass Point`, landmark: "Near SkyRoute Pickup Desk" },
      ],
      droppingPoints: [
        { time: "07:10", name: `${to} Ring Road`, landmark: "City Entry Flyover" },
        { time: "07:35", name: `${to} Main Bus Terminus`, landmark: "Platform 4 Arrival Bay" },
      ],
      bookedSeats: ["L2", "L4", "L8", "U1", "U5", "U9", "U11"],
      ladiesSeats: ["L3", "U3"],
    },
    {
      id: "intrcity-smart-02",
      operator: "IntrCity SmartBus",
      coachName: "Volvo 9600 AC Seater / Sleeper (2+1)",
      isGovt: false,
      assured: true,
      isNewFleet: true,
      liveTracking: true,
      hasWashroom: true,
      rating: 4.6,
      reviews: 528,
      departTime: "21:15",
      arriveTime: "06:30",
      departMinutes: 1275,
      durationMinutes: 555,
      price: 899,
      originalPrice: 1020,
      flashOffer: "Save ₹121 per seat",
      seatsLeft: 18,
      singleBerths: 4,
      isAc: true,
      isSleeper: true,
      isSeater: true,
      fleetAge: "4 Months Old",
      amenities: ["Live GPS", "Washroom", "Captain Onboard", "Clean Linen", "CCTV", "USB Charging"],
      boardingPoints: [
        { time: "20:55", name: `${from} Smart Lounge`, landmark: "Waiting Area Bay 1" },
        { time: "21:15", name: `${from} Central Hub`, landmark: "Main Highway Arch" },
      ],
      droppingPoints: [
        { time: "06:10", name: `${to} Junction`, landmark: "Near Railway Crossing" },
        { time: "06:30", name: `${to} Main Bus Terminus`, landmark: "SmartBus Arrival Zone" },
      ],
      bookedSeats: ["L1", "L5", "L9", "U2", "U6", "U10"],
      ladiesSeats: ["L6", "U6"],
    },
    {
      id: "govt-rtc-03",
      operator: `${rtc.code} Volvo Express`,
      coachName: "Govt. Official AC Volvo Multi-Axle (2+2)",
      isGovt: true,
      assured: true,
      isNewFleet: true,
      liveTracking: true,
      hasWashroom: false,
      rating: 4.5,
      reviews: 840,
      departTime: "07:30",
      arriveTime: "14:45",
      departMinutes: 450,
      durationMinutes: 435,
      price: 749,
      originalPrice: 849,
      flashOffer: `Govt RTC Offer • Code ${rtc.promoCode}`,
      seatsLeft: 22,
      singleBerths: 0,
      isAc: true,
      isSleeper: false,
      isSeater: true,
      fleetAge: "Official RTC Fleet",
      amenities: ["Live GPS", "Govt. Verified", "Pushback Seats", "Emergency SOS", "Charging Point"],
      boardingPoints: [
        { time: "07:15", name: `${from} State RTC Stand`, landmark: "Counter No. 5" },
        { time: "07:30", name: `${from} Bypass Point`, landmark: "RTC Express Bay" },
      ],
      droppingPoints: [
        { time: "14:45", name: `${to} State RTC Terminus`, landmark: "Main Platform 1" },
      ],
      bookedSeats: ["L2", "L7", "U4", "U8"],
      ladiesSeats: ["L1", "L4"],
    },
    {
      id: "greenline-express-04",
      operator: "GreenLine Cruiser",
      coachName: "Scania Metrolink AC Semi-Sleeper (2+2)",
      isGovt: false,
      assured: true,
      isNewFleet: false,
      liveTracking: true,
      hasWashroom: false,
      rating: 4.4,
      reviews: 215,
      departTime: "13:20",
      arriveTime: "20:10",
      departMinutes: 800,
      durationMinutes: 410,
      price: 689,
      seatsLeft: 9,
      singleBerths: 0,
      isAc: true,
      isSleeper: false,
      isSeater: true,
      fleetAge: "1 Year Old",
      amenities: ["Live GPS", "USB Charging", "Water Bottle", "Snacks Stop", "Reading Light"],
      boardingPoints: [
        { time: "13:05", name: `${from} Central Hub`, landmark: "Platform 3" },
        { time: "13:20", name: `${from} Highway Plaza`, landmark: "Toll Gate Stop" },
      ],
      droppingPoints: [
        { time: "19:50", name: `${to} Ring Road`, landmark: "South Circle" },
        { time: "20:10", name: `${to} Main Bus Terminus`, landmark: "Gate 1" },
      ],
      bookedSeats: ["L1", "L3", "L5", "L6", "L10", "U1", "U3", "U7", "U9", "U12"],
      ladiesSeats: ["L9", "U4"],
    },
    {
      id: "royal-deccan-05",
      operator: "Royal Meridian Travels",
      coachName: "Mercedes-Benz Multi-Axle AC Sleeper (2+1)",
      isGovt: false,
      assured: true,
      isNewFleet: true,
      liveTracking: true,
      hasWashroom: true,
      rating: 4.8,
      reviews: 419,
      departTime: "23:20",
      arriveTime: "08:05",
      departMinutes: 1400,
      durationMinutes: 525,
      price: 1549,
      originalPrice: 1799,
      flashOffer: "Flat ₹250 OFF • VIP Cabin",
      seatsLeft: 6,
      singleBerths: 2,
      isAc: true,
      isSleeper: true,
      isSeater: false,
      fleetAge: "3 Months Old",
      amenities: ["Live GPS", "Washroom", "Privacy Curtains", "Blanket & Pillow", "Wi-Fi", "USB-C Fast Charge"],
      boardingPoints: [
        { time: "23:00", name: `${from} Smart Lounge`, landmark: "Executive Bay" },
        { time: "23:20", name: `${from} Bypass Point`, landmark: "Expressway Ramp" },
      ],
      droppingPoints: [
        { time: "08:05", name: `${to} Main Bus Terminus`, landmark: "VIP Arrival Lane" },
      ],
      bookedSeats: ["L1", "L2", "L4", "L5", "L7", "L8", "L11", "U1", "U2", "U5", "U6", "U8", "U10", "U11"],
      ladiesSeats: ["L3", "U3"],
    },
    {
      id: "janata-nonac-06",
      operator: `${rtc.code} Express Deluxe`,
      coachName: "Govt. Non-AC Seater / Sleeper (2+2)",
      isGovt: true,
      assured: false,
      isNewFleet: false,
      liveTracking: false,
      hasWashroom: false,
      rating: 4.1,
      reviews: 196,
      departTime: "16:45",
      arriveTime: "00:30",
      departMinutes: 1005,
      durationMinutes: 465,
      price: 459,
      seatsLeft: 27,
      singleBerths: 2,
      isAc: false,
      isSleeper: true,
      isSeater: true,
      fleetAge: "Govt. Verified",
      amenities: ["Govt. Verified", "Overhead Luggage", "Fixed Fare", "Emergency Exit"],
      boardingPoints: [
        { time: "16:30", name: `${from} State RTC Stand`, landmark: "Platform 8" },
        { time: "16:45", name: `${from} Highway Plaza`, landmark: "Express Stop" },
      ],
      droppingPoints: [
        { time: "00:30", name: `${to} State RTC Terminus`, landmark: "Platform 3" },
      ],
      bookedSeats: ["L4", "U7"],
      ladiesSeats: ["L1", "L2"],
    },
  ];
}

function AllBusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFrom = searchParams.get("from") || "Kolkata";
  const initialTo = searchParams.get("to") || "Digha";
  const initialDepart = searchParams.get("depart") || TODAY_ISO;
  const initialCoach = searchParams.get("coach") || "all";

  // Top Search Bar states
  const [fromInput, setFromInput] = useState(initialFrom);
  const [toInput, setToInput] = useState(initialTo);
  const [departDate, setDepartDate] = useState(initialDepart);
  const [activeFrom, setActiveFrom] = useState(initialFrom);
  const [activeTo, setActiveTo] = useState(initialTo);
  const [activeDate, setActiveDate] = useState(initialDepart);

  // Sidebar Filters
  const [selectedBusTypes, setSelectedBusTypes] = useState<BusCategory[]>(() => {
    if (initialCoach === "ac-sleeper") return ["ac", "sleeper"];
    if (initialCoach === "ac-seater") return ["ac", "seater"];
    if (initialCoach === "volvo") return ["ac"];
    return [];
  });
  const [selectedFeatures, setSelectedFeatures] = useState<BusFeature[]>([]);
  const [selectedTimeWindows, setSelectedTimeWindows] = useState<TimeWindow[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<string[]>([]);
  const [selectedDropping, setSelectedDropping] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [govtOnly, setGovtOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  // Accordion UI states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    partner: true,
    boarding: false,
    dropping: false,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Per-card interactive drawers (Seat Deck & Bus Details)
  const [openSeatBusId, setOpenSeatBusId] = useState<string | null>(null);
  const [openDetailBusId, setOpenDetailBusId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("points");
  const [selectedSeatsByBus, setSelectedSeatsByBus] = useState<Record<string, string[]>>({});
  const [boardingByBus, setBoardingByBus] = useState<Record<string, string>>({});
  const [droppingByBus, setDroppingByBus] = useState<Record<string, string>>({});
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    bus: BusItem;
    seats: string[];
    boarding: string;
    dropping: string;
    total: number;
  } | null>(null);

  const busCatalog = useMemo(
    () => buildBusCatalog(activeFrom, activeTo),
    [activeFrom, activeTo]
  );

  const rtcMeta = useMemo(() => getRtcMeta(activeFrom), [activeFrom]);

  const allOperators = useMemo(
    () => Array.from(new Set(busCatalog.map((b) => b.operator))),
    [busCatalog]
  );

  const allBoardingPoints = useMemo(
    () => Array.from(new Set(busCatalog.flatMap((b) => b.boardingPoints.map((p) => p.name)))),
    [busCatalog]
  );

  const allDroppingPoints = useMemo(
    () => Array.from(new Set(busCatalog.flatMap((b) => b.droppingPoints.map((p) => p.name)))),
    [busCatalog]
  );

  const visibleBuses = useMemo(() => {
    const filtered = busCatalog.filter((bus) => {
      if (govtOnly && !bus.isGovt) return false;
      if (bus.price > maxPrice) return false;

      if (selectedBusTypes.length > 0) {
        const acRequested = selectedBusTypes.includes("ac");
        const nonAcRequested = selectedBusTypes.includes("non-ac");
        if (acRequested && !nonAcRequested && !bus.isAc) return false;
        if (nonAcRequested && !acRequested && bus.isAc) return false;

        const sleeperRequested = selectedBusTypes.includes("sleeper");
        const seaterRequested = selectedBusTypes.includes("seater");
        if (sleeperRequested && !seaterRequested && !bus.isSleeper) return false;
        if (seaterRequested && !sleeperRequested && !bus.isSeater) return false;
      }

      if (selectedFeatures.includes("live-gps") && !bus.liveTracking) return false;
      if (selectedFeatures.includes("new-fleet") && !bus.isNewFleet) return false;
      if (selectedFeatures.includes("offers") && !bus.flashOffer) return false;

      if (
        selectedTimeWindows.length > 0 &&
        !selectedTimeWindows.some((w) => matchesTimeWindow(bus.departMinutes, w))
      ) {
        return false;
      }

      if (selectedOperators.length > 0 && !selectedOperators.includes(bus.operator)) {
        return false;
      }

      if (
        selectedBoarding.length > 0 &&
        !bus.boardingPoints.some((p) => selectedBoarding.includes(p.name))
      ) {
        return false;
      }

      if (
        selectedDropping.length > 0 &&
        !bus.droppingPoints.some((p) => selectedDropping.includes(p.name))
      ) {
        return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "cheapest") return a.price - b.price;
      if (sortBy === "fastest") return a.durationMinutes - b.durationMinutes;
      if (sortBy === "top-rated") return b.rating - a.rating;
      if (sortBy === "earliest") return a.departMinutes - b.departMinutes;
      return (b.assured ? 1 : 0) - (a.assured ? 1 : 0) || b.rating - a.rating;
    });
  }, [
    busCatalog,
    govtOnly,
    maxPrice,
    selectedBusTypes,
    selectedFeatures,
    selectedTimeWindows,
    selectedOperators,
    selectedBoarding,
    selectedDropping,
    sortBy,
  ]);

  const activeFilterCount =
    selectedBusTypes.length +
    selectedFeatures.length +
    selectedTimeWindows.length +
    selectedOperators.length +
    selectedBoarding.length +
    selectedDropping.length +
    (maxPrice < 3000 ? 1 : 0) +
    (govtOnly ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedBusTypes([]);
    setSelectedFeatures([]);
    setSelectedTimeWindows([]);
    setSelectedOperators([]);
    setSelectedBoarding([]);
    setSelectedDropping([]);
    setMaxPrice(3000);
    setGovtOnly(false);
  };

  const toggleItem = <T extends string>(
    value: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSwapCities = () => {
    setFromInput(toInput);
    setToInput(fromInput);
  };

  const applySearch = (nextFrom: string, nextTo: string, nextDate: string) => {
    const cleanFrom = nextFrom.trim() || "Kolkata";
    const cleanTo = nextTo.trim() || "Digha";
    setActiveFrom(cleanFrom);
    setActiveTo(cleanTo);
    setActiveDate(nextDate);
    setOpenSeatBusId(null);
    setOpenDetailBusId(null);

    const params = new URLSearchParams({
      from: cleanFrom,
      to: cleanTo,
      depart: nextDate,
    });
    router.replace(`/allBus?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch(fromInput, toInput, departDate);
  };

  const handleQuickDate = (iso: string) => {
    setDepartDate(iso);
    applySearch(fromInput, toInput, iso);
  };

  const handleToggleSeat = (busId: string, seatCode: string) => {
    setSelectedSeatsByBus((prev) => {
      const current = prev[busId] || [];
      if (current.includes(seatCode)) {
        return { ...prev, [busId]: current.filter((s) => s !== seatCode) };
      }
      if (current.length >= 6) return prev;
      return { ...prev, [busId]: [...current, seatCode] };
    });
  };

  const handleProceedBooking = (bus: BusItem) => {
    const seats = selectedSeatsByBus[bus.id] || [];
    if (seats.length === 0) return;
    const boardingPoint =
      bus.boardingPoints.find((p) => p.name === boardingByBus[bus.id]) ||
      bus.boardingPoints[0];
    const droppingPoint =
      bus.droppingPoints.find((p) => p.name === droppingByBus[bus.id]) ||
      bus.droppingPoints[bus.droppingPoints.length - 1];

    const boarding = boardingPoint ? boardingPoint.name : activeFrom;
    const dropping = droppingPoint ? droppingPoint.name : activeTo;
    const boardingTime = boardingPoint ? boardingPoint.time : bus.departTime;
    const droppingTime = droppingPoint ? droppingPoint.time : bus.arriveTime;
    const boardingLandmark = boardingPoint ? boardingPoint.landmark : "";
    const droppingLandmark = droppingPoint ? droppingPoint.landmark : "";

    const bookingPayload = {
      type: "bus",
      busId: bus.id,
      operator: bus.operator,
      coachName: bus.coachName,
      isGovt: bus.isGovt,
      assured: bus.assured,
      rating: bus.rating,
      reviews: bus.reviews,
      departTime: bus.departTime,
      arriveTime: bus.arriveTime,
      durationMinutes: bus.durationMinutes,
      price: bus.price,
      originalPrice: bus.originalPrice || bus.price,
      seats,
      boarding,
      dropping,
      boardingTime,
      droppingTime,
      boardingLandmark,
      droppingLandmark,
      boardingPoints: bus.boardingPoints,
      droppingPoints: bus.droppingPoints,
      from: activeFrom,
      to: activeTo,
      departDate: activeDate,
      total: seats.length * bus.price,
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("skyroute_bus_booking", JSON.stringify(bookingPayload));
      } catch (err) {
        console.error("Failed saving bus booking details to sessionStorage", err);
      }
    }

    const q = new URLSearchParams({
      type: "bus",
      busId: bus.id,
      operator: bus.operator,
      coach: bus.coachName,
      from: activeFrom,
      to: activeTo,
      depart: activeDate,
      seats: seats.join(","),
      fare: String(bus.price),
      boarding: boarding,
      dropping: dropping,
      boardingTime: boardingTime,
      droppingTime: droppingTime,
      duration: String(bus.durationMinutes),
      isGovt: bus.isGovt ? "1" : "0",
      assured: bus.assured ? "1" : "0",
    });

    router.push(`/bookingDetails?${q.toString()}`);
  };

  return (
    <div className="sb-page">
      {/* 1. SkyRoute Deep-Navy Command Search Header (1320px Container) */}
      <section className="sb-command-section" aria-label="Modify bus search">
        <div className="sb-container">
          <div className="sb-command-banner">
            <form onSubmit={handleSearchSubmit} className="sb-search-bar">
              <div className="sb-route-pair">
                <label className="sb-input-tile">
                  <span className="sb-tile-label">From City</span>
                  <div className="sb-tile-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                    </svg>
                    <input
                      type="text"
                      list="sb-bus-cities"
                      className="sb-text-input"
                      value={fromInput}
                      onChange={(e) => setFromInput(e.target.value)}
                      placeholder="Departure city"
                    />
                  </div>
                </label>

                <button
                  type="button"
                  className="sb-swap-btn"
                  onClick={handleSwapCities}
                  aria-label="Swap departure and destination cities"
                  title="Swap cities"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 7l-5 5 5 5" />
                    <path d="M3 12h18" />
                    <path d="M16 17l5-5-5-5" />
                  </svg>
                </button>

                <label className="sb-input-tile">
                  <span className="sb-tile-label">To City</span>
                  <div className="sb-tile-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <input
                      type="text"
                      list="sb-bus-cities"
                      className="sb-text-input"
                      value={toInput}
                      onChange={(e) => setToInput(e.target.value)}
                      placeholder="Destination city"
                    />
                  </div>
                </label>

                <datalist id="sb-bus-cities">
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <label className="sb-input-tile sb-date-tile">
                <span className="sb-tile-label">Journey Date</span>
                <input
                  type="date"
                  className="sb-text-input sb-date-input"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                />
              </label>

              <div className="sb-quick-dates" role="group" aria-label="Quick journey date">
                <button
                  type="button"
                  className={departDate === TODAY_ISO ? "is-active" : ""}
                  onClick={() => handleQuickDate(TODAY_ISO)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={departDate === TOMORROW_ISO ? "is-active" : ""}
                  onClick={() => handleQuickDate(TOMORROW_ISO)}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className={departDate === DAY_AFTER_ISO ? "is-active" : ""}
                  onClick={() => handleQuickDate(DAY_AFTER_ISO)}
                >
                  20 Nov
                </button>
              </div>

              <button type="submit" className="sb-search-btn">
                <span>Search Buses</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Listing Workspace inside 1320px Container */}
      <div className="sb-container">
        <div className="sb-mobile-filter-bar">
          <button
            type="button"
            className="sb-mobile-filter-toggle"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
          >
            <span>{mobileFiltersOpen ? "Hide Filters" : "Filter Buses"}</span>
            {activeFilterCount > 0 && (
              <span className="sb-filter-count">{activeFilterCount}</span>
            )}
          </button>
          <span className="sb-mobile-result-count">
            {visibleBuses.length} {visibleBuses.length === 1 ? "Bus" : "Buses"} Found
          </span>
        </div>

        <div className="sb-workspace">
          {/* LEFT: Sticky SkyRoute Filter Rail */}
          <aside
            className={`sb-sidebar ${mobileFiltersOpen ? "is-open" : ""}`}
            aria-label="Bus filters"
          >
            <div className="sb-sidebar-header">
              <div className="sb-sidebar-title">
                <h2>Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="sb-filter-count">{activeFilterCount}</span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="sb-reset-btn"
                  onClick={resetAllFilters}
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Bus Type Tiles */}
            <div className="sb-filter-block">
              <h3 className="sb-filter-heading">Bus Type</h3>
              <div className="sb-type-grid">
                {(
                  [
                    { id: "ac", label: "AC" },
                    { id: "non-ac", label: "Non-AC" },
                    { id: "sleeper", label: "Sleeper" },
                    { id: "seater", label: "Seater" },
                  ] as const
                ).map((item) => {
                  const active = selectedBusTypes.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`sb-tile-btn ${active ? "is-active" : ""}`}
                      onClick={() => toggleItem(item.id, setSelectedBusTypes)}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="sb-feature-grid">
                {(
                  [
                    { id: "live-gps", label: "Live GPS" },
                    { id: "new-fleet", label: "New Fleet" },
                    { id: "offers", label: "Deals" },
                  ] as const
                ).map((feat) => {
                  const active = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      className={`sb-mini-chip ${active ? "is-active" : ""}`}
                      onClick={() => toggleItem(feat.id, setSelectedFeatures)}
                    >
                      {feat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="sb-filter-block">
              <div className="sb-price-head">
                <h3 className="sb-filter-heading">Max Ticket Fare</h3>
                <span className="sb-price-val">{formatInr(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={450}
                max={3000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="sb-range-slider"
                aria-label="Maximum bus ticket price"
              />
              <div className="sb-range-scale">
                <span>₹450</span>
                <span>₹3,000</span>
              </div>
            </div>

            {/* Departure Time Windows */}
            <div className="sb-filter-block">
              <h3 className="sb-filter-heading">Departure Time</h3>
              <div className="sb-time-grid">
                {TIME_WINDOWS.map((win) => {
                  const active = selectedTimeWindows.includes(win.id);
                  return (
                    <button
                      key={win.id}
                      type="button"
                      className={`sb-time-btn ${active ? "is-active" : ""}`}
                      onClick={() => toggleItem(win.id, setSelectedTimeWindows)}
                    >
                      <small>{win.sub}</small>
                      <strong>{win.label}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collapsible Bus Partner Filter */}
            <div className="sb-accordion">
              <button
                type="button"
                className="sb-accordion-trigger"
                onClick={() =>
                  setOpenAccordions((prev) => ({ ...prev, partner: !prev.partner }))
                }
                aria-expanded={openAccordions.partner}
              >
                <span>Bus Partner</span>
                <svg
                  className={openAccordions.partner ? "is-open" : ""}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openAccordions.partner && (
                <div className="sb-check-list">
                  {allOperators.map((op) => (
                    <label key={op} className="sb-check-item">
                      <input
                        type="checkbox"
                        checked={selectedOperators.includes(op)}
                        onChange={() => toggleItem(op, setSelectedOperators)}
                      />
                      <span>{op}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Collapsible Boarding Point Filter */}
            <div className="sb-accordion">
              <button
                type="button"
                className="sb-accordion-trigger"
                onClick={() =>
                  setOpenAccordions((prev) => ({ ...prev, boarding: !prev.boarding }))
                }
                aria-expanded={openAccordions.boarding}
              >
                <span>Boarding Point</span>
                <svg
                  className={openAccordions.boarding ? "is-open" : ""}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openAccordions.boarding && (
                <div className="sb-check-list">
                  {allBoardingPoints.map((pt) => (
                    <label key={pt} className="sb-check-item">
                      <input
                        type="checkbox"
                        checked={selectedBoarding.includes(pt)}
                        onChange={() => toggleItem(pt, setSelectedBoarding)}
                      />
                      <span>{pt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Collapsible Dropping Point Filter */}
            <div className="sb-accordion sb-accordion-last">
              <button
                type="button"
                className="sb-accordion-trigger"
                onClick={() =>
                  setOpenAccordions((prev) => ({ ...prev, dropping: !prev.dropping }))
                }
                aria-expanded={openAccordions.dropping}
              >
                <span>Dropping Point</span>
                <svg
                  className={openAccordions.dropping ? "is-open" : ""}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openAccordions.dropping && (
                <div className="sb-check-list">
                  {allDroppingPoints.map((pt) => (
                    <label key={pt} className="sb-check-item">
                      <input
                        type="checkbox"
                        checked={selectedDropping.includes(pt)}
                        onChange={() => toggleItem(pt, setSelectedDropping)}
                      />
                      <span>{pt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT: Govt RTC Spotlight + Sort Strip + Bus Ticket Cards */}
          <div className="sb-results-col">
            {/* Official Government RTC Partner Spotlight Banner */}
            <div className="sb-rtc-banner">
              <div className="sb-rtc-top">
                <div className="sb-rtc-brand">
                  <div className="sb-rtc-crest">
                    <Image
                      src={rtcMeta.logo}
                      alt={`${rtcMeta.code} logo`}
                      fill
                      sizes="48px"
                      className="sb-rtc-logo-img"
                    />
                  </div>
                  <div className="sb-rtc-info">
                    <div className="sb-rtc-title-row">
                      <h3>{rtcMeta.code}</h3>
                      <span className="sb-rtc-fullname">{rtcMeta.name}</span>
                      <span className="sb-rating-pill">
                        ★ {rtcMeta.rating} <small>({rtcMeta.reviews})</small>
                      </span>
                    </div>
                    <p className="sb-rtc-stats">
                      {rtcMeta.busCount} Official Buses • {rtcMeta.seatsAvail} Seats Available on {activeFrom} → {activeTo}
                    </p>
                  </div>
                </div>

                <div className="sb-rtc-price-box">
                  <span className="sb-rtc-from">Starting from</span>
                  <strong>₹459</strong>
                </div>
              </div>

              <div className="sb-rtc-bottom">
                <div className="sb-rtc-perks">
                  <span className="sb-rtc-promo">
                    Save up to ₹300 on {rtcMeta.code} bookings • Code: <strong>{rtcMeta.promoCode}</strong>
                  </span>
                  <span className="sb-rtc-tag">Official Fleet</span>
                  <span className="sb-rtc-tag">Live Tracking</span>
                </div>

                <button
                  type="button"
                  className={`sb-rtc-toggle-btn ${govtOnly ? "is-active" : ""}`}
                  onClick={() => setGovtOnly((prev) => !prev)}
                >
                  {govtOnly ? "Showing Govt Buses (Reset)" : "View Govt Buses"}
                </button>
              </div>
            </div>

            {/* Route Summary & Sort Bar */}
            <div className="sb-sort-strip">
              <div className="sb-route-summary">
                <h1>
                  {activeFrom} <span>→</span> {activeTo}
                </h1>
                <p>
                  <strong>{visibleBuses.length}</strong>{" "}
                  {visibleBuses.length === 1 ? "bus" : "buses"} on {formatReadableDate(activeDate)}
                </p>
              </div>

              <div className="sb-sort-pills" role="tablist" aria-label="Sort buses">
                {(
                  [
                    { id: "recommended", label: "Recommended" },
                    { id: "cheapest", label: "Cheapest" },
                    { id: "fastest", label: "Fastest" },
                    { id: "top-rated", label: "Top Rated" },
                    { id: "earliest", label: "Earliest" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={sortBy === opt.id}
                    className={sortBy === opt.id ? "is-active" : ""}
                    onClick={() => setSortBy(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bus Result Cards */}
            {visibleBuses.length === 0 ? (
              <div className="sb-empty-state">
                <h3>No buses match your current filters</h3>
                <p>Try widening your price range, clearing time slots, or resetting filters to view all coaches on this route.</p>
                <button type="button" className="sb-empty-reset" onClick={resetAllFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="sb-card-list">
                {visibleBuses.map((bus) => {
                  const isSeatsOpen = openSeatBusId === bus.id;
                  const isDetailOpen = openDetailBusId === bus.id;
                  const pickedSeats = selectedSeatsByBus[bus.id] || [];
                  const selectedBoard = boardingByBus[bus.id] || bus.boardingPoints[0]?.name || activeFrom;
                  const selectedDrop = droppingByBus[bus.id] || bus.droppingPoints[0]?.name || activeTo;
                  const savings = bus.originalPrice ? bus.originalPrice - bus.price : 0;
                  const accentClass = bus.isGovt
                    ? "is-govt"
                    : bus.flashOffer
                    ? "is-deal"
                    : "is-assured";

                  return (
                    <article key={bus.id} className={`sb-bus-card ${accentClass}`}>
                      <div className="sb-bus-main-grid">
                        {/* Left & Center Ticket Details */}
                        <div className="sb-bus-body">
                          {/* Top Trust & Offer Ribbon */}
                          <div className="sb-card-topbar">
                            <div className="sb-badges-left">
                              {bus.isGovt ? (
                                <span className="sb-badge sb-badge-govt">Official Govt RTC</span>
                              ) : bus.assured ? (
                                <span className="sb-badge sb-badge-assured">SkyRoute Assured</span>
                              ) : null}

                              <span className="sb-rating-pill">
                                ★ {bus.rating.toFixed(1)} <small>({bus.reviews})</small>
                              </span>

                              {bus.flashOffer && (
                                <span className="sb-badge sb-badge-offer">{bus.flashOffer}</span>
                              )}
                            </div>

                            <div className="sb-badges-right">
                              <span className="sb-fleet-pill">{bus.fleetAge}</span>
                              {bus.liveTracking && (
                                <span className="sb-gps-pill">
                                  <span className="sb-gps-dot" aria-hidden="true" />
                                  Live GPS
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Operator Info + Visual Journey Timeline */}
                          <div className="sb-journey-row">
                            <div className="sb-operator-col">
                              <h2 className="sb-operator-name">{bus.operator}</h2>
                              <p className="sb-coach-meta">{bus.coachName}</p>
                              <div className="sb-berth-tags">
                                {bus.singleBerths > 0 && (
                                  <span className="sb-berth-chip">
                                    {bus.singleBerths} Single Berths
                                  </span>
                                )}
                                {bus.hasWashroom && (
                                  <span className="sb-berth-chip">Onboard Washroom</span>
                                )}
                              </div>
                            </div>

                            <div className="sb-timeline-col">
                              <div className="sb-time-node">
                                <strong>{bus.departTime}</strong>
                                <span>{activeFrom}</span>
                                <small>{bus.boardingPoints[0]?.name}</small>
                              </div>

                              <div className="sb-duration-track" aria-label={`Duration ${formatDuration(bus.durationMinutes)}`}>
                                <span className="sb-duration-pill">
                                  {formatDuration(bus.durationMinutes)}
                                </span>
                                <div className="sb-track-line">
                                  <span className="sb-track-dot" />
                                  <span className="sb-track-dash" />
                                  <span className="sb-track-dot is-end" />
                                </div>
                              </div>

                              <div className="sb-time-node sb-time-node-right">
                                <strong>{bus.arriveTime}</strong>
                                <span>{activeTo}</span>
                                <small>{bus.droppingPoints[bus.droppingPoints.length - 1]?.name}</small>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Amenities & Details Trigger */}
                          <div className="sb-card-footbar">
                            <div className="sb-amenity-list">
                              {bus.amenities.slice(0, 4).map((am) => (
                                <span key={am} className="sb-amenity-chip">
                                  {am}
                                </span>
                              ))}
                              {bus.amenities.length > 4 && (
                                <span className="sb-amenity-more">
                                  +{bus.amenities.length - 4} more
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              className={`sb-details-trigger ${isDetailOpen ? "is-open" : ""}`}
                              onClick={() => {
                                setOpenDetailBusId(isDetailOpen ? null : bus.id);
                                setOpenSeatBusId(null);
                                setActiveDetailTab("points");
                              }}
                            >
                              <span>{isDetailOpen ? "Hide Details" : "Bus Details"}</span>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Right Perforated Ticket Fare Stub */}
                        <div className="sb-fare-stub">
                          <div className="sb-fare-top">
                            {savings > 0 && (
                              <span className="sb-save-chip">Save {formatInr(savings)}</span>
                            )}
                            <div className="sb-price-line">
                              {bus.originalPrice && (
                                <span className="sb-mrp">{formatInr(bus.originalPrice)}</span>
                              )}
                              <strong className="sb-price-now">{formatInr(bus.price)}</strong>
                            </div>
                            <span className="sb-per-seat">onwards / seat</span>
                          </div>

                          <div className="sb-fare-actions">
                            <button
                              type="button"
                              className={`sb-select-btn ${isSeatsOpen ? "is-open" : ""}`}
                              onClick={() => {
                                setOpenSeatBusId(isSeatsOpen ? null : bus.id);
                                setOpenDetailBusId(null);
                              }}
                            >
                              {isSeatsOpen ? "Hide Seats" : "Select Seats"}
                            </button>
                            <span
                              className={`sb-seats-left ${
                                bus.seatsLeft <= 9 ? "is-urgent" : ""
                              }`}
                            >
                              {bus.seatsLeft} Seats Left
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Bus Details Drawer */}
                      {isDetailOpen && (
                        <div className="sb-drawer">
                          <div className="sb-drawer-tabs" role="tablist">
                            <button
                              type="button"
                              className={activeDetailTab === "points" ? "is-active" : ""}
                              onClick={() => setActiveDetailTab("points")}
                            >
                              Boarding &amp; Dropping
                            </button>
                            <button
                              type="button"
                              className={activeDetailTab === "amenities" ? "is-active" : ""}
                              onClick={() => setActiveDetailTab("amenities")}
                            >
                              Amenities ({bus.amenities.length})
                            </button>
                            <button
                              type="button"
                              className={activeDetailTab === "policy" ? "is-active" : ""}
                              onClick={() => setActiveDetailTab("policy")}
                            >
                              Cancellation Policy
                            </button>
                          </div>

                          {activeDetailTab === "points" && (
                            <div className="sb-points-grid">
                              <div className="sb-points-col">
                                <h4>Boarding Points ({activeFrom})</h4>
                                <ul>
                                  {bus.boardingPoints.map((p) => (
                                    <li key={p.name}>
                                      <strong>{p.time}</strong>
                                      <div>
                                        <span>{p.name}</span>
                                        <small>{p.landmark}</small>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="sb-points-col">
                                <h4>Dropping Points ({activeTo})</h4>
                                <ul>
                                  {bus.droppingPoints.map((p) => (
                                    <li key={p.name}>
                                      <strong>{p.time}</strong>
                                      <div>
                                        <span>{p.name}</span>
                                        <small>{p.landmark}</small>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {activeDetailTab === "amenities" && (
                            <div className="sb-drawer-amenities">
                              {bus.amenities.map((am) => (
                                <span key={am} className="sb-drawer-am-pill">
                                  ✓ {am}
                                </span>
                              ))}
                            </div>
                          )}

                          {activeDetailTab === "policy" && (
                            <div className="sb-policy-grid">
                              <div className="sb-policy-row">
                                <span>More than 24 hrs before departure</span>
                                <strong>90% Refund</strong>
                              </div>
                              <div className="sb-policy-row">
                                <span>Between 12 hrs to 24 hrs before departure</span>
                                <strong>75% Refund</strong>
                              </div>
                              <div className="sb-policy-row">
                                <span>Between 4 hrs to 12 hrs before departure</span>
                                <strong>50% Refund</strong>
                              </div>
                              <div className="sb-policy-row">
                                <span>Less than 4 hrs before departure</span>
                                <strong>Non-refundable</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expandable Interactive Lower & Upper Deck Seat Selector */}
                      {isSeatsOpen && (
                        <div className="sb-seat-drawer">
                          <div className="sb-seat-layout-col">
                            <div className="sb-seat-legend">
                              <span>
                                <i className="sb-leg-box is-avail" /> Available
                              </span>
                              <span>
                                <i className="sb-leg-box is-selected" /> Selected
                              </span>
                              <span>
                                <i className="sb-leg-box is-booked" /> Booked
                              </span>
                              <span>
                                <i className="sb-leg-box is-ladies" /> Ladies
                              </span>
                            </div>

                            <div className="sb-decks-grid">
                              {[
                                { label: "Lower Deck", rows: LOWER_DECK_SEATS },
                                { label: "Upper Deck", rows: UPPER_DECK_SEATS },
                              ].map((deck) => (
                                <div key={deck.label} className="sb-deck-box">
                                  <div className="sb-deck-head">
                                    <span>{deck.label}</span>
                                    <small>{bus.isSleeper ? "2+1 Sleeper" : "2+2 Seater"}</small>
                                  </div>
                                  <div className="sb-deck-rows">
                                    {deck.rows.map((row, rIdx) => (
                                      <div key={`${deck.label}-${rIdx}`} className="sb-seat-row">
                                        {row.map((code, cIdx) => {
                                          if (!code) {
                                            return (
                                              <span
                                                key={`aisle-${rIdx}-${cIdx}`}
                                                className="sb-seat-aisle"
                                                aria-hidden="true"
                                              />
                                            );
                                          }
                                          const isBooked = bus.bookedSeats.includes(code);
                                          const isLadies = bus.ladiesSeats.includes(code);
                                          const isSelected = pickedSeats.includes(code);
                                          return (
                                            <button
                                              key={code}
                                              type="button"
                                              disabled={isBooked}
                                              onClick={() => handleToggleSeat(bus.id, code)}
                                              className={`sb-seat-btn ${
                                                isBooked
                                                  ? "is-booked"
                                                  : isSelected
                                                  ? "is-selected"
                                                  : isLadies
                                                  ? "is-ladies"
                                                  : ""
                                              }`}
                                              title={
                                                isBooked
                                                  ? `Seat ${code} is already booked`
                                                  : `Seat ${code} • ${formatInr(bus.price)}`
                                              }
                                            >
                                              {code}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right Selection Summary & Boarding/Dropping Picker */}
                          <div className="sb-seat-summary">
                            <h4>Trip Boarding &amp; Summary</h4>

                            <label className="sb-select-field">
                              <span>Boarding Point</span>
                              <select
                                value={selectedBoard}
                                onChange={(e) =>
                                  setBoardingByBus((prev) => ({
                                    ...prev,
                                    [bus.id]: e.target.value,
                                  }))
                                }
                              >
                                {bus.boardingPoints.map((p) => (
                                  <option key={p.name} value={p.name}>
                                    {p.time} — {p.name}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="sb-select-field">
                              <span>Dropping Point</span>
                              <select
                                value={selectedDrop}
                                onChange={(e) =>
                                  setDroppingByBus((prev) => ({
                                    ...prev,
                                    [bus.id]: e.target.value,
                                  }))
                                }
                              >
                                {bus.droppingPoints.map((p) => (
                                  <option key={p.name} value={p.name}>
                                    {p.time} — {p.name}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <div className="sb-summary-totals">
                              <div className="sb-sum-line">
                                <span>Selected Seats (max 6)</span>
                                <strong>
                                  {pickedSeats.length > 0 ? pickedSeats.join(", ") : "None"}
                                </strong>
                              </div>
                              <div className="sb-sum-line sb-sum-total">
                                <span>Total Fare</span>
                                <strong>{formatInr(pickedSeats.length * bus.price)}</strong>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="sb-proceed-btn"
                              disabled={pickedSeats.length === 0}
                              onClick={() => handleProceedBooking(bus)}
                            >
                              {pickedSeats.length > 0
                                ? `Continue (${pickedSeats.length} ${
                                    pickedSeats.length === 1 ? "Seat" : "Seats"
                                  })`
                                : "Select at least 1 seat"}
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Preview Confirmation Modal */}
      {bookingConfirmation && (
        <div
          className="sb-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Bus booking summary"
          onClick={() => setBookingConfirmation(null)}
        >
          <div className="sb-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-head">
              <div>
                <span className="sb-modal-eyebrow">SkyRoute Bus Checkout</span>
                <h3>{bookingConfirmation.bus.operator}</h3>
              </div>
              <button
                type="button"
                className="sb-modal-close"
                onClick={() => setBookingConfirmation(null)}
                aria-label="Close summary"
              >
                ✕
              </button>
            </div>

            <div className="sb-modal-body">
              <div className="sb-modal-row">
                <span>Route</span>
                <strong>
                  {activeFrom} → {activeTo}
                </strong>
              </div>
              <div className="sb-modal-row">
                <span>Journey Date</span>
                <strong>{formatReadableDate(activeDate)}</strong>
              </div>
              <div className="sb-modal-row">
                <span>Coach</span>
                <strong>{bookingConfirmation.bus.coachName}</strong>
              </div>
              <div className="sb-modal-row">
                <span>Boarding</span>
                <strong>{bookingConfirmation.boarding}</strong>
              </div>
              <div className="sb-modal-row">
                <span>Dropping</span>
                <strong>{bookingConfirmation.dropping}</strong>
              </div>
              <div className="sb-modal-row">
                <span>Seats Selected</span>
                <strong>{bookingConfirmation.seats.join(", ")}</strong>
              </div>
              <div className="sb-modal-row sb-modal-total">
                <span>Payable Total</span>
                <strong>{formatInr(bookingConfirmation.total)}</strong>
              </div>
            </div>

            <div className="sb-modal-footer">
              <button
                type="button"
                className="sb-modal-secondary"
                onClick={() => setBookingConfirmation(null)}
              >
                Modify Seats
              </button>
              <button
                type="button"
                className="sb-modal-primary"
                onClick={() => setBookingConfirmation(null)}
              >
                Confirm Seat Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AllBusPage() {
  return (
    <Suspense
      fallback={
        <div className="sb-page">
          <div className="sb-container">
            <div className="sb-loading">Loading available buses on SkyRoute...</div>
          </div>
        </div>
      }
    >
      <AllBusContent />
    </Suspense>
  );
}
