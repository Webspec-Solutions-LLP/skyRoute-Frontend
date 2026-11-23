"use client";

import React, { Suspense, useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "./AllHotels.css";

export type StayType = "overnight" | "hourly";
export type SortOption =
  | "popularity"
  | "price-low"
  | "price-high"
  | "rating-high"
  | "discount";

export interface HotelData {
  id: string;
  name: string;
  city: string;
  area: string;
  distance: string;
  starRating: number;
  propertyType: "Hotel" | "Resort" | "Boutique" | "Villa" | "Hostel";
  ratingScore: number;
  ratingLabel: string;
  reviewsCount: number;
  images: string[];
  basePrice: number;
  originalPrice: number;
  taxesAndFees: number;
  roomsLeft: number;
  freeCancellation: boolean;
  freeBreakfast: boolean;
  coupleFriendly: boolean;
  hasPool: boolean;
  hasSpa: boolean;
  amenities: string[];
  couponCode: string;
  couponDiscount: number;
  highlightReview: string;
  isMegaSale?: boolean;
}

const CITIES = [
  "New Delhi",
  "Mumbai",
  "Kolkata",
  "Goa",
  "Bengaluru",
  "Jaipur",
  "Hyderabad",
  "Chennai",
  "Dubai",
];

export const INITIAL_HOTELS: HotelData[] = [
  {
    id: "hotel-1",
    name: "NUO By Justa Heritage Suites",
    city: "New Delhi",
    area: "Greater Kailash",
    distance: "4.5 km from H Nizamuddin (NZM)",
    starRating: 4,
    propertyType: "Hotel",
    ratingScore: 8.8,
    ratingLabel: "Excellent",
    reviewsCount: 658,
    images: [
      "/images/hotel1.png",
      "/images/hotel2.png",
      "/images/hotel5.png",
      "/images/hotel6.png",
    ],
    basePrice: 10983,
    originalPrice: 14100,
    taxesAndFees: 1840,
    roomsLeft: 2,
    freeCancellation: true,
    freeBreakfast: true,
    coupleFriendly: true,
    hasPool: true,
    hasSpa: false,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Helpful staff",
      "24*7 Room Service",
      "Restaurant",
      "Contactless Check-in",
    ],
    couponCode: "IXIFIRST",
    couponDiscount: 755,
    highlightReview:
      "Helpful staff, tasty breakfast buffet and spotless rooms near Humayun's Tomb.",
    isMegaSale: true,
  },
  {
    id: "hotel-2",
    name: "The Hosteller City Center Landmark",
    city: "New Delhi",
    area: "Paharganj",
    distance: "370 m from New Delhi Railway Station (NDLS)",
    starRating: 3,
    propertyType: "Hotel",
    ratingScore: 7.9,
    ratingLabel: "Very Good",
    reviewsCount: 312,
    images: [
      "/images/hotel2.png",
      "/images/hotel3.png",
      "/images/hotel1.png",
      "/images/hotel4.png",
    ],
    basePrice: 3116,
    originalPrice: 10705,
    taxesAndFees: 468,
    roomsLeft: 3,
    freeCancellation: true,
    freeBreakfast: false,
    coupleFriendly: true,
    hasPool: false,
    hasSpa: false,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Free Car Parking",
      "Room Service",
    ],
    couponCode: "IXIWEEKEND",
    couponDiscount: 350,
    highlightReview:
      "Polite, supportive service with a warm stay and express check-in right beside the railway hub.",
    isMegaSale: true,
  },
  {
    id: "hotel-3",
    name: "Gold The Royal with Luxe Rooftop Lounge",
    city: "New Delhi",
    area: "Connaught Place",
    distance: "1.2 km from Shivaji Stadium Metro",
    starRating: 4,
    propertyType: "Hotel",
    ratingScore: 8.6,
    ratingLabel: "Excellent",
    reviewsCount: 789,
    images: [
      "/images/hotel3.png",
      "/images/hotel4.png",
      "/images/hotel2.png",
      "/images/hotel6.png",
    ],
    basePrice: 3940,
    originalPrice: 4638,
    taxesAndFees: 583,
    roomsLeft: 2,
    freeCancellation: true,
    freeBreakfast: true,
    coupleFriendly: true,
    hasPool: false,
    hasSpa: true,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Helpful staff",
      "Rooftop Cafe",
      "Fitness Center",
    ],
    couponCode: "SKYHOTEL",
    couponDiscount: 450,
    highlightReview:
      "Helpful staff, well-kept rooms and delicious food with a stunning sunset rooftop view.",
    isMegaSale: false,
  },
  {
    id: "hotel-4",
    name: "Lemon Tree Premier International Hub",
    city: "Mumbai",
    area: "Andheri East",
    distance: "1.9 km drive to T2 - Chhatrapati Shivaji Airport",
    starRating: 5,
    propertyType: "Resort",
    ratingScore: 9.4,
    ratingLabel: "Exceptional",
    reviewsCount: 1420,
    images: [
      "/images/hotel4.png",
      "/images/hotel5.png",
      "/images/hotel1.png",
      "/images/hotel3.png",
    ],
    basePrice: 8710,
    originalPrice: 12250,
    taxesAndFees: 1560,
    roomsLeft: 4,
    freeCancellation: true,
    freeBreakfast: true,
    coupleFriendly: true,
    hasPool: true,
    hasSpa: true,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Helpful staff",
      "Swimming Pool",
      "Luxury Spa",
      "Airport Shuttle",
    ],
    couponCode: "DEALPANTI",
    couponDiscount: 1200,
    highlightReview:
      "Luxurious stay near Mumbai airport, spacious clean suites, and world-class spa facilities.",
    isMegaSale: true,
  },
  {
    id: "hotel-5",
    name: "Aurika Luxury Airport Resort & Convention",
    city: "Mumbai",
    area: "Andheri East",
    distance: "1.8 km to Terminal 2",
    starRating: 5,
    propertyType: "Resort",
    ratingScore: 9.6,
    ratingLabel: "Exceptional",
    reviewsCount: 890,
    images: [
      "/images/hotel5.png",
      "/images/hotel6.png",
      "/images/hotel2.png",
      "/images/hotel4.png",
    ],
    basePrice: 10487,
    originalPrice: 14750,
    taxesAndFees: 2150,
    roomsLeft: 1,
    freeCancellation: true,
    freeBreakfast: true,
    coupleFriendly: true,
    hasPool: true,
    hasSpa: true,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Helpful staff",
      "Fine Dining",
      "Infinity Pool",
      "Concierge",
    ],
    couponCode: "AURIKA20",
    couponDiscount: 1500,
    highlightReview:
      "Extraordinary architecture, breathtaking views, and courteous staff making check-in effortless.",
    isMegaSale: true,
  },
  {
    id: "hotel-6",
    name: "Townhouse Rosedale Executive Residence",
    city: "Kolkata",
    area: "Newtown",
    distance: "2.6 km from Rabindra Tirtha Station",
    starRating: 4,
    propertyType: "Hotel",
    ratingScore: 8.4,
    ratingLabel: "Very Good",
    reviewsCount: 266,
    images: [
      "/images/hotel6.png",
      "/images/hotel1.png",
      "/images/hotel3.png",
      "/images/hotel5.png",
    ],
    basePrice: 2187,
    originalPrice: 2952,
    taxesAndFees: 390,
    roomsLeft: 2,
    freeCancellation: true,
    freeBreakfast: false,
    coupleFriendly: true,
    hasPool: false,
    hasSpa: false,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Helpful staff",
      "Elevator",
      "Daily Housekeeping",
    ],
    couponCode: "KOLKATA26",
    couponDiscount: 420,
    highlightReview:
      "Peaceful environment in Newtown with spacious bedrooms and fast room service.",
    isMegaSale: true,
  },
  {
    id: "hotel-7",
    name: "Townhouse Allen Park Heritage Boutique",
    city: "Kolkata",
    area: "Park Street",
    distance: "550 m from Park Circus Metro & Mother Teresa Mission",
    starRating: 4,
    propertyType: "Boutique",
    ratingScore: 8.7,
    ratingLabel: "Fabulous",
    reviewsCount: 418,
    images: [
      "/images/hotel1.png",
      "/images/hotel4.png",
      "/images/hotel2.png",
      "/images/hotel6.png",
    ],
    basePrice: 1607,
    originalPrice: 2169,
    taxesAndFees: 280,
    roomsLeft: 3,
    freeCancellation: true,
    freeBreakfast: true,
    coupleFriendly: true,
    hasPool: false,
    hasSpa: false,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Helpful staff",
      "Smart TV",
      "Mini Fridge",
    ],
    couponCode: "PARKSTREET",
    couponDiscount: 300,
    highlightReview:
      "Right in the heart of Kolkata's cultural district. Great value for clean beds and friendly hosts.",
    isMegaSale: false,
  },
  {
    id: "hotel-8",
    name: "Solace Palm Sands Luxury Beach Villa",
    city: "Goa",
    area: "Candolim Beach",
    distance: "200 m walk to Candolim Coast",
    starRating: 5,
    propertyType: "Villa",
    ratingScore: 9.5,
    ratingLabel: "Exceptional",
    reviewsCount: 940,
    images: [
      "/images/hotel3.png",
      "/images/hotel5.png",
      "/images/hotel6.png",
      "/images/hotel1.png",
    ],
    basePrice: 6850,
    originalPrice: 9400,
    taxesAndFees: 980,
    roomsLeft: 2,
    freeCancellation: true,
    freeBreakfast: true,
    coupleFriendly: true,
    hasPool: true,
    hasSpa: true,
    amenities: [
      "Free Wi-Fi",
      "AC rooms",
      "Clean rooms",
      "Essential toiletries",
      "Helpful staff",
      "Private Plunge Pool",
      "Beach Access",
      "Garden Patio",
    ],
    couponCode: "GOAGETAWAY",
    couponDiscount: 1100,
    highlightReview:
      "Paradise in North Goa. Pristine pool, heavenly beds, and courteous staff who arranged bike rentals.",
    isMegaSale: true,
  },
];

const BANK_PROMOS = [
  {
    id: "axis",
    badge: "Flat 12% Off",
    desc: "with Axis Bank Credit Cards + Interest Free EMI",
    code: "AXIS12",
    color: "#e11d48",
  },
  {
    id: "icici",
    badge: "Up to ₹2,500 Off",
    desc: "with ICICI Bank Credit Card Instant Discount",
    code: "ICICIHOTEL",
    color: "#ea580c",
  },
  {
    id: "idfc",
    badge: "Up to ₹2,500 Off",
    desc: "with IDFC FIRST Bank Cards + Zero Cost EMI",
    code: "IDFCFIRST",
    color: "#7c3aed",
  },
  {
    id: "weekend",
    badge: "Flat 85% Off",
    desc: "BREAK BANTA HAI SALE • Code: IXIWEEKEND",
    code: "IXIWEEKEND",
    color: "#0284c7",
  },
  {
    id: "hdfc",
    badge: "Up to ₹3,000 Off",
    desc: "with HDFC Bank SmartBuy Credit Cards",
    code: "HDFCHOTEL",
    color: "#006ce4",
  },
  {
    id: "sbi",
    badge: "Flat 15% Off",
    desc: "SBI Card Festive Bonanza on Luxury Stays",
    code: "SBISPECIAL",
    color: "#059669",
  },
  {
    id: "skyfirst",
    badge: "Flat ₹1,000 Off",
    desc: "SkyRoute New User Exclusive Welcome Coupon",
    code: "SKYFIRST",
    color: "#8b5cf6",
  },
  {
    id: "federal",
    badge: "Up to ₹1,800 Off",
    desc: "with Federal Bank Debit & Credit Cards",
    code: "FEDHOTEL",
    color: "#d97706",
  },
];

function AllHotelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters from URL / Hero
  const initialCity = searchParams.get("city") || "New Delhi";
  const initialStayType = (searchParams.get("stayType") as StayType) || "overnight";
  const initialCheckIn = searchParams.get("checkIn") || "2026-11-23";
  const initialCheckOut = searchParams.get("checkOut") || "2026-11-25";
  const initialRooms = parseInt(searchParams.get("rooms") || "1", 10);
  const initialAdults = parseInt(searchParams.get("adults") || "2", 10);
  const initialChildren = parseInt(searchParams.get("children") || "0", 10);

  // Search bar state
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [stayType, setStayType] = useState<StayType>(initialStayType);
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [rooms, setRooms] = useState(initialRooms);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  // Filter states
  const [textSearch, setTextSearch] = useState("");
  const [bestPriceOnly, setBestPriceOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedStarRating, setSelectedStarRating] = useState<number | null>(null);
  const [selectedPropType, setSelectedPropType] = useState<string | null>(null);
  const [filterFreeCancel, setFilterFreeCancel] = useState(false);
  const [filterFreeBreakfast, setFilterFreeBreakfast] = useState(false);
  const [filterCoupleFriendly, setFilterCoupleFriendly] = useState(false);
  const [filterExceptionalRating, setFilterExceptionalRating] = useState(false);
  const [filterPool, setFilterPool] = useState(false);

  // UI states
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [couponToast, setCouponToast] = useState<string | null>(null);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Map View Modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Refs for dropdown outside click
  const cityDropdownRef = useRef<HTMLDivElement | null>(null);
  const guestDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(target)) {
        setIsCityDropdownOpen(false);
      }
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(target)) {
        setIsGuestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update image carousel index for a hotel card
  const handleNextImage = (hotelId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndices((prev) => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (hotelId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndices((prev) => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const handleThumbnailClick = (hotelId: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndices((prev) => ({ ...prev, [hotelId]: index }));
  };

  const toggleFavorite = (hotelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites((prev) => ({ ...prev, [hotelId]: !prev[hotelId] }));
  };

  const applyBankPromo = (code: string) => {
    setAppliedCoupon(code);
    setCouponToast(`Coupon ${code} applied successfully! Instant savings activated.`);
    setTimeout(() => setCouponToast(null), 3800);
  };

  // Filtered & Sorted Hotel List
  const filteredHotels = useMemo(() => {
    return INITIAL_HOTELS.filter((hotel) => {
      // 1. City / destination check
      if (
        selectedCity &&
        hotel.city.toLowerCase() !== selectedCity.toLowerCase() &&
        !hotel.name.toLowerCase().includes(selectedCity.toLowerCase())
      ) {
        // If searching a specific city, allow general match or fallback
      }

      // 2. Text search within city (hotel name, area, amenities)
      if (textSearch.trim()) {
        const q = textSearch.toLowerCase().trim();
        const matchesName = hotel.name.toLowerCase().includes(q);
        const matchesArea = hotel.area.toLowerCase().includes(q);
        const matchesCity = hotel.city.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesCity) return false;
      }

      // 3. Price Filter
      if (hotel.basePrice > maxPrice) return false;

      // 4. Best price guarantee filter
      if (bestPriceOnly && hotel.basePrice > 4500) return false;

      // 5. Star Rating
      if (selectedStarRating !== null && hotel.starRating !== selectedStarRating) {
        return false;
      }

      // 6. Property Type
      if (selectedPropType !== null && hotel.propertyType !== selectedPropType) {
        return false;
      }

      // 7. Amenities Checkbox Filters
      if (filterFreeCancel && !hotel.freeCancellation) return false;
      if (filterFreeBreakfast && !hotel.freeBreakfast) return false;
      if (filterCoupleFriendly && !hotel.coupleFriendly) return false;
      if (filterExceptionalRating && hotel.ratingScore < 9.0) return false;
      if (filterPool && !hotel.hasPool) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === "price-low") return a.basePrice - b.basePrice;
      if (sortOption === "price-high") return b.basePrice - a.basePrice;
      if (sortOption === "rating-high") return b.ratingScore - a.ratingScore;
      if (sortOption === "discount") {
        const discA = ((a.originalPrice - a.basePrice) / a.originalPrice) * 100;
        const discB = ((b.originalPrice - b.basePrice) / b.originalPrice) * 100;
        return discB - discA;
      }
      return b.reviewsCount - a.reviewsCount; // default "popularity"
    });
  }, [
    selectedCity,
    textSearch,
    maxPrice,
    bestPriceOnly,
    selectedStarRating,
    selectedPropType,
    filterFreeCancel,
    filterFreeBreakfast,
    filterCoupleFriendly,
    filterExceptionalRating,
    filterPool,
    sortOption,
  ]);

  const resetAllFilters = () => {
    setTextSearch("");
    setMaxPrice(15000);
    setBestPriceOnly(false);
    setSelectedStarRating(null);
    setSelectedPropType(null);
    setFilterFreeCancel(false);
    setFilterFreeBreakfast(false);
    setFilterCoupleFriendly(false);
    setFilterExceptionalRating(false);
    setFilterPool(false);
    setSortOption("popularity");
  };

  const handleBookHotel = (hotel: HotelData) => {
    const extraDiscount = appliedCoupon ? 400 : 0;
    const effectivePrice = Math.max(999, hotel.basePrice - extraDiscount);

    const hotelPayload = {
      type: "hotel",
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      area: hotel.area,
      distance: hotel.distance,
      starRating: hotel.starRating,
      propertyType: hotel.propertyType,
      ratingScore: hotel.ratingScore,
      ratingLabel: hotel.ratingLabel,
      reviewsCount: hotel.reviewsCount,
      images: hotel.images,
      basePrice: effectivePrice,
      originalPrice: hotel.originalPrice,
      taxesAndFees: hotel.taxesAndFees,
      amenities: hotel.amenities,
      roomsLeft: hotel.roomsLeft,
      freeCancellation: hotel.freeCancellation,
      freeBreakfast: hotel.freeBreakfast,
      coupleFriendly: hotel.coupleFriendly,
      hasPool: hotel.hasPool,
      hasSpa: hotel.hasSpa,
      couponCode: appliedCoupon || hotel.couponCode,
      couponDiscount: hotel.couponDiscount + extraDiscount,
      highlightReview: hotel.highlightReview,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      rooms: rooms,
      adults: adults,
      children: children,
      stayType: stayType,
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("skyroute_hotel_booking", JSON.stringify(hotelPayload));
      } catch (err) {
        console.error("Failed saving hotel booking to sessionStorage", err);
      }
    }

    const q = new URLSearchParams({
      type: "hotel",
      hotelId: hotel.id,
      hotelName: hotel.name,
      city: hotel.city,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      rooms: String(rooms),
      adults: String(adults),
      children: String(children),
      price: String(effectivePrice),
    });

    router.push(`/bookingDetails?${q.toString()}`);
  };

  return (
    <div className="allhotels-main-wrapper">
      {/* 1. TOP COMMAND SEARCH MODIFICATION BAR (Styled exactly like allTrains) */}
      <section className="allhotels-top-section" aria-label="Modify Hotel Search">
        <div className="allhotels-top-container">
          <div className="allhotels-command-bar">
            {/* Stay Type Toggle: Long Stay vs Hourly Stay */}
            <div className="stay-type-toggle-row">
              <button
                type="button"
                className={`stay-type-pill ${stayType === "overnight" ? "active" : ""}`}
                onClick={() => setStayType("overnight")}
              >
                <span>Long Stay / Overnight</span>
              </button>
              <button
                type="button"
                className={`stay-type-pill ${stayType === "hourly" ? "active" : ""}`}
                onClick={() => setStayType("hourly")}
              >
                <span>Hourly Stay</span>
                <span className="stay-new-badge">NEW</span>
              </button>
            </div>

            {/* Hotel Search Grid Form matching allTrains */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCityDropdownOpen(false);
                setIsGuestDropdownOpen(false);
              }}
              className="allhotels-search-grid"
            >
              {/* Destination Field with Dropdown */}
              <div className="allhotels-input-box dest-box" ref={cityDropdownRef}>
                <span className="allhotels-box-label">City / Destination</span>
                <div className="allhotels-input-inner">
                  <span className="allhotels-pin-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <button
                    type="button"
                    className="allhotels-text-trigger"
                    onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                  >
                    <span className="allhotels-trigger-val">{selectedCity}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {isCityDropdownOpen && (
                  <div className="city-select-popover">
                    <div className="popover-header">Popular Destinations</div>
                    <div className="city-options-list">
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          className={`city-option-item ${selectedCity === city ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedCity(city);
                            setIsCityDropdownOpen(false);
                          }}
                        >
                          <span>{city}</span>
                          {selectedCity === city && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2.6">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Check-In Date */}
              <div className="allhotels-input-box date-box">
                <span className="allhotels-box-label">Check-in</span>
                <div className="allhotels-input-inner">
                  <span className="allhotels-pin-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="allhotels-date-native"
                    aria-label="Check-in date"
                  />
                </div>
              </div>

              {/* Check-Out Date */}
              <div className="allhotels-input-box date-box">
                <span className="allhotels-box-label">Check-out</span>
                <div className="allhotels-input-inner">
                  <span className="allhotels-pin-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="allhotels-date-native"
                    aria-label="Check-out date"
                  />
                </div>
              </div>

              {/* Rooms & Guests */}
              <div className="allhotels-input-box guests-box" ref={guestDropdownRef}>
                <span className="allhotels-box-label">Rooms &amp; Guests</span>
                <div className="allhotels-input-inner">
                  <span className="allhotels-pin-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <button
                    type="button"
                    className="allhotels-text-trigger"
                    onClick={() => setIsGuestDropdownOpen((prev) => !prev)}
                  >
                    <span className="allhotels-trigger-val">
                      {rooms} {rooms === 1 ? "Room" : "Rooms"}, {adults + children} {adults + children === 1 ? "Guest" : "Guests"}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {isGuestDropdownOpen && (
                  <div className="guest-select-popover">
                    <div className="counter-row">
                      <div>
                        <div className="counter-title">Rooms</div>
                        <div className="counter-sub">Minimum 1 room</div>
                      </div>
                      <div className="counter-controls">
                        <button
                          type="button"
                          onClick={() => setRooms((r) => Math.max(1, r - 1))}
                          disabled={rooms <= 1}
                        >
                          -
                        </button>
                        <span>{rooms}</span>
                        <button
                          type="button"
                          onClick={() => setRooms((r) => Math.min(6, r + 1))}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="counter-row">
                      <div>
                        <div className="counter-title">Adults</div>
                        <div className="counter-sub">Age 13+ years</div>
                      </div>
                      <div className="counter-controls">
                        <button
                          type="button"
                          onClick={() => setAdults((a) => Math.max(1, a - 1))}
                          disabled={adults <= 1}
                        >
                          -
                        </button>
                        <span>{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults((a) => Math.min(12, a + 1))}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="counter-row">
                      <div>
                        <div className="counter-title">Children</div>
                        <div className="counter-sub">Age 0–12 years</div>
                      </div>
                      <div className="counter-controls">
                        <button
                          type="button"
                          onClick={() => setChildren((c) => Math.max(0, c - 1))}
                          disabled={children <= 0}
                        >
                          -
                        </button>
                        <span>{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren((c) => Math.min(6, c + 1))}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="popover-done-btn"
                      onClick={() => setIsGuestDropdownOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Update Search Button (Royal Blue matching allTrains) */}
              <button
                type="submit"
                className="allhotels-update-btn"
                onClick={() => {
                  setIsCityDropdownOpen(false);
                  setIsGuestDropdownOpen(false);
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Update Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONAL BANK DISCOUNT TICKER (Screenshot 1 & 3) */}
      <section className="allhotels-promos-section">
        <div className="allhotels-promos-container">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              momentum: true,
            }}
            slidesPerView={1.2}
            spaceBetween={14}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            breakpoints={{
              480: {
                slidesPerView: 1.8,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 14,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 14,
              },
            }}
            className="allhotels-promos-swiper"
          >
            {BANK_PROMOS.map((promo) => (
              <SwiperSlide key={promo.id} className="promo-swiper-slide">
                <div
                  className={`promo-banner-card ${appliedCoupon === promo.code ? "applied" : ""}`}
                  onClick={() => applyBankPromo(promo.code)}
                  title={`Click to apply coupon ${promo.code}`}
                >
                  <div className="promo-badge-tag" style={{ backgroundColor: promo.color }}>
                    {promo.badge}
                  </div>
                  <p className="promo-desc-text">{promo.desc}</p>
                  <span className="promo-apply-chip">
                    {appliedCoupon === promo.code ? "Applied ✓" : "Apply Code"}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Coupon Notification Toast */}
      {couponToast && (
        <div className="allhotels-toast-alert" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.6">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{couponToast}</span>
        </div>
      )}

      {/* 3. MAIN 1320px TWO-COLUMN BODY LAYOUT */}
      <main className="allhotels-body-section">
        <div className="allhotels-body-container">
          
          {/* ==============================================================
              LEFT COLUMN: FILTERS (Screenshots 1, 2, 3, 4, 5)
              ============================================================== */}
          <aside className="allhotels-filters-sidebar">
            
            {/* Creative Interactive Mini-Map Preview Card (Screenshots 1 & 5) */}
            <div
              className="filter-map-card-creative"
              onClick={() => setIsMapModalOpen(true)}
              role="button"
              tabIndex={0}
              title={`Click to open full interactive map of ${selectedCity}`}
            >
              {/* Map Graphic Layer with City Grid, Park, River & Pins */}
              <div className="creative-map-canvas">
                <svg
                  className="creative-map-svg"
                  viewBox="0 0 290 125"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  {/* Terrain base */}
                  <rect width="290" height="125" fill="#f8fafc" />

                  {/* Urban block shapes */}
                  <rect x="12" y="10" width="58" height="38" rx="4" fill="#edf2f7" />
                  <rect x="80" y="8" width="70" height="40" rx="4" fill="#edf2f7" />
                  <rect x="160" y="10" width="118" height="38" rx="4" fill="#edf2f7" />
                  <rect x="12" y="65" width="78" height="48" rx="4" fill="#edf2f7" />
                  <rect x="100" y="65" width="75" height="48" rx="4" fill="#edf2f7" />
                  <rect x="185" y="65" width="93" height="48" rx="4" fill="#edf2f7" />

                  {/* Green park patches */}
                  <path
                    d="M18 16 Q42 10 60 22 T64 42 Q45 46 26 40 Z"
                    fill="#dcfce7"
                    opacity="0.9"
                  />
                  <path
                    d="M115 72 Q140 68 160 76 T155 98 Q132 102 110 94 Z"
                    fill="#dcfce7"
                    opacity="0.9"
                  />

                  {/* Winding Blue River */}
                  <path
                    d="M-5 85 C55 76 85 96 155 55 C205 25 235 34 295 18"
                    stroke="#bae6fd"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />

                  {/* Secondary White Roads */}
                  <line x1="0" y1="28" x2="290" y2="28" stroke="#ffffff" strokeWidth="4.5" />
                  <line x1="0" y1="78" x2="290" y2="78" stroke="#ffffff" strokeWidth="4.5" />
                  <line x1="75" y1="0" x2="75" y2="125" stroke="#ffffff" strokeWidth="4.5" />
                  <line x1="175" y1="0" x2="175" y2="125" stroke="#ffffff" strokeWidth="4.5" />
                  <line x1="250" y1="0" x2="250" y2="125" stroke="#ffffff" strokeWidth="3.5" />

                  {/* Golden Arterial Highway */}
                  <path
                    d="M0 54 Q95 48 145 56 T290 50"
                    stroke="#fde047"
                    strokeWidth="4.5"
                    fill="none"
                  />
                  <path
                    d="M0 54 Q95 48 145 56 T290 50"
                    stroke="#eab308"
                    strokeWidth="2.2"
                    fill="none"
                  />
                </svg>

                {/* Price Markers Scattered on Map Preview */}
                <div className="map-badge-marker marker-pos-1">
                  <span>₹3.1k</span>
                </div>
                <div className="map-badge-marker marker-pos-2">
                  <span>₹8.7k</span>
                </div>
                <div className="map-badge-marker marker-pos-3">
                  <span>₹10.9k</span>
                </div>

                {/* Central Pulsing Landmark Pin with Animated Waves */}
                <div className="map-pulse-landmark">
                  <div className="radar-wave wave-1" />
                  <div className="radar-wave wave-2" />
                  <div className="center-landmark-pin">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        fill="#ef4444"
                      />
                      <circle cx="12" cy="9" r="3.2" fill="#ffffff" />
                    </svg>
                  </div>
                </div>

                {/* SkyMap Tag in corner */}
                <span className="map-copyright-tag">SkyMap © 2026</span>
              </div>

              {/* Interactive Bottom Action Bar */}
              <div className="creative-map-footer">
                <div className="map-footer-text">
                  <div className="map-footer-title">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#006ce4"
                      strokeWidth="2.4"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Explore on Map</span>
                  </div>
                  <span className="map-footer-sub">
                    {filteredHotels.length} verified stays in {selectedCity}
                  </span>
                </div>

                <div className="map-footer-cta">
                  <span>View Map</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Header & Reset */}
            <div className="filters-header-row">
              <h3 className="filters-main-heading">Filters</h3>
              <button
                type="button"
                className="filters-reset-btn"
                onClick={resetAllFilters}
              >
                Reset All
              </button>
            </div>

            {/* Best Price Guarantee Toggle (Screenshot 1) */}
            <div className="filter-block best-price-block">
              <div className="best-price-info">
                <div className="best-price-tag">
                  <span className="currency-symbol">₹</span>
                  <span>Best Price Guarantee</span>
                </div>
                <span className="best-price-sub">Cheapest verified rates</span>
              </div>
              <label className="switch-toggle" aria-label="Toggle best price guarantee">
                <input
                  type="checkbox"
                  checked={bestPriceOnly}
                  onChange={(e) => setBestPriceOnly(e.target.checked)}
                />
                <span className="slider-round" />
              </label>
            </div>

            {/* Search within City / Locality (Screenshot 1) */}
            <div className="filter-block">
              <label className="filter-label" htmlFor="hotel-search-input">
                Search within {selectedCity}
              </label>
              <div className="filter-input-wrap">
                <svg
                  className="filter-search-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  id="hotel-search-input"
                  type="text"
                  placeholder="Area, landmark or hotel name..."
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                  className="filter-text-input"
                />
                {textSearch && (
                  <button
                    type="button"
                    className="clear-text-btn"
                    onClick={() => setTextSearch("")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Price Histogram & Dual Range Slider (Screenshot 2) */}
            <div className="filter-block">
              <div className="filter-label-row">
                <span className="filter-label">Price per night</span>
                <span className="filter-val-pill">Up to ₹{maxPrice.toLocaleString()}</span>
              </div>

              {/* Price Distribution Histogram Bars */}
              <div className="price-histogram-wrap" aria-hidden="true">
                {[12, 28, 45, 62, 54, 40, 75, 48, 35, 26, 20, 15, 18, 12, 8, 10, 6, 8, 4, 3].map(
                  (heightPct, idx) => (
                    <div
                      key={idx}
                      className="histogram-bar"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: (idx / 20) * 15000 <= maxPrice ? "#006ce4" : "#cbd5e1",
                      }}
                    />
                  )
                )}
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                className="price-range-slider"
                aria-label="Filter maximum price per night"
              />
              <div className="price-minmax-labels">
                <span>₹1,000</span>
                <span>₹7,500</span>
                <span>₹15,000+</span>
              </div>
            </div>

            {/* Most Popular Filters (Checkboxes with counts) (Screenshot 2 & 4) */}
            <div className="filter-block">
              <span className="filter-label">Popular Filters</span>
              <div className="filter-checkbox-list">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filterFreeCancel}
                    onChange={(e) => setFilterFreeCancel(e.target.checked)}
                  />
                  <span className="check-box-custom" />
                  <span className="check-text">Free Cancellation</span>
                  <span className="check-count">740</span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filterFreeBreakfast}
                    onChange={(e) => setFilterFreeBreakfast(e.target.checked)}
                  />
                  <span className="check-box-custom" />
                  <span className="check-text">Free Breakfast</span>
                  <span className="check-count">912</span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filterCoupleFriendly}
                    onChange={(e) => setFilterCoupleFriendly(e.target.checked)}
                  />
                  <span className="check-box-custom" />
                  <span className="check-text">Couple Friendly</span>
                  <span className="check-count">85</span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filterExceptionalRating}
                    onChange={(e) => setFilterExceptionalRating(e.target.checked)}
                  />
                  <span className="check-box-custom" />
                  <span className="check-text">Rated Exceptional (9+)</span>
                  <span className="check-count">169</span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={filterPool}
                    onChange={(e) => setFilterPool(e.target.checked)}
                  />
                  <span className="check-box-custom" />
                  <span className="check-text">Swimming Pool &amp; Spa</span>
                  <span className="check-count">124</span>
                </label>
              </div>
            </div>

            {/* Star Rating Filter (Screenshot 3) */}
            <div className="filter-block">
              <span className="filter-label">Star Rating</span>
              <div className="pill-filter-grid">
                {[
                  { stars: 5, label: "5 Star", count: 63 },
                  { stars: 4, label: "4 Star", count: 376 },
                  { stars: 3, label: "3 Star", count: 1336 },
                  { stars: 2, label: "2 Star", count: 169 },
                ].map((item) => (
                  <button
                    key={item.stars}
                    type="button"
                    className={`pill-filter-btn ${selectedStarRating === item.stars ? "active" : ""}`}
                    onClick={() =>
                      setSelectedStarRating((prev) =>
                        prev === item.stars ? null : item.stars
                      )
                    }
                  >
                    <span>{item.label}</span>
                    <span className="pill-count">({item.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accommodation Type (Screenshot 3) */}
            <div className="filter-block">
              <span className="filter-label">Accommodation Type</span>
              <div className="pill-filter-grid">
                {[
                  { type: "Hotel", count: 1768 },
                  { type: "Resort", count: 64 },
                  { type: "Boutique", count: 82 },
                  { type: "Villa", count: 31 },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    className={`pill-filter-btn ${selectedPropType === item.type ? "active" : ""}`}
                    onClick={() =>
                      setSelectedPropType((prev) =>
                        prev === item.type ? null : item.type
                      )
                    }
                  >
                    <span>{item.type}</span>
                    <span className="pill-count">({item.count})</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* ==============================================================
              RIGHT COLUMN: RESULTS LISTING (Screenshots 1, 3, 4, 5)
              ============================================================== */}
          <section className="allhotels-results-content">
            
            {/* Header: Results Count + Sort Dropdown */}
            <div className="results-header-bar">
              <div className="results-title-group">
                <h1 className="results-main-title">
                  Hotels in <span className="results-city-highlight">{selectedCity}</span>
                </h1>
                <span className="results-count-badge">
                  Showing {filteredHotels.length} verified {filteredHotels.length === 1 ? "property" : "properties"}
                </span>
              </div>

              {/* Sort By Dropdown */}
              <div className="sort-dropdown-wrap">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <div className="select-with-arrow">
                  <select
                    id="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="sort-native-select"
                  >
                    <option value="popularity">Popularity (Most Booked)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating-high">User Rating: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                  <svg
                    className="select-chevron"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Empty State when filters return 0 results */}
            {filteredHotels.length === 0 && (
              <div className="allhotels-empty-card">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
                  <path d="M12 4v6" />
                  <path d="M2 18h20" />
                </svg>
                <h3 className="empty-title">No hotels match your current filters</h3>
                <p className="empty-sub">Try increasing your maximum price or clearing star-rating filters.</p>
                <button type="button" className="empty-reset-btn" onClick={resetAllFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* List of Hotel Cards */}
            <div className="hotels-cards-list">
              {filteredHotels.map((hotel) => {
                const currentImgIdx = activeImageIndices[hotel.id] || 0;
                const currentImgSrc = hotel.images[currentImgIdx] || hotel.images[0];
                const isFavorite = Boolean(favorites[hotel.id]);
                const isExpanded = expandedDetailsId === hotel.id;

                // Dynamic extra savings if a promo is applied
                const extraDiscount = appliedCoupon ? 400 : 0;
                const effectivePrice = Math.max(999, hotel.basePrice - extraDiscount);
                const discountPercent = Math.round(
                  ((hotel.originalPrice - effectivePrice) / hotel.originalPrice) * 100
                );

                return (
                  <article key={hotel.id} className="hotel-listing-card">
                    
                    {/* Top Mega Sale banner if active */}
                    {hotel.isMegaSale && (
                      <div className="card-top-promo-ribbon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>MEGA SALE • Special Price for Limited Time Only!</span>
                      </div>
                    )}

                    <div className="card-main-grid">
                      {/* Left: Multi-Image Carousel with Thumbnails (Screenshots 1, 4, 5) */}
                      <div className="hotel-gallery-col">
                        <div className="gallery-primary-frame">
                          <Image
                            src={currentImgSrc}
                            alt={`${hotel.name} - View ${currentImgIdx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="gallery-primary-img"
                            priority={hotel.id === "hotel-1"}
                          />

                          {/* Wishlist Heart Button */}
                          <button
                            type="button"
                            className={`gallery-heart-btn ${isFavorite ? "is-fav" : ""}`}
                            onClick={(e) => toggleFavorite(hotel.id, e)}
                            aria-label="Add to wishlist"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={isFavorite ? "#ef4444" : "none"}
                              stroke={isFavorite ? "#ef4444" : "#ffffff"}
                              strokeWidth="2.2"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>

                          {/* Navigation Arrows */}
                          <button
                            type="button"
                            className="gallery-arrow-btn left"
                            onClick={(e) => handlePrevImage(hotel.id, hotel.images.length, e)}
                            aria-label="Previous photo"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className="gallery-arrow-btn right"
                            onClick={(e) => handleNextImage(hotel.id, hotel.images.length, e)}
                            aria-label="Next photo"
                          >
                            ›
                          </button>

                          {/* Slide counter pill (e.g. 1/4) */}
                          <span className="gallery-counter-pill">
                            {currentImgIdx + 1}/{hotel.images.length}
                          </span>
                        </div>

                        {/* Multi-thumbnail strip below image (Screenshot 4) */}
                        <div className="gallery-thumbnails-strip">
                          {hotel.images.map((thumbSrc, tIdx) => (
                            <button
                              key={tIdx}
                              type="button"
                              className={`thumbnail-btn ${currentImgIdx === tIdx ? "active" : ""}`}
                              onClick={(e) => handleThumbnailClick(hotel.id, tIdx, e)}
                              aria-label={`View photo ${tIdx + 1}`}
                            >
                              <Image
                                src={thumbSrc}
                                alt={`Thumbnail ${tIdx + 1}`}
                                width={60}
                                height={42}
                                className="thumbnail-img"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Middle: Details & Reviews (Screenshots 1, 3, 4, 5) */}
                      <div className="hotel-info-col">
                        <div className="hotel-headline-row">
                          <h2 className="hotel-card-title">{hotel.name}</h2>
                          <div className="hotel-stars-wrap" aria-label={`${hotel.starRating} stars`}>
                            {Array.from({ length: hotel.starRating }).map((_, sIdx) => (
                              <svg key={sIdx} width="13" height="13" viewBox="0 0 24 24" fill="#facc15">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        <div className="hotel-location-line">
                          <span className="area-name">{hotel.area}</span>
                          <span className="dot-sep">•</span>
                          <span className="distance-info">{hotel.distance}</span>
                        </div>

                        {/* Guest Rating Score Badge (e.g. 8.8 Excellent • 658 Ratings) */}
                        <div className="hotel-rating-row">
                          <span className="rating-score-box">{hotel.ratingScore}</span>
                          <span className="rating-word">{hotel.ratingLabel}</span>
                          <span className="dot-sep">•</span>
                          <span className="reviews-count-text">
                            {hotel.reviewsCount} verified reviews
                          </span>
                        </div>

                        {/* Verified Perks Checklist */}
                        <div className="hotel-perks-checklist">
                          {hotel.freeCancellation && (
                            <span className="perk-chip green">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Free Cancellation
                            </span>
                          )}
                          {hotel.freeBreakfast && (
                            <span className="perk-chip green">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Free Breakfast Included
                            </span>
                          )}
                          {hotel.coupleFriendly && (
                            <span className="perk-chip blue">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              Couple Friendly
                            </span>
                          )}
                        </div>

                        {/* Amenities Tags Row */}
                        <div className="hotel-amenities-tags">
                          {hotel.amenities.slice(0, 5).map((amenity, aIdx) => (
                            <span key={aIdx} className="amenity-chip">
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 5 && (
                            <span className="amenity-more-chip">
                              +{hotel.amenities.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* Testimonial Quote */}
                        <p className="hotel-review-snippet">
                          <span className="quote-icon">&ldquo;</span>
                          {hotel.highlightReview}
                        </p>
                      </div>

                      {/* Right: Pricing, Urgency, & CTA (Screenshots 1, 3, 4, 5) */}
                      <div className="hotel-pricing-col">
                        {hotel.roomsLeft <= 3 && (
                          <div className="urgency-rooms-badge">
                            <span className="pulse-dot" />
                            <span>Only {hotel.roomsLeft} rooms left!</span>
                          </div>
                        )}

                        <div className="price-stack">
                          <div className="struck-price-row">
                            <span className="struck-price">
                              ₹{hotel.originalPrice.toLocaleString()}
                            </span>
                            <span className="discount-pct-badge">
                              {discountPercent}% OFF
                            </span>
                          </div>

                          <div className="final-price-row">
                            <span className="currency-prefix">₹</span>
                            <span className="final-price-num">
                              {effectivePrice.toLocaleString()}
                            </span>
                          </div>

                          <span className="taxes-note">
                            + ₹{hotel.taxesAndFees.toLocaleString()} taxes &amp; fees / night
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="cta-buttons-stack">
                          <button
                            type="button"
                            className="hotel-book-btn"
                            onClick={() => handleBookHotel(hotel)}
                          >
                            <span>Book Now</span>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            className="hotel-details-toggle-btn"
                            onClick={() =>
                              setExpandedDetailsId((prev) => (prev === hotel.id ? null : hotel.id))
                            }
                          >
                            {isExpanded ? "Hide Details ▴" : "View Details ▾"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Applied Coupon Banner at Card Footer (Screenshots 1 & 3) */}
                    <div className="card-coupon-footer">
                      <div className="coupon-footer-left">
                        <span className="coupon-leaf-icon">🏷️</span>
                        <span>
                          Extra discount of ₹{hotel.couponDiscount + extraDiscount} included. Coupon code{" "}
                          <strong>{appliedCoupon || hotel.couponCode}</strong> applied!
                        </span>
                      </div>
                      <span className="coupon-guarantee-note">Instant Confirmation</span>
                    </div>

                    {/* Expanded Details Accordion */}
                    {isExpanded && (
                      <div className="card-expanded-accordion">
                        <div className="expanded-tabs-row">
                          <span className="expanded-tab active">Overview &amp; Amenities</span>
                        </div>

                        <div className="expanded-content-grid">
                          <div>
                            <h4 className="expanded-subtitle">All Room Amenities</h4>
                            <div className="expanded-amenities-list">
                              {hotel.amenities.map((item, idx) => (
                                <div key={idx} className="expanded-amenity-item">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006ce4" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="expanded-subtitle">Hotel Policies</h4>
                            <ul className="expanded-policies-list">
                              <li>Check-in: 12:00 PM | Check-out: 11:00 AM</li>
                              <li>Free cancellation up to 24 hours before check-in.</li>
                              <li>Valid Government ID required at reception (Aadhaar / Passport / DL).</li>
                              <li>Complimentary high-speed Wi-Fi provided in all suites.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      {/* 4. EXPLORE ON MAP MODAL */}
      {isMapModalOpen && (
        <div className="allhotels-modal-backdrop" onClick={() => setIsMapModalOpen(false)}>
          <div
            className="allhotels-modal-window map-modal-window"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-header-titles">
                <span className="modal-header-kicker">Interactive Location Map</span>
                <h3 className="modal-hotel-name">Hotels in {selectedCity}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsMapModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="map-modal-canvas">
              {/* Simulated Map Visual Grid with Pulsing Pins */}
              <div className="map-grid-bg">
                {filteredHotels.slice(0, 6).map((h, idx) => {
                  const offsets = [
                    { top: "35%", left: "42%" },
                    { top: "55%", left: "60%" },
                    { top: "28%", left: "68%" },
                    { top: "68%", left: "32%" },
                    { top: "44%", left: "78%" },
                    { top: "72%", left: "55%" },
                  ];
                  const pos = offsets[idx % offsets.length];
                  return (
                    <div
                      key={h.id}
                      className="map-hotel-pin-marker"
                      style={{ top: pos.top, left: pos.left }}
                      onClick={() => {
                        setIsMapModalOpen(false);
                        handleBookHotel(h);
                      }}
                    >
                      <div className="pin-price-pill">₹{h.basePrice.toLocaleString()}</div>
                      <div className="pin-stem" />
                    </div>
                  );
                })}
              </div>

              <div className="map-modal-notice">
                <span>📍 Click any price marker to reserve that property directly!</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AllHotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="allhotels-loading-screen">
          <div className="allhotels-loading-spinner" />
          <p>Searching verified hotels &amp; best rates...</p>
        </div>
      }
    >
      <AllHotelsContent />
    </Suspense>
  );
}
