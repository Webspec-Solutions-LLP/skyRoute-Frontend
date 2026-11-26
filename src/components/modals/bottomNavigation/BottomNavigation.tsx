"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./BottomNavigation.css";

type NavKey = "flight" | "bus" | "hotel" | "train" | "profile";

interface BottomNavItem {
  key: NavKey;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: BottomNavItem[] = [
  {
    key: "flight",
    label: "Flight",
    href: "/",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
  },
  {
    key: "bus",
    label: "Bus",
    href: "/bus",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
      </svg>
    ),
  },
  {
    key: "hotel",
    label: "Hotel",
    href: "/hotel",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
      </svg>
    ),
  },
  {
    key: "train",
    label: "Train",
    href: "/train",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm4.5-7H6V6h6v4zm4.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-6V6h6v4z" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    href: "/profile",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
];

const VISIBLE_PATHS = new Set(["/", "/bus", "/hotel", "/train", "/profile"]);

function getActiveKey(pathname: string | null): NavKey {
  if (!pathname) return "flight";
  if (pathname.startsWith("/bus") || pathname.startsWith("/allBus")) return "bus";
  if (pathname.startsWith("/hotel") || pathname.startsWith("/allHotels")) return "hotel";
  if (pathname.startsWith("/train") || pathname.startsWith("/allTrain")) return "train";
  if (pathname.startsWith("/profile") || pathname.startsWith("/myTrips")) return "profile";
  return "flight";
}

export default function BottomNavigation() {
  const pathname = usePathname();
  if (!pathname || !VISIBLE_PATHS.has(pathname)) return null;

  const activeKey = getActiveKey(pathname);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    setIsVisible(true);
    lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;
  }, [pathname]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = Math.max(0, window.scrollY);
        const delta = currentY - lastScrollY.current;

        if (currentY <= 24) {
          setIsVisible(true);
        } else if (delta > 6) {
          // User swipes bottom-to-top (scrolling down): slowly slide dock down
          setIsVisible(false);
        } else if (delta < -6) {
          // User scrolls opposite (scrolling up): slowly rise from bottom and stay fixed
          setIsVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`skyroute-bottom-nav ${isVisible ? "is-visible" : "is-hidden"}`}
      aria-label="Mobile Quick Navigation"
    >
      <div className="skyroute-bottom-nav-dock">
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`bottom-nav-item ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              title={item.label}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              {isActive && <span className="bottom-nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
