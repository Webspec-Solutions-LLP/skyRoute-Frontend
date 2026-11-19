"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "./GovtBus.css";

export interface GovtBusOperator {
  id: string;
  code: string;
  fullName: string;
  state: string;
  routesCount: string;
  serviceTypes: string;
  logo: string;
  cityImage: string;
  cityAlt: string;
  href: string;
}

export const GOVT_BUS_OPERATORS: GovtBusOperator[] = [
  {
    id: "prtc",
    code: "PRTC",
    fullName: "PEPSU Road Transport Corporation",
    state: "Punjab",
    routesCount: "480+ Routes",
    serviceTypes: "Volvo AC • Ordinary",
    logo: "/images/bus/busStateLogo1.png",
    cityImage: "/images/bus/city1.png",
    cityAlt: "Golden Temple in Amritsar, Punjab",
    href: "/bus?operator=PRTC#search-widget",
  },
  {
    id: "jksrtc",
    code: "JKSRTC",
    fullName: "Jammu & Kashmir State Road Transport Corporation",
    state: "Jammu & Kashmir",
    routesCount: "260+ Routes",
    serviceTypes: "AC Deluxe • Sleeper",
    logo: "/images/bus/busStateLogo2.png",
    cityImage: "/images/bus/city2.png",
    cityAlt: "Dal Lake and Himalayan mountains in Srinagar, Jammu & Kashmir",
    href: "/bus?operator=JKSRTC#search-widget",
  },
  {
    id: "osrtc",
    code: "OSRTC",
    fullName: "Odisha State Road Transport Corporation",
    state: "Odisha",
    routesCount: "390+ Routes",
    serviceTypes: "AC Sleeper • Express",
    logo: "/images/bus/busStateLogo3.png",
    cityImage: "/images/bus/city4.png",
    cityAlt: "Konark Sun Temple chariot wheel in Odisha",
    href: "/bus?operator=OSRTC#search-widget",
  },
  {
    id: "hrtc",
    code: "HRTC",
    fullName: "Himachal Road Transport Corporation",
    state: "Himachal Pradesh",
    routesCount: "520+ Routes",
    serviceTypes: "Himsuta Volvo • Ordinary",
    logo: "/images/bus/busStateLogo4.png",
    cityImage: "/images/bus/city3.png",
    cityAlt: "Christ Church on the Ridge in Shimla, Himachal Pradesh",
    href: "/bus?operator=HRTC#search-widget",
  },
  {
    id: "wbtc",
    code: "WBTC",
    fullName: "West Bengal Transport Corporation",
    state: "West Bengal",
    routesCount: "610+ Routes",
    serviceTypes: "Volvo AC • Rocket Bus",
    logo: "/images/bus/busStateLogo5.png",
    cityImage: "/images/bus/city5.png",
    cityAlt: "Victoria Memorial in Kolkata, West Bengal",
    href: "/bus?operator=WBTC#search-widget",
  },
  {
    id: "trtc",
    code: "TRTC",
    fullName: "Tripura Road Transport Corporation",
    state: "Tripura",
    routesCount: "180+ Routes",
    serviceTypes: "AC Coach • Intercity",
    logo: "/images/bus/busStateLogo6.png",
    cityImage: "/images/bus/city6.png",
    cityAlt: "Neermahal water palace in Tripura",
    href: "/bus?operator=TRTC#search-widget",
  },
];

export default function GovtBus() {
  return (
    <section
      className="skyroute-govtbus-section"
      aria-label="Government Bus Ticket Booking"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-govtbus-container">
        {/* Clean Heading Row (No Description, No Pagination Buttons) */}
        <div className="govtbus-section-header">
          <h2 className="govtbus-section-heading">
            Government{" "}
            <span className="govtbus-heading-highlight">
              Bus Ticket Booking
            </span>
          </h2>
        </div>

        {/* Swiper Carousel Bounded Inside 1320px Container */}
        <div className="govtbus-swiper-wrapper">
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
                slidesPerView: 4.35,
                spaceBetween: 16,
              },
            }}
            className="govtbus-swiper"
          >
            {GOVT_BUS_OPERATORS.map((item) => (
              <SwiperSlide key={item.id} className="govtbus-swiper-slide">
                <Link
                  href={item.href}
                  className="govtbus-card"
                  title={`Book ${item.code} (${item.fullName}) tickets`}
                >
                  {/* Top Unobstructed State Monument Photo */}
                  <div className="govtbus-media-wrap">
                    <Image
                      src={item.cityImage}
                      alt={item.cityAlt}
                      fill
                      sizes="(max-width: 480px) 80vw, (max-width: 992px) 36vw, 300px"
                      className="govtbus-city-img"
                    />
                    <div className="govtbus-media-tint" aria-hidden="true" />

                    {/* Official Partner Tag + State Pill */}
                    <div className="govtbus-media-top">
                      <span className="govtbus-official-pill">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Official RTC</span>
                      </span>

                      <span className="govtbus-state-pill">{item.state}</span>
                    </div>
                  </div>

                  {/* Official State Crest Emblem Anchored on the Photo-to-Body Seam */}
                  <div className="govtbus-body">
                    <div className="govtbus-crest-row">
                      <div className="govtbus-logo-ring">
                        <Image
                          src={item.logo}
                          alt={`${item.code} official logo`}
                          fill
                          sizes="56px"
                          className="govtbus-logo-img"
                        />
                      </div>

                      <div className="govtbus-code-meta">
                        <h3 className="govtbus-code">{item.code}</h3>
                        <span className="govtbus-routes-count">
                          {item.routesCount}
                        </span>
                      </div>
                    </div>

                    <p className="govtbus-fullname">{item.fullName}</p>
                  </div>

                  {/* Curtain-Fill Official Footer Strip */}
                  <div className="govtbus-footer">
                    <span className="govtbus-service-tag">
                      {item.serviceTypes}
                    </span>

                    <span className="govtbus-book-cta">
                      <span>Book</span>
                      <svg
                        className="govtbus-cta-arrow"
                        width="13"
                        height="13"
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
