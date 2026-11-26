"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "./Category.css";

export interface CategoryItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  theme: "cyan" | "pink" | "green" | "orange" | "purple" | "teal" | "lime" | "blue";
  accentColor: string;
  link: string;
}

// Demo categories mapping to the user's provided images (category1.webp .. category5.webp)
export const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: "flights",
    title: "Flights",
    image: "/images/category1.webp",
    alt: "Passenger airplane flying high in clear blue sky",
    theme: "cyan",
    accentColor: "#0284c7",
    link: "/",
  },
  {
    id: "hotels",
    title: "Hotels",
    image: "/images/category2.webp",
    alt: "Luxurious modern hotel room with comfortable bed and ambient lighting",
    theme: "pink",
    accentColor: "#e11d48",
    link: "/hotel",
  },
  {
    id: "holidays",
    title: "Holidays",
    image: "/images/category3.webp",
    alt: "Scenic tropical holiday destination with palm trees and ocean shore",
    theme: "green",
    accentColor: "#059669",
    link: "/hotel",
  },
  {
    id: "packages",
    title: "Packages",
    image: "/images/category4.webp",
    alt: "Famous travel package landmark Eiffel Tower Paris skyline",
    theme: "orange",
    accentColor: "#ea580c",
    link: "/package",
  },
  {
    id: "bus",
    title: "Bus",
    image: "/images/category5.webp",
    alt: "Modern comfortable tourist coach bus on city highway",
    theme: "purple",
    accentColor: "#7c3aed",
    link: "/bus",
  },
  {
    id: "cruises",
    title: "Cruises",
    image: "/images/category1.webp",
    alt: "Majestic luxury ocean cruise liner ship sailing on blue waters",
    theme: "teal",
    accentColor: "#0d9488",
    link: "/cruises",
  },
  {
    id: "car-rentals",
    title: "Car Rentals",
    image: "/images/category2.webp",
    alt: "Modern rental automobile parked outdoors",
    theme: "lime",
    accentColor: "#65a30d",
    link: "/car-rentals",
  },
  {
    id: "city-tours",
    title: "City Tours",
    image: "/images/category3.webp",
    alt: "Exciting city tours, sightseeing excursions and cultural experiences",
    theme: "blue",
    accentColor: "#2563eb",
    link: "/tours",
  },
  {
    id: "adventures",
    title: "Adventures",
    image: "/images/category4.webp",
    alt: "Thrilling outdoor adventures and trekking tours",
    theme: "orange",
    accentColor: "#f59e0b",
    link: "/adventures",
  },
  {
    id: "transfers",
    title: "Transfers",
    image: "/images/category5.webp",
    alt: "Airport and intercity shuttle transfer vehicles",
    theme: "purple",
    accentColor: "#8b5cf6",
    link: "/transfers",
  },
];

export default function Category() {
  return (
    <section className="skyroute-category-section" aria-label="Explore Travel Categories">
      {/* 1320px Main Container */}
      <div className="skyroute-category-container">
        
        {/* Header Section: Heading on Left with Flight Trail attached directly to its right */}
        <div className="category-section-header">
          <div className="category-title-track-wrap">
            <h2 className="category-section-heading">
              Explore <span className="category-heading-highlight">Travel Categories</span>
            </h2>
          </div>

          <p className="category-section-desc">
            Discover a world of possibilities with SkyRoute — seamless bookings, endless adventures, and unforgettable journeys.
          </p>
        </div>

        {/* Swiper Outer Wrapper: Horizontally bounded within 1320px with matching left & right margins */}
        <div className="category-swiper-wrapper">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              momentum: true,
            }}
            slidesPerView={2.4}
            spaceBetween={10}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            breakpoints={{
              451: {
                slidesPerView: 3.1,
                spaceBetween: 12,
              },
              679: {
                slidesPerView: 4.1,
                spaceBetween: 14,
              },
              877: {
                slidesPerView: 4.7,
                spaceBetween: 16,
              },
              1300: {
                slidesPerView: 5.2,
                spaceBetween: 20,
              },
            }}
            className="category-swiper"
          >
            {CATEGORY_ITEMS.map((item) => (
              <SwiperSlide key={item.id} className="category-swiper-slide">
                <Link
                  href={item.link}
                  className={`category-card theme-${item.theme}`}
                  title={`Explore ${item.title}`}
                >
                  {/* Organic Layered Fluid Blob Background */}
                  <div className="category-blob-canvas" aria-hidden="true">
                    <div className="blob-layer blob-back"></div>
                    <div className="blob-layer blob-front"></div>
                  </div>

                  {/* Card Content: Rounded Image + Category Title + Custom Arrow */}
                  <div className="category-card-body">
                    <div className="category-image-container">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 450px) 160px, (max-width: 678px) 200px, (max-width: 876px) 210px, 260px"
                        className="category-image"
                        priority={false}
                      />
                    </div>

                    <div className="category-card-info">
                      <h3 className="category-card-title">{item.title}</h3>
                      {/* Custom Arrow: Line with tick mark and arrow head (──|──►) */}
                      <div className="category-arrow-wrap" aria-hidden="true">
                        <svg
                          className="category-arrow-svg"
                          width="36"
                          height="14"
                          viewBox="0 0 36 14"
                          fill="none"
                        >
                          <path
                            d="M2 7H32M32 7L25 2.5M32 7L25 11.5"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="16"
                            y1="3.5"
                            x2="16"
                            y2="10.5"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
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

