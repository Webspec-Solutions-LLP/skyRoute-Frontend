"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "./Location1.css";

export interface LocationItem {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: string;
  link: string;
}

// Demo location destinations using public/images/location1.webp ... location7.webp
export const LOCATION_ITEMS: LocationItem[] = [
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "/images/location1.webp",
    rating: "4.8",
    link: "/destinations/bali",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    image: "/images/location2.webp",
    rating: "4.8",
    link: "/destinations/dubai",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "/images/location3.webp",
    rating: "4.9",
    link: "/destinations/paris",
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    image: "/images/location4.webp",
    rating: "4.7",
    link: "/destinations/singapore",
  },
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    image: "/images/location5.webp",
    rating: "4.8",
    link: "/destinations/new-york",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    image: "/images/location6.webp",
    rating: "4.9",
    link: "/destinations/london",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: "/images/location7.webp",
    rating: "4.9",
    link: "/destinations/tokyo",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    image: "/images/location1.webp",
    rating: "4.8",
    link: "/destinations/rome",
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    image: "/images/location2.webp",
    rating: "5.0",
    link: "/destinations/maldives",
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    image: "/images/location3.webp",
    rating: "4.8",
    link: "/destinations/sydney",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    image: "/images/location4.webp",
    rating: "4.7",
    link: "/destinations/barcelona",
  },
  {
    id: "switzerland",
    name: "Zurich",
    country: "Switzerland",
    image: "/images/location5.webp",
    rating: "4.9",
    link: "/destinations/switzerland",
  },
];

const ROUTE_TRACK_HEIGHT = 56;

function buildLoopRoutePath(width: number): {
  d: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
} {
  const safeWidth = Math.max(width, 60);
  const isCompact = safeWidth < 160;
  const startX = isCompact ? 5 : 8;
  const startY = 44;
  const endX = safeWidth - (isCompact ? 9 : 14);
  const endY = 26;
  const span = Math.max(endX - startX, 38);

  // Keep the aerial loop gracefully proportioned regardless of viewport width
  const s =
    span < 110
      ? 0.45
      : span < 170
        ? 0.6
        : span < 260
          ? 0.72
          : span < 380
            ? 0.84
            : 1;
  const loopCenterX =
    span >= 420
      ? startX + Math.min(span * 0.22, 160)
      : span < 130
        ? startX + span * 0.36
        : startX + span * 0.28;

  const entryCp1X = +(startX + (loopCenterX - startX) * 0.55).toFixed(1);
  const rightX = +(loopCenterX + 24 * s).toFixed(1);
  const rightY = +(21 + (1 - s) * 4).toFixed(1);
  const topX = +(loopCenterX - 2 * s).toFixed(1);
  const topY = +(8 + (1 - s) * 4).toFixed(1);
  const leftX = +(loopCenterX - 26 * s).toFixed(1);
  const leftY = +(24 + (1 - s) * 3).toFixed(1);
  const exitX = +(loopCenterX + 14 * s).toFixed(1);
  const exitY = 41;

  const tailSpan = Math.max(endX - exitX, 24);
  const tailCp1X = +(exitX + tailSpan * 0.3).toFixed(1);
  const tailCp2X = +(exitX + tailSpan * 0.72).toFixed(1);

  const d = [
    `M ${startX} ${startY}`,
    `C ${entryCp1X} 43, ${rightX} ${(rightY + 13 * s).toFixed(1)}, ${rightX} ${rightY}`,
    `C ${rightX} ${(rightY - 10 * s).toFixed(1)}, ${(loopCenterX + 12 * s).toFixed(1)} ${topY}, ${topX} ${topY}`,
    `C ${(loopCenterX - 16 * s).toFixed(1)} ${topY}, ${leftX} ${(leftY - 10 * s).toFixed(1)}, ${leftX} ${leftY}`,
    `C ${leftX} ${(leftY + 12 * s).toFixed(1)}, ${(loopCenterX - 8 * s).toFixed(1)} 42, ${exitX} ${exitY}`,
    `C ${tailCp1X} 39.6, ${tailCp2X} 16, ${endX} ${endY}`,
  ].join(" ");

  return { d, startX, startY, endX, endY };
}

export default function Location1() {
  const routeTrackRef = useRef<HTMLDivElement | null>(null);
  const rawId = useId();
  const routeGradientId = `loc1-flight-grad-${rawId.replace(/:/g, "")}`;
  const [trackWidth, setTrackWidth] = useState(820);

  const route = buildLoopRoutePath(trackWidth);

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

  const planeMotionStyle: React.CSSProperties & {
    WebkitOffsetPath?: string;
  } = {
    offsetPath: `path("${route.d}")`,
    WebkitOffsetPath: `path("${route.d}")`,
  };

  return (
    <section
      className="skyroute-location-section"
      aria-label="Popular destinations outside India"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-location-container">
        
        {/* Header Section: Heading on left, Loop-de-Loop Flight Route extending to the far right */}
        <div className="location-section-header">
          <div className="location-title-track-wrap">
            <h2 className="location-section-heading">
              Popular Destinations{" "}
              <span className="location-heading-highlight">Outside India</span>
            </h2>

            {/* Loop-de-loop Flight Route stretching from right of heading to right edge */}
            <div
              ref={routeTrackRef}
              className="location-route-track"
              aria-hidden="true"
            >
              <svg
                className="location-route-svg"
                viewBox={`0 0 ${Math.max(trackWidth, 60)} ${ROUTE_TRACK_HEIGHT}`}
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
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.82" />
                    <stop offset="48%" stopColor="#0ea5e9" stopOpacity="1" />
                    <stop offset="100%" stopColor="#006ce4" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Subtle Soft Sky Glow Guide Under the Dashed Loop Trail */}
                <path
                  d={route.d}
                  stroke="rgba(14, 165, 233, 0.13)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                {/* Crisp Gradient Dashed Flight Trail */}
                <path
                  d={route.d}
                  stroke={`url(#${routeGradientId})`}
                  strokeWidth="2.2"
                  strokeDasharray="6.5 5.5"
                  strokeLinecap="round"
                />

                {/* Polished Route Origin Anchor Dot */}
                <circle
                  cx={route.startX}
                  cy={route.startY}
                  r="5.2"
                  fill="rgba(96, 165, 250, 0.2)"
                />
                <circle
                  cx={route.startX}
                  cy={route.startY}
                  r="2.9"
                  fill="#0ea5e9"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                />

                {/* Subtle Destination Anchor Point beneath Pin Tip */}
                <circle
                  cx={route.endX}
                  cy={route.endY}
                  r="2.6"
                  fill="rgba(239, 68, 68, 0.3)"
                />
              </svg>

              {/* Destination Location Pin Icon at the End of the Route */}
              <div className="route-destination-pin" title="Destination Landmark">
                <span className="route-pin-ripple"></span>
                <span className="route-pin-ripple route-pin-ripple-delay"></span>
                <svg
                  className="route-pin-svg"
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

              {/* Plane-Only Animated Flight following the exact loop-de-loop curve */}
              <div
                className="route-active-vehicle"
                style={planeMotionStyle}
              >
                <svg
                  className="vehicle-icon plane-icon"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="#006ce4"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <p className="location-section-desc">
            Discover iconic international cities, exotic getaways, and world-famous travel hotspots beyond India.
          </p>
        </div>

        {/* Swiper: Shows four and a half destination cards on desktop */}
        <div className="location-swiper-wrapper">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              momentum: true,
            }}
            slidesPerView={2.1}
            spaceBetween={10}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            breakpoints={{
              451: {
                slidesPerView: 2.5,
                spaceBetween: 11,
              },
              576: {
                slidesPerView: 3.1,
                spaceBetween: 12,
              },
              877: {
                slidesPerView: 3.4,
                spaceBetween: 14,
              },
              1100: {
                slidesPerView: 4.5,
                spaceBetween: 16,
              },
            }}
            className="location-swiper"
          >
            {LOCATION_ITEMS.map((loc) => (
              <SwiperSlide key={loc.id} className="location-swiper-slide">
                <Link
                  href={`/allHotels?${new URLSearchParams({ city: loc.name }).toString()}`}
                  className="location-card"
                  title={`Explore ${loc.name}, ${loc.country}`}
                >
                  {/* Background Destination Photo */}
                  <div className="location-image-wrapper">
                    <Image
                      src={loc.image}
                      alt={`${loc.name}, ${loc.country}`}
                      fill
                      sizes="(max-width: 450px) 46vw, (max-width: 678px) 38vw, (max-width: 1099px) 30vw, 220px"
                      className="location-card-img"
                      priority={false}
                    />
                  </div>

                  {/* Top Right Subtle Travel Badge */}
                  <div className="location-card-top-badge" aria-hidden="true">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </div>

                  {/* Gradient Overlay for Text Contrast */}
                  <div className="location-card-overlay" aria-hidden="true"></div>

                  {/* Shimmer Light Sweep Effect on Hover */}
                  <div className="location-card-shimmer" aria-hidden="true"></div>

                  {/* Sleek Bottom Accent Line on Hover */}
                  <div className="location-bottom-accent-bar" aria-hidden="true"></div>

                  {/* Bottom Content Bar: Location Details on Left, Rating Pill on Right */}
                  <div className="location-card-bottom">
                    {/* Location Pin & Name */}
                    <div className="location-meta-left">
                      <div className="location-pin-icon" aria-hidden="true">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                        </svg>
                      </div>
                      <div className="location-text-wrap">
                        <span className="location-name">{loc.name}</span>
                        <span className="location-country">{loc.country}</span>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="location-rating-badge">
                      <svg
                        className="location-star-icon"
                        width="11.5"
                        height="11.5"
                        viewBox="0 0 24 24"
                        fill="#facc15"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="location-rating-num">{loc.rating}</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
