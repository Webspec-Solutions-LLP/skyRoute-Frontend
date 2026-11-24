"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "./Location2.css";

export interface IndiaDestinationItem {
  id: string;
  city: string;
  state: string;
  accommodations: string;
  image: string;
  alt: string;
  link: string;
}

export const INDIA_DESTINATIONS: IndiaDestinationItem[] = [
  {
    id: "mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    accommodations: "4,177",
    image: "/images/location8.png",
    alt: "Gateway of India landmark in Mumbai",
    link: "/destinations/mumbai",
  },
  {
    id: "new-delhi",
    city: "New Delhi",
    state: "Delhi NCR",
    accommodations: "12,786",
    image: "/images/location9.png",
    alt: "India Gate monument in New Delhi",
    link: "/destinations/new-delhi",
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    accommodations: "2,735",
    image: "/images/location12.png",
    alt: "Charminar historic monument in Hyderabad",
    link: "/destinations/hyderabad",
  },
  {
    id: "chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    accommodations: "2,832",
    image: "/images/location10.png",
    alt: "Kapaleeshwarar Temple gopuram in Chennai",
    link: "/destinations/chennai",
  },
  {
    id: "kolkata",
    city: "Kolkata",
    state: "West Bengal",
    accommodations: "3,140",
    image: "/images/location11.png",
    alt: "Howrah Bridge and Hooghly River in Kolkata",
    link: "/destinations/kolkata",
  },
  {
    id: "ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    accommodations: "1,965",
    image: "/images/location13.png",
    alt: "Historic carved archway monument in Ahmedabad",
    link: "/destinations/ahmedabad",
  },
];

const ROUTE_TRACK_HEIGHT = 44;

function buildRoutePath(width: number): {
  d: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
} {
  const safeWidth = Math.max(width, 160);
  const startX = 8;
  const startY = 30;
  const endX = safeWidth - 14;
  const endY = 25;
  const span = endX - startX;

  const cp1x = +(startX + span * 0.18).toFixed(1);
  const cp2x = +(startX + span * 0.36).toFixed(1);
  const midX = +(startX + span * 0.54).toFixed(1);
  const cp3x = +(startX + span * 0.72).toFixed(1);
  const cp4x = +(startX + span * 0.88).toFixed(1);

  return {
    d: `M ${startX} ${startY} C ${cp1x} 9, ${cp2x} 9, ${midX} 23 C ${cp3x} 37, ${cp4x} 36, ${endX} ${endY}`,
    startX,
    startY,
    endX,
    endY,
  };
}

export default function Location2() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const routeTrackRef = useRef<HTMLDivElement | null>(null);
  const rawId = useId();
  const routeGradientId = `loc2-route-grad-${rawId.replace(/:/g, "")}`;
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [trackWidth, setTrackWidth] = useState(860);
  const [tripIndex, setTripIndex] = useState(0);

  const vehicleType: "bus" | "plane" = tripIndex % 2 === 0 ? "bus" : "plane";
  const route = buildRoutePath(trackWidth);

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

  const syncNavState = (swiper: SwiperInstance) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const vehicleMotionStyle: React.CSSProperties & {
    WebkitOffsetPath?: string;
  } = {
    offsetPath: `path("${route.d}")`,
    WebkitOffsetPath: `path("${route.d}")`,
  };

  return (
    <section
      className="skyroute-location2-section"
      aria-label="Top destinations in India"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-location2-container">
        {/* Header Section: Heading + Animated Route Track on Top, Description + Nav Controls Below */}
        <div className="location2-section-header">
          <div className="location2-title-track-wrap">
            <h2 className="location2-section-heading">
              Top Destinations in{" "}
              <span className="location2-heading-highlight">India</span>
            </h2>

            {/* Polished Route Track stretching seamlessly to the right edge */}
            <div
              ref={routeTrackRef}
              className="location2-route-track"
              aria-hidden="true"
            >
              <svg
                className="location2-route-svg"
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
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.72" />
                    <stop offset="50%" stopColor="#0ea5e9" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Subtle Soft Glow Guide Under the Dashed Route */}
                <path
                  d={route.d}
                  stroke="rgba(14, 165, 233, 0.14)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                {/* Crisp Gradient Dashed Travel Path */}
                <path
                  d={route.d}
                  stroke={`url(#${routeGradientId})`}
                  strokeWidth="2.2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />

                {/* Polished Route Origin Anchor Dot */}
                <circle
                  cx={route.startX}
                  cy={route.startY}
                  r="5.5"
                  fill="rgba(14, 165, 233, 0.16)"
                />
                <circle
                  cx={route.startX}
                  cy={route.startY}
                  r="3"
                  fill="#0ea5e9"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                />

                {/* Subtle Destination Ground Point right beneath Pin Tip */}
                <circle
                  cx={route.endX}
                  cy={route.endY}
                  r="2.6"
                  fill="rgba(239, 68, 68, 0.3)"
                />
              </svg>

              {/* Destination Location Pin Icon at the End of the Route */}
              <div className="location2-route-pin" title="Destination Landmark">
                <span className="location2-pin-ripple"></span>
                <span className="location2-pin-ripple location2-pin-ripple-delay"></span>
                <svg
                  className="location2-pin-svg"
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

              {/* Dynamic Alternating Vehicle: Bus <-> Plane synced cleanly to route curve */}
              <div
                key={tripIndex}
                className="location2-route-vehicle"
                style={vehicleMotionStyle}
                onAnimationEnd={() => setTripIndex((prev) => prev + 1)}
              >
                {vehicleType === "plane" ? (
                  <svg
                    className="location2-vehicle-icon location2-plane-icon"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="#0284c7"
                  >
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                ) : (
                  <svg
                    className="location2-vehicle-icon location2-bus-icon"
                    width="26"
                    height="16"
                    viewBox="0 0 26 16"
                    fill="none"
                  >
                    <path
                      d="M3.5 2H21.2C22.9 2 24.3 3.2 24.6 4.9L25 7.5V11.2C25 12 24.4 12.6 23.6 12.6H22A2.6 2.6 0 0 0 16.8 12.6H9.2A2.6 2.6 0 0 0 4 12.6H2.4C1.6 12.6 1 12 1 11.2V4.5C1 3.12 2.12 2 3.5 2Z"
                      fill="#0284c7"
                    />
                    <rect x="3.2" y="4" width="4.6" height="3.4" rx="0.8" fill="#e0f2fe" />
                    <rect x="9.1" y="4" width="4.8" height="3.4" rx="0.8" fill="#e0f2fe" />
                    <rect x="15.2" y="4" width="4.4" height="3.4" rx="0.8" fill="#e0f2fe" />
                    <path
                      d="M20.8 4H22.2C22.7 4 23.1 4.35 23.2 4.85L23.6 7.4H20.8V4Z"
                      fill="#e0f2fe"
                    />
                    <circle cx="6.6" cy="12.5" r="2.2" fill="#0369a1" />
                    <circle cx="6.6" cy="12.5" r="1" fill="#ffffff" />
                    <circle cx="19.4" cy="12.5" r="2.2" fill="#0369a1" />
                    <circle cx="19.4" cy="12.5" r="1" fill="#ffffff" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="location2-header-bottom">
            <p className="location2-section-desc">
              Explore iconic Indian cities with curated stays, timeless heritage, and effortless travel planning.
            </p>

            <div className="location2-nav-controls" aria-label="Slider controls">
              <button
                type="button"
                className="location2-nav-btn"
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                aria-label="Previous destinations"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="location2-nav-btn"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                aria-label="Next destinations"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Swiper Carousel inside 1320px Boundaries */}
        <div className="location2-swiper-wrapper">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              sticky: true,
              momentum: true,
            }}
            slidesPerView={1.25}
            spaceBetween={12}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              syncNavState(swiper);
            }}
            onSlideChange={syncNavState}
            onReachBeginning={syncNavState}
            onReachEnd={syncNavState}
            onResize={syncNavState}
            breakpoints={{
              480: {
                slidesPerView: 1.9,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 2.8,
                spaceBetween: 16,
              },
              992: {
                slidesPerView: 3.6,
                spaceBetween: 16,
              },
              1200: {
                slidesPerView: 4.5,
                spaceBetween: 18,
              },
            }}
            className="location2-swiper"
          >
            {INDIA_DESTINATIONS.map((item) => (
              <SwiperSlide key={item.id} className="location2-swiper-slide">
                <Link
                  href={`/allHotels?${new URLSearchParams({ city: item.city }).toString()}`}
                  className="loc2-card"
                  title={`Explore stays in ${item.city}, ${item.state}`}
                >
                  {/* Framed Landmark Photo with State Badge */}
                  <div className="loc2-image-frame">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 480px) 80vw, (max-width: 992px) 36vw, 280px"
                      className="loc2-card-img"
                    />
                    <span className="loc2-state-pill">{item.state}</span>
                  </div>

                  {/* Distinct Editorial Footer */}
                  <div className="loc2-card-footer">
                    <div className="loc2-meta">
                      <h3 className="loc2-city-name">{item.city}</h3>
                      <p className="loc2-stays-line">
                        <svg
                          className="loc2-stays-icon"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M3 21h18" />
                          <path d="M5 21V7l8-4v18" />
                          <path d="M19 21V11l-6-4" />
                          <path d="M9 9v.01" />
                          <path d="M9 12v.01" />
                          <path d="M9 15v.01" />
                          <path d="M9 18v.01" />
                        </svg>
                        <span className="loc2-stays-count">
                          {item.accommodations}
                        </span>
                        <span className="loc2-stays-label">accommodations</span>
                      </p>
                    </div>

                    <span className="loc2-arrow-badge" aria-hidden="true">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17 17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </span>
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
