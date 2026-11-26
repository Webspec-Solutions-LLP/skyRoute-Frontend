"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Login from "@/components/modals/login/Login";
import "./Navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bookingType = searchParams.get("type");
  const hotelId = searchParams.get("hotelId");
  const [activeTab, setActiveTab] = useState(() => {
    if (pathname?.startsWith("/train") || pathname?.startsWith("/allTrain")) {
      return "Train";
    }
    if (pathname?.startsWith("/bus") || pathname?.startsWith("/allBus")) {
      return "Bus";
    }
    if (
      pathname?.startsWith("/hotel") ||
      pathname?.startsWith("/allHotels") ||
      (pathname?.startsWith("/bookingDetails") && (bookingType === "hotel" || Boolean(hotelId)))
    ) {
      return "Hotels";
    }
    if (pathname?.startsWith("/package")) {
      return "Packages";
    }
    if (pathname?.startsWith("/myTrips") || pathname?.startsWith("/giftCard") || pathname?.startsWith("/profile")) {
      return "";
    }
    return "Flights";
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{
    isLoggedIn: boolean;
    phone: string;
    fullName: string;
    firstName: string;
    email?: string;
    city?: string;
    gender?: string;
    avatar?: string;
  } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync user from localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("skyroute_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.isLoggedIn) {
              setCurrentUser(parsed);
              return;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      setCurrentUser(null);
    };

    loadUser();

    window.addEventListener("skyroute_auth_change", loadUser);
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener("skyroute_auth_change", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("skyroute_user");
      window.dispatchEvent(new Event("skyroute_auth_change"));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setIsUserMenuOpen(false);
  };

  // Sync active navigation tab with the current route.
  useEffect(() => {
    if (pathname?.startsWith("/train") || pathname?.startsWith("/allTrain")) {
      setActiveTab("Train");
    } else if (pathname?.startsWith("/bus") || pathname?.startsWith("/allBus")) {
      setActiveTab("Bus");
    } else if (
      pathname?.startsWith("/hotel") ||
      pathname?.startsWith("/allHotels") ||
      (pathname?.startsWith("/bookingDetails") && (bookingType === "hotel" || Boolean(hotelId)))
    ) {
      setActiveTab("Hotels");
    } else if (pathname?.startsWith("/package")) {
      setActiveTab("Packages");
    } else if (pathname?.startsWith("/myTrips") || pathname?.startsWith("/giftCard")) {
      setActiveTab("");
    } else {
      setActiveTab("Flights");
    }
  }, [pathname, bookingType, hotelId]);

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
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
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
      href: "/hotel",
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
      href: "/package",
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
          </ul>
        </nav>

        {/* RIGHT: Sign Up */}
        <div className="navbar-actions-section">
          <div className="navbar-auth-group">
            {currentUser && currentUser.isLoggedIn ? (
              <div className="navbar-user-profile-wrapper" ref={userMenuRef}>
                <button
                  type="button"
                  className={`navbar-user-profile-btn ${isUserMenuOpen ? "is-open" : ""}`}
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-expanded={isUserMenuOpen}
                  aria-label={`User menu for ${currentUser.firstName || "Joydeep"}`}
                >
                  <div className="navbar-user-avatar-circle">
                    <Image
                      src={currentUser.avatar || "/images/user-avatar.png"}
                      alt={currentUser.firstName || "Joydeep"}
                      width={34}
                      height={34}
                      className="navbar-user-avatar-img"
                    />
                    <span className="navbar-user-online-dot" />
                  </div>
                  <div className="navbar-user-info-stack">
                    <span className="navbar-user-badge">SkyPass</span>
                    <span className="navbar-user-greeting">Hey {currentUser.firstName || "Joydeep"}</span>
                  </div>
                  <div className="navbar-chevron-circle">
                    <svg
                      className={`navbar-user-chevron ${isUserMenuOpen ? "is-rotated" : ""}`}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="navbar-user-dropdown-menu">
                    <div className="navbar-user-dropdown-header">
                      <div className="navbar-user-header-avatar">
                        <Image
                          src={currentUser.avatar || "/images/user-avatar.png"}
                          alt={currentUser.firstName || "Joydeep"}
                          width={42}
                          height={42}
                          className="navbar-user-avatar-img"
                        />
                      </div>
                      <div className="navbar-user-header-details">
                        <span className="navbar-user-header-name">{currentUser.fullName || "Joydeep"}</span>
                        <span className="navbar-user-header-sub">{currentUser.email || (currentUser.phone ? `+91 ${currentUser.phone}` : "SkyRoute Explorer")}</span>
                        <span className="navbar-user-tier-badge">Verified Member ✓</span>
                      </div>
                    </div>

                    <div className="navbar-user-menu-divider" />

                    <Link
                      href="/profile"
                      className="navbar-user-menu-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="menu-icon-wrap">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/myTrips"
                      className="navbar-user-menu-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="menu-icon-wrap">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="14" x="3" y="7" rx="2" />
                          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <path d="M3 13h18" />
                        </svg>
                      </span>
                      <span>My Trips &amp; Bookings</span>
                    </Link>

                    <Link
                      href="/giftCard"
                      className="navbar-user-menu-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="menu-icon-wrap">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 12 20 22 4 22 4 12" />
                          <rect width="20" height="5" x="2" y="7" />
                          <line x1="12" x2="12" y1="22" y2="7" />
                        </svg>
                      </span>
                      <span>Travel Gift Cards</span>
                    </Link>

                    <div className="navbar-user-menu-divider" />

                    <button
                      type="button"
                      className="navbar-user-menu-item is-logout"
                      onClick={handleLogout}
                    >
                      <span className="menu-icon-wrap icon-logout">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                      </span>
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="navbar-signup-btn"
                onClick={() => setIsLoginModalOpen(true)}
                aria-label="Open Login Modal"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login & OTP Modal */}
      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
