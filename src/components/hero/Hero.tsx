"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./Hero.css";

// Slides data using the user's provided banners
const SLIDES = [
  {
    id: 1,
    image: "/images/banner.webp",
    alt: "Tropical beach resort with passenger airliner flying overhead",
  },
  {
    id: 2,
    image: "/images/banner1.webp",
    alt: "Exotic travel destination flight journey",
  },
];

export type TravelTab = "flights" | "hotels" | "bus" | "train";
type TripType = "one-way" | "round-trip";

interface HeroProps {
  defaultTab?: TravelTab;
}
type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";
type HotelStayType = "overnight" | "hourly";

interface AirportOption {
  city: string;
  code: string;
  airport: string;
  country: string;
}

interface HotelDestinationOption {
  city: string;
  area: string;
  stays: string;
}

const POPULAR_HOTEL_DESTINATIONS: HotelDestinationOption[] = [
  { city: "Goa", area: "North & South Beach Resorts", stays: "1,240+ stays" },
  { city: "Mumbai", area: "Colaba, Bandra & BKC", stays: "980+ stays" },
  { city: "New Delhi", area: "Connaught Place & Aerocity", stays: "1,120+ stays" },
  { city: "Jaipur", area: "Pink City Heritage Palaces", stays: "640+ stays" },
  { city: "Bengaluru", area: "Indiranagar & MG Road", stays: "870+ stays" },
  { city: "Kolkata", area: "Park Street & New Town", stays: "520+ stays" },
  { city: "Manali", area: "Old Manali Mountain Retreats", stays: "430+ stays" },
  { city: "Dubai", area: "Downtown & Palm Jumeirah", stays: "1,560+ stays" },
];

const HOTEL_PRICE_RANGES = [
  { id: "budget", label: "₹1k – ₹2.5k" },
  { id: "mid", label: "₹2.5k – ₹5k" },
  { id: "premium", label: "₹5k – ₹10k" },
  { id: "luxury", label: "₹10k+" },
];

const HOURLY_SLOTS = ["3 Hours", "6 Hours", "9 Hours", "12 Hours"];

type BusCoachType = "all" | "ac-sleeper" | "ac-seater" | "volvo";

interface BusCityOption {
  city: string;
  state: string;
  stand: string;
}

const POPULAR_BUS_CITIES: BusCityOption[] = [
  { city: "Kolkata", state: "West Bengal", stand: "Esplanade & Karunamoyee" },
  { city: "Digha", state: "West Bengal", stand: "New Digha Bus Stand" },
  { city: "Siliguri", state: "West Bengal", stand: "Tenzing Norgay Terminus" },
  { city: "New Delhi", state: "Delhi", stand: "Kashmere Gate ISBT" },
  { city: "Jaipur", state: "Rajasthan", stand: "Sindhi Camp Stand" },
  { city: "Mumbai", state: "Maharashtra", stand: "Dadar & Borivali Hub" },
  { city: "Pune", state: "Maharashtra", stand: "Swargate & Wakad" },
  { city: "Bengaluru", state: "Karnataka", stand: "Majestic & Madiwala" },
  { city: "Hyderabad", state: "Telangana", stand: "MGBS & Miyapur" },
  { city: "Goa", state: "Goa", stand: "Panjim & Mapusa Stand" },
];

const BUS_COACH_TYPES: { id: BusCoachType; label: string }[] = [
  { id: "all", label: "All Buses" },
  { id: "ac-sleeper", label: "AC Sleeper" },
  { id: "ac-seater", label: "AC Seater" },
  { id: "volvo", label: "Volvo Luxury" },
];

const BUS_TODAY_ISO = "2026-11-18";
const BUS_TOMORROW_ISO = "2026-11-19";
const BUS_WEEKEND_ISO = "2026-11-21";

type TrainQuotaType = "general" | "tatkal" | "ladies" | "senior";

interface TrainStationOption {
  name: string;
  code: string;
  city: string;
  state: string;
}

const POPULAR_TRAIN_STATIONS: TrainStationOption[] = [
  { name: "Kolad", code: "KOL", city: "Kolad", state: "Maharashtra" },
  { name: "Secunderabad Junction", code: "SC", city: "Hyderabad", state: "Telangana" },
  { name: "Howrah Junction", code: "HWH", city: "Kolkata", state: "West Bengal" },
  { name: "New Delhi Railway Station", code: "NDLS", city: "New Delhi", state: "Delhi" },
  { name: "Puri Terminus", code: "PURI", city: "Puri", state: "Odisha" },
  { name: "KSR Bengaluru City", code: "SBC", city: "Bengaluru", state: "Karnataka" },
  { name: "CSMT Mumbai", code: "CSMT", city: "Mumbai", state: "Maharashtra" },
  { name: "Chennai Central", code: "MAS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Varanasi Junction", code: "BSB", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Jaipur Junction", code: "JP", city: "Jaipur", state: "Rajasthan" },
  { name: "Patna Junction", code: "PNBE", city: "Patna", state: "Bihar" },
  { name: "Pune Junction", code: "PUNE", city: "Pune", state: "Maharashtra" },
  { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad", state: "Gujarat" },
];

const TRAIN_QUOTA_TYPES: { id: TrainQuotaType; label: string }[] = [
  { id: "general", label: "General Quota" },
  { id: "tatkal", label: "Tatkal" },
  { id: "ladies", label: "Ladies" },
  { id: "senior", label: "Sr. Citizen" },
];

const TRAIN_CLASSES = [
  "All Classes",
  "Sleeper (SL)",
  "AC 3 Tier (3A)",
  "AC 2 Tier (2A)",
  "AC 1st Class (1A)",
  "AC Chair Car (CC)",
  "Exec. Chair Car (EC)",
];

const TRAIN_TODAY_ISO = "2026-11-19";
const TRAIN_TOMORROW_ISO = "2026-11-20";
const TRAIN_WEEKEND_ISO = "2026-11-22";

const POPULAR_AIRPORTS: AirportOption[] = [
  { city: "New Delhi", code: "DEL", airport: "Indira Gandhi Intl", country: "India" },
  { city: "Mumbai", code: "BOM", airport: "Chhatrapati Shivaji Intl", country: "India" },
  { city: "Bengaluru", code: "BLR", airport: "Kempegowda Intl", country: "India" },
  { city: "Kolkata", code: "CCU", airport: "Netaji Subhas Chandra Bose", country: "India" },
  { city: "Hyderabad", code: "HYD", airport: "Rajiv Gandhi Intl", country: "India" },
  { city: "Goa", code: "GOI", airport: "Dabolim Airport", country: "India" },
  { city: "Dubai", code: "DXB", airport: "Dubai International", country: "UAE" },
  { city: "Singapore", code: "SIN", airport: "Changi Airport", country: "Singapore" },
];

const CABIN_OPTIONS: { value: CabinClass; label: string; tag: string }[] = [
  { value: "Economy", label: "Economy", tag: "Best value" },
  { value: "Premium Economy", label: "Premium Economy", tag: "Extra legroom" },
  { value: "Business", label: "Business", tag: "Lounge & flatbed" },
  { value: "First", label: "First", tag: "Private suite" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatFlightDate(isoDate: string): { main: string; sub: string } | null {
  if (!isoDate) return null;
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [year, month, day] = parts;
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = WEEKDAYS[utcDate.getUTCDay()];
  const monthLabel = MONTHS[month - 1];
  return {
    main: `${day} ${monthLabel} ${year}`,
    sub: `${weekday}, ${day} ${monthLabel} ${year}`,
  };
}

function formatTrainDate(isoDate: string): { weekday: string; dateStr: string; year: string } {
  if (!isoDate) return { weekday: "Thu", dateStr: "19 Nov", year: "2026" };
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return { weekday: "Thu", dateStr: "19 Nov", year: "2026" };
  const [year, month, day] = parts;
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = WEEKDAYS[utcDate.getUTCDay()];
  const monthLabel = MONTHS[month - 1];
  return {
    weekday,
    dateStr: `${day} ${monthLabel}`,
    year: `${year}`,
  };
}

function extractAirportCode(value: string, fallback: string): string {
  const match = value.match(/\(([A-Za-z]{3})\)/);
  if (match) return match[1].toUpperCase();
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, 3).toUpperCase();
}

function addDaysToIso(isoDate: string, days: number): string {
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + days));
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function calculateNights(checkInIso: string, checkOutIso: string): number {
  const a = checkInIso.split("-").map(Number);
  const b = checkOutIso.split("-").map(Number);
  if (a.length !== 3 || b.length !== 3) return 1;
  const t1 = Date.UTC(a[0], a[1] - 1, a[2]);
  const t2 = Date.UTC(b[0], b[1] - 1, b[2]);
  const diff = Math.round((t2 - t1) / 86400000);
  return diff > 0 ? diff : 1;
}

export default function Hero({ defaultTab = "flights" }: HeroProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<TravelTab>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Flight search states
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [fromLocation, setFromLocation] = useState("New Delhi (DEL)");
  const [toLocation, setToLocation] = useState("Mumbai (BOM)");
  const [swapRotated, setSwapRotated] = useState(false);
  const [departureDate, setDepartureDate] = useState("2026-12-02");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");
  const [bundleHotel, setBundleHotel] = useState(false);

  // Popover / dropdown states
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [openAirportField, setOpenAirportField] = useState<"from" | "to" | null>(null);

  // Hotel search states
  const [hotelStayType, setHotelStayType] = useState<HotelStayType>("overnight");
  const [hotelDestination, setHotelDestination] = useState("Goa");
  const [hotelCheckIn, setHotelCheckIn] = useState("2026-11-23");
  const [hotelCheckOut, setHotelCheckOut] = useState("2026-11-25");
  const [hotelHourlySlot, setHotelHourlySlot] = useState("6 Hours");
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelPriceBand, setHotelPriceBand] = useState<string>("mid");
  const [entireHomesOnly, setEntireHomesOnly] = useState(false);
  const [isHotelGuestsOpen, setIsHotelGuestsOpen] = useState(false);
  const [isHotelDestOpen, setIsHotelDestOpen] = useState(false);

  // Bus search states
  const [busCoachType, setBusCoachType] = useState<BusCoachType>("all");
  const [busFrom, setBusFrom] = useState("Kolkata");
  const [busTo, setBusTo] = useState("Digha");
  const [busSwapRotated, setBusSwapRotated] = useState(false);
  const [busDepartDate, setBusDepartDate] = useState(BUS_TODAY_ISO);
  const [busReturnDate, setBusReturnDate] = useState("");
  const [busSeats, setBusSeats] = useState(1);
  const [busLiveTrackOnly, setBusLiveTrackOnly] = useState(true);
  const [openBusField, setOpenBusField] = useState<"from" | "to" | null>(null);

  // Train search states
  const [trainQuota, setTrainQuota] = useState<TrainQuotaType>("general");
  const [trainFrom, setTrainFrom] = useState("Kolad (KOL)");
  const [trainTo, setTrainTo] = useState("Secunderabad Jn (SC)");
  const [trainSwapRotated, setTrainSwapRotated] = useState(false);
  const [trainDepartDate, setTrainDepartDate] = useState(TRAIN_TODAY_ISO);
  const [trainClass, setTrainClass] = useState("All Classes");
  const [trainTravelers, setTrainTravelers] = useState(1);
  const [trainFreeCancel, setTrainFreeCancel] = useState(false);
  const [trainLiveStatusOnly, setTrainLiveStatusOnly] = useState(true);
  const [openTrainField, setOpenTrainField] = useState<"from" | "to" | "class" | null>(null);

  // Refs for outside click & date pickers
  const passengerMenuRef = useRef<HTMLDivElement | null>(null);
  const routeCapsuleRef = useRef<HTMLDivElement | null>(null);
  const toInputRef = useRef<HTMLInputElement | null>(null);
  const departInputRef = useRef<HTMLInputElement | null>(null);
  const returnInputRef = useRef<HTMLInputElement | null>(null);
  const hotelGuestsRef = useRef<HTMLDivElement | null>(null);
  const hotelDestRef = useRef<HTMLDivElement | null>(null);
  const checkInInputRef = useRef<HTMLInputElement | null>(null);
  const checkOutInputRef = useRef<HTMLInputElement | null>(null);
  const busRouteRef = useRef<HTMLDivElement | null>(null);
  const busDepartInputRef = useRef<HTMLInputElement | null>(null);
  const busReturnInputRef = useRef<HTMLInputElement | null>(null);
  const trainRouteRef = useRef<HTMLDivElement | null>(null);
  const trainClassRef = useRef<HTMLDivElement | null>(null);
  const trainDepartInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Close popovers on outside click or Escape key
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (passengerMenuRef.current && !passengerMenuRef.current.contains(target)) {
        setIsPassengerOpen(false);
      }
      if (routeCapsuleRef.current && !routeCapsuleRef.current.contains(target)) {
        setOpenAirportField(null);
      }
      if (hotelGuestsRef.current && !hotelGuestsRef.current.contains(target)) {
        setIsHotelGuestsOpen(false);
      }
      if (hotelDestRef.current && !hotelDestRef.current.contains(target)) {
        setIsHotelDestOpen(false);
      }
      if (busRouteRef.current && !busRouteRef.current.contains(target)) {
        setOpenBusField(null);
      }
      if (trainRouteRef.current && !trainRouteRef.current.contains(target)) {
        setOpenTrainField((prev) => (prev === "from" || prev === "to" ? null : prev));
      }
      if (trainClassRef.current && !trainClassRef.current.contains(target)) {
        setOpenTrainField((prev) => (prev === "class" ? null : prev));
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPassengerOpen(false);
        setOpenAirportField(null);
        setIsHotelGuestsOpen(false);
        setIsHotelDestOpen(false);
        setOpenBusField(null);
        setOpenTrainField(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-scroll so downward-opening popups are fully visible in viewport
  useEffect(() => {
    const isAnyPopupOpen = Boolean(
      isPassengerOpen ||
      isHotelGuestsOpen ||
      openAirportField ||
      isHotelDestOpen ||
      openBusField ||
      openTrainField
    );

    if (!isAnyPopupOpen) return;

    const timer = setTimeout(() => {
      const activePopup = document.querySelector<HTMLElement>(
        ".train-meta-popover, .flight-passenger-popover, .flight-airport-dropdown, .hotel-dest-dropdown"
      );
      if (!activePopup) return;

      const rect = activePopup.getBoundingClientRect();
      const bottomBuffer = 48; // comfortable spacing from bottom of viewport
      const overflow = rect.bottom + bottomBuffer - window.innerHeight;

      if (overflow > 0) {
        const searchWidget = document.getElementById("search-widget");
        const widgetTop = searchWidget ? searchWidget.getBoundingClientRect().top : 100;
        const navbarOffset = 76; // keep search widget below fixed navbar
        const maxScroll = Math.max(0, widgetTop - navbarOffset);
        const scrollAmount = maxScroll > 0 ? Math.min(overflow, maxScroll) : overflow;

        if (scrollAmount > 0) {
          window.scrollBy({
            top: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 70);

    return () => clearTimeout(timer);
  }, [isPassengerOpen, isHotelGuestsOpen, openAirportField, isHotelDestOpen, openBusField, openTrainField]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
    setSwapRotated((prev) => !prev);
  };

  const handleTripTypeChange = (nextType: TripType) => {
    setTripType(nextType);
    if (nextType === "one-way") {
      setReturnDate("");
    }
  };

  const handleDepartureChange = (nextDate: string) => {
    setDepartureDate(nextDate);
    if (returnDate && nextDate && returnDate < nextDate) {
      setReturnDate("");
    }
  };

  const handleReturnBoxClick = () => {
    setIsPassengerOpen(false);
    setOpenAirportField(null);
    if (tripType === "one-way") {
      setTripType("round-trip");
    }
    const input = returnInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        input.focus();
      }
    } else {
      input.focus();
    }
  };

  const handleDepartureBoxClick = () => {
    setIsPassengerOpen(false);
    setOpenAirportField(null);
    const input = departInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        input.focus();
      }
    } else {
      input.focus();
    }
  };

  const totalSeated = adults + childrenCount;
  const totalPassengers = adults + childrenCount + infants;

  const updateAdults = (delta: number) => {
    const next = Math.max(1, Math.min(9 - childrenCount, adults + delta));
    setAdults(next);
    if (infants > next) {
      setInfants(next);
    }
  };

  const updateChildren = (delta: number) => {
    setChildrenCount((prev) => Math.max(0, Math.min(9 - adults, prev + delta)));
  };

  const updateInfants = (delta: number) => {
    setInfants((prev) => Math.max(0, Math.min(adults, prev + delta)));
  };

  const getFilteredAirports = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_AIRPORTS;
    const matches = POPULAR_AIRPORTS.filter(
      (item) =>
        item.city.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.airport.toLowerCase().includes(q) ||
        `${item.city} (${item.code})`.toLowerCase().includes(q)
    );
    return matches.length > 0 ? matches : POPULAR_AIRPORTS;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPassengerOpen(false);
    setOpenAirportField(null);

    if (activeTab === "flights") {
      if (!toLocation.trim()) {
        setOpenAirportField("to");
        toInputRef.current?.focus();
        return;
      }

      const params = new URLSearchParams({
        from: fromLocation.trim() || "New Delhi (DEL)",
        to: toLocation.trim(),
        trip: tripType,
        depart: departureDate || "2026-12-02",
        adults: String(adults),
        children: String(childrenCount),
        infants: String(infants),
        cabin: cabinClass,
        bundle: bundleHotel ? "1" : "0",
      });

      if (tripType === "round-trip" && returnDate) {
        params.set("return", returnDate);
      }

      router.push(`/allFlights?${params.toString()}`);
      return;
    }

    if (activeTab === "hotels") {
      setIsHotelGuestsOpen(false);
      setIsHotelDestOpen(false);
      const params = new URLSearchParams({
        city: hotelDestination || "New Delhi",
        stayType: hotelStayType || "overnight",
        checkIn: hotelCheckIn || "2026-11-23",
        checkOut: hotelStayType === "overnight" ? (hotelCheckOut || "2026-11-25") : "",
        slot: hotelStayType === "hourly" ? hotelHourlySlot : "",
        rooms: String(hotelRooms || 1),
        adults: String(hotelAdults || 2),
        children: String(hotelChildren || 0),
        priceBand: hotelPriceBand || "mid",
        entireHomes: entireHomesOnly ? "1" : "0",
      });
      router.push(`/allHotels?${params.toString()}`);
      return;
    }

    if (activeTab === "bus") {
      setOpenBusField(null);
      const params = new URLSearchParams({
        from: busFrom.trim() || "Kolkata",
        to: busTo.trim() || "Digha",
        depart: busDepartDate || BUS_TODAY_ISO,
        coach: busCoachType,
        seats: String(busSeats),
        live: busLiveTrackOnly ? "1" : "0",
      });

      if (busReturnDate) {
        params.set("return", busReturnDate);
      }

      router.push(`/allBus?${params.toString()}`);
      return;
    }

    if (activeTab === "train") {
      setOpenTrainField(null);
      const params = new URLSearchParams({
        from: trainFrom.trim() || "Howrah Junction (HWH)",
        to: trainTo.trim() || "Puri Terminus (PURI)",
        depart: trainDepartDate || TRAIN_TODAY_ISO,
        quota: trainQuota,
        class: trainClass,
        travelers: String(trainTravelers),
        freeCancel: trainFreeCancel ? "1" : "0",
        live: trainLiveStatusOnly ? "1" : "0",
      });

      router.push(`/allTrains?${params.toString()}`);
      return;
    }
  };

  const handleBusSwap = () => {
    setBusFrom(busTo);
    setBusTo(busFrom);
    setBusSwapRotated((prev) => !prev);
  };

  const handleTrainSwap = () => {
    setTrainFrom(trainTo);
    setTrainTo(trainFrom);
    setTrainSwapRotated((prev) => !prev);
  };

  const handleTrainDepartChange = (nextDate: string) => {
    setTrainDepartDate(nextDate);
  };

  const getFilteredTrainStations = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_TRAIN_STATIONS;
    const matches = POPULAR_TRAIN_STATIONS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q)
    );
    return matches.length > 0 ? matches : POPULAR_TRAIN_STATIONS;
  };

  const handleBusDepartChange = (nextDate: string) => {
    setBusDepartDate(nextDate);
    if (busReturnDate && nextDate && busReturnDate < nextDate) {
      setBusReturnDate("");
    }
  };

  const getFilteredBusCities = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_BUS_CITIES;
    const matches = POPULAR_BUS_CITIES.filter(
      (item) =>
        item.city.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.stand.toLowerCase().includes(q)
    );
    return matches.length > 0 ? matches : POPULAR_BUS_CITIES;
  };

  const openNativePicker = (input: HTMLInputElement | null) => {
    if (!input) return;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        input.focus();
      }
    } else {
      input.focus();
    }
  };

  const handleHotelCheckInChange = (nextDate: string) => {
    setHotelCheckIn(nextDate);
    if (nextDate && (!hotelCheckOut || hotelCheckOut <= nextDate)) {
      setHotelCheckOut(addDaysToIso(nextDate, 1));
    }
  };

  const updateHotelRooms = (delta: number) => {
    const nextRooms = Math.max(1, Math.min(6, hotelRooms + delta));
    setHotelRooms(nextRooms);
    if (hotelAdults < nextRooms) {
      setHotelAdults(nextRooms);
    }
  };

  const updateHotelAdults = (delta: number) => {
    setHotelAdults((prev) => Math.max(hotelRooms, Math.min(12, prev + delta)));
  };

  const updateHotelChildren = (delta: number) => {
    setHotelChildren((prev) => Math.max(0, Math.min(6, prev + delta)));
  };

  const getFilteredHotelDestinations = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_HOTEL_DESTINATIONS;
    const matches = POPULAR_HOTEL_DESTINATIONS.filter(
      (item) => item.city.toLowerCase().includes(q) || item.area.toLowerCase().includes(q)
    );
    return matches.length > 0 ? matches : POPULAR_HOTEL_DESTINATIONS;
  };

  const formattedDeparture = formatFlightDate(departureDate);
  const formattedReturn = formatFlightDate(returnDate);
  const formattedCheckIn = formatFlightDate(hotelCheckIn);
  const formattedCheckOut = formatFlightDate(hotelCheckOut);
  const formattedBusDepart = formatFlightDate(busDepartDate);
  const formattedBusReturn = formatFlightDate(busReturnDate);
  const formattedTrainDepart = formatFlightDate(trainDepartDate);
  const hotelNights = calculateNights(hotelCheckIn, hotelCheckOut);
  const totalHotelGuests = hotelAdults + hotelChildren;
  const fromCode = extractAirportCode(fromLocation, "FROM");
  const toCode = extractAirportCode(toLocation, "TO");
  const activeBusCoachLabel = BUS_COACH_TYPES.find((c) => c.id === busCoachType)?.label || "All Buses";
  const activeTrainQuotaLabel = TRAIN_QUOTA_TYPES.find((q) => q.id === trainQuota)?.label || "General";
  const trainTomorrowIso = addDaysToIso(TRAIN_TODAY_ISO, 1);
  const trainDayAfterIso = addDaysToIso(TRAIN_TODAY_ISO, 2);
  const trainDateFormatted = formatTrainDate(trainDepartDate);

  return (
    <section className="skyroute-hero-wrapper" aria-label="Hero Banner and Travel Search">
      {/* 1. Full-Width Background Slider */}
      <div className="hero-slider-bg">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide-item ${index === currentSlide ? "active" : ""}`}
            aria-hidden={index !== currentSlide}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority
              unoptimized
              className="hero-slide-img"
              sizes="100vw"
            />
          </div>
        ))}
        {/* Soft atmospheric gradient overlay on the left to ensure text legibility */}
        <div className="hero-overlay-gradient" />
      </div>

      {/* 2. Slider Navigation Arrows */}
      <button
        type="button"
        className="hero-carousel-arrow hero-arrow-left"
        onClick={handlePrevSlide}
        aria-label="Previous Banner"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="hero-carousel-arrow hero-arrow-right"
        onClick={handleNextSlide}
        aria-label="Next Banner"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* 3. 1320px Constrained Content Container */}
      <div className="skyroute-hero-container">
        <div className="hero-headline-block">
          <h1 className="hero-main-title">
            <span>Your Next Journey</span>{" "}
            <span className="hero-highlight-phrase">Starts Here!</span>
          </h1>
          <p className="hero-subtitle">
            Find the best flights, hotels and travel deals around the world.
          </p>
          <a href="#search-widget" className="hero-explore-btn">
            <span>Explore Now</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Travel search widget */}
        <div id="search-widget" className={`hero-search-wrapper hero-search-${activeTab}`}>
          <div className="hero-tabs-bar" role="tablist" aria-label="Travel type">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "hotels"}
              className={`hero-tab-btn ${activeTab === "hotels" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("hotels");
                setIsPassengerOpen(false);
                setOpenAirportField(null);
                setOpenBusField(null);
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
              </svg>
              <span>Hotels</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "flights"}
              className={`hero-tab-btn ${activeTab === "flights" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("flights");
                setIsHotelGuestsOpen(false);
                setIsHotelDestOpen(false);
                setOpenBusField(null);
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <span>Flights</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "bus"}
              className={`hero-tab-btn ${activeTab === "bus" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("bus");
                setIsPassengerOpen(false);
                setOpenAirportField(null);
                setIsHotelGuestsOpen(false);
                setIsHotelDestOpen(false);
                setOpenTrainField(null);
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V6h12v5z" />
              </svg>
              <span>Bus</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "train"}
              className={`hero-tab-btn ${activeTab === "train" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("train");
                setIsPassengerOpen(false);
                setOpenAirportField(null);
                setIsHotelGuestsOpen(false);
                setIsHotelDestOpen(false);
                setOpenBusField(null);
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V7h12v4z" />
              </svg>
              <span>Train</span>
            </button>
          </div>

          {activeTab === "flights" && (
            <form onSubmit={handleSearchSubmit} className="sky-flight-deck">
              {/* Top Utility Bar: Segmented Trip Toggle + Live Route Pill */}
              <div className="flight-deck-topbar">
                <div className="flight-trip-segmented" role="radiogroup" aria-label="Trip type">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={tripType === "one-way"}
                    className={`flight-trip-option ${tripType === "one-way" ? "active" : ""}`}
                    onClick={() => handleTripTypeChange("one-way")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="13 6 19 12 13 18" />
                    </svg>
                    <span>One-way</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={tripType === "round-trip"}
                    className={`flight-trip-option ${tripType === "round-trip" ? "active" : ""}`}
                    onClick={() => handleTripTypeChange("round-trip")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    <span>Round-trip</span>
                  </button>
                </div>

                <div className="flight-route-badge" aria-live="polite">
                  <span className="route-badge-dot" />
                  <span className="route-badge-codes">
                    {fromCode} {tripType === "round-trip" ? "⇄" : "→"} {toCode}
                  </span>
                  <span className="route-badge-sep">•</span>
                  <span className="route-badge-meta">{cabinClass}</span>
                </div>
              </div>

              {/* Middle Boarding-Pass Input Grid */}
              <div className="flight-deck-grid">
                {/* 1. Paired Route Capsule (From + Swap + To) */}
                <div className="flight-route-capsule" ref={routeCapsuleRef}>
                  <div className={`flight-tile flight-tile-from ${openAirportField === "from" ? "focused" : ""}`}>
                    <span className="flight-tile-eyebrow">Flying From</span>
                    <div className="flight-tile-control">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 22h20" />
                          <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="flight-tile-input"
                        placeholder="City or airport"
                        value={fromLocation}
                        onFocus={() => {
                          setOpenAirportField("from");
                          setIsPassengerOpen(false);
                        }}
                        onChange={(e) => setFromLocation(e.target.value)}
                        aria-label="Departure city or airport"
                      />
                    </div>

                    {openAirportField === "from" && (
                      <div className="flight-airport-dropdown" role="listbox" aria-label="Departure airport suggestions">
                        <div className="airport-dropdown-header">Popular Departure Cities</div>
                        {getFilteredAirports(fromLocation).map((item) => (
                          <button
                            key={`from-${item.code}`}
                            type="button"
                            className="airport-option-row"
                            onClick={() => {
                              setFromLocation(`${item.city} (${item.code})`);
                              setOpenAirportField(null);
                            }}
                          >
                            <span className="airport-option-code">{item.code}</span>
                            <span className="airport-option-info">
                              <strong>{item.city}</strong>
                              <small>{item.airport}, {item.country}</small>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`flight-swap-btn ${swapRotated ? "rotated" : ""}`}
                    onClick={handleSwapLocations}
                    aria-label="Swap departure and destination"
                    title="Swap route"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 7l-5 5 5 5" />
                      <path d="M3 12h18" />
                      <path d="M16 17l5-5-5-5" />
                    </svg>
                  </button>

                  <div className={`flight-tile flight-tile-to ${openAirportField === "to" ? "focused" : ""}`}>
                    <span className="flight-tile-eyebrow">Flying To</span>
                    <div className="flight-tile-control">
                      <span className="flight-tile-icon flight-tile-icon-teal" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <input
                        ref={toInputRef}
                        type="text"
                        className="flight-tile-input"
                        placeholder="Where to?"
                        value={toLocation}
                        onFocus={() => {
                          setOpenAirportField("to");
                          setIsPassengerOpen(false);
                        }}
                        onChange={(e) => setToLocation(e.target.value)}
                        aria-label="Destination city or airport"
                      />
                    </div>

                    {openAirportField === "to" && (
                      <div className="flight-airport-dropdown" role="listbox" aria-label="Destination airport suggestions">
                        <div className="airport-dropdown-header">Popular Destinations</div>
                        {getFilteredAirports(toLocation).map((item) => (
                          <button
                            key={`to-${item.code}`}
                            type="button"
                            className="airport-option-row"
                            onClick={() => {
                              setToLocation(`${item.city} (${item.code})`);
                              setOpenAirportField(null);
                            }}
                          >
                            <span className="airport-option-code">{item.code}</span>
                            <span className="airport-option-info">
                              <strong>{item.city}</strong>
                              <small>{item.airport}, {item.country}</small>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Dual Date Capsule (Departure + Return) */}
                <div className="flight-dates-capsule">
                  <div className="flight-date-slot" onClick={handleDepartureBoxClick}>
                    <span className="flight-tile-eyebrow">Departure</span>
                    <div className="flight-date-display">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <div className="flight-date-text">
                        <span className="flight-date-main">
                          {formattedDeparture ? formattedDeparture.main : "Select date"}
                        </span>
                        <span className="flight-date-sub">
                          {formattedDeparture ? formattedDeparture.sub : "Choose departure"}
                        </span>
                      </div>
                    </div>
                    <input
                      ref={departInputRef}
                      type="date"
                      className="flight-native-date-overlay"
                      value={departureDate}
                      onChange={(e) => handleDepartureChange(e.target.value)}
                      aria-label="Departure date"
                    />
                  </div>

                  <span className="flight-ticket-divider" aria-hidden="true" />

                  <div
                    className={`flight-date-slot ${tripType === "one-way" ? "is-muted" : ""}`}
                    onClick={handleReturnBoxClick}
                  >
                    <span className="flight-tile-eyebrow">
                      Return
                      {tripType === "round-trip" && returnDate && (
                        <button
                          type="button"
                          className="flight-date-clear"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReturnDate("");
                          }}
                          aria-label="Clear return date"
                        >
                          ×
                        </button>
                      )}
                    </span>
                    <div className="flight-date-display">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <div className="flight-date-text">
                        <span className={`flight-date-main ${!formattedReturn ? "is-placeholder" : ""}`}>
                          {tripType === "one-way"
                            ? "+ Add Return"
                            : formattedReturn
                              ? formattedReturn.main
                              : "Select return"}
                        </span>
                        <span className="flight-date-sub">
                          {tripType === "one-way"
                            ? "Switch to round-trip"
                            : formattedReturn
                              ? formattedReturn.sub
                              : "Optional return date"}
                        </span>
                      </div>
                    </div>
                    <input
                      ref={returnInputRef}
                      type="date"
                      className="flight-native-date-overlay"
                      min={departureDate || undefined}
                      value={returnDate}
                      onChange={(e) => {
                        if (tripType === "one-way") setTripType("round-trip");
                        setReturnDate(e.target.value);
                      }}
                      aria-label="Return date"
                    />
                  </div>
                </div>

                {/* 3. Passengers & Cabin Selector Tile + Popover */}
                <div className="flight-passenger-anchor" ref={passengerMenuRef}>
                  <button
                    type="button"
                    className={`flight-passenger-trigger ${isPassengerOpen ? "open" : ""}`}
                    aria-expanded={isPassengerOpen}
                    aria-haspopup="dialog"
                    onClick={() => {
                      setIsPassengerOpen((prev) => !prev);
                      setOpenAirportField(null);
                    }}
                  >
                    <span className="flight-tile-eyebrow">Travelers &amp; Class</span>
                    <div className="flight-passenger-summary">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </span>
                      <div className="flight-date-text">
                        <span className="flight-date-main">
                          {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
                        </span>
                        <span className="flight-date-sub">{cabinClass}</span>
                      </div>
                      <span className={`flight-trigger-chevron ${isPassengerOpen ? "rotated" : ""}`} aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </button>

                  {isPassengerOpen && (
                    <div className="flight-passenger-popover" role="dialog" aria-label="Select passengers and cabin class">
                      <div className="popover-header">
                        <span className="popover-title">Passengers &amp; Cabin</span>
                        <span className="popover-pill">
                          {totalPassengers} total
                        </span>
                      </div>

                      <div className="popover-stepper-list">
                        {/* Adults */}
                        <div className="popover-stepper-row">
                          <div className="stepper-label-group">
                            <span className="stepper-title">Adults</span>
                            <span className="stepper-age">12 yrs &amp; above</span>
                          </div>
                          <div className="stepper-controls">
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => updateAdults(-1)}
                              disabled={adults <= 1}
                              aria-label="Decrease adults"
                            >
                              −
                            </button>
                            <span className="stepper-value" aria-live="polite">{adults}</span>
                            <button
                              type="button"
                              className="stepper-btn stepper-btn-plus"
                              onClick={() => updateAdults(1)}
                              disabled={totalSeated >= 9}
                              aria-label="Increase adults"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="popover-stepper-row">
                          <div className="stepper-label-group">
                            <span className="stepper-title">Children</span>
                            <span className="stepper-age">2 – 11 yrs</span>
                          </div>
                          <div className="stepper-controls">
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => updateChildren(-1)}
                              disabled={childrenCount <= 0}
                              aria-label="Decrease children"
                            >
                              −
                            </button>
                            <span className="stepper-value" aria-live="polite">{childrenCount}</span>
                            <button
                              type="button"
                              className="stepper-btn stepper-btn-plus"
                              onClick={() => updateChildren(1)}
                              disabled={totalSeated >= 9}
                              aria-label="Increase children"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Infants */}
                        <div className="popover-stepper-row">
                          <div className="stepper-label-group">
                            <span className="stepper-title">Infants</span>
                            <span className="stepper-age">Below 2 yrs (on lap)</span>
                          </div>
                          <div className="stepper-controls">
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => updateInfants(-1)}
                              disabled={infants <= 0}
                              aria-label="Decrease infants"
                            >
                              −
                            </button>
                            <span className="stepper-value" aria-live="polite">{infants}</span>
                            <button
                              type="button"
                              className="stepper-btn stepper-btn-plus"
                              onClick={() => updateInfants(1)}
                              disabled={infants >= adults}
                              aria-label="Increase infants"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="popover-cabin-section">
                        <span className="popover-section-label">Cabin Class</span>
                        <div className="popover-cabin-grid">
                          {CABIN_OPTIONS.map((option) => {
                            const isSelected = cabinClass === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={`cabin-choice-card ${isSelected ? "selected" : ""}`}
                                onClick={() => setCabinClass(option.value)}
                                title={option.tag}
                              >
                                <span className="cabin-choice-name">{option.label}</span>
                                {isSelected && (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="popover-footer">
                        <span className="popover-hint">Max 9 travelers</span>
                        <button
                          type="button"
                          className="popover-done-btn"
                          onClick={() => setIsPassengerOpen(false)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Strip: Hotel Bundle Toggle + SkyRoute Search CTA */}
              <div className="flight-deck-footer">
                <label className={`flight-bundle-chip ${bundleHotel ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    className="flight-bundle-checkbox"
                    checked={bundleHotel}
                    onChange={(e) => setBundleHotel(e.target.checked)}
                  />
                  <span className="flight-bundle-switch" aria-hidden="true">
                    <span className="flight-bundle-knob" />
                  </span>
                  <span className="flight-bundle-text">Add a hotel &amp; save up to 25%</span>
                  <span className="flight-bundle-badge">Bundle &amp; Save</span>
                </label>

                <button type="submit" className="hero-search-submit-btn flight-search-cta">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search Flights</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === "hotels" && (
            <form onSubmit={handleSearchSubmit} className="sky-flight-deck sky-hotel-deck">
              {/* Top Utility Bar: Overnight / Day Use Toggle + Live Stay Preview */}
              <div className="flight-deck-topbar">
                <div className="flight-trip-segmented" role="radiogroup" aria-label="Hotel stay type">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={hotelStayType === "overnight"}
                    className={`flight-trip-option ${hotelStayType === "overnight" ? "active" : ""}`}
                    onClick={() => setHotelStayType("overnight")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                    <span>Overnight Stay</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={hotelStayType === "hourly"}
                    className={`flight-trip-option ${hotelStayType === "hourly" ? "active" : ""}`}
                    onClick={() => setHotelStayType("hourly")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 14" />
                    </svg>
                    <span>Day Use / Hourly</span>
                    <span className="hotel-new-tag">NEW</span>
                  </button>
                </div>

                <div className="flight-route-badge" aria-live="polite">
                  <span className="route-badge-dot" />
                  <span className="route-badge-codes">
                    {hotelDestination.trim() || "Choose City"}
                  </span>
                  <span className="route-badge-sep">•</span>
                  <span className="route-badge-meta">
                    {hotelStayType === "overnight"
                      ? `${hotelNights} ${hotelNights === 1 ? "Night" : "Nights"}`
                      : hotelHourlySlot}
                  </span>
                  <span className="route-badge-sep">•</span>
                  <span>
                    {hotelRooms} {hotelRooms === 1 ? "Room" : "Rooms"}
                  </span>
                </div>
              </div>

              {/* Main 3-Zone Hotel Deck Grid */}
              <div className="hotel-deck-grid">
                {/* 1. Destination / Property Input + Suggestions */}
                <div className={`hotel-dest-capsule ${isHotelDestOpen ? "focused" : ""}`} ref={hotelDestRef}>
                  <span className="flight-tile-eyebrow">Destination or Property</span>
                  <div className="flight-tile-control">
                    <span className="flight-tile-icon flight-tile-icon-teal" aria-hidden="true">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="flight-tile-input"
                      placeholder="City, landmark or hotel name"
                      value={hotelDestination}
                      onFocus={() => {
                        setIsHotelDestOpen(true);
                        setIsHotelGuestsOpen(false);
                      }}
                      onChange={(e) => setHotelDestination(e.target.value)}
                      aria-label="Hotel destination or property"
                    />
                  </div>

                  {isHotelDestOpen && (
                    <div className="flight-airport-dropdown hotel-dest-dropdown" role="listbox" aria-label="Popular hotel destinations">
                      <div className="airport-dropdown-header">Popular Stay Destinations</div>
                      {getFilteredHotelDestinations(hotelDestination).map((item) => (
                        <button
                          key={item.city}
                          type="button"
                          className="airport-option-row"
                          onClick={() => {
                            setHotelDestination(item.city);
                            setIsHotelDestOpen(false);
                          }}
                        >
                          <span className="hotel-dest-pin" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                              <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
                            </svg>
                          </span>
                          <span className="airport-option-info">
                            <strong>{item.city}</strong>
                            <small>{item.area}</small>
                          </span>
                          <span className="hotel-dest-count">{item.stays}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Check-in & Check-out (or Hourly Slot) Capsule */}
                <div className="hotel-dates-capsule">
                  <div
                    className="flight-date-slot"
                    onClick={() => {
                      setIsHotelGuestsOpen(false);
                      setIsHotelDestOpen(false);
                      openNativePicker(checkInInputRef.current);
                    }}
                  >
                    <span className="flight-tile-eyebrow">Check-in</span>
                    <div className="flight-date-display">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <div className="flight-date-text">
                        <span className="flight-date-main">
                          {formattedCheckIn ? formattedCheckIn.main : "Select date"}
                        </span>
                        <span className="flight-date-sub">
                          {formattedCheckIn ? formattedCheckIn.sub : "Choose check-in"}
                        </span>
                      </div>
                    </div>
                    <input
                      ref={checkInInputRef}
                      type="date"
                      className="flight-native-date-overlay"
                      value={hotelCheckIn}
                      onChange={(e) => handleHotelCheckInChange(e.target.value)}
                      aria-label="Check-in date"
                    />
                  </div>

                  {hotelStayType === "overnight" ? (
                    <>
                      <span className="hotel-nights-chip" aria-hidden="true">
                        {hotelNights}N
                      </span>

                      <div
                        className="flight-date-slot hotel-checkout-slot"
                        onClick={() => {
                          setIsHotelGuestsOpen(false);
                          setIsHotelDestOpen(false);
                          openNativePicker(checkOutInputRef.current);
                        }}
                      >
                        <span className="flight-tile-eyebrow">Check-out</span>
                        <div className="flight-date-display">
                          <span className="flight-tile-icon" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="3" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                          </span>
                          <div className="flight-date-text">
                            <span className="flight-date-main">
                              {formattedCheckOut ? formattedCheckOut.main : "Select date"}
                            </span>
                            <span className="flight-date-sub">
                              {formattedCheckOut ? formattedCheckOut.sub : "Choose check-out"}
                            </span>
                          </div>
                        </div>
                        <input
                          ref={checkOutInputRef}
                          type="date"
                          className="flight-native-date-overlay"
                          min={addDaysToIso(hotelCheckIn, 1)}
                          value={hotelCheckOut}
                          onChange={(e) => setHotelCheckOut(e.target.value)}
                          aria-label="Check-out date"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flight-date-slot hotel-slot-picker">
                      <span className="flight-tile-eyebrow">Stay Duration</span>
                      <div className="hotel-hourly-pills">
                        {HOURLY_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`hotel-slot-pill ${hotelHourlySlot === slot ? "active" : ""}`}
                            onClick={() => setHotelHourlySlot(slot)}
                          >
                            {slot.replace(" Hours", "h")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Rooms & Guests Selector + Popover */}
                <div className="flight-passenger-anchor" ref={hotelGuestsRef}>
                  <button
                    type="button"
                    className={`flight-passenger-trigger ${isHotelGuestsOpen ? "open" : ""}`}
                    aria-expanded={isHotelGuestsOpen}
                    aria-haspopup="dialog"
                    onClick={() => {
                      setIsHotelGuestsOpen((prev) => !prev);
                      setIsHotelDestOpen(false);
                    }}
                  >
                    <span className="flight-tile-eyebrow">Rooms &amp; Guests</span>
                    <div className="flight-passenger-summary">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </span>
                      <div className="flight-date-text">
                        <span className="flight-date-main">
                          {totalHotelGuests} {totalHotelGuests === 1 ? "Guest" : "Guests"} • {hotelRooms} {hotelRooms === 1 ? "Room" : "Rooms"}
                        </span>
                        <span className="flight-date-sub">
                          {hotelAdults} {hotelAdults === 1 ? "Adult" : "Adults"}
                          {hotelChildren > 0 ? `, ${hotelChildren} ${hotelChildren === 1 ? "Child" : "Children"}` : ""}
                        </span>
                      </div>
                      <span className={`flight-trigger-chevron ${isHotelGuestsOpen ? "rotated" : ""}`} aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </button>

                  {isHotelGuestsOpen && (
                    <div className="flight-passenger-popover" role="dialog" aria-label="Select rooms and guests">
                      <div className="popover-header">
                        <span className="popover-title">Rooms &amp; Guests</span>
                        <span className="popover-pill">
                          {hotelRooms}R • {totalHotelGuests}G
                        </span>
                      </div>

                      <div className="popover-stepper-list">
                        <div className="popover-stepper-row">
                          <div className="stepper-label-group">
                            <span className="stepper-title">Rooms</span>
                            <span className="stepper-age">Max 6 rooms</span>
                          </div>
                          <div className="stepper-controls">
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => updateHotelRooms(-1)}
                              disabled={hotelRooms <= 1}
                              aria-label="Decrease rooms"
                            >
                              −
                            </button>
                            <span className="stepper-value" aria-live="polite">{hotelRooms}</span>
                            <button
                              type="button"
                              className="stepper-btn stepper-btn-plus"
                              onClick={() => updateHotelRooms(1)}
                              disabled={hotelRooms >= 6}
                              aria-label="Increase rooms"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="popover-stepper-row">
                          <div className="stepper-label-group">
                            <span className="stepper-title">Adults</span>
                            <span className="stepper-age">13 yrs &amp; above</span>
                          </div>
                          <div className="stepper-controls">
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => updateHotelAdults(-1)}
                              disabled={hotelAdults <= hotelRooms}
                              aria-label="Decrease hotel adults"
                            >
                              −
                            </button>
                            <span className="stepper-value" aria-live="polite">{hotelAdults}</span>
                            <button
                              type="button"
                              className="stepper-btn stepper-btn-plus"
                              onClick={() => updateHotelAdults(1)}
                              disabled={hotelAdults >= 12}
                              aria-label="Increase hotel adults"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="popover-stepper-row">
                          <div className="stepper-label-group">
                            <span className="stepper-title">Children</span>
                            <span className="stepper-age">0 – 12 yrs</span>
                          </div>
                          <div className="stepper-controls">
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => updateHotelChildren(-1)}
                              disabled={hotelChildren <= 0}
                              aria-label="Decrease hotel children"
                            >
                              −
                            </button>
                            <span className="stepper-value" aria-live="polite">{hotelChildren}</span>
                            <button
                              type="button"
                              className="stepper-btn stepper-btn-plus"
                              onClick={() => updateHotelChildren(1)}
                              disabled={hotelChildren >= 6}
                              aria-label="Increase hotel children"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="popover-footer">
                        <span className="popover-hint">Free cancellation available</span>
                        <button
                          type="button"
                          className="popover-done-btn"
                          onClick={() => setIsHotelGuestsOpen(false)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Strip: Price Band Chips + Entire Homes Toggle + Search Hotels CTA */}
              <div className="flight-deck-footer hotel-deck-footer">
                <div className="hotel-footer-filters">
                  <div className="hotel-price-strip" role="group" aria-label="Price per night">
                    <span className="hotel-price-label">Budget:</span>
                    {HOTEL_PRICE_RANGES.map((band) => {
                      const active = hotelPriceBand === band.id;
                      return (
                        <button
                          key={band.id}
                          type="button"
                          className={`hotel-price-chip ${active ? "active" : ""}`}
                          onClick={() => setHotelPriceBand(active ? "" : band.id)}
                        >
                          {band.label}
                        </button>
                      );
                    })}
                  </div>

                  <label className={`hotel-homes-toggle ${entireHomesOnly ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={entireHomesOnly}
                      onChange={(e) => setEntireHomesOnly(e.target.checked)}
                    />
                    <span>Entire Homes &amp; Villas</span>
                  </label>
                </div>

                <button type="submit" className="hero-search-submit-btn flight-search-cta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search Hotels</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === "bus" && (
            <form onSubmit={handleSearchSubmit} className="sky-flight-deck sky-bus-deck">
              {/* Top Utility Bar: Coach Preference Switcher + Live Bus Route Pill */}
              <div className="flight-deck-topbar">
                <div className="flight-trip-segmented bus-coach-segmented" role="radiogroup" aria-label="Bus coach preference">
                  {BUS_COACH_TYPES.map((coach) => (
                    <button
                      key={coach.id}
                      type="button"
                      role="radio"
                      aria-checked={busCoachType === coach.id}
                      className={`flight-trip-option ${busCoachType === coach.id ? "active" : ""}`}
                      onClick={() => setBusCoachType(coach.id)}
                    >
                      <span>{coach.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flight-route-badge" aria-live="polite">
                  <span className="route-badge-dot" />
                  <span className="route-badge-codes">
                    {busFrom.trim() || "Source"} → {busTo.trim() || "Destination"}
                  </span>
                  <span className="route-badge-sep">•</span>
                  <span className="route-badge-meta">
                    {busSeats} {busSeats === 1 ? "Seat" : "Seats"}
                  </span>
                  <span className="route-badge-sep">•</span>
                  <span>{activeBusCoachLabel}</span>
                </div>
              </div>

              {/* Main 3-Zone Bus Deck Grid */}
              <div className="bus-deck-grid">
                {/* 1. Paired Source & Destination Capsule */}
                <div className="flight-route-capsule" ref={busRouteRef}>
                  <div className={`flight-tile flight-tile-from ${openBusField === "from" ? "focused" : ""}`}>
                    <span className="flight-tile-eyebrow">Leaving From</span>
                    <div className="flight-tile-control">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 6v6" />
                          <path d="M15 6v6" />
                          <path d="M2 12h19.6" />
                          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
                          <circle cx="7" cy="18" r="2" />
                          <path d="M9 18h5" />
                          <circle cx="16" cy="18" r="2" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="flight-tile-input"
                        placeholder="Enter source city"
                        value={busFrom}
                        onFocus={() => setOpenBusField("from")}
                        onChange={(e) => setBusFrom(e.target.value)}
                        aria-label="Bus departure city"
                      />
                    </div>

                    {openBusField === "from" && (
                      <div className="flight-airport-dropdown hotel-dest-dropdown" role="listbox" aria-label="Departure bus cities">
                        <div className="airport-dropdown-header">Popular Boarding Cities</div>
                        {getFilteredBusCities(busFrom).map((item) => (
                          <button
                            key={`bus-from-${item.city}`}
                            type="button"
                            className="airport-option-row"
                            onClick={() => {
                              setBusFrom(item.city);
                              setOpenBusField(null);
                            }}
                          >
                            <span className="hotel-dest-pin" aria-hidden="true">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </span>
                            <span className="airport-option-info">
                              <strong>{item.city}</strong>
                              <small>{item.stand} • {item.state}</small>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`flight-swap-btn ${busSwapRotated ? "rotated" : ""}`}
                    onClick={handleBusSwap}
                    aria-label="Swap bus source and destination"
                    title="Swap route"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 7l-5 5 5 5" />
                      <path d="M3 12h18" />
                      <path d="M16 17l5-5-5-5" />
                    </svg>
                  </button>

                  <div className={`flight-tile flight-tile-to ${openBusField === "to" ? "focused" : ""}`}>
                    <span className="flight-tile-eyebrow">Going To</span>
                    <div className="flight-tile-control">
                      <span className="flight-tile-icon flight-tile-icon-teal" aria-hidden="true">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="flight-tile-input"
                        placeholder="Enter destination city"
                        value={busTo}
                        onFocus={() => setOpenBusField("to")}
                        onChange={(e) => setBusTo(e.target.value)}
                        aria-label="Bus destination city"
                      />
                    </div>

                    {openBusField === "to" && (
                      <div className="flight-airport-dropdown hotel-dest-dropdown" role="listbox" aria-label="Destination bus cities">
                        <div className="airport-dropdown-header">Popular Bus Routes</div>
                        {getFilteredBusCities(busTo).map((item) => (
                          <button
                            key={`bus-to-${item.city}`}
                            type="button"
                            className="airport-option-row"
                            onClick={() => {
                              setBusTo(item.city);
                              setOpenBusField(null);
                            }}
                          >
                            <span className="hotel-dest-pin" aria-hidden="true">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </span>
                            <span className="airport-option-info">
                              <strong>{item.city}</strong>
                              <small>{item.stand} • {item.state}</small>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Journey Date & Optional Return Capsule */}
                <div className="flight-dates-capsule">
                  <div
                    className="flight-date-slot"
                    onClick={() => {
                      setOpenBusField(null);
                      openNativePicker(busDepartInputRef.current);
                    }}
                  >
                    <span className="flight-tile-eyebrow">Travel Date</span>
                    <div className="flight-date-display">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <div className="flight-date-text">
                        <span className="flight-date-main">
                          {formattedBusDepart ? formattedBusDepart.main : "Select date"}
                        </span>
                        <span className="flight-date-sub">
                          {formattedBusDepart ? formattedBusDepart.sub : "Choose journey date"}
                        </span>
                      </div>
                    </div>
                    <input
                      ref={busDepartInputRef}
                      type="date"
                      className="flight-native-date-overlay"
                      value={busDepartDate}
                      onChange={(e) => handleBusDepartChange(e.target.value)}
                      aria-label="Bus travel date"
                    />
                  </div>

                  <span className="flight-ticket-divider" aria-hidden="true" />

                  <div
                    className={`flight-date-slot ${!busReturnDate ? "is-muted" : ""}`}
                    onClick={() => {
                      setOpenBusField(null);
                      openNativePicker(busReturnInputRef.current);
                    }}
                  >
                    <span className="flight-tile-eyebrow">
                      Return
                      {busReturnDate && (
                        <button
                          type="button"
                          className="flight-date-clear"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBusReturnDate("");
                          }}
                          aria-label="Clear bus return date"
                        >
                          ×
                        </button>
                      )}
                    </span>
                    <div className="flight-date-display">
                      <span className="flight-tile-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <div className="flight-date-text">
                        <span className={`flight-date-main ${!formattedBusReturn ? "is-placeholder" : ""}`}>
                          {formattedBusReturn ? formattedBusReturn.main : "+ Add Return"}
                        </span>
                        <span className="flight-date-sub">
                          {formattedBusReturn ? formattedBusReturn.sub : "Optional return trip"}
                        </span>
                      </div>
                    </div>
                    <input
                      ref={busReturnInputRef}
                      type="date"
                      className="flight-native-date-overlay"
                      min={busDepartDate || undefined}
                      value={busReturnDate}
                      onChange={(e) => setBusReturnDate(e.target.value)}
                      aria-label="Bus return date"
                    />
                  </div>
                </div>

                {/* 3. Inline Seats / Travelers Quick Stepper Tile */}
                <div className="bus-seats-tile">
                  <span className="flight-tile-eyebrow">Seats / Travelers</span>
                  <div className="bus-seats-control-row">
                    <div className="bus-seats-label">
                      <strong>{busSeats} {busSeats === 1 ? "Seat" : "Seats"}</strong>
                      <span>Max 6 per booking</span>
                    </div>
                    <div className="stepper-controls">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => setBusSeats((prev) => Math.max(1, prev - 1))}
                        disabled={busSeats <= 1}
                        aria-label="Decrease bus seats"
                      >
                        −
                      </button>
                      <span className="stepper-value" aria-live="polite">{busSeats}</span>
                      <button
                        type="button"
                        className="stepper-btn stepper-btn-plus"
                        onClick={() => setBusSeats((prev) => Math.min(6, prev + 1))}
                        disabled={busSeats >= 6}
                        aria-label="Increase bus seats"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Strip: Quick Date Chips (Today / Tomorrow / Weekend) + Live GPS Toggle + Search Buses CTA */}
              <div className="flight-deck-footer hotel-deck-footer">
                <div className="hotel-footer-filters">
                  <div className="hotel-price-strip" role="group" aria-label="Quick travel date">
                    <span className="hotel-price-label">Quick Date:</span>
                    <button
                      type="button"
                      className={`hotel-price-chip ${busDepartDate === BUS_TODAY_ISO ? "active" : ""}`}
                      onClick={() => handleBusDepartChange(BUS_TODAY_ISO)}
                    >
                      Today, 18 Nov
                    </button>
                    <button
                      type="button"
                      className={`hotel-price-chip ${busDepartDate === BUS_TOMORROW_ISO ? "active" : ""}`}
                      onClick={() => handleBusDepartChange(BUS_TOMORROW_ISO)}
                    >
                      Tomorrow, 19 Nov
                    </button>
                    <button
                      type="button"
                      className={`hotel-price-chip ${busDepartDate === BUS_WEEKEND_ISO ? "active" : ""}`}
                      onClick={() => handleBusDepartChange(BUS_WEEKEND_ISO)}
                    >
                      Weekend, 21 Nov
                    </button>
                  </div>

                  <label className={`hotel-homes-toggle ${busLiveTrackOnly ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={busLiveTrackOnly}
                      onChange={(e) => setBusLiveTrackOnly(e.target.checked)}
                    />
                    <span>Live GPS Tracked Buses</span>
                  </label>
                </div>

                <button type="submit" className="hero-search-submit-btn flight-search-cta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search Buses</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === "train" && (
            <form onSubmit={handleSearchSubmit} className="sky-train-sleek-deck">
              {/* Main Horizontal Search Bar */}
              <div className="train-search-bar" ref={trainRouteRef}>
                {/* 1. Origin Station (From) */}
                <div className={`train-station-tile train-station-from ${openTrainField === "from" ? "focused" : ""}`}>
                  <div className="train-tile-icon-box" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="16" height="16" x="4" y="3" rx="2" />
                      <path d="M4 11h16" />
                      <path d="M12 3v8" />
                      <circle cx="8" cy="15" r="1.2" fill="currentColor" />
                      <circle cx="16" cy="15" r="1.2" fill="currentColor" />
                      <path d="m8 19-2 3" />
                      <path d="m18 22-2-3" />
                    </svg>
                  </div>
                  <div className="train-tile-content">
                    <span className="train-tile-label">From</span>
                    <input
                      type="text"
                      className="train-tile-input"
                      placeholder="Enter station or city"
                      value={trainFrom}
                      onFocus={() => setOpenTrainField("from")}
                      onChange={(e) => setTrainFrom(e.target.value)}
                      aria-label="Train departure station"
                    />
                  </div>

                  {openTrainField === "from" && (
                    <div className="flight-airport-dropdown hotel-dest-dropdown train-station-dropdown" role="listbox" aria-label="Departure train stations">
                      <div className="airport-dropdown-header">Popular Origin Stations</div>
                      {getFilteredTrainStations(trainFrom).map((item) => (
                        <button
                          key={`train-from-${item.code}`}
                          type="button"
                          className="airport-option-row"
                          onClick={() => {
                            setTrainFrom(`${item.name} (${item.code})`);
                            setOpenTrainField(null);
                          }}
                        >
                          <span className="hotel-dest-pin" aria-hidden="true">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="16" height="16" x="4" y="3" rx="2" />
                              <path d="M4 11h16" />
                            </svg>
                          </span>
                          <span className="airport-option-info">
                            <strong>{item.name} ({item.code})</strong>
                            <small>{item.city} • {item.state}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Swap Button */}
                <div className="train-swap-wrapper">
                  <button
                    type="button"
                    className={`train-swap-circle-btn ${trainSwapRotated ? "rotated" : ""}`}
                    onClick={handleTrainSwap}
                    aria-label="Swap origin and destination stations"
                    title="Swap stations"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7H4" />
                      <path d="m8 3-4 4 4 4" />
                      <path d="M4 17h16" />
                      <path d="m16 21 4-4-4-4" />
                    </svg>
                  </button>
                </div>

                {/* 2. Destination Station (To) */}
                <div className={`train-station-tile train-station-to ${openTrainField === "to" ? "focused" : ""}`}>
                  <div className="train-tile-icon-box train-icon-to" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="16" height="16" x="4" y="3" rx="2" />
                      <path d="M4 11h16" />
                      <circle cx="8" cy="15" r="1.2" fill="currentColor" />
                      <circle cx="16" cy="15" r="1.2" fill="currentColor" />
                      <path d="m8 19-2 3" />
                      <path d="m18 22-2-3" />
                    </svg>
                  </div>
                  <div className="train-tile-content">
                    <span className="train-tile-label">To</span>
                    <input
                      type="text"
                      className="train-tile-input"
                      placeholder="Enter station or city"
                      value={trainTo}
                      onFocus={() => setOpenTrainField("to")}
                      onChange={(e) => setTrainTo(e.target.value)}
                      aria-label="Train destination station"
                    />
                  </div>

                  {openTrainField === "to" && (
                    <div className="flight-airport-dropdown hotel-dest-dropdown train-station-dropdown" role="listbox" aria-label="Arrival train stations">
                      <div className="airport-dropdown-header">Popular Destination Stations</div>
                      {getFilteredTrainStations(trainTo).map((item) => (
                        <button
                          key={`train-to-${item.code}`}
                          type="button"
                          className="airport-option-row"
                          onClick={() => {
                            setTrainTo(`${item.name} (${item.code})`);
                            setOpenTrainField(null);
                          }}
                        >
                          <span className="hotel-dest-pin hotel-dest-pin-to" aria-hidden="true">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </span>
                          <span className="airport-option-info">
                            <strong>{item.name} ({item.code})</strong>
                            <small>{item.city} • {item.state}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="train-bar-divider" aria-hidden="true" />

                {/* 3. Departure Date Tile with Quick Tatkal Pills */}
                <div
                  className="train-date-tile"
                  onClick={() => {
                    setOpenTrainField(null);
                    openNativePicker(trainDepartInputRef.current);
                  }}
                >
                  <div className="train-date-info">
                    <span className="train-tile-label">Departure Date</span>
                    <div className="train-date-val">
                      <strong>{trainDateFormatted.weekday}, {trainDateFormatted.dateStr}</strong>
                      <small>{trainDateFormatted.year}</small>
                    </div>
                  </div>

                  {/* Quick Tatkal Shortcut Badges */}
                  <div className="train-quick-tatkal-group">
                    <button
                      type="button"
                      className={`train-tatkal-pill-btn ${trainDepartDate === trainTomorrowIso ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrainDepartDate(trainTomorrowIso);
                      }}
                      title="Depart Tomorrow (Tatkal Booking Window)"
                    >
                      <span className="tatkal-btn-label">Tomorrow</span>
                      <span className="tatkal-btn-tag">Tatkal Open</span>
                    </button>
                    <button
                      type="button"
                      className={`train-tatkal-pill-btn ${trainDepartDate === trainDayAfterIso ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrainDepartDate(trainDayAfterIso);
                      }}
                      title="Depart Day After (Tatkal Booking Window)"
                    >
                      <span className="tatkal-btn-label">Day After</span>
                      <span className="tatkal-btn-tag">Tatkal Open</span>
                    </button>
                  </div>

                  <input
                    ref={trainDepartInputRef}
                    type="date"
                    className="flight-native-date-overlay"
                    value={trainDepartDate}
                    onChange={(e) => setTrainDepartDate(e.target.value)}
                    aria-label="Train departure date"
                  />
                </div>

                <div className="train-bar-divider" aria-hidden="true" />

                {/* 4. Compact Coach & Quota Pill */}
                <div className="train-meta-tile" ref={trainClassRef}>
                  <span className="train-tile-label">Coach &amp; Quota</span>
                  <button
                    type="button"
                    className={`train-meta-select-btn ${openTrainField === "class" ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTrainField((prev) => (prev === "class" ? null : "class"));
                    }}
                    aria-label="Select coach class and quota"
                  >
                    <span className="train-meta-select-text">
                      <strong>{activeTrainQuotaLabel}</strong>
                      <small>{trainClass === "All Classes" ? "All Classes" : trainClass}</small>
                    </span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="train-meta-arrow">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {openTrainField === "class" && (
                    <div className="train-meta-popover" role="dialog" aria-label="Train options" onClick={(e) => e.stopPropagation()}>
                      <div className="train-popover-header">Booking Quota</div>
                      <div className="train-quota-chips-strip">
                        {TRAIN_QUOTA_TYPES.map((quota) => (
                          <button
                            key={quota.id}
                            type="button"
                            className={`train-quota-chip ${trainQuota === quota.id ? "active" : ""}`}
                            onClick={() => setTrainQuota(quota.id)}
                          >
                            {quota.label}
                          </button>
                        ))}
                      </div>

                      <div className="train-popover-header train-popover-subhdr">Coach Class</div>
                      <div className="train-class-scroll-list">
                        {TRAIN_CLASSES.map((cls) => (
                          <button
                            key={cls}
                            type="button"
                            className={`train-class-choice ${trainClass === cls ? "selected" : ""}`}
                            onClick={() => {
                              setTrainClass(cls);
                              setOpenTrainField(null);
                            }}
                          >
                            <span>{cls}</span>
                            {trainClass === cls && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Guarantee Strip: Full Train Fare Refund + Key Benefits */}
              <div className={`train-guarantee-bar ${trainFreeCancel ? "is-active" : ""}`}>
                <label className="train-guarantee-checkbox-wrap">
                  <input
                    type="checkbox"
                    checked={trainFreeCancel}
                    onChange={(e) => setTrainFreeCancel(e.target.checked)}
                    className="train-guarantee-native-input"
                  />
                  <span className="train-guarantee-custom-box" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="train-guarantee-main-text">
                    Get a full train fare refund
                  </span>
                </label>

                <div className="train-guarantee-sep" aria-hidden="true" />

                <div className="train-guarantee-perks">
                  <div className="train-perk-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12" />
                      <path d="M6 8h12" />
                      <path d="m6 13 8.5 8" />
                      <path d="M6 13h3a4.5 4.5 0 0 0 0-9" />
                    </svg>
                    <span>₹0 cancellation fee</span>
                  </div></div>

                <button type="submit" className="train-search-submit-btn" aria-label="Search Trains">
                  <span className="train-submit-btn-text">Search Trains</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="train-cta-arrow">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 4. Bottom Executive Trust Bar (5 items) */}
        <div className="hero-features-bar">
          {/* 1. Secure Booking */}
          <div className="hero-feature-item">
            <div className="feature-icon-circle trust-badge-emerald">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="feature-text-block">
              <span className="feature-title">Secure Booking</span>
              <span className="feature-desc">256-bit encrypted checkout</span>
            </div>
          </div>

          <div className="feature-divider" />

          {/* 2. 24/7 Support */}
          <div className="hero-feature-item">
            <div className="feature-icon-circle trust-badge-sky">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              </svg>
            </div>
            <div className="feature-text-block">
              <span className="feature-title">24/7 Support</span>
              <span className="feature-desc">Live travel experts anytime</span>
            </div>
          </div>

          <div className="feature-divider" />

          {/* 3. Best Price Guarantee */}
          <div className="hero-feature-item">
            <div className="feature-icon-circle trust-badge-cyan">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
            </div>
            <div className="feature-text-block">
              <span className="feature-title">Best Price Guarantee</span>
              <span className="feature-desc">Lowest verified fares daily</span>
            </div>
          </div>

          <div className="feature-divider" />

          {/* 4. Exclusive Offers */}
          <div className="hero-feature-item">
            <div className="feature-icon-circle trust-badge-violet">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
              </svg>
            </div>
            <div className="feature-text-block">
              <span className="feature-title">Exclusive Offers</span>
              <span className="feature-desc">Instant member savings</span>
            </div>
          </div>

          <div className="feature-divider" />

          {/* 5. Trusted by Millions */}
          <div className="hero-feature-item">
            <div className="feature-icon-circle trust-badge-amber">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="feature-text-block">
              <span className="feature-title">Trusted by Millions</span>
              <span className="feature-desc">4.9★ rated global travelers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
