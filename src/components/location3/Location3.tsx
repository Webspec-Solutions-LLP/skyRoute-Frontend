"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Location3.css";

export interface DestinationCardItem {
  id: string;
  city: string;
  state: string;
  properties: string;
  image: string;
  alt: string;
  link: string;
  isTall?: boolean;
}

// 13 Destinations mapped to public/images/location1.webp through location13.png
export const LOCATION3_DESTINATIONS: DestinationCardItem[] = [
  {
    id: "kolkata",
    city: "Kolkata",
    state: "WEST BENGAL",
    properties: "968",
    image: "/images/location11.png",
    alt: "Howrah Bridge and city view in Kolkata, West Bengal",
    link: "/hotels?city=kolkata",
    isTall: true, // Grid Slot 1: Tall card (spans rows 1-2, col 1)
  },
  {
    id: "paris",
    city: "Paris",
    state: "FRANCE",
    properties: "1,420",
    image: "/images/location3.webp",
    alt: "Charming Parisian streets and cafes in Paris",
    link: "/hotels?city=paris",
  },
  {
    id: "dubai",
    city: "Dubai",
    state: "UAE",
    properties: "1,850",
    image: "/images/location2.webp",
    alt: "Iconic luxury skyline and resorts in Dubai",
    link: "/hotels?city=dubai",
  },
  {
    id: "singapore",
    city: "Singapore",
    state: "SINGAPORE",
    properties: "975",
    image: "/images/location4.webp",
    alt: "Marina Bay and modern architecture in Singapore",
    link: "/hotels?city=singapore",
  },
  {
    id: "bali",
    city: "Bali",
    state: "INDONESIA",
    properties: "1,640",
    image: "/images/location1.webp",
    alt: "Exotic coastal beaches and temples in Bali",
    link: "/hotels?city=bali",
  },
  {
    id: "new-york",
    city: "New York",
    state: "USA",
    properties: "2,310",
    image: "/images/location5.webp",
    alt: "Manhattan skyscrapers and bustling streets in New York",
    link: "/hotels?city=new-york",
  },
  {
    id: "london",
    city: "London",
    state: "UNITED KINGDOM",
    properties: "2,480",
    image: "/images/location6.webp",
    alt: "Historic landmarks and River Thames in London",
    link: "/hotels?city=london",
  },
  {
    id: "mumbai",
    city: "Mumbai",
    state: "MAHARASHTRA",
    properties: "4,177",
    image: "/images/location8.png",
    alt: "Gateway of India and Arabian Sea in Mumbai",
    link: "/hotels?city=mumbai",
    isTall: true, // Grid Slot 8: Tall card (spans rows 3-4, col 3)
  },
  {
    id: "new-delhi",
    city: "New Delhi",
    state: "DELHI NCR",
    properties: "3,890",
    image: "/images/location9.png",
    alt: "India Gate monument and grand avenue in New Delhi",
    link: "/hotels?city=new-delhi",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    state: "JAPAN",
    properties: "1,920",
    image: "/images/location7.webp",
    alt: "Vibrant neon skyline and cityscape of Tokyo",
    link: "/hotels?city=tokyo",
  },
  {
    id: "chennai",
    city: "Chennai",
    state: "TAMIL NADU",
    properties: "1,230",
    image: "/images/location10.png",
    alt: "Historic temple architecture and coastline in Chennai",
    link: "/hotels?city=chennai",
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    state: "TELANGANA",
    properties: "1,520",
    image: "/images/location12.png",
    alt: "Historic Charminar monument in Hyderabad",
    link: "/hotels?city=hyderabad",
  },
  {
    id: "ahmedabad",
    city: "Ahmedabad",
    state: "GUJARAT",
    properties: "1,040",
    image: "/images/location13.png",
    alt: "Heritage carved arches and architecture in Ahmedabad",
    link: "/hotels?city=ahmedabad",
  },
];

const ROUTE_TRACK_HEIGHT = 50;

function buildLocation3Route(width: number): {
  d: string;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
} {
  const safeWidth = Math.max(width, 180);
  const startX = 8;
  const startY = 34;
  const endX = safeWidth - 14;
  const endY = 28;
  const span = endX - startX;

  const midX = +(startX + span * 0.5).toFixed(1);
  const midY = 30;

  // Hop 1: High scenic arc over mountains/clouds to mid-route hub
  const cp1x = +(startX + span * 0.14).toFixed(1);
  const cp2x = +(startX + span * 0.36).toFixed(1);

  // Hop 2: Second graceful soaring arc landing into destination hotel pin
  const cp3x = +(midX + span * 0.14).toFixed(1);
  const cp4x = +(midX + span * 0.36).toFixed(1);

  return {
    d: `M ${startX} ${startY} C ${cp1x} 7, ${cp2x} 7, ${midX} ${midY} C ${cp3x} 9, ${cp4x} 9, ${endX} ${endY}`,
    startX,
    startY,
    midX,
    midY,
    endX,
    endY,
  };
}

export default function Location3() {
  const routeTrackRef = useRef<HTMLDivElement | null>(null);
  const rawId = useId();
  const routeGradientId = `loc3-route-grad-${rawId.replace(/:/g, "")}`;
  const [trackWidth, setTrackWidth] = useState(820);

  const route = buildLocation3Route(trackWidth);

  useEffect(() => {
    const el = routeTrackRef.current;
    if (!el) return;

    const updateWidth = () => {
      const nextWidth = Math.round(el.getBoundingClientRect().width);
      if (nextWidth > 0) {
        setTrackWidth((prev) => (prev === nextWidth ? prev : nextWidth));
      }
    };

    updateWidth();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const vehicleMotionStyle: React.CSSProperties & {
    WebkitOffsetPath?: string;
  } = {
    offsetPath: `path("${route.d}")`,
    WebkitOffsetPath: `path("${route.d}")`,
  };

  return (
    <section
      className="skyroute-location3-section"
      aria-label="Explore Top Hotel Destinations"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-location3-container">
        
        {/* Header Section: Heading on Left with Animated Travel Trail stretching to the Right */}
        <div className="location3-section-header">
          <div className="location3-title-track-wrap">
            <h2 className="location3-section-heading">
              Explore{" "}
              <span className="location3-heading-highlight">
                Top Destinations
              </span>
            </h2>

            {/* Polished Route Track */}
            <div
              ref={routeTrackRef}
              className="location3-route-track"
              aria-hidden="true"
            >
              <svg
                className="location3-route-svg"
                viewBox={`0 0 ${Math.max(trackWidth, 160)} ${ROUTE_TRACK_HEIGHT}`}
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={routeGradientId}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#0ea5e9" stopOpacity="1" />
                    <stop offset="100%" stopColor="#006ce4" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Glow Guide under Dashed Path */}
                <path
                  d={route.d}
                  stroke="rgba(14, 165, 233, 0.15)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                {/* Crisp Gradient Dashed Path */}
                <path
                  d={route.d}
                  stroke={`url(#${routeGradientId})`}
                  strokeWidth="2.2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />

                {/* Origin Anchor Dot */}
                <circle
                  cx={route.startX}
                  cy={route.startY}
                  r="5"
                  fill="rgba(14, 165, 233, 0.2)"
                />
                <circle
                  cx={route.startX}
                  cy={route.startY}
                  r="2.8"
                  fill="#0ea5e9"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                />

                {/* Mid-Route Transit Waypoint Hub */}
                <circle
                  cx={route.midX}
                  cy={route.midY}
                  r="6"
                  fill="rgba(14, 165, 233, 0.16)"
                />
                <circle
                  cx={route.midX}
                  cy={route.midY}
                  r="3.2"
                  fill="#ffffff"
                  stroke="#0284c7"
                  strokeWidth="1.6"
                />
                <circle
                  cx={route.midX}
                  cy={route.midY}
                  r="1.2"
                  fill="#006ce4"
                />

                {/* Destination Anchor Dot */}
                <circle
                  cx={route.endX}
                  cy={route.endY}
                  r="3.2"
                  fill="rgba(239, 68, 68, 0.25)"
                />
              </svg>

              {/* Destination Location Pin Icon */}
              <div className="location3-route-pin" title="Hotel Destination">
                <span className="location3-pin-ripple" />
                <span className="location3-pin-ripple location3-pin-ripple-delay" />
                <svg
                  className="location3-pin-svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#ef4444"
                  />
                  <circle cx="12" cy="9" r="2.7" fill="#ffffff" />
                </svg>
              </div>

              {/* Animated Vehicle (High-Fidelity Jet Airliner) along track */}
              <div
                className="location3-route-vehicle"
                style={vehicleMotionStyle}
              >
                <svg
                  className="location3-vehicle-icon"
                  width="30"
                  height="24"
                  viewBox="0 0 30 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Engine Vapor Exhaust Trails */}
                  <path
                    d="M1 8.5H8"
                    stroke="rgba(56, 189, 248, 0.65)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M1 15.5H8"
                    stroke="rgba(56, 189, 248, 0.65)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />

                  {/* Left & Right Jet Engine Pods */}
                  <rect x="8.5" y="7.2" width="6" height="2.6" rx="1.3" fill="#0284c7" />
                  <rect x="8.5" y="14.2" width="6" height="2.6" rx="1.3" fill="#0284c7" />

                  {/* Swept Main Wings */}
                  <path
                    d="M12.5 12L8.5 2.2C8.3 1.7 8.9 1.2 9.4 1.4L13.8 3.2L18.5 12L13.8 20.8L9.4 22.6C8.9 22.8 8.3 22.3 8.5 21.8L12.5 12Z"
                    fill="#0ea5e9"
                  />

                  {/* Horizontal Tail Stabilizers */}
                  <path
                    d="M4.5 12L2 6.5C1.8 6.1 2.3 5.7 2.7 5.9L5.2 7L7 12L5.2 17L2.7 18.1C2.3 18.3 1.8 17.9 2 17.5L4.5 12Z"
                    fill="#0284c7"
                  />

                  {/* Main Aerodynamic Fuselage (Nose Pointing RIGHT) */}
                  <path
                    d="M2.5 12C2.5 10.2 4.2 9.5 6.8 9.5L21.5 9.8C25.5 10 29 11.2 29 12C29 12.8 25.5 14 21.5 14.2L6.8 14.5C4.2 14.5 2.5 13.8 2.5 12Z"
                    fill="#006ce4"
                  />

                  {/* Cockpit Windshield */}
                  <path
                    d="M23 10.8C24.8 11.2 26.2 11.6 26.2 12C26.2 12.4 24.8 12.8 23 13.2L22.2 12Z"
                    fill="#e0f2fe"
                  />

                  {/* Red Port & Green Starboard Wingtip Nav Lights */}
                  <circle cx="9" cy="1.6" r="0.9" fill="#ef4444" />
                  <circle cx="9" cy="22.4" r="0.9" fill="#22c55e" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid: 13 Destination Cards Matching Screenshot 1 Layout & Screenshot 2 Content */}
        <div className="location3-grid">
          {LOCATION3_DESTINATIONS.map((item) => (
            <Link
              key={item.id}
              href={`/allHotels?${new URLSearchParams({ city: item.city }).toString()}`}
              className={`location3-card ${item.isTall ? "is-tall" : ""}`}
              title={`Explore ${item.properties} properties in ${item.city}, ${item.state}`}
            >
              {/* Full Background Destination Photo */}
              <div className="loc3-image-wrap">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes={
                    item.isTall
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  }
                  className="loc3-card-img"
                  priority={item.id === "kolkata" || item.id === "paris"}
                />
              </div>

              {/* Gradient Vignette Overlay for Text Legibility */}
              <div className="loc3-card-overlay">
                
                {/* Top Subtle Hotel Badge */}
                <div className="loc3-top-badge" aria-hidden="true">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                    <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
                    <path d="M12 4v6" />
                    <path d="M2 18h20" />
                  </svg>
                </div>

                {/* Bottom Content Bar: City Name, State, & '968 Properties →' Pill */}
                <div className="loc3-card-content">
                  <div className="loc3-location-info">
                    <h3 className="loc3-city-name">{item.city}</h3>
                    <span className="loc3-state-name">{item.state}</span>
                  </div>

                  <div className="loc3-properties-pill">
                    <span className="loc3-properties-count">
                      <strong>{item.properties}</strong> Properties
                    </span>
                    <svg
                      className="loc3-arrow-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
