"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

const CITIES = [
  "Kolkata",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Goa",
  "Jaipur",
];

const MORE_SERVICES = [
  { label: "Visa Services", href: "#visa" },
  { label: "Travel Insurance", href: "#insurance" },
  { label: "Forex Cards", href: "#forex" },
  { label: "Gift Cards", href: "#gift-cards" },
  { label: "Tour Activities", href: "#activities" },
  { label: "My Trips", href: "/myTrips" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(() => {
    if (pathname?.startsWith("/train") || pathname?.startsWith("/allTrain")) {
      return "Train";
    }
    if (pathname?.startsWith("/bus") || pathname?.startsWith("/allBus")) {
      return "Bus";
    }
    if (pathname?.startsWith("/myTrips")) {
      return "";
    }
    return "Flights";
  });
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLLIElement>(null);

  // Sync active navigation tab with the current route.
  useEffect(() => {
    if (pathname?.startsWith("/train") || pathname?.startsWith("/allTrain")) {
      setActiveTab("Train");
    } else if (pathname?.startsWith("/bus") || pathname?.startsWith("/allBus")) {
      setActiveTab("Bus");
    } else if (pathname?.startsWith("/myTrips")) {
      setActiveTab("");
    } else {
      setActiveTab("Flights");
    }
  }, [pathname]);

  // Track page scroll for subtle frosted elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMoreDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCityDropdownOpen(false);
        setIsMoreDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Crisp uniform-stroke icons in exact order: Flights, Hotels, Bus, Packages
  const navItems: { label: string; href?: string; icon: React.ReactNode }[] = [
    {
      label: "Flights",
      href: "/",
      icon: (
        <svg
          className="nav-icon"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      ),
    },
    {
      label: "Hotels",
      icon: (
        <svg
          className="nav-icon"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
          <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
          <path d="M12 4v6" />
          <path d="M2 18h20" />
        </svg>
      ),
    },
    {
      label: "Bus",
      href: "/bus",
      icon: (
        <svg
          className="nav-icon"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 6v6" />
          <path d="M15 6v6" />
          <path d="M2 12h19.6" />
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
          <circle cx="7" cy="18" r="2" />
          <path d="M9 18h5" />
          <circle cx="16" cy="18" r="2" />
        </svg>
      ),
    },
    {
      label: "Train",
      href: "/train",
      icon: (
        <svg
          className="nav-icon"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="16" height="16" x="4" y="3" rx="2" />
          <path d="M4 11h16" />
          <path d="M12 3v8" />
          <path d="m8 19-2 3" />
          <path d="m18 22-2-3" />
          <circle cx="8" cy="15" r="1" fill="currentColor" />
          <circle cx="16" cy="15" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Packages",
      icon: (
        <svg
          className="nav-icon"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="14" x="3" y="7" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 13h18" />
        </svg>
      ),
    },
  ];

  return (
    <header className={`skyroute-navbar-wrapper ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="skyroute-navbar-container">
        {/* LEFT: Brand Logo */}
        <div className="navbar-brand-section">
          <Link href="/" className="navbar-logo-link" aria-label="SkyRoute Home" onClick={() => setActiveTab("Flights")}>
            <div className="navbar-logo-circle">
              <Image
                src="/images/logo.webp"
                alt="SkyRoute Logo"
                width={46}
                height={46}
                priority
                className="navbar-logo-img"
              />
            </div>
            <div className="navbar-brand-text">
              <span className="navbar-brand-name">
                <span className="navbar-brand-sky">Sky</span>
                <span className="navbar-brand-route">Route</span>
              </span>
              <span className="navbar-brand-tagline">FLY • STAY • TRAVEL</span>
            </div>
          </Link>
        </div>

        {/* CENTER: Navigation Links (Flights, Hotels, Bus, Packages, More) */}
        <nav aria-label="Main Navigation">
          <ul className="navbar-nav-section">
            {navItems.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`nav-item-btn ${isActive ? "is-active" : ""}`}
                      onClick={() => setActiveTab(item.label)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`nav-item-btn ${isActive ? "is-active" : ""}`}
                      onClick={() => setActiveTab(item.label)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )}
                </li>
              );
            })}

            {/* More Dropdown */}
            <li className="nav-more-dropdown-wrapper" ref={moreDropdownRef}>
              <button
                type="button"
                className={`nav-item-btn nav-more-btn ${isMoreDropdownOpen ? "is-open" : ""}`}
                onClick={() => setIsMoreDropdownOpen((prev) => !prev)}
                aria-expanded={isMoreDropdownOpen}
              >
                <span>More</span>
                <svg
                  className={`nav-chevron-icon ${isMoreDropdownOpen ? "is-rotated" : ""}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isMoreDropdownOpen && (
                <div className="nav-dropdown-menu">
                  {MORE_SERVICES.map((service) => (
                    <Link
                      key={service.label}
                      href={service.href}
                      className="nav-dropdown-item"
                      onClick={() => setIsMoreDropdownOpen(false)}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* RIGHT: Location Selector & Sign Up */}
        <div className="navbar-actions-section">
          <div className="navbar-location-wrapper" ref={cityDropdownRef}>
            <button
              type="button"
              className={`navbar-location-pill ${isCityDropdownOpen ? "is-open" : ""}`}
              onClick={() => setIsCityDropdownOpen((prev) => !prev)}
              aria-label={`Select city, currently ${selectedCity}`}
              aria-expanded={isCityDropdownOpen}
            >
              <span className="location-icon" aria-hidden="true">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span>{selectedCity}</span>
              <span className="chevron-icon" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            {isCityDropdownOpen && (
              <div className="navbar-location-dropdown">
                <div className="location-dropdown-header">Select City</div>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`location-dropdown-item ${selectedCity === city ? "is-selected" : ""}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                    }}
                  >
                    <span>{city}</span>
                    {selectedCity === city && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="navbar-auth-group">
            <Link href="/signup" className="navbar-signup-btn">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
