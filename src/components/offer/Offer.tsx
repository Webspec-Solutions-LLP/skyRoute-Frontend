"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "./Offer.css";

export interface OfferItem {
  id: string;
  eyebrow: string;
  titlePrefix: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  link: string;
}

export const OFFER_ITEMS: OfferItem[] = [
  {
    id: "special-travel-deals",
    eyebrow: "Special Travel Deals",
    titlePrefix: "Get Up to",
    highlight: "50% OFF",
    subtitle: "Book now and save more on your next trip!",
    ctaText: "Grab the Deal",
    image: "/images/offer1.png",
    imageAlt: "Tropical beach luggage and straw hat travel deal",
    imagePosition: "left 84%",
    link: "/hotel",
  },
  {
    id: "summer-island-escapes",
    eyebrow: "Summer Island Escapes",
    titlePrefix: "Save Up to",
    highlight: "40% OFF",
    subtitle: "Exclusive flight & resort bundles across coastal paradises!",
    ctaText: "Grab the Deal",
    image: "/images/offer2.png",
    imageAlt: "Mediterranean coastal hillside island vacation offer",
    imagePosition: "left 52%",
    link: "/hotel",
  },
  {
    id: "luxury-beach-getaways",
    eyebrow: "Luxury Beach Getaways",
    titlePrefix: "Enjoy Flat",
    highlight: "35% OFF",
    subtitle: "Unwind in overwater villas with complimentary airport transfers!",
    ctaText: "Grab the Deal",
    image: "/images/offer3.png",
    imageAlt: "Maldives sunset overwater villas getaway offer",
    imagePosition: "left 55%",
    link: "/hotel",
  },
];

export default function Offer() {
  return (
    <section className="skyroute-offer-section" aria-label="Special Travel Deals">
      {/* 1320px Standard Container */}
      <div className="skyroute-offer-container">
        <div className="offer-swiper-wrapper">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              sticky: true,
              momentum: true,
            }}
            slidesPerView={1.2}
            spaceBetween={10}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            breakpoints={{
              451: {
                slidesPerView: 1.2,
                spaceBetween: 11,
              },
              576: {
                slidesPerView: 1.2,
                spaceBetween: 12,
              },
              679: {
                slidesPerView: 1.2,
                spaceBetween: 14,
              },
              877: {
                slidesPerView: 1.2,
                spaceBetween: 15,
              },
              1100: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              1300: {
                slidesPerView: 1.2,
                spaceBetween: 18,
              },
            }}
            className="offer-swiper"
          >
            {OFFER_ITEMS.map((offer, index) => (
              <SwiperSlide key={offer.id} className="offer-swiper-slide">
                <div className="offer-banner-card">
                  {/* Left Visual Photo Layer */}
                  <div className="offer-banner-media" aria-hidden="true">
                    <Image
                      src={offer.image}
                      alt={offer.imageAlt}
                      fill
                      sizes="(max-width: 678px) 90vw, (max-width: 1299px) 48vw, 560px"
                      className="offer-banner-img"
                      style={{ objectPosition: offer.imagePosition }}
                      priority={index === 0}
                    />
                  </div>

                  {/* Seamless Deep Blue Gradient Blend Layer */}
                  <div className="offer-banner-overlay" aria-hidden="true" />

                  {/* Banner Text + CTA Content */}
                  <div className="offer-banner-content">
                    <div className="offer-banner-copy">
                      <span className="offer-banner-eyebrow">{offer.eyebrow}</span>
                      <h2 className="offer-banner-title">
                        {offer.titlePrefix}{" "}
                        <span className="offer-banner-highlight">{offer.highlight}</span>
                      </h2>
                      <p className="offer-banner-subtitle">{offer.subtitle}</p>
                    </div>

                    <Link href={offer.link} className="offer-banner-cta">
                      <span>{offer.ctaText}</span>
                      <svg
                        className="offer-banner-cta-arrow"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
