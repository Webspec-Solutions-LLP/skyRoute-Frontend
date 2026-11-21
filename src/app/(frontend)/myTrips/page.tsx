"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "./MyTrips.css";

export type TripType = "flight" | "train" | "bus" | "hotel";
export type TripStatus = "upcoming" | "past" | "cancelled" | "failed";

export interface TripBooking {
  id: string;
  type: TripType;
  status: TripStatus;
  dateStr: string; // e.g. "Sat, 14 Nov"
  fullDate: string; // e.g. "14 Nov 2026"
  monthGroup: string; // e.g. "Nov 2026"
  timestamp: number;
  from: string;
  to: string;
  title: string; // e.g. "Chennai ➔ Agartala"
  subtitle: string; // e.g. "IndiGo • 6E6662, 6E994"
  metaBadge: string; // e.g. "Superfast" | "Economy"
  passengers: string[];
  seatInfo?: string;
  pnr: string;
  bookingId: string;
  amountPaid: number;
  departTime?: string;
  arriveTime?: string;
  duration?: string;
  boardingPoint?: string;
  droppingPoint?: string;
}

// Initial realistic mock data based on Screenshots 2 & 3 + custom bus & hotel designs
const INITIAL_TRIPS: TripBooking[] = [
  // --- PAST TRIPS (Nov 2026, Oct 2026, Jun 2026) ---
  {
    id: "trip-fl-1",
    type: "flight",
    status: "past",
    dateStr: "Sat, 14 Nov",
    fullDate: "14 Nov 2026",
    monthGroup: "Nov 2026",
    timestamp: new Date("2026-11-14T08:30:00").getTime(),
    from: "Chennai",
    to: "Agartala",
    title: "Chennai ➔ Agartala",
    subtitle: "IndiGo • 6E6662, 6E994",
    metaBadge: "Economy • 1 Stop via CCU",
    passengers: ["Joydeep Barik", "Ananya Sen", "Aarav Barik"],
    seatInfo: "Seats 14A, 14B, 14C",
    pnr: "6E-K48912",
    bookingId: "SKY-FL-91823",
    amountPaid: 14850,
    departTime: "08:30 AM",
    arriveTime: "02:15 PM",
    duration: "5h 45m",
  },
  {
    id: "trip-fl-2",
    type: "flight",
    status: "past",
    dateStr: "Sat, 14 Nov",
    fullDate: "14 Nov 2026",
    monthGroup: "Nov 2026",
    timestamp: new Date("2026-11-14T11:45:00").getTime(),
    from: "Chennai",
    to: "Agartala",
    title: "Chennai ➔ Agartala",
    subtitle: "IndiGo • 6E6662, 6E994",
    metaBadge: "Economy • Connecting",
    passengers: ["Rohan Mukherjee 11E"],
    seatInfo: "Seat 11E",
    pnr: "6E-J71029",
    bookingId: "SKY-FL-91824",
    amountPaid: 4950,
    departTime: "11:45 AM",
    arriveTime: "05:30 PM",
    duration: "5h 45m",
  },
  {
    id: "trip-tr-1",
    type: "train",
    status: "past",
    dateStr: "Wed, 11 Nov",
    fullDate: "11 Nov 2026",
    monthGroup: "Nov 2026",
    timestamp: new Date("2026-11-11T06:40:00").getTime(),
    from: "Katpadi Jn",
    to: "Mgr Chennai Ctl",
    title: "Katpadi Jn ➔ Mgr Chennai Ctl",
    subtitle: "20663 MAS VANDE BHARAT",
    metaBadge: "AC Chair Car (CC)",
    passengers: ["Joydeep Barik", "S. Mukherjee", "R. Roy"],
    seatInfo: "Coach C5 37 • C5 48 • C1 2",
    pnr: "4219-5820-19",
    bookingId: "SKY-TR-61023",
    amountPaid: 2190,
    departTime: "06:40 AM",
    arriveTime: "08:45 AM",
    duration: "2h 05m",
  },
  {
    id: "trip-bus-1",
    type: "bus",
    status: "past",
    dateStr: "Mon, 30 Nov",
    fullDate: "30 Nov 2026",
    monthGroup: "Nov 2026",
    timestamp: new Date("2026-11-30T21:20:00").getTime(),
    from: "Kolkata (Babughat)",
    to: "Puri (Near Stand)",
    title: "Kolkata ➔ Puri",
    subtitle: "Dolphin Tours and Travels • Volvo A/C Multi-Axle",
    metaBadge: "Volvo Multi-Axle AC Sleeper",
    passengers: ["Joydeep Barik", "T. Roy"],
    seatInfo: "Seat 19 (Lower), Seat 20 (Upper)",
    pnr: "BS-DOL-9481",
    bookingId: "SKY-BS-44102",
    amountPaid: 1792,
    departTime: "09:20 PM",
    arriveTime: "07:20 AM",
    duration: "10h 00m",
    boardingPoint: "Babughat Bus Stand Stand Tulu",
    droppingPoint: "Puri Main Bus Terminus",
  },
  {
    id: "trip-htl-1",
    type: "hotel",
    status: "past",
    dateStr: "Tue, 10 Nov - Fri, 13 Nov",
    fullDate: "10 Nov - 13 Nov 2026",
    monthGroup: "Nov 2026",
    timestamp: new Date("2026-11-10T12:00:00").getTime(),
    from: "Puri",
    to: "Puri",
    title: "The Grand Palace Beach Resort & Spa",
    subtitle: "Puri Sea Beach Road • Deluxe Sea View Room",
    metaBadge: "3 Nights • 2 Guests • Breakfast Included",
    passengers: ["Joydeep Barik", "Guest 2"],
    seatInfo: "Room 304 (Deluxe Ocean View)",
    pnr: "HTL-PURI-8219",
    bookingId: "SKY-HT-10928",
    amountPaid: 8400,
  },
  {
    id: "trip-tr-2",
    type: "train",
    status: "past",
    dateStr: "Tue, 27 Oct",
    fullDate: "27 Oct 2026",
    monthGroup: "Oct 2026",
    timestamp: new Date("2026-10-27T14:15:00").getTime(),
    from: "DHARMANAGAR",
    to: "Badarpur Jn",
    title: "DHARMANAGAR ➔ Badarpur Jn",
    subtitle: "15663 AGTL SCL EXP",
    metaBadge: "Second Seating (2S)",
    passengers: ["Joydeep Barik", "Pooja Sharma", "Vikram Malhotra", "Neha Verma"],
    seatInfo: "D1 6 • D1 8 • D1 9 • D1 10",
    pnr: "3184-9102-45",
    bookingId: "SKY-TR-49102",
    amountPaid: 480,
    departTime: "02:15 PM",
    arriveTime: "04:50 PM",
    duration: "2h 35m",
  },
  {
    id: "trip-bus-2",
    type: "bus",
    status: "past",
    dateStr: "Fri, 16 Oct",
    fullDate: "16 Oct 2026",
    monthGroup: "Oct 2026",
    timestamp: new Date("2026-10-16T06:30:00").getTime(),
    from: "Kolkata (Esplanade)",
    to: "Digha (Old Stand)",
    title: "Kolkata ➔ Digha",
    subtitle: "Greenline Volvo Express • Multi-Axle AC",
    metaBadge: "Superfast AC Coach",
    passengers: ["Joydeep Barik"],
    seatInfo: "Seat L1",
    pnr: "BS-GNL-3891",
    bookingId: "SKY-BS-29184",
    amountPaid: 450,
    departTime: "06:30 AM",
    arriveTime: "11:15 AM",
    duration: "4h 45m",
  },
  {
    id: "trip-tr-3",
    type: "train",
    status: "past",
    dateStr: "Sun, 14 Jun",
    fullDate: "14 Jun 2026",
    monthGroup: "Jun 2026",
    timestamp: new Date("2026-06-14T09:10:00").getTime(),
    from: "DHARMANAGAR",
    to: "AGARTALA",
    title: "DHARMANAGAR ➔ AGARTALA",
    subtitle: "15664 SCL AGTL EXP",
    metaBadge: "Second Seating (2S)",
    passengers: ["Rohan Mukherjee"],
    seatInfo: "D2 49",
    pnr: "2819-4710-88",
    bookingId: "SKY-TR-18290",
    amountPaid: 125,
    departTime: "09:10 AM",
    arriveTime: "12:30 PM",
    duration: "3h 20m",
  },

  // --- UPCOMING TRIPS ---
  {
    id: "trip-up-tr-1",
    type: "train",
    status: "upcoming",
    dateStr: "Thu, 03 Dec",
    fullDate: "03 Dec 2026",
    monthGroup: "Dec 2026",
    timestamp: new Date("2026-12-03T22:45:00").getTime(),
    from: "Howrah Jn (HWH)",
    to: "Smvt Bengaluru (SMVB)",
    title: "Howrah ➔ Smvt Bengaluru",
    subtitle: "12863 Hwh Smvb Exp",
    metaBadge: "Sleeper (SL) • Confirmed",
    passengers: ["Joydeep Barik"],
    seatInfo: "Coach S4 — Berth 32 (Lower)",
    pnr: "6428-1940-27",
    bookingId: "SKY-TR-99412",
    amountPaid: 847,
    departTime: "10:45 PM",
    arriveTime: "07:00 AM",
    duration: "1d 8h 15m",
  },
  {
    id: "trip-up-fl-1",
    type: "flight",
    status: "upcoming",
    dateStr: "Fri, 04 Dec",
    fullDate: "04 Dec 2026",
    monthGroup: "Dec 2026",
    timestamp: new Date("2026-12-04T06:15:00").getTime(),
    from: "Kolkata (CCU)",
    to: "Mumbai (BOM)",
    title: "Kolkata ➔ Mumbai",
    subtitle: "Akasa Air • QP 1382",
    metaBadge: "Economy • Non-stop",
    passengers: ["Joydeep Barik"],
    seatInfo: "Seat 8F (Window)",
    pnr: "QP-B92104",
    bookingId: "SKY-FL-88319",
    amountPaid: 4320,
    departTime: "06:15 AM",
    arriveTime: "09:05 AM",
    duration: "2h 50m",
  },
  {
    id: "trip-up-bus-1",
    type: "bus",
    status: "upcoming",
    dateStr: "Sat, 05 Dec",
    fullDate: "05 Dec 2026",
    monthGroup: "Dec 2026",
    timestamp: new Date("2026-12-05T21:30:00").getTime(),
    from: "Kolkata (Babughat)",
    to: "Digha (Near Stand)",
    title: "Kolkata ➔ Digha",
    subtitle: "SkyLine Navigator Express",
    metaBadge: "Volvo Multi-Axle AC Sleeper (2+1)",
    passengers: ["Joydeep Barik"],
    seatInfo: "Seat L1 (Single Sleeper)",
    pnr: "BS-SKY-8812",
    bookingId: "SKY-BS-91823",
    amountPaid: 896,
    departTime: "09:30 PM",
    arriveTime: "05:30 AM",
    duration: "8h 00m",
  },

  // --- CANCELLED TRIPS ---
  {
    id: "trip-can-fl-1",
    type: "flight",
    status: "cancelled",
    dateStr: "Fri, 18 Sep",
    fullDate: "18 Sep 2026",
    monthGroup: "Sep 2026",
    timestamp: new Date("2026-09-18T10:00:00").getTime(),
    from: "Kolkata (CCU)",
    to: "Delhi (DEL)",
    title: "Kolkata ➔ Delhi",
    subtitle: "IndiGo • 6E 2041",
    metaBadge: "Cancelled • Full Refund Processed",
    passengers: ["Joydeep Barik"],
    seatInfo: "Seat 15D",
    pnr: "6E-C19284",
    bookingId: "SKY-FL-74019",
    amountPaid: 3890,
  },
  {
    id: "trip-can-tr-1",
    type: "train",
    status: "cancelled",
    dateStr: "Mon, 10 Aug",
    fullDate: "10 Aug 2026",
    monthGroup: "Aug 2026",
    timestamp: new Date("2026-08-10T23:15:00").getTime(),
    from: "Sealdah (SDAH)",
    to: "New Jalpaiguri (NJP)",
    title: "Sealdah ➔ New Jalpaiguri",
    subtitle: "12377 Padatik Express",
    metaBadge: "AC 3 Tier (3A) • Cancelled by User",
    passengers: ["Joydeep Barik"],
    seatInfo: "B3 42",
    pnr: "1928-3019-48",
    bookingId: "SKY-TR-39102",
    amountPaid: 1145,
  },
];

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function MyTripsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qType = searchParams.get("type");
  const qStatus = searchParams.get("status");

  // Active category filter: "all" | "flights" | "trains" | "buses" | "hotels"
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (qType === "flight" || qType === "flights") return "flights";
    if (qType === "train" || qType === "trains") return "trains";
    if (qType === "bus" || qType === "buses") return "buses";
    if (qType === "hotel" || qType === "hotels") return "hotels";
    return "flights"; // default to flights as shown in Screenshot 2
  });

  // Active status filter: "upcoming" | "past" | "cancelled" | "failed"
  const [activeStatus, setActiveStatus] = useState<TripStatus>(() => {
    if (qStatus === "upcoming") return "upcoming";
    if (qStatus === "cancelled") return "cancelled";
    if (qStatus === "failed") return "failed";
    return "past"; // default to "past" as shown in Screenshot 2 & 3
  });

  const handleViewTripDetails = (trip: TripBooking) => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("skyroute_active_trip", JSON.stringify(trip));
      } catch (err) {
        console.error("Error storing active trip", err);
      }
    }
    router.push(`/tripDetails?id=${encodeURIComponent(trip.id)}&type=${encodeURIComponent(trip.type)}`);
  };
  const [tripsList, setTripsList] = useState<TripBooking[]>(INITIAL_TRIPS);

  // Hydrate freshly confirmed bookings from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTrain = sessionStorage.getItem("skyroute_train_booking");
        const storedBus = sessionStorage.getItem("skyroute_bus_booking");

        setTripsList((prev) => {
          let updated = [...prev];

          // If a train was booked in this session
          if (storedTrain) {
            const tr = JSON.parse(storedTrain);
            if (tr && tr.trainNo && !updated.some((t) => t.bookingId === "SKY-SESSION-TRAIN")) {
              const newTrainTrip: TripBooking = {
                id: "trip-session-train",
                type: "train",
                status: "upcoming",
                dateStr: tr.departDate || "Upcoming",
                fullDate: `${tr.departDate || "Dec 2026"}`,
                monthGroup: "Dec 2026",
                timestamp: Date.now() + 86400000,
                from: tr.fromName || "Howrah",
                to: tr.toName || "Bengaluru",
                title: `${tr.fromName || "Howrah"} ➔ ${tr.toName || "Bengaluru"}`,
                subtitle: `${tr.trainNo} ${tr.trainName}`,
                metaBadge: `${tr.className || "Sleeper"} • Confirmed`,
                passengers: ["Joydeep Barik"],
                seatInfo: `Coach S4 • Berth 32 [CNF]`,
                pnr: "6428-1940-27",
                bookingId: "SKY-SESSION-TRAIN",
                amountPaid: tr.fare || 830,
                departTime: tr.departureTime || "10:45 PM",
                arriveTime: tr.arrivalTime || "07:00 AM",
                duration: tr.duration || "1d 8h 15m",
              };
              updated = [newTrainTrip, ...updated];
            }
          }

          // If a bus was booked in this session
          if (storedBus) {
            const bs = JSON.parse(storedBus);
            if (bs && bs.operator && !updated.some((t) => t.bookingId === "SKY-SESSION-BUS")) {
              const newBusTrip: TripBooking = {
                id: "trip-session-bus",
                type: "bus",
                status: "upcoming",
                dateStr: bs.departDate || "Upcoming",
                fullDate: `${bs.departDate || "Dec 2026"}`,
                monthGroup: "Dec 2026",
                timestamp: Date.now() + 172800000,
                from: bs.from || "Kolkata",
                to: bs.to || "Digha",
                title: `${bs.from || "Kolkata"} ➔ ${bs.to || "Digha"}`,
                subtitle: `${bs.operator} • ${bs.coachName || "Volvo Multi-Axle"}`,
                metaBadge: "Volvo Multi-Axle AC Sleeper",
                passengers: ["Joydeep Barik"],
                seatInfo: `Seats ${(bs.seats || ["L1"]).join(", ")}`,
                pnr: "BS-SKY-9481",
                bookingId: "SKY-SESSION-BUS",
                amountPaid: bs.total || 896,
                departTime: bs.boardingTime || "09:30 PM",
                arriveTime: bs.droppingTime || "05:30 AM",
                duration: "8h 00m",
                boardingPoint: bs.boarding,
                droppingPoint: bs.dropping,
              };
              updated = [newBusTrip, ...updated];
            }
          }

          return updated;
        });
      } catch (err) {
        console.error("Error loading session bookings into MyTrips:", err);
      }
    }
  }, []);

  // Filter trips by Status & Category
  const filteredTrips = useMemo(() => {
    return tripsList.filter((trip) => {
      // Status match
      if (trip.status !== activeStatus) return false;

      // Category match
      if (activeCategory === "flights" && trip.type !== "flight") return false;
      if (activeCategory === "trains" && trip.type !== "train") return false;
      if (activeCategory === "buses" && trip.type !== "bus") return false;
      if (activeCategory === "hotels" && trip.type !== "hotel") return false;

      return true;
    });
  }, [tripsList, activeStatus, activeCategory]);

  // Group filtered trips by monthGroup
  const groupedTrips = useMemo(() => {
    const groups: { month: string; trips: TripBooking[] }[] = [];
    const map = new Map<string, TripBooking[]>();

    filteredTrips.forEach((trip) => {
      if (!map.has(trip.monthGroup)) {
        map.set(trip.monthGroup, []);
      }
      map.get(trip.monthGroup)!.push(trip);
    });

    map.forEach((trips, month) => {
      groups.push({ month, trips });
    });

    return groups;
  }, [filteredTrips]);

  // Compute live count badges for each status tab
  const statusCounts = useMemo(() => {
    const filterByCategory = (status: TripStatus) => {
      return tripsList.filter((t) => {
        if (t.status !== status) return false;
        if (activeCategory === "flights" && t.type !== "flight") return false;
        if (activeCategory === "trains" && t.type !== "train") return false;
        if (activeCategory === "buses" && t.type !== "bus") return false;
        if (activeCategory === "hotels" && t.type !== "hotel") return false;
        return true;
      }).length;
    };

    return {
      upcoming: filterByCategory("upcoming"),
      past: filterByCategory("past"),
      cancelled: filterByCategory("cancelled"),
      failed: filterByCategory("failed"),
    };
  }, [tripsList, activeCategory]);

  // Compute live count badges for each category in sidebar
  const categoryCounts = useMemo(() => {
    const filterByStatus = (type?: TripType) => {
      return tripsList.filter((t) => {
        if (t.status !== activeStatus) return false;
        if (type && t.type !== type) return false;
        return true;
      }).length;
    };

    return {
      all: filterByStatus(),
      flights: filterByStatus("flight"),
      trains: filterByStatus("train"),
      buses: filterByStatus("bus"),
      hotels: filterByStatus("hotel"),
    };
  }, [tripsList, activeStatus]);

  // High quality vector SVG icons for categories in cards
  const getCategoryAvatar = (type: TripType) => {
    switch (type) {
      case "flight":
        return (
          <div className="mytrips-avatar-circle mytrips-avatar-flight" aria-label="Flight Trip">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.6.2-2 1-.3.8 0 1.7.7 2.1l5.4 3.6-2.5 2.5-2.6-.7c-.5-.1-1 .1-1.3.5-.3.4-.2 1 .2 1.4l2.1 2.1 2.1 2.1c.4.4 1 .5 1.4.2.4-.3.6-.8.5-1.3l-.7-2.6 2.5-2.5 3.6 5.4c.4.7 1.3 1 2.1.7.8-.4 1.2-1.2 1-2z"/>
            </svg>
          </div>
        );
      case "train":
        return (
          <div className="mytrips-avatar-circle mytrips-avatar-train" aria-label="Train Trip">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="16" rx="3"/>
              <path d="M4 11h16"/>
              <path d="M12 3v8"/>
              <path d="m8 19-3 3"/>
              <path d="m16 19 3 3"/>
              <circle cx="8" cy="15" r="1.2" fill="currentColor"/>
              <circle cx="16" cy="15" r="1.2" fill="currentColor"/>
            </svg>
          </div>
        );
      case "bus":
        return (
          <div className="mytrips-avatar-circle mytrips-avatar-bus" aria-label="Bus Trip">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="16" rx="3"/>
              <path d="M4 10h16"/>
              <path d="m6 19-2 2.5"/>
              <path d="m18 19 2 2.5"/>
              <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
              <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
              <path d="M9 6h6"/>
            </svg>
          </div>
        );
      case "hotel":
        return (
          <div className="mytrips-avatar-circle mytrips-avatar-hotel" aria-label="Hotel Booking">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"/>
              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
              <path d="M9 7h1"/>
              <path d="M9 11h1"/>
              <path d="M9 15h1"/>
              <path d="M14 7h1"/>
              <path d="M14 11h1"/>
              <path d="M14 15h1"/>
            </svg>
          </div>
        );
    }
  };

  const getStatusChip = (status: TripStatus) => {
    switch (status) {
      case "past":
        return <span className="mytrips-status-chip mytrips-status-completed">✓ Completed</span>;
      case "upcoming":
        return <span className="mytrips-status-chip mytrips-status-confirmed">● Confirmed</span>;
      case "cancelled":
        return <span className="mytrips-status-chip mytrips-status-cancelled">✕ Cancelled</span>;
      case "failed":
        return <span className="mytrips-status-chip mytrips-status-failed">! Payment Failed</span>;
    }
  };

  return (
    <div className="mytrips-page">
      {/* 1320PX MAIN WRAPPER CONTAINER */}
      <div className="mytrips-container">
        {/* TOP HEADER SECTION */}
        <section className="mytrips-header-bar">
          <div className="mytrips-title-area">
            <h1 className="mytrips-page-title">
              <span className="mytrips-page-title-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="15" rx="3"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <circle cx="9" cy="13" r="1" fill="currentColor"/>
                  <circle cx="15" cy="13" r="1" fill="currentColor"/>
                </svg>
              </span>
              <span>My Trips &amp; Bookings</span>
            </h1>
            <p className="mytrips-page-subtitle">
              Manage your upcoming reservations, download past e-tickets, and view journey details
            </p>
          </div>

          {/* STATUS TABS: UPCOMING | PAST | CANCELLED | FAILED */}
          <div className="mytrips-status-tabs" role="tablist">
            {(
              [
                { id: "upcoming", label: "Upcoming" },
                { id: "past", label: "Past" },
                { id: "cancelled", label: "Cancelled" },
                { id: "failed", label: "Failed" },
              ] as const
            ).map((tab) => {
              const isActive = activeStatus === tab.id;
              const count = statusCounts[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`mytrips-status-tab ${isActive ? "is-active" : ""}`}
                  onClick={() => setActiveStatus(tab.id)}
                >
                  <span>{tab.label}</span>
                  {count > 0 && <span className="mytrips-count-badge">{count}</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* TWO-COLUMN GRID LAYOUT (280px SIDEBAR + 1FR MAIN) */}
        <div className="mytrips-grid-layout">
          {/* LEFT SIDEBAR NAVIGATION WITH POLISHED FINISHING ICONS */}
          <aside className="mytrips-sidebar">
            <div className="mytrips-nav-card">
              <div className="mytrips-nav-header">
                <div className="mytrips-nav-title">
                  <div className="mytrips-nav-title-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <span>My Trips</span>
                </div>
                <span style={{ fontSize: "12px", color: "#64748b" }}>▲</span>
              </div>

              <ul className="mytrips-nav-list">
                {[
                  {
                    id: "all",
                    label: "All Bookings",
                    boxClass: "is-all",
                    count: categoryCounts.all,
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                    ),
                  },
                  {
                    id: "flights",
                    label: "Flights",
                    boxClass: "is-flights",
                    count: categoryCounts.flights,
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.6.2-2 1-.3.8 0 1.7.7 2.1l5.4 3.6-2.5 2.5-2.6-.7c-.5-.1-1 .1-1.3.5-.3.4-.2 1 .2 1.4l2.1 2.1 2.1 2.1c.4.4 1 .5 1.4.2.4-.3.6-.8.5-1.3l-.7-2.6 2.5-2.5 3.6 5.4c.4.7 1.3 1 2.1.7.8-.4 1.2-1.2 1-2z"/>
                      </svg>
                    ),
                  },
                  {
                    id: "trains",
                    label: "Trains",
                    boxClass: "is-trains",
                    count: categoryCounts.trains,
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="3" width="16" height="16" rx="3"/>
                        <path d="M4 11h16"/>
                        <path d="M12 3v8"/>
                        <path d="m8 19-3 3"/>
                        <path d="m16 19 3 3"/>
                        <circle cx="8" cy="15" r="1.2" fill="currentColor"/>
                        <circle cx="16" cy="15" r="1.2" fill="currentColor"/>
                      </svg>
                    ),
                  },
                  {
                    id: "buses",
                    label: "Buses",
                    boxClass: "is-buses",
                    count: categoryCounts.buses,
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="3" width="16" height="16" rx="2.5"/>
                        <path d="M4 10h16"/>
                        <path d="m6 19-2 2.5"/>
                        <path d="m18 19 2 2.5"/>
                        <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
                        <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
                        <path d="M9 6h6"/>
                      </svg>
                    ),
                  },
                  {
                    id: "hotels",
                    label: "Hotels",
                    boxClass: "is-hotels",
                    count: categoryCounts.hotels,
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"/>
                        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
                        <path d="M9 7h1"/>
                        <path d="M9 11h1"/>
                        <path d="M9 15h1"/>
                        <path d="M14 7h1"/>
                        <path d="M14 11h1"/>
                        <path d="M14 15h1"/>
                      </svg>
                    ),
                  },
                ].map((item) => {
                  const isActive = activeCategory === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`mytrips-nav-btn ${isActive ? "is-active" : ""}`}
                        onClick={() => setActiveCategory(item.id)}
                      >
                        <div className="mytrips-nav-item-left">
                          <span className={`mytrips-icon-box ${item.boxClass}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.count > 0 && (
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: isActive ? "#0284c7" : "#64748b",
                              background: isActive ? "#ffffff" : "#f1f5f9",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              border: isActive ? "1px solid #bae6fd" : "none",
                            }}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 24x7 SUPPORT CARD */}
            <div className="mytrips-support-card">
              <h3 className="mytrips-support-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Need Help With a Trip?</span>
              </h3>
              <p className="mytrips-support-desc">
                24×7 customer assistance for reschedules, ticket cancellations, and instant refunds.
              </p>
              <button
                type="button"
                className="mytrips-support-btn"
                onClick={() => alert("Connecting to SkyRoute 24x7 Customer Care line at 1800-SKY-ROUTE (Toll Free)...")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>Call SkyRoute Care</span>
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT AREA */}
          <main className="mytrips-content-area">
            {groupedTrips.length === 0 ? (
              /* EMPTY STATE */
              <div className="mytrips-empty-state">
                <div className="mytrips-empty-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <h3 className="mytrips-empty-title">
                  No {activeStatus} {activeCategory === "all" ? "trips" : activeCategory} found
                </h3>
                <p className="mytrips-empty-desc">
                  You have no {activeStatus} bookings in this section. Plan your next journey with SkyRoute today!
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                  <Link href="/" className="mytrips-btn-blue">
                    Search Flights
                  </Link>
                  <Link href="/allTrains" className="mytrips-btn-blue-outline">
                    Book Trains
                  </Link>
                  <Link href="/allBus" className="mytrips-btn-blue-outline">
                    Book Buses
                  </Link>
                </div>
              </div>
            ) : (
              /* GROUPED BOOKINGS BY MONTH (Screenshot 2 & 3) */
              groupedTrips.map((group) => (
                <section key={group.month} className="mytrips-month-section">
                  <div className="mytrips-month-header">{group.month}</div>

                  {group.trips.map((trip) => (
                    <article key={trip.id} className="mytrips-trip-card">
                      <div className="mytrips-trip-main">
                        {getCategoryAvatar(trip.type)}

                        <div className="mytrips-trip-info">
                          <div className="mytrips-route-row">
                            <h2 className="mytrips-route-title">
                              <span>{trip.from}</span>
                              <span className="mytrips-route-arrow">➔</span>
                              <span>{trip.to}</span>
                            </h2>
                            <span className={`mytrips-type-pill mytrips-type-${trip.type}`}>
                              {trip.type}
                            </span>
                          </div>

                          <div className="mytrips-details-row">
                            <span>{trip.subtitle}</span>
                            {trip.metaBadge && (
                              <>
                                <span>•</span>
                                <span>{trip.metaBadge}</span>
                              </>
                            )}
                          </div>

                          {/* PASSENGERS & SEAT DETAILS (Screenshot 2 & 3) */}
                          <div className="mytrips-passengers-row">
                            {trip.type === "train" && trip.seatInfo ? (
                              <span className="mytrips-seat-tag">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M7 13h10"/>
                                  <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
                                </svg>
                                <span>{trip.seatInfo}</span>
                              </span>
                            ) : trip.type === "bus" && trip.seatInfo ? (
                              <span className="mytrips-seat-tag" style={{ background: "#f0fdf4", color: "#166534" }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                                  <path d="M13 5v2"/>
                                  <path d="M13 17v2"/>
                                  <path d="M13 11v2"/>
                                </svg>
                                <span>{trip.seatInfo}</span>
                              </span>
                            ) : (
                              <span>
                                {trip.passengers.join(" • ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT META & VIEW DETAILS CTA */}
                      <div className="mytrips-trip-aside">
                        <div className="mytrips-date-text">{trip.dateStr}</div>
                        {getStatusChip(trip.status)}

                        <button
                          type="button"
                          className="mytrips-view-btn"
                          onClick={() => handleViewTripDetails(trip)}
                        >
                          <span>View Details</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </section>
              ))
            )}

            {/* PREVIOUS BOOKINGS FOOTER PROMPT (Screenshot 2) */}
            <div className="mytrips-footer-callout">
              <span>Want to view your previous bookings?</span>
              <button
                type="button"
                className="mytrips-footer-link"
                onClick={() => {
                  setActiveStatus("past");
                  setActiveCategory("all");
                }}
              >
                Click here
              </button>
            </div>
          </main>
        </div>
      </div>

      </div>
  );
}

export default function MyTripsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading your trips...</div>}>
      <MyTripsContent />
    </Suspense>
  );
}
