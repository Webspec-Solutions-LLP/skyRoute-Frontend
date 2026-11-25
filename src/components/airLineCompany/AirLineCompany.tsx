"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "./AirLineCompany.css";

export type AirlineTheme =
  | "indigo"
  | "air-india"
  | "express"
  | "akasa"
  | "spicejet"
  | "qatar";

export interface AirlineCompanyItem {
  id: string;
  name: string;
  code: string;
  tagline: string;
  image: string;
  alt: string;
  theme: AirlineTheme;
  link: string;
}

export const AIRLINE_COMPANIES: AirlineCompanyItem[] = [
  {
    id: "indigo",
    name: "IndiGo",
    code: "6E",
    tagline: "On-time network",
    image: "/images/airline1.png",
    alt: "IndiGo airline tail logo",
    theme: "indigo",
    link: "/allFlights?airline=indigo",
  },
  {
    id: "air-india",
    name: "Air India",
    code: "AI",
    tagline: "Full-service carrier",
    image: "/images/airline2.png",
    alt: "Air India airline tail logo",
    theme: "air-india",
    link: "/allFlights?airline=air-india",
  },
  {
    id: "air-india-express",
    name: "Air India Express",
    code: "IX",
    tagline: "Smart value fares",
    image: "/images/airline3.png",
    alt: "Air India Express airline tail logo",
    theme: "express",
    link: "/allFlights?airline=air-india-express",
  },
  {
    id: "akasa-air",
    name: "Akasa Air",
    code: "QP",
    tagline: "Modern sky fleet",
    image: "/images/airline4.png",
    alt: "Akasa Air airline tail logo",
    theme: "akasa",
    link: "/allFlights?airline=akasa-air",
  },
  {
    id: "spicejet",
    name: "SpiceJet",
    code: "SG",
    tagline: "Everyday low fares",
    image: "/images/airline5.png",
    alt: "SpiceJet airline tail logo",
    theme: "spicejet",
    link: "/allFlights?airline=spicejet",
  },
  {
    id: "alliance-air",
    name: "Alliance Air",
    code: "9I",
    tagline: "Regional & heritage",
    image: "/images/airline6.png",
    alt: "Alliance Air airline tail logo",
    theme: "qatar",
    link: "/allFlights?airline=alliance-air",
  },
];

export default function AirLineCompany() {
  return (
    <section
      className="skyroute-airline-co-section"
      aria-label="Our Popular Airline"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-airline-co-container">
        {/* Heading Matching Other Sections (No Description) */}
        <div className="airline-co-header">
          <h2 className="airline-co-heading">
            Our Popular{" "}
            <span className="airline-co-heading-highlight">Airline</span>
          </h2>
        </div>

        {/* Swiper Carousel Showing 5.2 Airline Cards on Desktop */}
        <div className="airline-co-swiper-wrapper">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              momentum: true,
            }}
            slidesPerView={1.5}
            spaceBetween={12}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            breakpoints={{
              460: {
                slidesPerView: 2.2,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 3.1,
                spaceBetween: 14,
              },
              900: {
                slidesPerView: 4.2,
                spaceBetween: 14,
              },
              1200: {
                slidesPerView: 5.2,
                spaceBetween: 16,
              },
            }}
            className="airline-co-swiper"
          >
            {AIRLINE_COMPANIES.map((airline) => (
              <SwiperSlide key={airline.id} className="airline-co-slide">
                <Link
                  href={airline.link}
                  className={`airline-co-card theme-${airline.theme}`}
                  title={`Explore ${airline.name} flights`}
                >
                  {/* Decorative Translucent Wing Glow */}
                  <span className="airline-co-orb" aria-hidden="true" />

                  {/* Top Row: Demo Tail-Fin Logo Image + IATA Code Pill */}
                  <div className="airline-co-card-top">
                    <div className="airline-co-logo-pad">
                      <Image
                        src={airline.image}
                        alt={airline.alt}
                        fill
                        sizes="72px"
                        className="airline-logo-img"
                      />
                    </div>
                    <span className="airline-co-code">{airline.code}</span>
                  </div>

                  {/* Bottom Row: Airline Name + Tagline + Arrow */}
                  <div className="airline-co-card-bottom">
                    <div className="airline-co-text">
                      <h3 className="airline-co-name">{airline.name}</h3>
                      <span className="airline-co-tagline">
                        {airline.tagline}
                      </span>
                    </div>

                    <span className="airline-co-arrow" aria-hidden="true">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
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
