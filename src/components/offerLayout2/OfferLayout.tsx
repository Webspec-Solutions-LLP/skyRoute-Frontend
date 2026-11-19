"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "./OfferLayout.css";

export interface BusOfferItem {
  id: string;
  badge: string;
  discount: string;
  title: string;
  terms: string;
  code: string;
  image: string;
  alt: string;
  imagePosition: string;
  accent: "emerald" | "amber" | "coral" | "blue" | "crimson" | "cyan";
}

export const BUS_OFFER_ITEMS: BusOfferItem[] = [
  {
    id: "hill-rtc-500",
    badge: "State RTC Deal",
    discount: "Up to ₹500 OFF",
    title: "On Hill & Mountain Bus Routes",
    terms: "Min. fare ₹1,000 • AC & Volvo",
    code: "HILL500",
    image: "/images/bus/busoffer1.png",
    alt: "Green mountain highway coach bus offer banner",
    imagePosition: "72% center",
    accent: "emerald",
  },
  {
    id: "luxury-coach-15",
    badge: "Luxury Fleet",
    discount: "Flat 15% OFF",
    title: "On Volvo & AC Sleeper Buses",
    terms: "Max discount ₹450 • Intercity",
    code: "SKYBUS15",
    image: "/images/bus/busoffer2.png",
    alt: "Yellow luxury express coach on scenic highway",
    imagePosition: "52% center",
    accent: "amber",
  },
  {
    id: "express-rtc-300",
    badge: "Popular Offer",
    discount: "Up to ₹300 OFF",
    title: "On Express State RTC Bookings",
    terms: "Private & govt. operators",
    code: "RTC300",
    image: "/images/bus/busoffer3.png",
    alt: "Interstate highway express coach at sunset",
    imagePosition: "75% center",
    accent: "coral",
  },
  {
    id: "night-metro-200",
    badge: "UPI Instant",
    discount: "Flat ₹200 OFF",
    title: "On Overnight & Metro Coaches",
    terms: "Zero fee on UPI checkout",
    code: "NIGHT200",
    image: "/images/bus/busoffer4.png",
    alt: "Blue evening city coach bus with glowing light trails",
    imagePosition: "62% center",
    accent: "blue",
  },
  {
    id: "coastal-weekend-20",
    badge: "Weekend Deal",
    discount: "Up to 20% OFF",
    title: "On Coastal & Holiday Bus Trips",
    terms: "Valid on Fri–Sun bookings",
    code: "COAST20",
    image: "/images/bus/busoffer5.png",
    alt: "Red luxury coach driving along a coastal ocean highway",
    imagePosition: "58% 60%",
    accent: "crimson",
  },
  {
    id: "first-sleeper-250",
    badge: "New User",
    discount: "Flat ₹250 OFF",
    title: "On First AC Sleeper Ticket",
    terms: "Instant checkout savings",
    code: "FIRSTBUS",
    image: "/images/bus/busoffer6.png",
    alt: "Modern AC sleeper and executive coach buses",
    imagePosition: "65% center",
    accent: "cyan",
  },
];

export default function OfferLayout() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  return (
    <section
      className="skyroute-offer2-section"
      aria-label="Bus Booking Discount Offers"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-offer2-container">
        {/* Clean Heading Only (Matching SkyRoute Typography, No Description) */}
        <div className="offer2-section-header">
          <h2 className="offer2-section-heading">
            Bus Booking{" "}
            <span className="offer2-heading-highlight">Discount Offers</span>
          </h2>
        </div>

        {/* Swiper Carousel Bounded Inside 1320px Container */}
        <div className="offer2-swiper-wrapper">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              sticky: true,
              momentum: true,
            }}
            slidesPerView={1.15}
            spaceBetween={12}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            breakpoints={{
              540: {
                slidesPerView: 1.65,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 2.9,
                spaceBetween: 16,
              },
              1240: {
                slidesPerView: 3.2,
                spaceBetween: 16,
              },
            }}
            className="offer2-swiper"
          >
            {BUS_OFFER_ITEMS.map((offer) => {
              const isCopied = copiedId === offer.id;

              return (
                <SwiperSlide key={offer.id} className="offer2-swiper-slide">
                  <article className={`offer2-card offer2-accent-${offer.accent}`}>
                    {/* Full-Bleed Bus Offer Image */}
                    <Image
                      src={offer.image}
                      alt={offer.alt}
                      fill
                      sizes="(max-width: 540px) 88vw, (max-width: 1024px) 46vw, 410px"
                      className="offer2-bg-img"
                      style={{ objectPosition: offer.imagePosition }}
                    />

                    {/* Smooth Directional Gradient for High-Contrast Overlapping Copy */}
                    <div className="offer2-scrim" aria-hidden="true" />

                    {/* Overlapping Content Layer Directly Over Image */}
                    <div className="offer2-overlay-content">
                      {/* Top Row: Accent Badge + Terms Pill */}
                      <div className="offer2-top-row">
                        <span className="offer2-badge">{offer.badge}</span>
                        <span className="offer2-tc-tag">*T&amp;C Apply</span>
                      </div>

                      {/* Middle Offer Headline & Subtitle */}
                      <div className="offer2-copy">
                        <h3 className="offer2-discount">{offer.discount}</h3>
                        <p className="offer2-title">{offer.title}</p>
                        <span className="offer2-terms">{offer.terms}</span>
                      </div>

                      {/* Bottom Frosted Glass Promo Code Bar */}
                      <div className="offer2-coupon-glass">
                        <div className="offer2-code-group">
                          <span className="offer2-code-label">CODE</span>
                          <span className="offer2-code-value">{offer.code}</span>
                        </div>

                        <button
                          type="button"
                          className={`offer2-copy-btn ${isCopied ? "is-copied" : ""}`}
                          onClick={() => handleCopyCode(offer.id, offer.code)}
                          aria-label={`Copy coupon code ${offer.code}`}
                        >
                          {isCopied ? (
                            <>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <rect width="14" height="14" x="8" y="8" rx="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
