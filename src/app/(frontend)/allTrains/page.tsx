"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "./AllTrains.css";

/* ==========================================================================
   TRAIN DATA INTERFACES & SCHEMAS
   ========================================================================== */

export interface TrainHaltingStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  dayCount: number;
}

export interface CoachClassAvailability {
  classCode: "SL" | "3E" | "3A" | "2A" | "1A";
  className: string;
  fare: number;
  status: "AVAILABLE" | "WL" | "RAC" | "REGRET";
  statusText: string;
  confirmationProbability?: number; // e.g. 85 for 85%
  isConfirmed2xRefund?: boolean;
  lastUpdated: string;
}

export interface TrainResultItem {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: "Superfast" | "Duronto" | "Rajdhani" | "Vande Bharat" | "Express";
  rating: number;
  reviewsCount: number;
  hasPantry: boolean;
  hasChargingPoint: boolean;
  hasCleanRestroom: boolean;
  runsOnDays: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  fromStation: {
    code: string;
    name: string;
    city: string;
  };
  toStation: {
    code: string;
    name: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  departurePeriod: "early-morning" | "morning" | "afternoon" | "night";
  duration: string;
  durationMinutes: number;
  distanceKm: number;
  classes: CoachClassAvailability[];
  halts: TrainHaltingStop[];
}

export interface DateAvailabilitySlot {
  iso: string;
  dayName: string;
  dateStr: string;
  fullDateStr: string;
  isInitialSearchDate: boolean;
  status: "AVAILABLE" | "WL" | "RAC" | "REGRET";
  statusText: string;
  confirmationProbability: number;
  alternateFare: number;
}

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const POPULAR_TRAIN_MOCK_DATABASE: TrainResultItem[] = [
  {
    id: "trn-12863",
    trainNumber: "12863",
    trainName: "Hwh Smvb Express",
    trainType: "Superfast",
    rating: 4.1,
    reviewsCount: 1420,
    hasPantry: true,
    hasChargingPoint: true,
    hasCleanRestroom: true,
    runsOnDays: [true, true, true, true, true, true, true],
    fromStation: { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
    toStation: { code: "SMVB", name: "Sir M. Visvesvaraya Terminal", city: "Bengaluru" },
    departureTime: "10:45 PM",
    arrivalTime: "07:00 AM",
    departurePeriod: "night",
    duration: "1d 8h 15m",
    durationMinutes: 1935,
    distanceKm: 1948,
    classes: [
      { classCode: "SL", className: "Sleeper Class", fare: 830, status: "WL", statusText: "GNWL 100", confirmationProbability: 65, lastUpdated: "25 mins ago" },
      { classCode: "3E", className: "AC 3 Economy", fare: 1985, status: "AVAILABLE", statusText: "AVAILABLE 24", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "12 mins ago" },
      { classCode: "3A", className: "AC 3 Tier", fare: 2100, status: "AVAILABLE", statusText: "AVAILABLE 18", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "5 mins ago" },
      { classCode: "2A", className: "AC 2 Tier", fare: 2990, status: "WL", statusText: "GNWL 14", confirmationProbability: 82, isConfirmed2xRefund: true, lastUpdated: "18 mins ago" },
    ],
    halts: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "10:45 PM", haltMinutes: 0, distanceKm: 0, dayCount: 1 },
      { stationCode: "KGP", stationName: "Kharagpur Jn", arrivalTime: "12:20 AM", departureTime: "12:25 AM", haltMinutes: 5, distanceKm: 115, dayCount: 2 },
      { stationCode: "BLS", stationName: "Baleshwar", arrivalTime: "01:50 AM", departureTime: "01:55 AM", haltMinutes: 5, distanceKm: 231, dayCount: 2 },
      { stationCode: "BBS", stationName: "Bhubaneswar", arrivalTime: "05:00 AM", departureTime: "05:05 AM", haltMinutes: 5, distanceKm: 437, dayCount: 2 },
      { stationCode: "VSKP", stationName: "Visakhapatnam", arrivalTime: "12:40 PM", departureTime: "01:00 PM", haltMinutes: 20, distanceKm: 880, dayCount: 2 },
      { stationCode: "BZA", stationName: "Vijayawada Jn", arrivalTime: "07:15 PM", departureTime: "07:25 PM", haltMinutes: 10, distanceKm: 1230, dayCount: 2 },
      { stationCode: "RU", stationName: "Renigunta Jn", arrivalTime: "01:45 AM", departureTime: "01:50 AM", haltMinutes: 5, distanceKm: 1610, dayCount: 3 },
      { stationCode: "KJM", stationName: "Krishnarajapuram", arrivalTime: "06:18 AM", departureTime: "06:20 AM", haltMinutes: 2, distanceKm: 1935, dayCount: 3 },
      { stationCode: "SMVB", stationName: "SMVT Bengaluru", arrivalTime: "07:00 AM", departureTime: "--:--", haltMinutes: 0, distanceKm: 1948, dayCount: 3 },
    ],
  },
  {
    id: "trn-12703",
    trainNumber: "12703",
    trainName: "Falaknuma Express",
    trainType: "Superfast",
    rating: 4.2,
    reviewsCount: 1890,
    hasPantry: true,
    hasChargingPoint: true,
    hasCleanRestroom: true,
    runsOnDays: [true, true, true, true, true, true, true],
    fromStation: { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
    toStation: { code: "SC", name: "Secunderabad Junction", city: "Hyderabad" },
    departureTime: "08:35 AM",
    arrivalTime: "10:30 AM",
    departurePeriod: "morning",
    duration: "25h 55m",
    durationMinutes: 1555,
    distanceKm: 1545,
    classes: [
      { classCode: "SL", className: "Sleeper Class", fare: 710, status: "WL", statusText: "WL 45", confirmationProbability: 72, lastUpdated: "14 mins ago" },
      { classCode: "3E", className: "AC 3 Economy", fare: 1695, status: "AVAILABLE", statusText: "AVAILABLE 32", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "2 mins ago" },
      { classCode: "3A", className: "AC 3 Tier", fare: 1820, status: "AVAILABLE", statusText: "AVAILABLE 12", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "40 mins ago" },
      { classCode: "2A", className: "AC 2 Tier", fare: 2555, status: "WL", statusText: "WL 18", confirmationProbability: 78, isConfirmed2xRefund: true, lastUpdated: "5 mins ago" },
      { classCode: "1A", className: "AC First Class", fare: 4295, status: "AVAILABLE", statusText: "AVAILABLE 4", confirmationProbability: 100, lastUpdated: "1 hr ago" },
    ],
    halts: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "08:35 AM", haltMinutes: 0, distanceKm: 0, dayCount: 1 },
      { stationCode: "KGP", stationName: "Kharagpur Jn", arrivalTime: "10:05 AM", departureTime: "10:10 AM", haltMinutes: 5, distanceKm: 115, dayCount: 1 },
      { stationCode: "BBS", stationName: "Bhubaneswar", arrivalTime: "02:25 PM", departureTime: "02:30 PM", haltMinutes: 5, distanceKm: 437, dayCount: 1 },
      { stationCode: "VSKP", stationName: "Visakhapatnam", arrivalTime: "09:30 PM", departureTime: "09:50 PM", haltMinutes: 20, distanceKm: 880, dayCount: 1 },
      { stationCode: "BZA", stationName: "Vijayawada Jn", arrivalTime: "03:45 AM", departureTime: "04:00 AM", haltMinutes: 15, distanceKm: 1230, dayCount: 2 },
      { stationCode: "NLDA", stationName: "Nalgonda", arrivalTime: "07:14 AM", departureTime: "07:15 AM", haltMinutes: 1, distanceKm: 1435, dayCount: 2 },
      { stationCode: "SC", stationName: "Secunderabad Jn", arrivalTime: "10:30 AM", departureTime: "--:--", haltMinutes: 0, distanceKm: 1545, dayCount: 2 },
    ],
  },
  {
    id: "trn-12245",
    trainNumber: "12245",
    trainName: "Howrah - SMVB Duronto Express",
    trainType: "Duronto",
    rating: 4.4,
    reviewsCount: 2150,
    hasPantry: true,
    hasChargingPoint: true,
    hasCleanRestroom: true,
    runsOnDays: [false, true, true, false, true, true, false],
    fromStation: { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
    toStation: { code: "SMVB", name: "SMVT Bengaluru", city: "Bengaluru" },
    departureTime: "10:50 AM",
    arrivalTime: "03:45 PM",
    departurePeriod: "morning",
    duration: "1d 4h 55m",
    durationMinutes: 1735,
    distanceKm: 1942,
    classes: [
      { classCode: "SL", className: "Sleeper Class", fare: 1735, status: "WL", statusText: "GNWL 75", confirmationProbability: 60, lastUpdated: "30 mins ago" },
      { classCode: "3A", className: "AC 3 Tier", fare: 4005, status: "AVAILABLE", statusText: "AVAILABLE 56", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "1 hr ago" },
      { classCode: "2A", className: "AC 2 Tier", fare: 5460, status: "AVAILABLE", statusText: "AVAILABLE 14", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "35 mins ago" },
      { classCode: "1A", className: "AC First Class", fare: 6765, status: "AVAILABLE", statusText: "AVAILABLE 6", confirmationProbability: 100, lastUpdated: "15 mins ago" },
    ],
    halts: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "10:50 AM", haltMinutes: 0, distanceKm: 0, dayCount: 1 },
      { stationCode: "BBS", stationName: "Bhubaneswar", arrivalTime: "04:15 PM", departureTime: "04:20 PM", haltMinutes: 5, distanceKm: 437, dayCount: 1 },
      { stationCode: "VZM", stationName: "Vizianagaram Jn", arrivalTime: "09:50 PM", departureTime: "09:55 PM", haltMinutes: 5, distanceKm: 818, dayCount: 1 },
      { stationCode: "BZA", stationName: "Vijayawada Jn", arrivalTime: "04:25 AM", departureTime: "04:35 AM", haltMinutes: 10, distanceKm: 1230, dayCount: 2 },
      { stationCode: "RU", stationName: "Renigunta Jn", arrivalTime: "10:05 AM", departureTime: "10:10 AM", haltMinutes: 5, distanceKm: 1610, dayCount: 2 },
      { stationCode: "SMVB", stationName: "SMVT Bengaluru", arrivalTime: "03:45 PM", departureTime: "--:--", haltMinutes: 0, distanceKm: 1942, dayCount: 2 },
    ],
  },
  {
    id: "trn-18045",
    trainNumber: "18045",
    trainName: "East Coast Express",
    trainType: "Express",
    rating: 3.9,
    reviewsCount: 1120,
    hasPantry: true,
    hasChargingPoint: true,
    hasCleanRestroom: false,
    runsOnDays: [true, true, true, true, true, true, true],
    fromStation: { code: "SHM", name: "Shalimar", city: "Kolkata" },
    toStation: { code: "SC", name: "Secunderabad Junction", city: "Hyderabad" },
    departureTime: "11:25 AM",
    arrivalTime: "05:20 PM",
    departurePeriod: "morning",
    duration: "29h 55m",
    durationMinutes: 1795,
    distanceKm: 1585,
    classes: [
      { classCode: "SL", className: "Sleeper Class", fare: 690, status: "AVAILABLE", statusText: "AVAILABLE 54", confirmationProbability: 100, lastUpdated: "51 mins ago" },
      { classCode: "3E", className: "AC 3 Economy", fare: 1670, status: "AVAILABLE", statusText: "AVAILABLE 20", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "1 hr ago" },
      { classCode: "3A", className: "AC 3 Tier", fare: 1775, status: "AVAILABLE", statusText: "AVAILABLE 27", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "24 mins ago" },
      { classCode: "2A", className: "AC 2 Tier", fare: 2540, status: "AVAILABLE", statusText: "AVAILABLE 14", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "3 hrs ago" },
    ],
    halts: [
      { stationCode: "SHM", stationName: "Shalimar", arrivalTime: "--:--", departureTime: "11:25 AM", haltMinutes: 0, distanceKm: 0, dayCount: 1 },
      { stationCode: "KGP", stationName: "Kharagpur Jn", arrivalTime: "01:10 PM", departureTime: "01:15 PM", haltMinutes: 5, distanceKm: 110, dayCount: 1 },
      { stationCode: "CTC", stationName: "Cuttack Jn", arrivalTime: "04:55 PM", departureTime: "05:00 PM", haltMinutes: 5, distanceKm: 409, dayCount: 1 },
      { stationCode: "BBS", stationName: "Bhubaneswar", arrivalTime: "05:40 PM", departureTime: "05:45 PM", haltMinutes: 5, distanceKm: 437, dayCount: 1 },
      { stationCode: "VSKP", stationName: "Visakhapatnam", arrivalTime: "02:30 AM", departureTime: "02:50 AM", haltMinutes: 20, distanceKm: 880, dayCount: 2 },
      { stationCode: "BZA", stationName: "Vijayawada Jn", arrivalTime: "10:15 AM", departureTime: "10:30 AM", haltMinutes: 15, distanceKm: 1230, dayCount: 2 },
      { stationCode: "KZJ", stationName: "Kazipet Jn", arrivalTime: "02:30 PM", departureTime: "02:32 PM", haltMinutes: 2, distanceKm: 1450, dayCount: 2 },
      { stationCode: "SC", stationName: "Secunderabad Jn", arrivalTime: "05:20 PM", departureTime: "--:--", haltMinutes: 0, distanceKm: 1585, dayCount: 2 },
    ],
  },
  {
    id: "trn-22817",
    trainNumber: "22817",
    trainName: "Howrah - Mysuru Superfast Exp",
    trainType: "Superfast",
    rating: 4.0,
    reviewsCount: 940,
    hasPantry: true,
    hasChargingPoint: true,
    hasCleanRestroom: true,
    runsOnDays: [false, false, false, false, true, false, false],
    fromStation: { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
    toStation: { code: "SBC", name: "KSR Bengaluru", city: "Bengaluru" },
    departureTime: "04:15 PM",
    arrivalTime: "12:40 AM",
    departurePeriod: "afternoon",
    duration: "1d 8h 25m",
    durationMinutes: 1945,
    distanceKm: 1960,
    classes: [
      { classCode: "SL", className: "Sleeper Class", fare: 840, status: "WL", statusText: "GNWL 64", confirmationProbability: 68, lastUpdated: "1 hr ago" },
      { classCode: "3E", className: "AC 3 Economy", fare: 2005, status: "WL", statusText: "GNWL 26", confirmationProbability: 80, isConfirmed2xRefund: true, lastUpdated: "2 hrs ago" },
      { classCode: "3A", className: "AC 3 Tier", fare: 2120, status: "WL", statusText: "GNWL 25", confirmationProbability: 84, isConfirmed2xRefund: true, lastUpdated: "2 hrs ago" },
      { classCode: "2A", className: "AC 2 Tier", fare: 3020, status: "AVAILABLE", statusText: "AVAILABLE 19", confirmationProbability: 100, isConfirmed2xRefund: true, lastUpdated: "2 hrs ago" },
    ],
    halts: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "04:15 PM", haltMinutes: 0, distanceKm: 0, dayCount: 1 },
      { stationCode: "BBS", stationName: "Bhubaneswar", arrivalTime: "10:10 PM", departureTime: "10:15 PM", haltMinutes: 5, distanceKm: 437, dayCount: 1 },
      { stationCode: "VSKP", stationName: "Visakhapatnam", arrivalTime: "05:25 AM", departureTime: "05:45 AM", haltMinutes: 20, distanceKm: 880, dayCount: 2 },
      { stationCode: "RU", stationName: "Renigunta Jn", arrivalTime: "06:40 PM", departureTime: "06:45 PM", haltMinutes: 5, distanceKm: 1610, dayCount: 2 },
      { stationCode: "SBC", stationName: "KSR Bengaluru", arrivalTime: "12:40 AM", departureTime: "--:--", haltMinutes: 0, distanceKm: 1960, dayCount: 3 },
    ],
  },
  {
    id: "trn-20898",
    trainNumber: "20898",
    trainName: "Howrah - Puri Vande Bharat Exp",
    trainType: "Vande Bharat",
    rating: 4.8,
    reviewsCount: 3410,
    hasPantry: true,
    hasChargingPoint: true,
    hasCleanRestroom: true,
    runsOnDays: [true, true, true, false, true, true, true],
    fromStation: { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
    toStation: { code: "PURI", name: "Puri Terminus", city: "Puri" },
    departureTime: "06:10 AM",
    arrivalTime: "12:35 PM",
    departurePeriod: "early-morning",
    duration: "6h 25m",
    durationMinutes: 385,
    distanceKm: 500,
    classes: [
      { classCode: "3E", className: "Chair Car (CC)", fare: 1265, status: "AVAILABLE", statusText: "AVAILABLE 142", confirmationProbability: 100, lastUpdated: "5 mins ago" },
      { classCode: "1A", className: "Executive Chair (EC)", fare: 2420, status: "AVAILABLE", statusText: "AVAILABLE 28", confirmationProbability: 100, lastUpdated: "8 mins ago" },
    ],
    halts: [
      { stationCode: "HWH", stationName: "Howrah Jn", arrivalTime: "--:--", departureTime: "06:10 AM", haltMinutes: 0, distanceKm: 0, dayCount: 1 },
      { stationCode: "KGP", stationName: "Kharagpur Jn", arrivalTime: "07:38 AM", departureTime: "07:40 AM", haltMinutes: 2, distanceKm: 115, dayCount: 1 },
      { stationCode: "BLS", stationName: "Baleshwar", arrivalTime: "09:03 AM", departureTime: "09:05 AM", haltMinutes: 2, distanceKm: 231, dayCount: 1 },
      { stationCode: "BBS", stationName: "Bhubaneswar", arrivalTime: "11:06 AM", departureTime: "11:08 AM", haltMinutes: 2, distanceKm: 437, dayCount: 1 },
      { stationCode: "KUR", stationName: "Khurda Road Jn", arrivalTime: "11:26 AM", departureTime: "11:28 AM", haltMinutes: 2, distanceKm: 456, dayCount: 1 },
      { stationCode: "PURI", stationName: "Puri Terminus", arrivalTime: "12:35 PM", departureTime: "--:--", haltMinutes: 0, distanceKm: 500, dayCount: 1 },
    ],
  },
];

/* 7 Dates Carousel Ribbon items */
const CALENDAR_DATES = [
  { iso: "2026-12-01", day: "Tue", date: "01 Dec", status: "Few Seats", fare: "₹690" },
  { iso: "2026-12-02", day: "Wed", date: "02 Dec", status: "Available", fare: "₹690" },
  { iso: "2026-12-03", day: "Thu", date: "03 Dec", status: "Available", fare: "₹710" },
  { iso: "2026-12-04", day: "Fri", date: "04 Dec", status: "Few Seats", fare: "₹830" },
  { iso: "2026-12-05", day: "Sat", date: "05 Dec", status: "Tatkal Open", fare: "₹830" },
  { iso: "2026-12-06", day: "Sun", date: "06 Dec", status: "Available", fare: "₹690" },
  { iso: "2026-12-07", day: "Mon", date: "07 Dec", status: "Available", fare: "₹690" },
];

/**
 * Generates the current selected date + next 5 operating dates (6 dates total)
 * dynamically based on the train's operating schedule and class status.
 */
function getNextDeparturesForTrain(
  train: TrainResultItem,
  classObj: CoachClassAvailability,
  baseIso: string,
  quota: string = "general",
  count: number = 6
): DateAvailabilitySlot[] {
  const slots: DateAvailabilitySlot[] = [];
  const baseDate = new Date(baseIso + "T00:00:00");
  
  // JS Day (0=Sun, 1=Mon... 6=Sat) to runsOnDays [0=Mon, 1=Tue... 6=Sun]
  const jsDayToRunsIndex = (jsDay: number) => (jsDay === 0 ? 6 : jsDay - 1);

  let currentD = new Date(baseDate);
  let iterations = 0;

  while (slots.length < count && iterations < 90) {
    iterations++;
    const runsIdx = jsDayToRunsIndex(currentD.getDay());
    const doesRun = train.runsOnDays[runsIdx];

    if (doesRun) {
      const iso = currentD.toISOString().split("T")[0];
      const isFirst = slots.length === 0;
      const dayName = currentD.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = currentD.toLocaleDateString("en-US", { day: "2-digit" });
      const month = currentD.toLocaleDateString("en-US", { month: "short" });

      let status: "AVAILABLE" | "WL" | "RAC" | "REGRET" = classObj.status;
      let statusText = classObj.statusText;
      let chance = classObj.confirmationProbability || 85;

      if (!isFirst) {
        if (slots.length === 1) {
          status = "WL";
          statusText = "WL 11";
          chance = 89;
        } else if (slots.length === 2) {
          status = "WL";
          statusText = "WL 8";
          chance = 91;
        } else if (slots.length === 3) {
          status = "AVAILABLE";
          statusText = "AVAILABLE 16";
          chance = 100;
        } else if (slots.length === 4) {
          status = "WL";
          statusText = "WL 14";
          chance = 82;
        } else {
          status = "REGRET";
          statusText = "Regret";
          chance = 45;
        }
      }

      // Quota sensitivity: ladies / senior citizens have higher chances
      if (quota === "ladies" || quota === "senior") {
        if (status === "WL") {
          status = "AVAILABLE";
          statusText = "AVAILABLE 8";
          chance = 100;
        }
      }

      slots.push({
        iso,
        dayName,
        dateStr: `${dayNum} ${month}`,
        fullDateStr: `${dayName}, ${dayNum} ${month}`,
        isInitialSearchDate: isFirst,
        status,
        statusText,
        confirmationProbability: chance,
        alternateFare: Math.round(classObj.fare * 1.35),
      });
    }

    currentD.setDate(currentD.getDate() + 1);
  }

  return slots;
}

/* ==========================================================================
   MAIN ALLTRAINS CONTENT WRAPPER
   ========================================================================== */

function AllTrainsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters from URL or defaults
  const fromParam = searchParams.get("from") || "Howrah Junction (HWH)";
  const toParam = searchParams.get("to") || "Secunderabad Junction (SC)";
  const dateParam = searchParams.get("depart") || "2026-12-03";
  const quotaParam = searchParams.get("quota") || "general";
  const classParam = searchParams.get("class") || "All Classes";

  // Search Bar Local State
  const [fromQuery, setFromQuery] = useState(fromParam);
  const [toQuery, setToQuery] = useState(toParam);
  const [departDate, setDepartDate] = useState(dateParam);
  const [selectedQuota, setSelectedQuota] = useState(quotaParam);
  const [selectedClass, setSelectedClass] = useState(classParam);

  // Filter States
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showAcOnly, setShowAcOnly] = useState(false);
  const [filterClass, setFilterClass] = useState<string>("ALL");
  const [filterTimeWindow, setFilterTimeWindow] = useState<string>("ALL");
  const [filterTrainType, setFilterTrainType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"recommended" | "fastest" | "cheapest" | "earliest">("recommended");

  // Interaction State: active selected class and quota per train
  const [selectedCoachMap, setSelectedCoachMap] = useState<Record<string, string>>({});
  const [selectedQuotaMap, setSelectedQuotaMap] = useState<Record<string, string>>({});
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);

  // Handle Search Swap
  const handleSwapStations = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  // Handle Search Update Submit
  const handleUpdateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: fromQuery,
      to: toQuery,
      depart: departDate,
      quota: selectedQuota,
      class: selectedClass,
    });
    router.push(`/allTrains?${params.toString()}`);
  };

  // Filter & Sort Logic
  const filteredTrains = useMemo(() => {
    let list = [...POPULAR_TRAIN_MOCK_DATABASE];

    // Show Available Only
    if (showAvailableOnly) {
      list = list.filter((train) =>
        train.classes.some((c) => c.status === "AVAILABLE")
      );
    }

    // Show AC Only
    if (showAcOnly) {
      list = list.filter((train) =>
        train.classes.some((c) => c.classCode !== "SL")
      );
    }

    // Class Filter
    if (filterClass !== "ALL") {
      list = list.filter((train) =>
        train.classes.some((c) => c.classCode === filterClass)
      );
    }

    // Time Window Filter
    if (filterTimeWindow !== "ALL") {
      list = list.filter((train) => train.departurePeriod === filterTimeWindow);
    }

    // Train Type Filter
    if (filterTrainType !== "ALL") {
      list = list.filter((train) => train.trainType === filterTrainType);
    }

    // Sort Logic
    if (sortBy === "fastest") {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === "cheapest") {
      list.sort((a, b) => {
        const minA = Math.min(...a.classes.map((c) => c.fare));
        const minB = Math.min(...b.classes.map((c) => c.fare));
        return minA - minB;
      });
    } else if (sortBy === "earliest") {
      list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [showAvailableOnly, showAcOnly, filterClass, filterTimeWindow, filterTrainType, sortBy]);

  // Click handler for coach tile: toggles or sets selected class for that train
  const handleSelectCoach = (trainId: string, classCode: string) => {
    setSelectedCoachMap((prev) => {
      // If clicking the currently selected coach, toggle it off; otherwise select the new coach
      if (prev[trainId] === classCode) {
        const next = { ...prev };
        delete next[trainId];
        return next;
      }
      return {
        ...prev,
        [trainId]: classCode,
      };
    });
  };

  const handleBookTicket = (train: TrainResultItem, classCode: string, dateStr?: string) => {
    const cls = train.classes.find((c) => c.classCode === classCode);
    const dateLabel = dateStr || departDate;
    setBookingNotice(`Proceeding to IRCTC Passenger Details for ${train.trainNumber} - ${train.trainName} on ${dateLabel} (${cls?.className} • ₹${cls?.fare})`);
    setTimeout(() => {
      setBookingNotice(null);
    }, 4500);
  };

  const handleAlternatePlan = (train: TrainResultItem, classCode: string, slot: DateAvailabilitySlot) => {
    setBookingNotice(`Found high-probability alternate train connection on ${slot.fullDateStr} with ${slot.confirmationProbability}% Confirmation Chance (₹${slot.alternateFare})`);
    setTimeout(() => {
      setBookingNotice(null);
    }, 4500);
  };

  const resetFilters = () => {
    setShowAvailableOnly(false);
    setShowAcOnly(false);
    setFilterClass("ALL");
    setFilterTimeWindow("ALL");
    setFilterTrainType("ALL");
    setSortBy("recommended");
  };

  return (
    <main className="alltrains-page">
      {/* 1320px Standard Container */}
      <div className="alltrains-container">

        {/* =====================================================================
            1. TOP COMMAND SEARCH MODIFICATION BAR
            ===================================================================== */}
        <section className="alltrains-command-bar" aria-label="Modify Train Search">
          <form onSubmit={handleUpdateSearch} className="alltrains-search-grid">
            {/* Origin Station */}
            <div className="alltrains-input-box from-box">
              <span className="alltrains-box-label">From Station</span>
              <div className="alltrains-input-inner">
                <span className="alltrains-pin-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <rect x="4" y="3" width="16" height="15" rx="3" />
                    <line x1="4" y1="11" x2="20" y2="11" />
                    <circle cx="8" cy="15" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="15" r="1.5" fill="currentColor" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  className="alltrains-text-input"
                  placeholder="Origin Station / City"
                  aria-label="Origin station"
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              className="alltrains-swap-btn"
              onClick={handleSwapStations}
              title="Swap origin and destination"
              aria-label="Swap stations"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            {/* Destination Station */}
            <div className="alltrains-input-box to-box">
              <span className="alltrains-box-label">To Station</span>
              <div className="alltrains-input-inner">
                <span className="alltrains-pin-icon dest-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  className="alltrains-text-input"
                  placeholder="Destination Station / City"
                  aria-label="Destination station"
                />
              </div>
            </div>

            {/* Journey Date */}
            <div className="alltrains-input-box date-box">
              <span className="alltrains-box-label">Journey Date</span>
              <div className="alltrains-input-inner">
                <span className="alltrains-pin-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="alltrains-date-native"
                  aria-label="Departure date"
                />
              </div>
            </div>

            {/* Booking Quota */}
            <div className="alltrains-input-box quota-box">
              <span className="alltrains-box-label">Quota</span>
              <div className="alltrains-input-inner">
                <select
                  value={selectedQuota}
                  onChange={(e) => setSelectedQuota(e.target.value)}
                  className="alltrains-select-input"
                  aria-label="Booking Quota"
                >
                  <option value="general">General Quota</option>
                  <option value="tatkal">Tatkal Quota</option>
                  <option value="ladies">Ladies Quota</option>
                  <option value="senior">Sr. Citizen Quota</option>
                </select>
              </div>
            </div>

            {/* Update Search Button (Royal Blue) */}
            <button type="submit" className="alltrains-update-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Update Search</span>
            </button>
          </form>
        </section>

        {/* =====================================================================
            2. INTERACTIVE DATE CAROUSEL RIBBON
            ===================================================================== */}
        <section className="alltrains-date-ribbon" aria-label="Dates Availability">
          <div className="alltrains-date-track">
            {CALENDAR_DATES.map((item) => {
              const isActive = departDate === item.iso;
              return (
                <button
                  key={item.iso}
                  type="button"
                  className={`alltrains-date-pill ${isActive ? "is-active" : ""}`}
                  onClick={() => setDepartDate(item.iso)}
                  aria-pressed={isActive}
                >
                  <span className="alltrains-date-day">{item.day}, {item.date}</span>
                  <span className="alltrains-date-meta">
                    <span className="alltrains-status-dot" />
                    <span>{item.status}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            3. TRUST / GUARANTEE HERO STRIP
            ===================================================================== */}
        <section className="alltrains-trust-strip">
          <div className="alltrains-trust-item">
            <span className="alltrains-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </span>
            <div className="alltrains-trust-text">
              <strong>₹0 Cancellation Fee</strong>
              <span>Instant full refund on train cancellations</span>
            </div>
          </div>

          <div className="alltrains-trust-sep" aria-hidden="true" />

          <div className="alltrains-trust-item">
            <span className="alltrains-trust-icon confirmed-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2" />
                <path d="m6 12 1 1 2-2" />
              </svg>
            </span>
            <div className="alltrains-trust-text">
              <strong>Confirmed Seat or 2X Refund</strong>
              <span>Backed by IRCTC Authorized AI waitlist predictor</span>
            </div>
          </div>

          <div className="alltrains-trust-sep" aria-hidden="true" />

          <div className="alltrains-trust-item">
            <span className="alltrains-trust-icon upi-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            <div className="alltrains-trust-text">
              <strong>Zero Charges on UPI</strong>
              <span>Pay directly with Google Pay, PhonePe &amp; Paytm</span>
            </div>
          </div>
        </section>

        {/* Global Feedback Banner when booking is clicked */}
        {bookingNotice && (
          <div className="alltrains-global-notice" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 14 14" />
            </svg>
            <span>{bookingNotice}</span>
          </div>
        )}

        {/* =====================================================================
            4. MAIN 2-COLUMN LAYOUT: SIDEBAR FILTERS + TRAIN RESULTS
            ===================================================================== */}
        <div className="alltrains-main-layout">

          {/* 4A. LEFT SIDEBAR FILTERS */}
          <aside className="alltrains-sidebar" aria-label="Filters">
            <div className="alltrains-filter-card">
              <div className="alltrains-filter-card-header">
                <h3 className="alltrains-filter-title">Filter By</h3>
                <button type="button" onClick={resetFilters} className="alltrains-clear-btn">
                  Clear All
                </button>
              </div>

              {/* Quick Filters */}
              <div className="alltrains-filter-group">
                <span className="alltrains-group-label">Quick Filters</span>
                <label className="alltrains-checkbox-row">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  />
                  <span>Show Available Only</span>
                </label>
                <label className="alltrains-checkbox-row">
                  <input
                    type="checkbox"
                    checked={showAcOnly}
                    onChange={(e) => setShowAcOnly(e.target.checked)}
                  />
                  <span>Show AC Only</span>
                </label>
              </div>

              {/* Coach Classes */}
              <div className="alltrains-filter-group">
                <span className="alltrains-group-label">Coach Class</span>
                <div className="alltrains-class-pills-wrap">
                  {["ALL", "SL", "3E", "3A", "2A", "1A"].map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      className={`alltrains-filter-chip ${filterClass === cls ? "active" : ""}`}
                      onClick={() => setFilterClass(cls)}
                    >
                      {cls === "ALL" ? "All Classes" : cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure Time Slots */}
              <div className="alltrains-filter-group">
                <span className="alltrains-group-label">Departure Time</span>
                <div className="alltrains-time-grid">
                  {[
                    { id: "ALL", label: "Anytime", sub: "24 hrs" },
                    { id: "early-morning", label: "Early Morning", sub: "00:00 - 06:00" },
                    { id: "morning", label: "Morning", sub: "06:00 - 12:00" },
                    { id: "afternoon", label: "Afternoon", sub: "12:00 - 18:00" },
                    { id: "night", label: "Night", sub: "18:00 - 24:00" },
                  ].map((time) => (
                    <button
                      key={time.id}
                      type="button"
                      className={`alltrains-time-pill ${filterTimeWindow === time.id ? "active" : ""}`}
                      onClick={() => setFilterTimeWindow(time.id)}
                    >
                      <strong>{time.label}</strong>
                      <small>{time.sub}</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* Train Types */}
              <div className="alltrains-filter-group">
                <span className="alltrains-group-label">Train Type</span>
                <div className="alltrains-class-pills-wrap">
                  {["ALL", "Vande Bharat", "Rajdhani", "Duronto", "Superfast", "Express"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`alltrains-filter-chip ${filterTrainType === type ? "active" : ""}`}
                      onClick={() => setFilterTrainType(type)}
                    >
                      {type === "ALL" ? "All Trains" : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* 4B. RIGHT TRAIN RESULTS LIST */}
          <section className="alltrains-results-column" aria-label="Train Search Results">
            {/* Results Header: Route Summary & Sorting Controls */}
            <div className="alltrains-results-header">
              <div className="alltrains-route-title-wrap">
                <h1 className="alltrains-route-heading">
                  {fromQuery.split("(")[0].trim()} to {toQuery.split("(")[0].trim()} Trains
                </h1>
                <p className="alltrains-route-sub">
                  {filteredTrains.length} trains found along the corridor • Updated live from IRCTC
                </p>
              </div>

              <div className="alltrains-sort-wrap">
                <span className="alltrains-sort-label">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="alltrains-sort-select"
                  aria-label="Sort trains list"
                >
                  <option value="recommended">Popularity (Recommended)</option>
                  <option value="fastest">Fastest Journey</option>
                  <option value="cheapest">Lowest Fare</option>
                  <option value="earliest">Earliest Departure</option>
                </select>
              </div>
            </div>

            {/* List of Train Cards */}
            {filteredTrains.length === 0 ? (
              <div className="alltrains-empty-state">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <rect x="4" y="3" width="16" height="15" rx="3" />
                  <line x1="4" y1="11" x2="20" y2="11" />
                </svg>
                <h3>No Trains Matching Your Selected Filters</h3>
                <p>Try resetting some filters or selecting another date on the calendar strip.</p>
                <button type="button" onClick={resetFilters} className="alltrains-empty-btn">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="alltrains-cards-stack">
                {filteredTrains.map((train) => {
                  const activeClassCode = selectedCoachMap[train.id];
                  const activeCoachObj = train.classes.find((c) => c.classCode === activeClassCode);
                  const isScheduleExpanded = expandedScheduleId === train.id;

                  // Active quota for this specific train's date availability panel
                  const currentTrainQuota = selectedQuotaMap[train.id] || selectedQuota || "general";

                  // Next 5 dates slots generated dynamically if a class is selected
                  const dateAvailabilitySlots = activeCoachObj
                    ? getNextDeparturesForTrain(train, activeCoachObj, departDate, currentTrainQuota, 6)
                    : [];

                  return (
                    <article key={train.id} className="alltrains-card">
                      {/* Train Card Header */}
                      <div className="alltrains-card-topbar">
                        <div className="alltrains-train-identity">
                          <span className={`alltrains-type-badge type-${train.trainType.toLowerCase().replace(/\s+/g, "-")}`}>
                            {train.trainType}
                          </span>
                          <h2 className="alltrains-train-title">
                            <span className="alltrains-train-no">{train.trainNumber}</span>
                            <span className="alltrains-train-name">{train.trainName}</span>
                          </h2>
                          <span className="alltrains-rating-badge">
                            ★ {train.rating}
                          </span>
                        </div>

                        {/* Running Days & Halts Quick Links */}
                        <div className="alltrains-topbar-right">
                          <div className="alltrains-runs-strip" title="Runs on highlighted days">
                            <span className="runs-label">Runs on:</span>
                            {train.runsOnDays.map((runs, dayIdx) => (
                              <span
                                key={dayIdx}
                                className={`runs-day-badge ${runs ? "active" : "inactive"}`}
                              >
                                {WEEK_DAYS[dayIdx]}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            className="alltrains-schedule-toggle-btn"
                            onClick={() => setExpandedScheduleId((prev) => (prev === train.id ? null : train.id))}
                            aria-expanded={isScheduleExpanded}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{isScheduleExpanded ? "Hide Route" : "View Route"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Timeline & Station Corridor */}
                      <div className="alltrains-corridor-row">
                        {/* Departure Station */}
                        <div className="alltrains-point alltrains-depart">
                          <span className="alltrains-point-time">{train.departureTime}</span>
                          <strong className="alltrains-point-code">{train.fromStation.code}</strong>
                          <span className="alltrains-point-name">{train.fromStation.name}</span>
                        </div>

                        {/* Middle Rail Track */}
                        <div className="alltrains-track-middle">
                          <span className="alltrains-duration-badge">{train.duration}</span>
                          <div className="alltrains-rail-track" aria-hidden="true">
                            <span className="alltrains-rail-circle start-dot" />
                            <span className="alltrains-rail-line" />
                            <span className="alltrains-train-glyph">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V6h12v5z" />
                              </svg>
                            </span>
                            <span className="alltrains-rail-line" />
                            <span className="alltrains-rail-circle end-dot" />
                          </div>
                          <span className="alltrains-distance-text">{train.distanceKm} km • {train.halts.length} halts</span>
                        </div>

                        {/* Arrival Station */}
                        <div className="alltrains-point alltrains-arrive">
                          <span className="alltrains-point-time">{train.arrivalTime}</span>
                          <strong className="alltrains-point-code">{train.toStation.code}</strong>
                          <span className="alltrains-point-name">{train.toStation.name}</span>
                        </div>
                      </div>

                      {/* Coach Classes Availability Row (Clicking any opens next 5 dates panel) */}
                      <div className="alltrains-classes-row">
                        {train.classes.map((cls) => {
                          const isSelected = activeClassCode === cls.classCode;
                          const isAvailable = cls.status === "AVAILABLE";
                          const isWL = cls.status === "WL";

                          return (
                            <button
                              key={cls.classCode}
                              type="button"
                              className={`alltrains-class-tile ${isSelected ? "is-selected" : ""} ${isAvailable ? "status-avail" : isWL ? "status-wl" : "status-regret"}`}
                              onClick={() => handleSelectCoach(train.id, cls.classCode)}
                              aria-expanded={isSelected}
                            >
                              <div className="alltrains-tile-top">
                                <strong className="alltrains-class-name">{cls.classCode}</strong>
                                <span className="alltrains-class-price">₹{cls.fare}</span>
                              </div>

                              <div className="alltrains-tile-status">
                                <span className="status-label">{cls.statusText}</span>
                                {cls.confirmationProbability && cls.confirmationProbability < 100 && (
                                  <span className="cnf-chance-tag">
                                    {cls.confirmationProbability}% Chance
                                  </span>
                                )}
                              </div>

                              <div className="alltrains-tile-bottom">
                                <span className="tile-update-time">{cls.lastUpdated}</span>
                                {cls.isConfirmed2xRefund && (
                                  <span className="confirmed-guarantee-tag" title="Confirmed or 2X Refund Guaranteed">
                                    2X Refund
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* =========================================================================
                          NEXT 5 DATES AVAILABILITY PANEL (Opens when clicking any class tile)
                          Shows Current Date + Next 5 Operating Dates with Quota Switcher
                          ========================================================================= */}
                      {activeCoachObj && (
                        <div className="alltrains-dates-panel" role="region" aria-label={`6-Day Availability for ${activeCoachObj.classCode}`}>
                          {/* Panel Header */}
                          <div className="alltrains-panel-top">
                            <div className="alltrains-panel-info">
                              <span className="alltrains-panel-badge">
                                {activeCoachObj.classCode} - {activeCoachObj.className}
                              </span>
                              <span className="alltrains-panel-hint">
                                Showing current date + next 5 departures • Base Fare: <strong>₹{activeCoachObj.fare}</strong>
                              </span>
                            </div>

                            {/* Quota Tabs Switcher */}
                            <div className="alltrains-panel-quota-tabs" role="tablist" aria-label="Quota Filter">
                              {[
                                { id: "general", label: "General" },
                                { id: "senior", label: "Senior Citizen" },
                                { id: "ladies", label: "Ladies" },
                                { id: "tatkal", label: "Tatkal" },
                              ].map((q) => {
                                const isQActive = currentTrainQuota === q.id;
                                return (
                                  <button
                                    key={q.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isQActive}
                                    className={`alltrains-quota-tab-btn ${isQActive ? "is-active" : ""}`}
                                    onClick={() => setSelectedQuotaMap((prev) => ({ ...prev, [train.id]: q.id }))}
                                  >
                                    {q.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 6 Dates Rows (Initial Date + Next 5 Dates) */}
                          <div className="alltrains-panel-dates-list">
                            {dateAvailabilitySlots.map((slot, sIdx) => {
                              const isAvail = slot.status === "AVAILABLE";
                              const isWL = slot.status === "WL";
                              const isRegret = slot.status === "REGRET";

                              return (
                                <React.Fragment key={slot.iso}>
                                  {sIdx === 1 && (
                                    <div className="alltrains-next-dates-header" aria-hidden="true">
                                      <span className="next-dates-line" />
                                      <span className="next-dates-text">Next 5 Operating Dates</span>
                                      <span className="next-dates-line" />
                                    </div>
                                  )}

                                  <div className={`alltrains-date-availability-row ${slot.isInitialSearchDate ? "is-search-date" : ""}`}>
                                    {/* Column 1: Date & Day */}
                                    <div className="alltrains-row-date-col">
                                      <span className="date-main">{slot.dateStr}</span>
                                      <span className="day-sub">{slot.dayName}</span>
                                      {slot.isInitialSearchDate && (
                                        <span className="search-date-tag">Selected Date</span>
                                      )}
                                    </div>

                                    {/* Column 2: Status & Description */}
                                    <div className="alltrains-row-status-col">
                                      <div className="status-badge-wrap">
                                        <span className={`status-pill ${isAvail ? "pill-avail" : isWL ? "pill-wl" : "pill-regret"}`}>
                                          {slot.statusText}
                                          {isWL && (
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                          )}
                                        </span>
                                        <span className="status-sub-label">
                                          {isAvail ? "Guaranteed Berth" : isWL ? "Waitlist" : "No more booking"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Column 3: Alternate Plan Button */}
                                    <div className="alltrains-row-alternate-col">
                                      {slot.confirmationProbability < 100 && !isRegret ? (
                                        <button
                                          type="button"
                                          className="alltrains-alternate-btn"
                                          onClick={() => handleAlternatePlan(train, activeCoachObj.classCode, slot)}
                                          title="View high-confidence alternate travel plan"
                                        >
                                          <span className="alt-btn-label">
                                            <span className="alt-icon" aria-hidden="true">💡</span>
                                            {slot.confirmationProbability}% Chance
                                          </span>
                                          <span className="alt-btn-price">₹{slot.alternateFare}</span>
                                        </button>
                                      ) : (
                                        <div className="alltrains-alternate-empty" />
                                      )}
                                    </div>

                                    {/* Column 4: Primary Book Button */}
                                    <div className="alltrains-row-book-col">
                                      <button
                                        type="button"
                                        disabled={isRegret}
                                        className={`alltrains-slot-book-btn ${isRegret ? "is-disabled" : ""}`}
                                        onClick={() => handleBookTicket(train, activeCoachObj.classCode, slot.fullDateStr)}
                                      >
                                        <span className="book-btn-label">{isRegret ? "Regret" : "Book"}</span>
                                        {!isRegret ? (
                                          <span className="book-btn-price">₹{activeCoachObj.fare}</span>
                                        ) : (
                                          <span className="book-btn-sub">Closed</span>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {/* Clean Guarantee Footer */}
                          <div className="alltrains-panel-footer">
                            <span className="panel-footer-item">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                <polyline points="9 12 11 14 15 10"/>
                              </svg>
                              ₹0 cancellation fee & instant refund
                            </span>
                            <span className="panel-footer-dot">•</span>
                            <span className="panel-footer-item">Official IRCTC partner sync</span>
                          </div>
                        </div>
                      )}

                      {/* Expandable Route & Halts Timetable Drawer */}
                      {isScheduleExpanded && (
                        <div className="alltrains-schedule-drawer" role="region" aria-label="Route timetable">
                          <div className="alltrains-drawer-header">
                            <h4>{train.trainNumber} {train.trainName} - Full Route Timetable</h4>
                            <span className="drawer-sub">Total {train.halts.length} stations across journey</span>
                          </div>

                          <div className="alltrains-table-container">
                            <table className="alltrains-halts-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Station Name</th>
                                  <th>Code</th>
                                  <th>Arrive</th>
                                  <th>Depart</th>
                                  <th>Halt</th>
                                  <th>Distance</th>
                                  <th>Day</th>
                                </tr>
                              </thead>
                              <tbody>
                                {train.halts.map((halt, idx) => (
                                  <tr key={halt.stationCode}>
                                    <td>{idx + 1}</td>
                                    <td><strong>{halt.stationName}</strong></td>
                                    <td><span className="station-code-chip">{halt.stationCode}</span></td>
                                    <td>{halt.arrivalTime}</td>
                                    <td>{halt.departureTime}</td>
                                    <td>{halt.haltMinutes > 0 ? `${halt.haltMinutes}m` : "--"}</td>
                                    <td>{halt.distanceKm} km</td>
                                    <td>Day {halt.dayCount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

      </div>
    </main>
  );
}

export default function AllTrainsPage() {
  return (
    <Suspense fallback={<div className="alltrains-loading">Loading live trains from IRCTC...</div>}>
      <AllTrainsContent />
    </Suspense>
  );
}
