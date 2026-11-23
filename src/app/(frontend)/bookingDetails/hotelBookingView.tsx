"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { INITIAL_HOTELS, HotelData } from "../allHotels/page";
import "./HotelBookingView.css";

interface RoomTierOption {
  id: string;
  planName: string;
  planBadge?: string;
  perks: string[];
  basePrice: number;
  originalPrice: number;
  taxesAndFees: number;
  roomsLeft: number;
}

interface RoomTypeData {
  id: string;
  name: string;
  sizeSqFt: number;
  bedType: string;
  viewType: string;
  sleeps: number;
  images: string[];
  amenities: string[];
  tiers: RoomTierOption[];
}

const DEFAULT_ROOMS: RoomTypeData[] = [
  {
    id: "superior-room",
    name: "Superior Room",
    sizeSqFt: 240,
    bedType: "1 Queen / Double Bed",
    viewType: "City View",
    sleeps: 4,
    images: [
      "/images/hotel1.png",
      "/images/hotel2.png",
      "/images/hotel3.png",
    ],
    amenities: [
      "City view",
      "Complimentary Wi-Fi",
      "Tile / Italian Marble floor",
      "Air-conditioned suites",
      "Luxury toiletries",
      "Rain shower",
      "Health Faucet",
      "Double Bed",
      "Smart TV with HD DTH",
      "Western style toilet",
    ],
    tiers: [
      {
        id: "plan-room-only",
        planName: "Room Only (European Plan)",
        planBadge: "Most Popular",
        perks: [
          "Non-refundable rate",
          "Complimentary High-Speed Wi-Fi",
          "Express Contactless Check-in",
          "Mandatory Gala Dinner charges included for Christmas & New Year",
        ],
        basePrice: 10883,
        originalPrice: 14100,
        taxesAndFees: 3236,
        roomsLeft: 2,
      },
      {
        id: "plan-with-breakfast",
        planName: "Room With Gourmet Breakfast (CP Plan)",
        planBadge: "Recommended Deal",
        perks: [
          "Complimentary Gourmet Buffet Breakfast included",
          "Free High-Speed Wi-Fi",
          "Complimentary early check-in (subject to availability)",
          "Mandatory Gala Dinner charges included",
        ],
        basePrice: 11194,
        originalPrice: 14500,
        taxesAndFees: 3328,
        roomsLeft: 2,
      },
    ],
  },
  {
    id: "executive-suite",
    name: "Deluxe Executive Suite",
    sizeSqFt: 380,
    bedType: "1 King Bed + Lounge Sofa",
    viewType: "Garden & Skyline View",
    sleeps: 3,
    images: [
      "/images/hotel4.png",
      "/images/hotel5.png",
      "/images/hotel6.png",
    ],
    amenities: [
      "Separate Living Lounge",
      "Private Scenic Balcony",
      "Espresso Coffee Machine",
      "Bathtub with Bathrobes & Slippers",
      "High-speed 100Mbps Wi-Fi",
      "Mini Fridge & Bar Setup",
      "Electronic Laptop Safe",
      "55-inch Smart OLED TV",
      "In-room Dining 24 Hours",
    ],
    tiers: [
      {
        id: "suite-room-only",
        planName: "Suite Only (European Plan)",
        perks: [
          "Spacious 380 sq. ft. suite with separate parlor",
          "Complimentary High-Speed Wi-Fi",
          "Free cancellation up to 48 hours before check-in",
          "Access to Executive Business Center",
        ],
        basePrice: 14250,
        originalPrice: 19000,
        taxesAndFees: 4150,
        roomsLeft: 3,
      },
      {
        id: "suite-all-meals",
        planName: "Suite With Breakfast & Dinner (Half Board)",
        planBadge: "VIP Package",
        perks: [
          "Daily Chef's Breakfast Buffet + 4-Course Dinner",
          "Complimentary Airport Pick-up & Drop Service",
          "Evening Sunset Cocktails at Rooftop Lounge",
          "Flexible Check-out up to 2:00 PM",
        ],
        basePrice: 16400,
        originalPrice: 20500,
        taxesAndFees: 4800,
        roomsLeft: 1,
      },
    ],
  },
];

const SURROUNDING_LANDMARKS = [
  { name: "Lotus Temple", distance: "2.46 km", time: "8 mins drive" },
  { name: "Humayun's Tomb", distance: "4.86 km", time: "12 mins drive" },
  { name: "Lodhi Garden", distance: "5.13 km", time: "14 mins drive" },
  { name: "Qutub Minar", distance: "5.71 km", time: "15 mins drive" },
  { name: "India Gate", distance: "6.82 km", time: "18 mins drive" },
  { name: "Akshardham Temple", distance: "7.93 km", time: "20 mins drive" },
  { name: "Red Fort", distance: "11.6 km", time: "28 mins drive" },
  { name: "Indira Gandhi Intl Airport (DEL)", distance: "16.2 km", time: "35 mins drive" },
];

const GUEST_REVIEWS = [
  {
    id: "rev-1",
    author: "Udayadietya Jain",
    type: "Solo Traveller",
    date: "Oct 2026",
    rating: 10,
    title: "Comfortable Quiet Room & Spotless Maintenance",
    comment:
      "The room was perfect. Service was polite, courteous, and fast. The suite was quiet and exceptionally comfortable right in Greater Kailash.",
  },
  {
    id: "rev-2",
    author: "ixigoer Traveller",
    type: "Solo Traveller",
    date: "Oct 2026",
    rating: 9.2,
    title: "Amazing and definitely worth every rupee!",
    comment:
      "Although my stay here was short, I really enjoyed myself. The breakfast buffet was fresh with lots of variety, and staff were extremely kind.",
  },
  {
    id: "rev-3",
    author: "Siddharth & Ananya",
    type: "Couple",
    date: "Nov 2026",
    rating: 9.6,
    title: "Romantic & Peaceful Getaway in the Heart of Delhi",
    comment:
      "Loved the rooftop cafe and courteous staff. Rooms are beautifully styled with contemporary decor. Will definitely book again!",
  },
  {
    id: "rev-4",
    author: "Meera Subramanian",
    type: "Family",
    date: "Sep 2026",
    rating: 8.8,
    title: "Great stay with kids, safe and prime locality",
    comment:
      "Located in a safe upscale neighborhood. The kids enjoyed the food and prompt room service. The staff helped us arrange hassle-free airport cabs.",
  },
  {
    id: "rev-5",
    author: "Kavita Rao",
    type: "Business",
    date: "Nov 2026",
    rating: 9.0,
    title: "Fast Wi-Fi and Excellent Work Desk Setup",
    comment:
      "Perfect for working remotely. High-speed internet, ergonomic study desk, and delicious in-room dining made my business trip effortless.",
  },
];

export default function HotelBookingView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search Params
  const hotelId = searchParams.get("hotelId") || "hotel-1";
  const checkInParam = searchParams.get("checkIn") || "2026-11-23";
  const checkOutParam = searchParams.get("checkOut") || "2026-11-25";
  const roomsParam = parseInt(searchParams.get("rooms") || "1", 10);
  const adultsParam = parseInt(searchParams.get("adults") || "2", 10);
  const childrenParam = parseInt(searchParams.get("children") || "0", 10);

  // Hydrate Hotel details from sessionStorage or fallback to mock DB
  const [hotel, setHotel] = useState<HotelData>(() => {
    const found = INITIAL_HOTELS.find((h) => h.id === hotelId);
    return found || INITIAL_HOTELS[0];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("skyroute_hotel_booking");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id) {
            setHotel((prev) => ({
              ...prev,
              ...parsed,
            }));
          }
        } catch (e) {
          console.error("Error reading stored hotel booking", e);
        }
      }
    }
  }, [hotelId]);

  // Tab Navigation State
  const [activeNavTab, setActiveNavTab] = useState<
    "overview" | "rooms" | "location" | "reviews" | "facilities" | "policies"
  >("overview");

  // About Tab State
  const [aboutTab, setAboutTab] = useState<
    "overview" | "dining" | "rooms" | "facilities" | "neighborhood"
  >("overview");

  // Selection States
  const [selectedRoomId, setSelectedRoomId] = useState<string>("superior-room");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan-room-only");
  const [roomFilter, setRoomFilter] = useState<"all" | "breakfast" | "suites">("all");
  const [reviewsFilter, setReviewsFilter] = useState<string>("All");

  // User interaction states
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState<boolean>(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Booking Checkout Drawer State
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState<boolean>(false);
  const [guestFullName, setGuestFullName] = useState<string>("Joydeep Barik");
  const [guestEmail, setGuestEmail] = useState<string>("joydeep.travel@skyroute.com");
  const [guestPhone, setGuestPhone] = useState<string>("+91 98301 23456");
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [couponCodeInput, setCouponCodeInput] = useState<string>("IXIFIRST");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("IXIFIRST");
  const [couponDiscount, setCouponDiscount] = useState<number>(755);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [bookingRefId, setBookingRefId] = useState<string>("");

  // Target anchors
  const scrollToSection = (id: string) => {
    setActiveNavTab(id as any);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setShareToast("Property link copied to clipboard!");
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  // Find currently selected room & plan
  const currentSelectedRoom = useMemo(() => {
    return DEFAULT_ROOMS.find((r) => r.id === selectedRoomId) || DEFAULT_ROOMS[0];
  }, [selectedRoomId]);

  const currentSelectedPlan = useMemo(() => {
    return (
      currentSelectedRoom.tiers.find((t) => t.id === selectedPlanId) ||
      currentSelectedRoom.tiers[0]
    );
  }, [currentSelectedRoom, selectedPlanId]);

  // Pricing calculations
  const baseTariff = currentSelectedPlan.basePrice * roomsParam;
  const taxesAmount = currentSelectedPlan.taxesAndFees * roomsParam;
  const grandTotal = Math.max(999, baseTariff + taxesAmount - couponDiscount);

  // Apply promo
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.trim().toUpperCase() === "IXIFIRST") {
      setAppliedCoupon("IXIFIRST");
      setCouponDiscount(755);
      setShareToast("Coupon IXIFIRST applied successfully (₹755 off)!");
    } else if (couponCodeInput.trim().toUpperCase() === "AXIS12") {
      setAppliedCoupon("AXIS12");
      setCouponDiscount(1200);
      setShareToast("Coupon AXIS12 applied successfully (₹1,200 off)!");
    } else {
      setAppliedCoupon(couponCodeInput.trim().toUpperCase());
      setCouponDiscount(500);
      setShareToast(`Coupon ${couponCodeInput.trim().toUpperCase()} applied (₹500 off)!`);
    }
    setTimeout(() => setShareToast(null), 3500);
  };

  const handleProceedToCheckout = (roomId?: string, planId?: string) => {
    const rId = roomId || selectedRoomId;
    const pId = planId || selectedPlanId;
    const chosenRoom = DEFAULT_ROOMS.find((r) => r.id === rId) || DEFAULT_ROOMS[0];
    const chosenPlan = chosenRoom.tiers.find((t) => t.id === pId) || chosenRoom.tiers[0];

    const hotelCheckoutData = {
      type: "hotel",
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      area: hotel.area || "Greater Kailash 1",
      starRating: hotel.starRating || 4,
      address: "C-22, Greater Kailash 1 Rd, Greater Kailash-1, New Delhi, 110048",
      image: hotel.images?.[0] || "/images/hotel1.png",
      images: hotel.images || ["/images/hotel1.png"],
      checkIn: checkInParam,
      checkOut: checkOutParam,
      rooms: roomsParam,
      adults: adultsParam,
      children: childrenParam,
      roomId: chosenRoom.id,
      roomName: chosenRoom.name,
      roomSize: chosenRoom.sizeSqFt,
      bedType: chosenRoom.bedType,
      viewType: chosenRoom.viewType,
      planId: chosenPlan.id,
      planName: chosenPlan.planName,
      basePrice: chosenPlan.basePrice * roomsParam,
      originalPrice: chosenPlan.originalPrice * roomsParam,
      taxesAndFees: chosenPlan.taxesAndFees * roomsParam,
      freeCancellation: true,
      freeBreakfast: chosenPlan.planName.toLowerCase().includes("breakfast") || chosenPlan.planName.toLowerCase().includes("cp"),
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("skyroute_hotel_booking", JSON.stringify(hotelCheckoutData));
      } catch (err) {
        console.error("Failed saving hotel checkout to sessionStorage", err);
      }
    }

    const q = new URLSearchParams({
      type: "hotel",
      step: "checkout",
      hotelId: hotel.id,
      roomId: chosenRoom.id,
      planId: chosenPlan.id,
      checkIn: checkInParam,
      checkOut: checkOutParam,
      rooms: String(roomsParam),
      adults: String(adultsParam),
      children: String(childrenParam),
      price: String(chosenPlan.basePrice * roomsParam),
    });

    router.push(`/bookingDetails?${q.toString()}`);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = "SKY-HTL-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRefId(newRef);
    setIsConfirmed(true);

    // Save final confirmed voucher into sessionStorage
    if (typeof window !== "undefined") {
      try {
        const finalBooking = {
          type: "hotel",
          bookingRef: newRef,
          hotelName: hotel.name,
          city: hotel.city,
          address: "C-22, Greater Kailash 1 Rd, Greater Kailash-1, New Delhi, 110048",
          roomName: currentSelectedRoom.name,
          planName: currentSelectedPlan.planName,
          checkIn: checkInParam,
          checkOut: checkOutParam,
          rooms: roomsParam,
          guests: adultsParam + childrenParam,
          primaryGuest: guestFullName,
          email: guestEmail,
          phone: guestPhone,
          amountPaid: grandTotal,
          status: "CONFIRMED",
          bookedAt: new Date().toISOString(),
        };
        sessionStorage.setItem("skyroute_hotel_confirmed", JSON.stringify(finalBooking));
      } catch (err) {
        console.error("Failed saving hotel confirmed booking", err);
      }
    }
  };

  const filteredRooms = useMemo(() => {
    if (roomFilter === "breakfast") {
      return DEFAULT_ROOMS.map((r) => ({
        ...r,
        tiers: r.tiers.filter((t) => t.id.includes("breakfast") || t.id.includes("meals")),
      }));
    }
    if (roomFilter === "suites") {
      return DEFAULT_ROOMS.filter((r) => r.id.includes("suite"));
    }
    return DEFAULT_ROOMS;
  }, [roomFilter]);

  const filteredReviews = useMemo(() => {
    if (reviewsFilter === "All") return GUEST_REVIEWS;
    return GUEST_REVIEWS.filter((rev) =>
      rev.type.toLowerCase().includes(reviewsFilter.toLowerCase())
    );
  }, [reviewsFilter]);

  // Gallery photos
  const allHotelPhotos = [
    hotel.images[0] || "/images/hotel1.png",
    hotel.images[1] || "/images/hotel2.png",
    hotel.images[2] || "/images/hotel3.png",
    hotel.images[3] || "/images/hotel4.png",
    "/images/hotel5.png",
    "/images/hotel6.png",
  ];

  return (
    <div className="sr-hotel-detail-page">
      {/* 1. STICKY SUB-NAVIGATION BAR (Screenshot 1) */}
      <nav className="sr-hotel-subnav-strip" aria-label="Hotel Sections Navigation">
        <div className="sr-hotel-subnav-container">
          <div className="sr-hotel-tabs-scroll">
            <button
              type="button"
              className={`sr-hotel-nav-tab ${activeNavTab === "overview" ? "is-active" : ""}`}
              onClick={() => scrollToSection("overview")}
            >
              Overview
            </button>
            <button
              type="button"
              className={`sr-hotel-nav-tab ${activeNavTab === "rooms" ? "is-active" : ""}`}
              onClick={() => scrollToSection("rooms")}
            >
              Rooms &amp; Rates
            </button>
            <button
              type="button"
              className={`sr-hotel-nav-tab ${activeNavTab === "location" ? "is-active" : ""}`}
              onClick={() => scrollToSection("location")}
            >
              Location &amp; Map
            </button>
            <button
              type="button"
              className={`sr-hotel-nav-tab ${activeNavTab === "reviews" ? "is-active" : ""}`}
              onClick={() => scrollToSection("reviews")}
            >
              Reviews &amp; Ratings
            </button>
            <button
              type="button"
              className={`sr-hotel-nav-tab ${activeNavTab === "facilities" ? "is-active" : ""}`}
              onClick={() => scrollToSection("facilities")}
            >
              Facilities &amp; Amenities
            </button>
            <button
              type="button"
              className={`sr-hotel-nav-tab ${activeNavTab === "policies" ? "is-active" : ""}`}
              onClick={() => scrollToSection("policies")}
            >
              Policies
            </button>
          </div>

          <button
            type="button"
            className="sr-hotel-nav-book-btn"
            onClick={() => scrollToSection("rooms")}
          >
            <span>Select Room</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main 1320px Details Container */}
      <div className="sr-hotel-container">
        
        {/* Toast Alert */}
        {shareToast && (
          <div className="sr-hotel-toast-bubble" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.8">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{shareToast}</span>
          </div>
        )}

        {/* =====================================================================
            2. HOTEL TITLE & LOCATION HEADER (Screenshot 1)
            ===================================================================== */}
        <section className="sr-hotel-header-section" id="overview">
          <div className="sr-hotel-title-left">
            <div className="sr-hotel-name-row">
              <h1 className="sr-hotel-h1">{hotel.name}</h1>
              <div className="sr-hotel-star-ratings" aria-label={`${hotel.starRating || 4} stars`}>
                {Array.from({ length: hotel.starRating || 4 }).map((_, idx) => (
                  <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="sr-verified-badge">✓ SkyRoute Certified</span>
            </div>

            <div className="sr-hotel-address-line">
              <span className="sr-address-icon-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2.4">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="sr-address-text">
                C-22, Greater Kailash 1 Rd, Greater Kailash-1, C Block, New Delhi, 110048
              </span>
              <button
                type="button"
                className="sr-address-map-link"
                onClick={() => scrollToSection("location")}
              >
                View on map
              </button>
            </div>
          </div>

          <div className="sr-hotel-header-actions">
            <button
              type="button"
              className={`sr-action-btn ${isSaved ? "is-fav" : ""}`}
              onClick={() => setIsSaved(!isSaved)}
              aria-label="Save hotel"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={isSaved ? "#ef4444" : "none"} stroke={isSaved ? "#ef4444" : "currentColor"} strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              className="sr-action-btn"
              onClick={handleShare}
              aria-label="Share property link"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </section>

        {/* =====================================================================
            3. HERO BENTO GALLERY & RECOMMENDED DEAL (Screenshot 1)
            ===================================================================== */}
        <section className="sr-hotel-gallery-grid">
          {/* Left Large Hero Facade */}
          <div
            className="sr-gallery-hero-tile"
            onClick={() => {
              setActivePhotoIdx(0);
              setIsPhotoLightboxOpen(true);
            }}
          >
            <Image
              src={allHotelPhotos[0]}
              alt={`${hotel.name} Facade`}
              fill
              priority
              sizes="(max-width: 992px) 100vw, 480px"
              className="sr-hero-cover-img"
            />
            <div className="sr-gallery-badge-overlay">
              <span>Exterior &amp; Entrance</span>
            </div>
          </div>

          {/* Center 2 Stacked Interior Photos */}
          <div className="sr-gallery-stacked-col">
            <div
              className="sr-gallery-sub-tile"
              onClick={() => {
                setActivePhotoIdx(1);
                setIsPhotoLightboxOpen(true);
              }}
            >
              <Image
                src={allHotelPhotos[1]}
                alt={`${hotel.name} Deluxe Room`}
                fill
                sizes="(max-width: 992px) 50vw, 240px"
                className="sr-hero-cover-img"
              />
              <span className="sr-sub-tile-tag">Rooms &amp; Suites</span>
            </div>

            <div
              className="sr-gallery-sub-tile"
              onClick={() => {
                setActivePhotoIdx(2);
                setIsPhotoLightboxOpen(true);
              }}
            >
              <Image
                src={allHotelPhotos[2]}
                alt={`${hotel.name} Modern Architecture`}
                fill
                sizes="(max-width: 992px) 50vw, 240px"
                className="sr-hero-cover-img"
              />
              <button
                type="button"
                className="sr-all-photos-pill-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx(0);
                  setIsPhotoLightboxOpen(true);
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>See All Photos ({allHotelPhotos.length}+)</span>
              </button>
            </div>
          </div>

          {/* Right Spotlight: Recommended Deal Spotlight Card (Screenshot 1) */}
          <aside className="sr-recommended-deal-card">
            <div className="sr-deal-thumb-frame">
              <Image
                src={allHotelPhotos[3] || allHotelPhotos[0]}
                alt="Recommended Superior Room"
                fill
                sizes="340px"
                className="sr-deal-img"
              />
              <span className="sr-deal-floating-badge">Recommended Deal</span>
            </div>

            <div className="sr-deal-content">
              <h3 className="sr-deal-room-title">Superior Room</h3>
              <ul className="sr-deal-perks-list">
                <li className="sr-deal-perk non-ref">
                  <span className="sr-cross-dot">⊘</span>
                  <span>Non-refundable rate</span>
                </li>
                <li className="sr-deal-perk green">
                  <span className="sr-check-dot">✓</span>
                  <span>Complimentary High-Speed Wi-Fi</span>
                </li>
                <li className="sr-deal-perk blue">
                  <span className="sr-check-dot">✓</span>
                  <span>Mandatory Gala Dinner charges included</span>
                </li>
              </ul>

              <div className="sr-deal-pricing-block">
                <span className="sr-deal-more-link" onClick={() => scrollToSection("rooms")}>
                  More Details ›
                </span>
                <div className="sr-deal-price-row">
                  <div className="sr-deal-price-stack">
                    <span className="sr-deal-struck">₹14,100</span>
                    <span className="sr-deal-current">₹10,883</span>
                  </div>
                  <span className="sr-deal-taxes-note">+ ₹3,236 taxes &amp; fees, per night</span>
                </div>
              </div>

              <div className="sr-deal-buttons-row">
                <button
                  type="button"
                  className="sr-deal-primary-btn"
                  onClick={() => {
                    handleProceedToCheckout("superior-room", "plan-room-only");
                  }}
                >
                  Reserve 1 Room
                </button>
                <button
                  type="button"
                  className="sr-deal-secondary-btn"
                  onClick={() => scrollToSection("rooms")}
                >
                  View All Rooms
                </button>
              </div>
            </div>
          </aside>
        </section>

        {/* =====================================================================
            4. KEY HIGHLIGHTS & SENTIMENT ROW (Screenshot 2)
            ===================================================================== */}
        <section className="sr-hotel-highlights-grid">
          <div className="sr-highlight-card">
            <div className="sr-highlight-icon-wrap staff">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="sr-highlight-info">
              <h4 className="sr-highlight-title">Friendly Staff</h4>
              <p className="sr-highlight-desc">
                Kind, welcoming and helpful staff consistently provide attentive service throughout stays.
              </p>
            </div>
          </div>

          <div className="sr-highlight-card">
            <div className="sr-highlight-icon-wrap location">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            </div>
            <div className="sr-highlight-info">
              <h4 className="sr-highlight-title">Prime Location</h4>
              <p className="sr-highlight-desc">
                Excellent Greater Kailash location beside premier markets, metro transit, and neighborhood parks.
              </p>
            </div>
          </div>

          <div className="sr-highlight-card">
            <div className="sr-highlight-icon-wrap food">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <div className="sr-highlight-info">
              <h4 className="sr-highlight-title">Tasty Gourmet Food</h4>
              <p className="sr-highlight-desc">
                Breakfast buffet and multi-cuisine restaurant meals are fresh, varied, and widely praised.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. ABOUT THE PROPERTY & POPULAR FACILITIES (Screenshot 2)
            ===================================================================== */}
        <section className="sr-hotel-about-section">
          <div className="sr-about-main-col">
            <h2 className="sr-section-title">About</h2>

            <div className="sr-about-subtabs">
              <button
                type="button"
                className={`sr-about-tab ${aboutTab === "overview" ? "active" : ""}`}
                onClick={() => setAboutTab("overview")}
              >
                Overview
              </button>
              <button
                type="button"
                className={`sr-about-tab ${aboutTab === "dining" ? "active" : ""}`}
                onClick={() => setAboutTab("dining")}
              >
                Food &amp; Dining
              </button>
              <button
                type="button"
                className={`sr-about-tab ${aboutTab === "rooms" ? "active" : ""}`}
                onClick={() => setAboutTab("rooms")}
              >
                Rooms
              </button>
              <button
                type="button"
                className={`sr-about-tab ${aboutTab === "facilities" ? "active" : ""}`}
                onClick={() => setAboutTab("facilities")}
              >
                Facilities &amp; Activities
              </button>
              <button
                type="button"
                className={`sr-about-tab ${aboutTab === "neighborhood" ? "active" : ""}`}
                onClick={() => setAboutTab("neighborhood")}
              >
                Location &amp; Nearby Areas
              </button>
            </div>

            <div className="sr-about-tab-content">
              {aboutTab === "overview" && (
                <div className="sr-about-prose">
                  <p>
                    • <strong>{hotel.name}</strong> is a boutique upscale property situated at C-22, Greater Kailash 1, New Delhi.
                  </p>
                  <p>
                    • Featuring sophisticated Scandinavian-inspired architecture, bespoke art curated across suites, and state-of-the-art climate control, the hotel is ideal for both business executives and leisure explorers.
                  </p>
                  <p>
                    • The surrounding South Delhi district offers immediate access to the bustling M-Block Market, trendy cafes, and metro transport.
                  </p>
                </div>
              )}

              {aboutTab === "dining" && (
                <div className="sr-about-prose">
                  <p>
                    • <strong>All-Day Dining Bistro:</strong> Serves authentic North Indian specialties, Mediterranean bowls, and artisanal European desserts prepared by executive chefs.
                  </p>
                  <p>• 24-hour in-room dining available with midnight snack and beverage menu.</p>
                </div>
              )}

              {aboutTab === "rooms" && (
                <div className="sr-about-prose">
                  <p>
                    • Superior and Executive suites equipped with 300-thread count Egyptian cotton sheets, double-glazed soundproof glass, and ergonomic work stations.
                  </p>
                </div>
              )}

              {aboutTab === "facilities" && (
                <div className="sr-about-prose">
                  <p>
                    • High-speed 100 Mbps fiber internet throughout the premises, valet parking, electric vehicle charging dock, and fitness center.
                  </p>
                </div>
              )}

              {aboutTab === "neighborhood" && (
                <div className="sr-about-prose">
                  <p>
                    • 500 meters walk from Greater Kailash Metro Station (Magenta Line). 15 minutes drive to Nehru Place Commercial Complex and Select Citywalk Saket.
                  </p>
                </div>
              )}
            </div>

            {/* Popular Facilities Icon Strip (Screenshot 2) */}
            <div className="sr-popular-facilities-block">
              <h3 className="sr-facilities-subhead">Popular Facilities</h3>
              <div className="sr-facility-icons-strip">
                <div className="sr-facility-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                  <span>Internet Services</span>
                </div>

                <div className="sr-facility-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                  <span>Airport Transfer</span>
                </div>

                <div className="sr-facility-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H7.5a1 1 0 0 0-.8.4L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3" />
                    <circle cx="6.5" cy="16.5" r="2.5" />
                    <circle cx="16.5" cy="16.5" r="2.5" />
                  </svg>
                  <span>Taxi / Cab Service</span>
                </div>

                <div className="sr-facility-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
                  </svg>
                  <span>Free Car Parking</span>
                </div>

                <div className="sr-facility-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2">
                    <path d="M18 12H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                  <span>Non-smoking Rooms</span>
                </div>

                <div className="sr-facility-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2">
                    <path d="M3 20h18" />
                    <path d="M5 20v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8" />
                    <path d="M8 10V4h8v6" />
                  </svg>
                  <span>Ergonomic Desk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Mini Widget: Guest Rating & Mini Map (Screenshot 2) */}
          <div className="sr-about-sidebar-col">
            {/* Guest Rating Score Card */}
            <div className="sr-guest-rating-box">
              <div className="sr-rating-header">
                <span className="sr-score-number">{hotel.ratingScore || 8.6}</span>
                <div className="sr-score-meta">
                  <span className="sr-score-word">{hotel.ratingLabel || "Excellent"}</span>
                  <span className="sr-score-sub">{hotel.reviewsCount || 658} Verified Ratings</span>
                </div>
              </div>
              <span className="sr-rating-highlight-pill">✓ 80% rated positive in last 3 months</span>

              <div className="sr-guest-quote-block">
                <span className="sr-quote-lead">Guests are saying:</span>
                <p className="sr-quote-body">
                  &ldquo;The room was perfect. Service was good. The room was quiet, pristine, and very comfortable.&rdquo;
                </p>
                <span className="sr-quote-author">
                  — Udayadietya Jain • Solo Traveller • Oct 2026
                </span>
              </div>
            </div>

            {/* Sidebar Mini-Map Preview Card (Screenshot 2) */}
            <div className="sr-sidebar-map-preview" onClick={() => scrollToSection("location")}>
              <div className="sr-mini-map-art">
                <svg width="100%" height="100" viewBox="0 0 280 100" fill="none" preserveAspectRatio="none">
                  <rect width="280" height="100" fill="#f1f5f9" />
                  <path d="M10 20 Q80 10 140 30 T280 20" stroke="#e2e8f0" strokeWidth="4" />
                  <path d="M0 60 Q100 70 190 40 T280 60" stroke="#ffffff" strokeWidth="6" />
                  <line x1="60" y1="0" x2="60" y2="100" stroke="#ffffff" strokeWidth="4" />
                  <line x1="180" y1="0" x2="180" y2="100" stroke="#ffffff" strokeWidth="4" />
                  <circle cx="120" cy="50" r="14" fill="#006ce4" opacity="0.2" />
                  <circle cx="120" cy="50" r="7" fill="#006ce4" />
                </svg>
                <div className="sr-mini-map-pin">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#006ce4">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.8" fill="#ffffff" />
                  </svg>
                </div>
              </div>
              <div className="sr-mini-map-btn-row">
                <span>View on Map</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. SELECT YOUR ROOM MATRIX (Screenshot 3)
            ===================================================================== */}
        <section className="sr-hotel-rooms-section" id="rooms">
          <div className="sr-rooms-header-row">
            <div>
              <h2 className="sr-section-title">Select your room</h2>
              <span className="sr-rooms-subhead">
                Showing all available room categories and meal packages for {checkInParam} to {checkOutParam} ({roomsParam} {roomsParam === 1 ? "Room" : "Rooms"})
              </span>
            </div>

            {/* Room Filters */}
            <div className="sr-room-filters-row">
              <button
                type="button"
                className={`sr-filter-pill ${roomFilter === "all" ? "active" : ""}`}
                onClick={() => setRoomFilter("all")}
              >
                All Rooms
              </button>
              <button
                type="button"
                className={`sr-filter-pill ${roomFilter === "breakfast" ? "active" : ""}`}
                onClick={() => setRoomFilter("breakfast")}
              >
                ✓ Breakfast Included
              </button>
              <button
                type="button"
                className={`sr-filter-pill ${roomFilter === "suites" ? "active" : ""}`}
                onClick={() => setRoomFilter("suites")}
              >
                Executive Suites
              </button>
            </div>
          </div>

          {/* Room Categories Table Header */}
          <div className="sr-room-table-head">
            <span className="sr-head-col col-room">Room Category</span>
            <span className="sr-head-col col-options">Meal Plans &amp; Benefits</span>
            <span className="sr-head-col col-price">Price &amp; Instant Reserve</span>
          </div>

          {/* Room Cards List */}
          <div className="sr-room-cards-list">
            {filteredRooms.map((room) => (
              <article key={room.id} className="sr-room-card">
                {/* Left: Room Media & Attributes */}
                <div className="sr-room-col-left">
                  <div className="sr-room-photo-frame">
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      sizes="280px"
                      className="sr-room-img"
                    />
                    <span className="sr-room-photo-count">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                      </svg>
                      {room.images.length}+
                    </span>
                  </div>

                  <h3 className="sr-room-title">{room.name}</h3>

                  <div className="sr-room-specs-line">
                    <span className="sr-spec-item">📐 {room.sizeSqFt} sq. ft.</span>
                    <span className="sr-spec-item">🛏️ {room.bedType}</span>
                    <span className="sr-spec-item">🌆 {room.viewType}</span>
                    <span className="sr-spec-item">👥 Sleeps {room.sleeps}</span>
                  </div>

                  <div className="sr-room-amenities-checklist">
                    {room.amenities.slice(0, 6).map((item, aIdx) => (
                      <span key={aIdx} className="sr-amenity-check">
                        ✓ {item}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="sr-room-details-btn"
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setIsCheckoutDrawerOpen(true);
                    }}
                  >
                    View Room Details ›
                  </button>
                </div>

                {/* Right: Stacked Meal Plans & Pricing Rows */}
                <div className="sr-room-col-right">
                  {room.tiers.map((tier) => {
                    const isSelected = selectedRoomId === room.id && selectedPlanId === tier.id;
                    const tierEffective = tier.basePrice * roomsParam;
                    const tierTaxes = tier.taxesAndFees * roomsParam;
                    const tierDiscountPct = Math.round(
                      ((tier.originalPrice - tier.basePrice) / tier.originalPrice) * 100
                    );

                    return (
                      <div
                        key={tier.id}
                        className={`sr-room-tier-row ${isSelected ? "is-selected-tier" : ""}`}
                      >
                        {/* Middle Options */}
                        <div className="sr-tier-plan-col">
                          <div className="sr-plan-title-line">
                            <h4 className="sr-plan-name">{tier.planName}</h4>
                            {tier.planBadge && (
                              <span className="sr-plan-badge">{tier.planBadge}</span>
                            )}
                          </div>

                          <ul className="sr-plan-perks-list">
                            {tier.perks.map((perk, pIdx) => (
                              <li key={pIdx} className="sr-plan-perk-item">
                                {perk.toLowerCase().includes("non-ref") ? (
                                  <span className="sr-nonref-bullet">⊘</span>
                                ) : (
                                  <span className="sr-check-bullet">✓</span>
                                )}
                                <span>{perk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Right Price & CTA */}
                        <div className="sr-tier-price-col">
                          <div className="sr-tier-urgency-row">
                            <span className="sr-discount-tag">{tierDiscountPct}% OFF</span>
                            <span className="sr-rooms-left-tag">
                              {tier.roomsLeft} {tier.roomsLeft === 1 ? "room" : "rooms"} left!
                            </span>
                          </div>

                          <div className="sr-tier-prices">
                            <span className="sr-tier-struck">
                              ₹{(tier.originalPrice * roomsParam).toLocaleString()}
                            </span>
                            <div className="sr-tier-final-price">
                              <span className="sr-currency">₹</span>
                              <span className="sr-amount">{tierEffective.toLocaleString()}</span>
                            </div>
                            <span className="sr-tier-taxes-sub">
                              + ₹{tierTaxes.toLocaleString()} taxes &amp; fees / night
                            </span>
                          </div>

                          <button
                            type="button"
                            className="sr-reserve-tier-btn"
                            onClick={() => {
                              handleProceedToCheckout(room.id, tier.id);
                            }}
                          >
                            <span>Reserve {roomsParam} Room</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================================
            7. EXPLORE THE AREA & LANDMARKS (Screenshot 4)
            ===================================================================== */}
        <section className="sr-hotel-area-section" id="location">
          <div className="sr-area-header-row">
            <div>
              <h2 className="sr-section-title">Explore the Area</h2>
              <span className="sr-area-address-text">
                📍 C-22, Greater Kailash 1 Rd, Greater Kailash-1, C Block, New Delhi, 110048
              </span>
            </div>
            <a
              href="https://maps.google.com/?q=Greater+Kailash+1+New+Delhi"
              target="_blank"
              rel="noopener noreferrer"
              className="sr-google-maps-btn"
            >
              <span>View On Google Maps</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          <div className="sr-interactive-map-wrapper">
            {/* Map Canvas Background */}
            <div className="sr-map-canvas-frame">
              <svg width="100%" height="340" viewBox="0 0 900 340" fill="none" preserveAspectRatio="none">
                <rect width="900" height="340" fill="#f8fafc" />
                {/* Secondary roads */}
                <line x1="0" y1="80" x2="900" y2="80" stroke="#ffffff" strokeWidth="6" />
                <line x1="0" y1="180" x2="900" y2="180" stroke="#ffffff" strokeWidth="8" />
                <line x1="0" y1="260" x2="900" y2="260" stroke="#ffffff" strokeWidth="6" />
                <line x1="220" y1="0" x2="220" y2="340" stroke="#ffffff" strokeWidth="8" />
                <line x1="520" y1="0" x2="520" y2="340" stroke="#ffffff" strokeWidth="10" />
                <line x1="740" y1="0" x2="740" y2="340" stroke="#ffffff" strokeWidth="6" />

                {/* City Blocks */}
                <rect x="50" y="20" width="140" height="45" rx="4" fill="#e2e8f0" opacity="0.6" />
                <rect x="250" y="20" width="240" height="45" rx="4" fill="#e2e8f0" opacity="0.6" />
                <rect x="550" y="20" width="160" height="45" rx="4" fill="#e2e8f0" opacity="0.6" />
                <rect x="50" y="105" width="140" height="60" rx="4" fill="#e2e8f0" opacity="0.6" />
                <rect x="250" y="105" width="240" height="60" rx="4" fill="#dcfce7" opacity="0.8" />
                <rect x="550" y="105" width="160" height="60" rx="4" fill="#e2e8f0" opacity="0.6" />

                {/* Primary Boulevard */}
                <path d="M0 180 Q350 170 520 180 T900 170" stroke="#fde047" strokeWidth="5" />

                {/* Center Hotel Pin */}
                <circle cx="520" cy="180" r="28" fill="#006ce4" opacity="0.2" />
                <circle cx="520" cy="180" r="14" fill="#006ce4" opacity="0.4" />
              </svg>

              <div className="sr-map-hotel-marker-pin">
                <div className="sr-pin-pulse-wave" />
                <svg width="34" height="34" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="3.2" fill="#ffffff" />
                </svg>
                <span className="sr-marker-callout-tag">{hotel.name}</span>
              </div>
            </div>

            {/* Floating "Around the property" List (Screenshot 4) */}
            <div className="sr-around-property-card">
              <div className="sr-around-card-header">
                <span className="sr-around-card-title">Around the property</span>
                <span className="sr-around-card-icon">📍</span>
              </div>

              <div className="sr-around-landmarks-scroll">
                {SURROUNDING_LANDMARKS.map((lm, idx) => (
                  <div key={idx} className="sr-around-landmark-item">
                    <span className="sr-landmark-name">{lm.name}</span>
                    <div className="sr-landmark-metrics">
                      <span className="sr-distance-tag">{lm.distance}</span>
                      <span className="sr-time-tag">{lm.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            8. GUEST REVIEWS & RATINGS BREAKDOWN (Screenshots 4 & 5)
            ===================================================================== */}
        <section className="sr-hotel-reviews-section" id="reviews">
          <h2 className="sr-section-title">Verified Guest Reviews</h2>

          <div className="sr-reviews-overview-grid">
            {/* Left Big Score Box */}
            <div className="sr-reviews-score-hero">
              <div className="sr-score-ring">
                <span className="sr-big-score">{hotel.ratingScore || 8.6}</span>
                <span className="sr-out-of">/ 10</span>
              </div>
              <div className="sr-hero-score-info">
                <h3 className="sr-hero-score-word">{hotel.ratingLabel || "Excellent"}</h3>
                <span className="sr-hero-score-total">
                  Based on {hotel.reviewsCount || 658} genuine guest reviews
                </span>
                <span className="sr-positive-pill">✓ 80% rated positive in last 3 months</span>
              </div>
            </div>

            {/* Right Detailed Category Breakdown Bars (Screenshot 5) */}
            <div className="sr-category-meters-col">
              <div className="sr-category-meter">
                <div className="sr-meter-labels">
                  <span>Food &amp; Dining</span>
                  <strong>9.2</strong>
                </div>
                <div className="sr-meter-bar-track">
                  <div className="sr-meter-bar-fill" style={{ width: "92%" }} />
                </div>
              </div>

              <div className="sr-category-meter">
                <div className="sr-meter-labels">
                  <span>Staff &amp; Hospitality</span>
                  <strong>9.0</strong>
                </div>
                <div className="sr-meter-bar-track">
                  <div className="sr-meter-bar-fill" style={{ width: "90%" }} />
                </div>
              </div>

              <div className="sr-category-meter">
                <div className="sr-meter-labels">
                  <span>Room Comfort</span>
                  <strong>9.0</strong>
                </div>
                <div className="sr-meter-bar-track">
                  <div className="sr-meter-bar-fill" style={{ width: "90%" }} />
                </div>
              </div>

              <div className="sr-category-meter">
                <div className="sr-meter-labels">
                  <span>Location &amp; Safety</span>
                  <strong>8.8</strong>
                </div>
                <div className="sr-meter-bar-track">
                  <div className="sr-meter-bar-fill" style={{ width: "88%" }} />
                </div>
              </div>

              <div className="sr-category-meter">
                <div className="sr-meter-labels">
                  <span>Cleanliness</span>
                  <strong>8.6</strong>
                </div>
                <div className="sr-meter-bar-track">
                  <div className="sr-meter-bar-fill" style={{ width: "86%" }} />
                </div>
              </div>

              <div className="sr-category-meter">
                <div className="sr-meter-labels">
                  <span>Value for Money</span>
                  <strong>8.0</strong>
                </div>
                <div className="sr-meter-bar-track">
                  <div className="sr-meter-bar-fill" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Review Filter Tabs (Screenshot 4) */}
          <div className="sr-review-filter-tabs">
            {["All", "Couple", "Family", "Business", "Solo"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`sr-review-pill ${reviewsFilter === cat ? "active" : ""}`}
                onClick={() => setReviewsFilter(cat)}
              >
                {cat === "All" ? "All Reviews (160)" : `${cat} Travellers`}
              </button>
            ))}
          </div>

          {/* Reviews Stream */}
          <div className="sr-reviews-cards-stream">
            {filteredReviews.map((rev) => (
              <article key={rev.id} className="sr-single-review-card">
                <div className="sr-review-top-row">
                  <div className="sr-reviewer-profile">
                    <div className="sr-avatar-initial">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="sr-reviewer-name">{rev.author}</h4>
                      <span className="sr-reviewer-tag">
                        {rev.type} • Verified Stay • {rev.date}
                      </span>
                    </div>
                  </div>

                  <span className="sr-single-rating-badge">
                    ★ {rev.rating} / 10
                  </span>
                </div>

                <h5 className="sr-review-headline">{rev.title}</h5>
                <p className="sr-review-text">&ldquo;{rev.comment}&rdquo;</p>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================================
            9. COMPREHENSIVE HOTEL FACILITIES (Screenshots 5 & 6)
            ===================================================================== */}
        <section className="sr-hotel-facilities-section" id="facilities">
          <h2 className="sr-section-title">Hotel Facilities &amp; Amenities</h2>
          <span className="sr-facilities-intro">
            Comprehensive amenities designed for supreme comfort, safety, and modern convenience.
          </span>

          <div className="sr-facilities-category-grid">
            <div className="sr-fac-category-card">
              <h3 className="sr-fac-cat-title">🚪 Access &amp; Accessibility</h3>
              <ul className="sr-fac-items-list">
                <li>Elevator access to all guest floors</li>
                <li>Wheelchair-accessible corridors and entrance</li>
                <li>Ramp access for easy mobility</li>
                <li>Accessible guest reception counter</li>
              </ul>
            </div>

            <div className="sr-fac-category-card">
              <h3 className="sr-fac-cat-title">🚿 Bathroom &amp; Hygiene</h3>
              <ul className="sr-fac-items-list">
                <li>24/7 Hot &amp; cold water supply</li>
                <li>Rain shower with health faucets</li>
                <li>Dental, shaving and shower cap kits</li>
                <li>Premium herbal toiletries and fresh towels</li>
                <li>Hairdryer &amp; illuminated makeup mirror</li>
              </ul>
            </div>

            <div className="sr-fac-category-card">
              <h3 className="sr-fac-cat-title">🛡️ Safety &amp; Cleanliness</h3>
              <ul className="sr-fac-items-list">
                <li>Optical smoke detectors in all rooms</li>
                <li>Soundproofing with acoustic wall insulation</li>
                <li>Electronic in-room digital safe</li>
                <li>24/7 CCTV surveillance in common areas</li>
                <li>Doctor-on-call medical assistance</li>
              </ul>
            </div>

            <div className="sr-fac-category-card">
              <h3 className="sr-fac-cat-title">☕ In-Room Comfort</h3>
              <ul className="sr-fac-items-list">
                <li>Tea / Coffee electric kettle maker</li>
                <li>Direct dial telephone</li>
                <li>HD Smart Television with premium streaming apps</li>
                <li>Personalized morning wake-up call service</li>
                <li>Centralized climate-controlled air conditioning</li>
              </ul>
            </div>

            <div className="sr-fac-category-card">
              <h3 className="sr-fac-cat-title">🍽️ Services &amp; Dining</h3>
              <ul className="sr-fac-items-list">
                <li>24/7 In-room dining and food delivery</li>
                <li>Official GST invoice provided at check-out</li>
                <li>Dedicated outdoor smoking area</li>
                <li>Daily professional housekeeping &amp; turn-down</li>
                <li>Concierge travel desk &amp; city tour bookings</li>
              </ul>
            </div>

            <div className="sr-fac-category-card">
              <h3 className="sr-fac-cat-title">🧳 Luggage &amp; Connectivity</h3>
              <ul className="sr-fac-items-list">
                <li>Complimentary luggage storage before check-in</li>
                <li>High-speed Wi-Fi in all public spaces</li>
                <li>Airport shuttle taxi booking service</li>
                <li>Express check-in / check-out desk</li>
              </ul>
            </div>
          </div>
        </section>

        {/* =====================================================================
            10. HOTEL POLICIES (Screenshot 6)
            ===================================================================== */}
        <section className="sr-hotel-policies-section" id="policies">
          <h2 className="sr-section-title">Hotel Policies</h2>

          {/* Check-In / Check-Out Hours Box */}
          <div className="sr-checkin-hours-banner">
            <div className="sr-hours-block">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2.3">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <span className="sr-hours-label">Check-in Time</span>
                <span className="sr-hours-val">2:00 PM</span>
              </div>
            </div>

            <div className="sr-hours-divider" />

            <div className="sr-hours-block">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2.3">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <span className="sr-hours-label">Check-out Time</span>
                <span className="sr-hours-val">12:00 PM</span>
              </div>
            </div>
          </div>

          <div className="sr-property-rules-card">
            <h3 className="sr-rules-head">Property Policies &amp; Terms</h3>
            <ul className="sr-rules-list">
              <li>
                <strong>Age Requirement:</strong> The primary guest checking in must be at least 18 years of age.
              </li>
              <li>
                <strong>Government Identification:</strong> As per Government of India guidelines, all adults must present a valid government-approved photo identity card (Aadhaar Card, Passport, or Driving License) at the time of check-in. PAN cards are not accepted as identity proof.
              </li>
              <li>
                <strong>Standard Timings:</strong> Early check-in or late check-out is strictly subject to room availability and may be chargeable directly by hotel management.
              </li>
              <li>
                <strong>Cancellation Policy:</strong> Free cancellation is permitted up to 24 hours prior to the check-in date. Late cancellations or no-shows incur a 1-night tariff penalty.
              </li>
              <li>
                <strong>Festive Gala Supplements:</strong> A mandatory Gala Dinner supplement is charged for stays overlapping Christmas Eve (24th Dec) and New Year&apos;s Eve (31st Dec).
              </li>
              <li>
                <strong>Child Policy:</strong> Children under 6 years of age stay complimentary with parents when using existing bedding. Extra bed or rollaway cot available upon request.
              </li>
            </ul>
          </div>
        </section>

      </div>

      {/* =====================================================================
          11. BOOKING CHECKOUT DRAWER / MODAL
          ===================================================================== */}
      {isCheckoutDrawerOpen && (
        <div className="sr-checkout-backdrop" onClick={() => setIsCheckoutDrawerOpen(false)}>
          <div
            className="sr-checkout-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="sr-checkout-header">
              <div>
                <span className="sr-drawer-kicker">SkyRoute Verified Hotel Reservation</span>
                <h3 className="sr-drawer-hotel-name">{hotel.name}</h3>
              </div>
              <button
                type="button"
                className="sr-drawer-close-btn"
                onClick={() => setIsCheckoutDrawerOpen(false)}
                aria-label="Close reservation drawer"
              >
                ✕
              </button>
            </div>

            {isConfirmed ? (
              /* Success Confirmation Ticket View */
              <div className="sr-drawer-success-view">
                <div className="sr-success-ring">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.8">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="sr-success-heading">Reservation Confirmed!</h3>
                <p className="sr-success-sub">
                  Your hotel booking voucher has been issued and sent to your email.
                </p>

                <div className="sr-ticket-summary-slip">
                  <div className="sr-slip-line">
                    <span>Booking Reference:</span>
                    <strong className="sr-slip-code">{bookingRefId}</strong>
                  </div>
                  <div className="sr-slip-line">
                    <span>Hotel:</span>
                    <strong>{hotel.name}</strong>
                  </div>
                  <div className="sr-slip-line">
                    <span>Category &amp; Plan:</span>
                    <strong>
                      {currentSelectedRoom.name} • {currentSelectedPlan.planName}
                    </strong>
                  </div>
                  <div className="sr-slip-line">
                    <span>Dates of Stay:</span>
                    <strong>{checkInParam} to {checkOutParam}</strong>
                  </div>
                  <div className="sr-slip-line">
                    <span>Guest:</span>
                    <strong>{guestFullName}</strong>
                  </div>
                  <div className="sr-slip-line total">
                    <span>Grand Total Paid:</span>
                    <strong className="sr-green">₹{grandTotal.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="sr-success-actions">
                  <button
                    type="button"
                    className="sr-success-primary-btn"
                    onClick={() => {
                      setIsCheckoutDrawerOpen(false);
                      router.push("/myTrips");
                    }}
                  >
                    View in My Trips
                  </button>
                  <button
                    type="button"
                    className="sr-success-secondary-btn"
                    onClick={() => setIsCheckoutDrawerOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Guest Form & Fare Breakdown */
              <form onSubmit={handleConfirmReservation} className="sr-drawer-form">
                {/* Stay Summary Bar */}
                <div className="sr-drawer-stay-meta">
                  <div className="sr-meta-item">
                    <span className="sr-meta-lbl">Selected Room</span>
                    <strong className="sr-meta-val">{currentSelectedRoom.name}</strong>
                  </div>
                  <div className="sr-meta-item">
                    <span className="sr-meta-lbl">Dates</span>
                    <strong className="sr-meta-val">{checkInParam} → {checkOutParam}</strong>
                  </div>
                  <div className="sr-meta-item">
                    <span className="sr-meta-lbl">Guests</span>
                    <strong className="sr-meta-val">
                      {roomsParam} Room, {adultsParam + childrenParam} Guests
                    </strong>
                  </div>
                </div>

                {/* Primary Guest Details */}
                <div className="sr-drawer-fields-block">
                  <h4 className="sr-fields-block-title">Primary Guest Information</h4>
                  <div className="sr-fields-grid-2">
                    <div className="sr-form-group">
                      <label className="sr-form-label">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={guestFullName}
                        onChange={(e) => setGuestFullName(e.target.value)}
                        className="sr-form-input"
                        placeholder="As shown on passport / Aadhaar"
                      />
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-form-label">Email for Voucher *</label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="sr-form-input"
                        placeholder="yourname@domain.com"
                      />
                    </div>
                  </div>

                  <div className="sr-fields-grid-2">
                    <div className="sr-form-group">
                      <label className="sr-form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="sr-form-input"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="sr-form-group">
                      <label className="sr-form-label">Special Requests (Optional)</label>
                      <input
                        type="text"
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        className="sr-form-input"
                        placeholder="Quiet room, High floor, Early check-in"
                      />
                    </div>
                  </div>
                </div>

                {/* Promo Code Strip */}
                <div className="sr-coupon-apply-wrap">
                  <span className="sr-coupon-label">Have a coupon code?</span>
                  <div className="sr-coupon-input-row">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="e.g. IXIFIRST, AXIS12"
                      className="sr-coupon-input"
                    />
                    <button
                      type="button"
                      className="sr-coupon-apply-btn"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Itemized Price Breakdown */}
                <div className="sr-fare-breakdown-card">
                  <div className="sr-breakdown-line">
                    <span>Base Room Tariff ({roomsParam} {roomsParam === 1 ? "room" : "rooms"})</span>
                    <span>₹{baseTariff.toLocaleString()}</span>
                  </div>
                  <div className="sr-breakdown-line">
                    <span>Hotel Taxes, GST &amp; Service Charges</span>
                    <span>₹{taxesAmount.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="sr-breakdown-line green">
                      <span>Promo Coupon Discount ({appliedCoupon})</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="sr-breakdown-line total">
                    <span>Total Amount Payable</span>
                    <strong className="sr-total-price">₹{grandTotal.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="sr-drawer-actions">
                  <button
                    type="button"
                    className="sr-drawer-cancel-btn"
                    onClick={() => setIsCheckoutDrawerOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sr-drawer-confirm-btn">
                    <span>Confirm &amp; Reserve Room (₹{grandTotal.toLocaleString()})</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          12. FULL PHOTO GALLERY LIGHTBOX MODAL
          ===================================================================== */}
      {isPhotoLightboxOpen && (
        <div className="sr-lightbox-backdrop" onClick={() => setIsPhotoLightboxOpen(false)}>
          <div className="sr-lightbox-container" onClick={(e) => e.stopPropagation()}>
            <div className="sr-lightbox-top-bar">
              <span className="sr-lightbox-title">
                {hotel.name} — Photo {activePhotoIdx + 1} of {allHotelPhotos.length}
              </span>
              <button
                type="button"
                className="sr-lightbox-close"
                onClick={() => setIsPhotoLightboxOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="sr-lightbox-main-view">
              <Image
                src={allHotelPhotos[activePhotoIdx]}
                alt={`Photo ${activePhotoIdx + 1}`}
                fill
                sizes="90vw"
                className="sr-lightbox-img"
              />
              <button
                type="button"
                className="sr-lightbox-arrow left"
                onClick={() =>
                  setActivePhotoIdx((prev) =>
                    prev === 0 ? allHotelPhotos.length - 1 : prev - 1
                  )
                }
              >
                ‹
              </button>
              <button
                type="button"
                className="sr-lightbox-arrow right"
                onClick={() =>
                  setActivePhotoIdx((prev) =>
                    prev === allHotelPhotos.length - 1 ? 0 : prev + 1
                  )
                }
              >
                ›
              </button>
            </div>

            <div className="sr-lightbox-thumb-strip">
              {allHotelPhotos.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`sr-lightbox-thumb-btn ${activePhotoIdx === idx ? "active" : ""}`}
                  onClick={() => setActivePhotoIdx(idx)}
                >
                  <Image src={src} alt={`Thumb ${idx + 1}`} width={60} height={42} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
