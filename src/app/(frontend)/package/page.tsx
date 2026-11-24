"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import PackageDetails from "@/components/modals/packageDetails/PackageDetails";
import "./Package.css";

// Package Type Definition
interface PackageItem {
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

// Curated Tour Packages Data
const PACKAGES_DATA: PackageItem[] = [
  {
    id: "pkg-kashmir",
    title: "Magical Kashmir Paradise: Srinagar, Gulmarg & Pahalgam",
    destination: "Kashmir",
    stateOrCountry: "Jammu & Kashmir",
    category: "hills",
    duration: "5N / 6D",
    nights: 5,
    days: 6,
    rating: 4.9,
    reviewsCount: 428,
    badge: "Bestseller",
    badgeType: "bestseller",
    image: "/images/location4.webp",
    originalPrice: 32000,
    price: 24999,
    inclusions: {
      flights: true,
      hotels: "4★ Premium Stay & Deluxe Houseboat",
      meals: "Breakfast & Dinner Included",
      transfers: "Private AC Sedan / SUV",
      sightseeing: true,
    },
    highlights: [
      "1 Night Luxury Dal Lake Houseboat with Shikara Ride",
      "Gulmarg Gondola Phase 1 & 2 Cable Car Excursion",
      "Betaab Valley & Aru Valley Tour in Pahalgam",
      "Chauffeur-driven Private Cab for all Sightseeing",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar & Dal Lake Houseboat Experience",
        description: "Warm welcome at Srinagar Airport. Transfer to your traditional luxury Dal Lake houseboat. Enjoy a romantic 1-hour sunset Shikara ride followed by authentic Kashmiri dinner.",
      },
      {
        day: 2,
        title: "Srinagar to Gulmarg Day Trip (Meadow of Flowers)",
        description: "Drive through pine-clad hills to Gulmarg. Experience the world's second-highest Gondola ride overlooking snow-capped Apharwat peaks. Return to Srinagar hotel.",
      },
      {
        day: 3,
        title: "Srinagar to Pahalgam (Valley of Shepherds)",
        description: "Scenic drive passing saffron fields and Avantipur ruins. Check in at riverside luxury resort. Visit the Lidder riverfront and local market.",
      },
      {
        day: 4,
        title: "Pahalgam Local Sightseeing: Betaab & Chandanwari",
        description: "Explore Betaab Valley, Aru Valley, and Chandanwari by private local union cab. Evening bonfire at the resort.",
      },
      {
        day: 5,
        title: "Pahalgam to Srinagar & Mughal Gardens Tour",
        description: "Return to Srinagar. Visit famous Mughal heritage sites: Shalimar Bagh, Nishat Bagh, and the historic Shankaracharya Temple. Shop for authentic dry fruits and Pashmina.",
      },
      {
        day: 6,
        title: "Departure from Srinagar",
        description: "Breakfast at hotel. Private airport drop with unforgettable Himalayan memories.",
      },
    ],
  },
  {
    id: "pkg-goa",
    title: "Goa Beachfront Bliss: North & South Goa Extravaganza",
    destination: "Goa",
    stateOrCountry: "Goa",
    category: "beach",
    duration: "4N / 5D",
    nights: 4,
    days: 5,
    rating: 4.8,
    reviewsCount: 560,
    badge: "Trending",
    badgeType: "trending",
    image: "/images/location1.webp",
    originalPrice: 24500,
    price: 18499,
    inclusions: {
      flights: true,
      hotels: "5★ Beachfront Resort with Pool",
      meals: "Daily Buffet Breakfast Included",
      transfers: "Private AC Cab with Airport Pickup",
      sightseeing: true,
    },
    highlights: [
      "Stay in Calangute / Candolim with Direct Beach Access",
      "Luxury Mandovi River Cruise with Goan Folk Dance",
      "North Goa Fort Aguada, Chapora Fort & Watersports",
      "South Goa Old Churches & Mangueshi Temple Tour",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goa & Beachfront Relaxation",
        description: "Airport pickup in private cab. Check in at your luxury resort. Relax by the infinity pool and stroll along Calangute Beach at sunset.",
      },
      {
        day: 2,
        title: "North Goa Forts, Beaches & Nightlife",
        description: "Tour Fort Aguada, Sinquerim Beach, Chapora Fort, and Anjuna Beach. Optional parasailing and jet-skiing. Evening at Tito's Lane or beach shacks.",
      },
      {
        day: 3,
        title: "South Goa Heritage & Evening Mandovi Cruise",
        description: "Visit Basilica of Bom Jesus, Se Cathedral, and Mangueshi Temple. Enjoy an evening 1-hour sunset cruise on Mandovi River with live DJ and folk music.",
      },
      {
        day: 4,
        title: "Dudhsagar Waterfall or Island Day Tour",
        description: "Full day excursion to the majestic Dudhsagar Waterfalls via jungle jeep safari, or take a scenic catamaran cruise to Grand Island with snorkeling.",
      },
      {
        day: 5,
        title: "Souvenir Shopping & Airport Departure",
        description: "Leisurely breakfast. Buy famous cashews, feni, and Goan spices before airport transfer.",
      },
    ],
  },
  {
    id: "pkg-dubai",
    title: "Dazzling Dubai & Desert Safari Extravaganza",
    destination: "Dubai",
    stateOrCountry: "United Arab Emirates",
    category: "international",
    duration: "5N / 6D",
    nights: 5,
    days: 6,
    rating: 4.9,
    reviewsCount: 389,
    badge: "International",
    badgeType: "international",
    image: "/images/location2.webp",
    originalPrice: 62000,
    price: 49999,
    inclusions: {
      flights: true,
      hotels: "4★ Downtown Hotel with Rooftop Pool",
      meals: "Daily Breakfast + Desert Safari BBQ Dinner",
      transfers: "All Shared & Private City Transfers + UAE Visa",
      sightseeing: true,
    },
    highlights: [
      "Burj Khalifa 124th Floor Observation Deck Tickets",
      "Premium 4x4 Dune Bashing Desert Safari with BBQ",
      "Dubai Marina Luxury Dhow Cruise with International Buffet",
      "Dubai Frame, Miracle Garden & Global Village Access",
    ],
    itinerary: [
      {
        day: 1,
        title: "Welcome to Dubai & Marina Dhow Cruise",
        description: "Arrive at Dubai International Airport. Smooth transfer to hotel. In the evening, board a 2-hour Marina Dhow Cruise with illuminated skyline views and buffet dinner.",
      },
      {
        day: 2,
        title: "Dubai City Tour & Burj Khalifa At The Top",
        description: "Half-day guided city tour covering Palm Jumeirah, Burj Al Arab photo stop, Dubai Frame. Evening visit to Dubai Mall and 124th floor of Burj Khalifa with Dubai Fountain Show.",
      },
      {
        day: 3,
        title: "Thrilling Desert Safari with BBQ & Tanoura Show",
        description: "Morning at leisure. Afternoon 4x4 Land Cruiser desert safari with red dune bashing, camel riding, sandboarding, Henna tattooing, fire show, and Arabic BBQ dinner.",
      },
      {
        day: 4,
        title: "Miracle Garden & Global Village Extravaganza",
        description: "Visit the world's largest natural flower garden with 150 million blossoms, followed by cultural pavilions, shopping, and food at Global Village.",
      },
      {
        day: 5,
        title: "Abu Dhabi Day Tour: Sheikh Zayed Mosque & Louvre",
        description: "Full day excursion to Abu Dhabi. Marvel at the grand Sheikh Zayed Grand Mosque, Emirates Palace, and Ferrari World photo stop.",
      },
      {
        day: 6,
        title: "Duty-Free Shopping & Return Flight",
        description: "Morning shopping at Gold Souk & Meena Bazaar. Transfer to airport for your onward journey.",
      },
    ],
  },
  {
    id: "pkg-kerala",
    title: "Kerala Serenade: Munnar, Thekkady & Alleppey Houseboat",
    destination: "Kerala",
    stateOrCountry: "Kerala",
    category: "hills",
    duration: "5N / 6D",
    nights: 5,
    days: 6,
    rating: 4.9,
    reviewsCount: 312,
    badge: "Top Rated",
    badgeType: "bestseller",
    image: "/images/location5.webp",
    originalPrice: 29999,
    price: 22899,
    inclusions: {
      flights: true,
      hotels: "4★ Hill Resorts & Deluxe Private Houseboat",
      meals: "All Meals on Houseboat + Daily Breakfast",
      transfers: "Private Dedicated Chauffeur Driven Cab",
      sightseeing: true,
    },
    highlights: [
      "2 Nights in Misty Munnar with Tea Plantation Tours",
      "Periyar Wildlife Sanctuary Boating in Thekkady",
      "Overnight Cruise in Traditional Alleppey Backwater Houseboat",
      "Cheeyappara & Valara Waterfalls en-route",
    ],
    itinerary: [
      {
        day: 1,
        title: "Cochin Arrival & Scenic Drive to Munnar",
        description: "Pickup from Cochin Airport. Drive through aromatic spice plantations and scenic waterfalls to Munnar. Check-in at mountain resort.",
      },
      {
        day: 2,
        title: "Munnar Tea Gardens & Eravikulam National Park",
        description: "Visit Eravikulam National Park (home to Nilgiri Tahr), Tata Tea Museum, Mattupetty Dam, and Echo Point. Enjoy fresh cardamom tea.",
      },
      {
        day: 3,
        title: "Munnar to Thekkady (Wildlife & Spice Tour)",
        description: "Drive to Thekkady. Visit natural spice plantations. Enjoy Kathakali dance and Kalaripayattu martial arts show in the evening.",
      },
      {
        day: 4,
        title: "Thekkady to Alleppey Houseboat Check-in",
        description: "Board your private houseboat in Alleppey by 12:00 PM. Cruise through palm-fringed canals, paddy fields, and backwater villages with freshly prepared authentic Kerala meals.",
      },
      {
        day: 5,
        title: "Alleppey to Cochin Sightseeing",
        description: "Disembark after breakfast. Drive to Fort Kochi. Visit Chinese Fishing Nets, Mattancherry Palace, and Jewish Synagogue.",
      },
      {
        day: 6,
        title: "Departure from Cochin",
        description: "Leisure morning and transfer to Cochin Airport for departure.",
      },
    ],
  },
  {
    id: "pkg-bali",
    title: "Tropical Bali & Nusa Penida Island Dream Gateway",
    destination: "Bali",
    stateOrCountry: "Indonesia",
    category: "international",
    duration: "6N / 7D",
    nights: 6,
    days: 7,
    rating: 4.9,
    reviewsCount: 275,
    badge: "Trending International",
    badgeType: "international",
    image: "/images/location3.webp",
    originalPrice: 54000,
    price: 42500,
    inclusions: {
      flights: true,
      hotels: "Private Pool Villa in Ubud & Beach Resort in Seminyak",
      meals: "Daily Floating Breakfast + Sunset Beach Dinner",
      transfers: "Private AC Vehicle + Fast Boat to Nusa Penida",
      sightseeing: true,
    },
    highlights: [
      "Private Pool Villa Stay in Cultural Ubud",
      "Full Day Nusa Penida Island Tour with Kelingking Beach",
      "Famous Bali Jungle Swing & Tegalalang Rice Terraces",
      "Tanah Lot Sunset Temple & Uluwatu Kecak Fire Dance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Denpasar Arrival & Private Villa Check-in",
        description: "Welcome flower garland greeting at Ngurah Rai International Airport. Transfer to your luxury private pool villa in Ubud.",
      },
      {
        day: 2,
        title: "Ubud Culture, Jungle Swing & Kintamani Volcano",
        description: "Soar over lush ravines on the famous Bali Jungle Swing. Explore Tegalalang Rice Terraces, coffee plantations, and Mount Batur volcano view.",
      },
      {
        day: 3,
        title: "Pristine Nusa Penida Island Speedboat Day Tour",
        description: "Board speedboat to Nusa Penida. Visit the iconic T-Rex shaped Kelingking Beach, Broken Beach, Angel's Billabong, and Crystal Bay.",
      },
      {
        day: 4,
        title: "Waterfalls & Transfer to Seminyak Beach",
        description: "Visit Tegenungan Waterfall and Monkey Forest. Transfer to Seminyak beachside resort. Evening sunset at Finns Beach Club.",
      },
      {
        day: 5,
        title: "Watersports & Uluwatu Sunset Temple",
        description: "Morning banana boat and parasailing at Tanjung Benoa. Sunset visit to cliffside Uluwatu Temple with dramatic Kecak fire dance performance.",
      },
      {
        day: 6,
        title: "Tanah Lot Temple & Balinese Spa Day",
        description: "Enjoy a rejuvenating 2-hour authentic Balinese body massage. Evening visit to the magnificent sea temple Tanah Lot.",
      },
      {
        day: 7,
        title: "Departure from Bali",
        description: "Floating breakfast in villa pool. Transfer to airport for flight home.",
      },
    ],
  },
  {
    id: "pkg-rajasthan",
    title: "Royal Rajasthan: Jaipur, Jodhpur & Udaipur Palaces",
    destination: "Rajasthan",
    stateOrCountry: "Rajasthan",
    category: "heritage",
    duration: "6N / 7D",
    nights: 6,
    days: 7,
    rating: 4.8,
    reviewsCount: 290,
    badge: "Heritage Pick",
    badgeType: "luxury",
    image: "/images/location6.webp",
    originalPrice: 35000,
    price: 27499,
    inclusions: {
      flights: true,
      hotels: "Heritage Haveli & 4★ Boutique Hotels",
      meals: "Daily Traditional Rajasthani Breakfast & Dinner",
      transfers: "Private AC Sedan with Verified Driver",
      sightseeing: true,
    },
    highlights: [
      "Amber Fort Jeep / Elephant Ride & Hawa Mahal in Jaipur",
      "Mehrangarh Fort & Umaid Bhawan Palace in the Blue City",
      "Romantic Lake Pichola Sunset Boat Cruise in Udaipur",
      "Traditional Rajasthani Cultural Folk Performance & Dinner",
    ],
    itinerary: [
      {
        day: 1,
        title: "Jaipur Arrival & Pink City Sightseeing",
        description: "Arrive in Jaipur. Check in at heritage hotel. Visit Birla Temple and enjoy sunset shopping at Johari & Bapu Bazaar.",
      },
      {
        day: 2,
        title: "Amber Fort, City Palace & Hawa Mahal",
        description: "Morning ascent to Amber Fort. Stop by Jal Mahal. Explore Maharaja's City Palace and Jantar Mantar observatory.",
      },
      {
        day: 3,
        title: "Jaipur to Jodhpur via Pushkar",
        description: "Drive to Jodhpur with a stop at Brahma Temple in holy Pushkar. Arrive in Jodhpur and explore clock tower and blue alleys.",
      },
      {
        day: 4,
        title: "Mehrangarh Fort & Drive to Udaipur",
        description: "Tour the colossal Mehrangarh Fort and Jaswant Thada. Scenic drive through Aravalli hills to Udaipur, the City of Lakes.",
      },
      {
        day: 5,
        title: "Udaipur City Palace & Lake Pichola Cruise",
        description: "Marvel at the majestic City Palace complex and Saheliyon Ki Bari. Enjoy a peaceful sunset boat ride on Lake Pichola with views of Lake Palace.",
      },
      {
        day: 6,
        title: "Monsoon Palace & Bagore Ki Haveli Folk Show",
        description: "Panoramic vistas from Sajjangarh Monsoon Palace. Evening Dharohar folk dance show at Bagore Ki Haveli.",
      },
      {
        day: 7,
        title: "Departure from Udaipur",
        description: "Breakfast at hotel. Transfer to Udaipur Airport for flight home.",
      },
    ],
  },
  {
    id: "pkg-himachal",
    title: "Himachal Highlands: Shimla, Manali & Solang Valley",
    destination: "Himachal",
    stateOrCountry: "Himachal Pradesh",
    category: "hills",
    duration: "5N / 6D",
    nights: 5,
    days: 6,
    rating: 4.8,
    reviewsCount: 380,
    badge: "Family Favorite",
    badgeType: "bestseller",
    image: "/images/location7.webp",
    originalPrice: 28000,
    price: 21999,
    inclusions: {
      flights: true,
      hotels: "4★ Valley View Mountain Resorts",
      meals: "Buffet Breakfast & Dinner Included",
      transfers: "Private AC Cab for all Hill Transfers",
      sightseeing: true,
    },
    highlights: [
      "2 Nights Shimla Mall Road & Kufri Snow Point Excursion",
      "3 Nights Manali with Solang Valley & Atal Tunnel Visit",
      "Visit Historic Hadimba Temple & Vashisht Hot Springs",
      "River Rafting & Paragliding in Kullu Valley",
    ],
    itinerary: [
      {
        day: 1,
        title: "Chandigarh Arrival & Scenic Drive to Shimla",
        description: "Pickup from Chandigarh Airport. Drive through the picturesque Shivalik ranges to Shimla. Evening walk on Ridge and Mall Road.",
      },
      {
        day: 2,
        title: "Shimla & Kufri Winter Wonderland Excursion",
        description: "Drive to Kufri. Enjoy yak rides, go-karting, and panoramic views of Himalayan peaks. Visit Jakhoo Temple in the afternoon.",
      },
      {
        day: 3,
        title: "Shimla to Manali via Kullu Valley",
        description: "Scenic 7-hour drive along the roaring Beas river. Stop for river rafting and shawls shopping in Kullu. Check-in at Manali resort.",
      },
      {
        day: 4,
        title: "Solang Valley Adventure & Atal Tunnel",
        description: "Full day at Solang Valley. Enjoy zorbing, quad biking, and cable car rides. Drive through the world-famous Atal Tunnel to Sissu.",
      },
      {
        day: 5,
        title: "Manali Local Sightseeing: Hadimba & Old Manali",
        description: "Visit Hadimba Devi wooden temple, Vashisht thermal hot springs, Tibetan Monastery, and cozy cafes in Old Manali.",
      },
      {
        day: 6,
        title: "Manali to Chandigarh Airport Drop",
        description: "Scenic return drive to Chandigarh Airport for return flight.",
      },
    ],
  },
  {
    id: "pkg-andaman",
    title: "Exotic Andaman: Port Blair, Havelock & Radhanagar Beach",
    destination: "Andaman",
    stateOrCountry: "Andaman & Nicobar Islands",
    category: "beach",
    duration: "5N / 6D",
    nights: 5,
    days: 6,
    rating: 4.9,
    reviewsCount: 245,
    badge: "Island Explorer",
    badgeType: "trending",
    image: "/images/location8.png",
    originalPrice: 38000,
    price: 29800,
    inclusions: {
      flights: true,
      hotels: "Luxury Beachfront Cottages & 4★ Hotel",
      meals: "Daily Island Breakfast & Dinner",
      transfers: "Private AC Cab + Luxury Makruzz High-Speed Ferry",
      sightseeing: true,
    },
    highlights: [
      "Cellular Jail Light & Sound Show in Port Blair",
      "Radhanagar Beach - Ranked Asia's Best Beach by Time Magazine",
      "Scuba Diving & Snorkeling at Elephant Beach Havelock",
      "Luxury High-Speed Private Cruise between Islands",
    ],
    itinerary: [
      {
        day: 1,
        title: "Port Blair Arrival & Cellular Jail Light & Sound Show",
        description: "Arrive at Veer Savarkar Airport. Check in at hotel. Visit Cellular Jail and witness the historic, moving Light and Sound saga in the evening.",
      },
      {
        day: 2,
        title: "Port Blair to Havelock Island via Luxury Catamaran",
        description: "Board private Makruzz cruise to Havelock. Check-in at beach resort. Spend a golden sunset at world-famous Radhanagar Beach.",
      },
      {
        day: 3,
        title: "Elephant Beach Coral Reefs & Watersports",
        description: "Speedboat ride to Elephant Beach. Experience vibrant coral reefs with included snorkeling and optional underwater sea-walk.",
      },
      {
        day: 4,
        title: "Havelock to Neil Island (Natural Bridge & Laxmanpur)",
        description: "Ferry to Neil Island. Visit the Howrah Natural Coral Bridge and watch a breathtaking sunset at Laxmanpur Beach.",
      },
      {
        day: 5,
        title: "Neil Island to Port Blair & Souvenir Shopping",
        description: "Return ferry to Port Blair. Visit Sagarika Emporium for pearl jewelry and wooden handicrafts.",
      },
      {
        day: 6,
        title: "Departure from Port Blair",
        description: "Breakfast and private transfer to airport with tropical island memories.",
      },
    ],
  },
];

export default function PackagePage() {
  // Search & Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchDestination, setSearchDestination] = useState<string>("");
  const [originCity, setOriginCity] = useState<string>("Kolkata");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<"recommended" | "price_low" | "price_high" | "rating">("recommended");

  // Selected package for Itinerary modal
  const [activeModalPackage, setActiveModalPackage] = useState<PackageItem | null>(null);

  // Booking Form Modal State
  const [bookingModalPackage, setBookingModalPackage] = useState<PackageItem | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    phone: "",
    email: "",
    travelDate: "2026-12-15",
    travellersCount: 2,
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter Logic
  const filteredPackages = useMemo(() => {
    return PACKAGES_DATA.filter((pkg) => {
      // Category match
      if (selectedCategory !== "all" && pkg.category !== selectedCategory) {
        return false;
      }
      // Search destination match
      if (
        searchDestination.trim() &&
        !pkg.title.toLowerCase().includes(searchDestination.toLowerCase()) &&
        !pkg.destination.toLowerCase().includes(searchDestination.toLowerCase()) &&
        !pkg.stateOrCountry.toLowerCase().includes(searchDestination.toLowerCase())
      ) {
        return false;
      }
      // Duration filter match
      if (durationFilter === "short" && pkg.days > 5) return false;
      if (durationFilter === "medium" && (pkg.days < 5 || pkg.days > 6)) return false;
      if (durationFilter === "long" && pkg.days < 7) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === "price_low") return a.price - b.price;
      if (sortOption === "price_high") return b.price - a.price;
      if (sortOption === "rating") return b.rating - a.rating;
      return 0; // Default recommended
    });
  }, [selectedCategory, searchDestination, durationFilter, sortOption]);

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFormData.name || !bookingFormData.phone) return;

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalPackage(null);
      setBookingFormData({
        name: "",
        phone: "",
        email: "",
        travelDate: "2026-12-15",
        travellersCount: 2,
      });
    }, 2000);
  };

  return (
    <div className="pkg-page-wrapper">
      {/* =====================================================================
          1. HERO & SEARCH BANNER (1320px Max Container)
          ===================================================================== */}
      <section className="pkg-hero-section">
        <div className="pkg-hero-bg-overlay" />
        <div className="pkg-container pkg-hero-content">
          <div className="pkg-hero-badge">
            <span>✨ SKYROUTE SIGNATURE HOLIDAYS</span>
          </div>
          <h1 className="pkg-hero-title">
            Curated Holiday Packages for Unforgettable Journeys
          </h1>
          <p className="pkg-hero-subtitle">
            All-inclusive flights, handpicked luxury stays, guided sightseeing &amp; 24/7 on-ground concierge support.
          </p>

          {/* Search Box Card */}
          <div className="pkg-search-card">
            <div className="pkg-search-grid">
              {/* Origin City */}
              <div className="pkg-search-field">
                <span className="pkg-field-label">Departing From</span>
                <div className="pkg-field-input-wrap">
                  <span className="pkg-field-icon">🛫</span>
                  <select
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="pkg-field-select"
                  >
                    <option value="Kolkata">Kolkata (CCU)</option>
                    <option value="New Delhi">New Delhi (DEL)</option>
                    <option value="Mumbai">Mumbai (BOM)</option>
                    <option value="Bengaluru">Bengaluru (BLR)</option>
                    <option value="Hyderabad">Hyderabad (HYD)</option>
                    <option value="Chennai">Chennai (MAA)</option>
                  </select>
                </div>
              </div>

              {/* Destination Search */}
              <div className="pkg-search-field">
                <span className="pkg-field-label">Destination / Country</span>
                <div className="pkg-field-input-wrap">
                  <span className="pkg-field-icon">📍</span>
                  <input
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    placeholder="Search e.g. Kashmir, Goa, Dubai, Bali..."
                    className="pkg-field-input"
                  />
                  {searchDestination && (
                    <button
                      type="button"
                      onClick={() => setSearchDestination("")}
                      className="pkg-input-clear-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="pkg-search-field">
                <span className="pkg-field-label">Duration</span>
                <div className="pkg-field-input-wrap">
                  <span className="pkg-field-icon">🗓️</span>
                  <select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className="pkg-field-select"
                  >
                    <option value="all">All Durations</option>
                    <option value="short">Short Break (3 - 5 Days)</option>
                    <option value="medium">Classic Trip (5 - 6 Days)</option>
                    <option value="long">Extended Holiday (7+ Days)</option>
                  </select>
                </div>
              </div>

              {/* Search CTA */}
              <div className="pkg-search-btn-wrap">
                <button
                  type="button"
                  className="pkg-search-btn"
                  onClick={() => {
                    const el = document.getElementById("packages-listing");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Explore Packages</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. MAIN CONTENT AREA (Strict 1320px Container)
          ===================================================================== */}
      <main className="pkg-container pkg-main-body" id="packages-listing">
        {/* Category Pills Navigation */}
        <section className="pkg-categories-strip">
          <div className="pkg-categories-scroll">
            {[
              { id: "all", label: "All Packages", icon: "🌍" },
              { id: "hills", label: "Hills & Mountains", icon: "🏔️" },
              { id: "beach", label: "Beaches & Coastal", icon: "🏖️" },
              { id: "international", label: "International", icon: "✈️" },
              { id: "heritage", label: "Heritage & Palaces", icon: "🕌" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`pkg-cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="pkg-sort-wrap">
            <span className="pkg-sort-label">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="pkg-sort-select"
            >
              <option value="recommended">Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </section>

        {/* Results Header */}
        <div className="pkg-results-header">
          <h2 className="pkg-results-title">
            Featured Tour Packages
            <span className="pkg-results-count">({filteredPackages.length} available)</span>
          </h2>
          <span className="pkg-origin-note">
            Departing from <strong>{originCity}</strong> with verified flights &amp; transfers included
          </span>
        </div>

        {/* Packages Grid */}
        <div className="pkg-grid">
          {filteredPackages.map((pkg) => (
            <article key={pkg.id} className="pkg-card">
              {/* Image Frame */}
              <div className="pkg-card-img-wrap">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="pkg-card-img"
                />
                {pkg.badge && (
                  <span className={`pkg-card-badge ${pkg.badgeType || "bestseller"}`}>
                    {pkg.badge}
                  </span>
                )}
                <div className="pkg-duration-pill">
                  <span>⏱️ {pkg.duration}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="pkg-card-body">
                {/* Location & Rating */}
                <div className="pkg-card-top-row">
                  <span className="pkg-card-loc">
                    📍 {pkg.destination}, {pkg.stateOrCountry}
                  </span>
                  <div className="pkg-rating-box">
                    <span className="pkg-star">★</span>
                    <strong>{pkg.rating}</strong>
                    <span className="pkg-reviews-sub">({pkg.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="pkg-card-title">{pkg.title}</h3>

                {/* Inclusions Badges Strip */}
                <div className="pkg-inclusions-strip">
                  <span className="pkg-inc-tag" title="Flights Included">✈️ Flights</span>
                  <span className="pkg-inc-tag" title="Hotels Included">🏨 Hotels</span>
                  <span className="pkg-inc-tag" title="Meals Included">🍽️ Meals</span>
                  <span className="pkg-inc-tag" title="Transfers Included">🚗 Transfers</span>
                  <span className="pkg-inc-tag" title="Sightseeing Included">🎟️ Sightseeing</span>
                </div>

                {/* Highlights List */}
                <ul className="pkg-highlights-list">
                  {pkg.highlights.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="pkg-highlight-item">
                      <span className="pkg-check-icon">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pkg-card-divider" />

                {/* Pricing & Actions */}
                <div className="pkg-card-bottom-row">
                  <div className="pkg-price-col">
                    <span className="pkg-original-price">₹{pkg.originalPrice.toLocaleString()}</span>
                    <div className="pkg-current-price-row">
                      <strong className="pkg-price-val">₹{pkg.price.toLocaleString()}</strong>
                      <span className="pkg-price-unit">/ person</span>
                    </div>
                    <span className="pkg-tax-note">Inclusive of flights &amp; stay</span>
                  </div>

                  <div className="pkg-actions-col">
                    <button
                      type="button"
                      onClick={() => setActiveModalPackage(pkg)}
                      className="pkg-view-btn"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingModalPackage(pkg)}
                      className="pkg-book-btn"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="pkg-empty-state">
            <span className="pkg-empty-icon">🔍</span>
            <h3>No Packages Found Matching Your Filter</h3>
            <p>Try clearing your destination search or select &quot;All Packages&quot; to see available options.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchDestination("");
                setDurationFilter("all");
              }}
              className="pkg-reset-btn"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* =====================================================================
            3. VALUE PROPOSITION & PROMO BANNERS (1320px)
            ===================================================================== */}
        <section className="pkg-why-section">
          <div className="pkg-section-header">
            <h2 className="pkg-section-title">Why Book Holidays with SkyRoute?</h2>
            <p className="pkg-section-sub">
              Over 500,000+ satisfied travelers trust us for stress-free dream holidays.
            </p>
          </div>

          <div className="pkg-why-grid">
            <div className="pkg-why-card">
              <div className="pkg-why-icon-box">🛡️</div>
              <h4>100% Verified Stays</h4>
              <p>Handpicked 4★ &amp; 5★ audited resorts and heritage villas with verified guest ratings.</p>
            </div>

            <div className="pkg-why-card">
              <div className="pkg-why-icon-box">✈️</div>
              <h4>Confirmed Flight Bookings</h4>
              <p>Top airline flight tickets with convenient timings and check-in baggage allowances included.</p>
            </div>

            <div className="pkg-why-card">
              <div className="pkg-why-icon-box">🚗</div>
              <h4>Private Chauffeur Transfers</h4>
              <p>Dedicated AC cabs and sanitized vehicles exclusively for your group throughout the journey.</p>
            </div>

            <div className="pkg-why-card">
              <div className="pkg-why-icon-box">📞</div>
              <h4>24/7 On-Ground Concierge</h4>
              <p>Dedicated trip manager assigned for 24/7 assistance from departure until you return home safely.</p>
            </div>
          </div>
        </section>

        {/* Promo Highlights Banner */}
        <section className="pkg-promo-banner">
          <div className="pkg-promo-left">
            <span className="pkg-promo-tag">LIMITED PERIOD OFFER</span>
            <h3 className="pkg-promo-title">Plan Your Winter Holiday &amp; Save Flat 15%</h3>
            <p className="pkg-promo-desc">
              Use promo coupon <strong>SKYHOLIDAY</strong> during checkout. Enjoy free date change and no-cost EMI options starting at ₹1,999/month.
            </p>
          </div>
          <button
            type="button"
            className="pkg-promo-cta-btn"
            onClick={() => {
              const el = document.getElementById("packages-listing");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Claim Discount Now
          </button>
        </section>
      </main>

      {/* =====================================================================
          4. PACKAGE DETAILS MODAL (Dedicated Modal Component)
          ===================================================================== */}
      <PackageDetails
        isOpen={Boolean(activeModalPackage)}
        onClose={() => setActiveModalPackage(null)}
        packageData={activeModalPackage}
        originCity={originCity}
        onBookNow={(pkg) => {
          setActiveModalPackage(null);
          setBookingModalPackage(pkg);
        }}
      />

      {/* =====================================================================
          5. BOOKING & ENQUIRY MODAL
          ===================================================================== */}
      {bookingModalPackage && (
        <div
          className="pkg-modal-backdrop"
          onClick={() => setBookingModalPackage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="pkg-modal-dialog booking-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="pkg-modal-header">
              <div>
                <span className="pkg-modal-kicker">INSTANT TOUR RESERVATION</span>
                <h3 className="pkg-modal-title">{bookingModalPackage.title}</h3>
                <span className="pkg-modal-sub">₹{bookingModalPackage.price.toLocaleString()} per adult</span>
              </div>
              <button
                type="button"
                className="pkg-modal-close-btn"
                onClick={() => setBookingModalPackage(null)}
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="pkg-booking-success-box">
                <div className="pkg-success-icon-ring">✓</div>
                <h3>Reservation Request Received!</h3>
                <p>
                  Thank you, <strong>{bookingFormData.name}</strong>. Our dedicated travel advisor will contact you at <strong>{bookingFormData.phone}</strong> within 15 minutes to confirm your itinerary and flight slots.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="pkg-booking-form">
                <div className="pkg-form-grid-2">
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="pkg-form-input"
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={bookingFormData.phone}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                      placeholder="Enter your 10-digit mobile"
                      className="pkg-form-input"
                    />
                  </div>
                </div>

                <div className="pkg-form-grid-2">
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={bookingFormData.email}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                      placeholder="Enter email for voucher"
                      className="pkg-form-input"
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Preferred Travel Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingFormData.travelDate}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, travelDate: e.target.value })}
                      className="pkg-form-input"
                    />
                  </div>
                </div>

                <div className="pkg-form-group">
                  <label className="pkg-form-label">Number of Travelers</label>
                  <select
                    value={bookingFormData.travellersCount}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, travellersCount: parseInt(e.target.value, 10) })}
                    className="pkg-form-input"
                  >
                    <option value={1}>1 Traveler (Solo)</option>
                    <option value={2}>2 Travelers (Couple / Twin)</option>
                    <option value={3}>3 Travelers (Triple Sharing)</option>
                    <option value={4}>4 Travelers (Family)</option>
                    <option value={5}>5+ Travelers (Group)</option>
                  </select>
                </div>

                <div className="pkg-fare-estimate-strip">
                  <span>Estimated Total ({bookingFormData.travellersCount} Guests):</span>
                  <strong>
                    ₹{(bookingModalPackage.price * bookingFormData.travellersCount).toLocaleString()}
                  </strong>
                </div>

                <button type="submit" className="pkg-submit-booking-btn">
                  <span>Confirm Booking &amp; Request Callback</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
