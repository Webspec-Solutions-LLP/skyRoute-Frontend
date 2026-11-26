"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "./Hotel.css";

export type HotelCityKey = "Bangalore" | "Goa" | "Mumbai";

export interface HotelItem {
  id: string;
  name: string;
  area: string;
  city: HotelCityKey;
  category: string;
  rating: string;
  ratingLabel: string;
  price: string;
  amenities: string[];
  image: string;
  alt: string;
  link: string;
}

const CITY_TABS: HotelCityKey[] = ["Bangalore", "Goa", "Mumbai"];

export const HOTELS_BY_CITY: Record<HotelCityKey, HotelItem[]> = {
  Bangalore: [
    {
      id: "blr-1",
      name: "The Veranda Suites Indiranagar",
      area: "Indiranagar, Bangalore",
      city: "Bangalore",
      category: "Boutique Stay",
      rating: "9.4",
      ratingLabel: "Superb",
      price: "₹2,755",
      amenities: ["Free Wi-Fi", "Balcony"],
      image: "/images/hotel1.png",
      alt: "Bright modern hotel room with patio greenery in Bangalore",
      link: "/hotels/veranda-suites-indiranagar",
    },
    {
      id: "blr-2",
      name: "Oakwood Manor Whitefield",
      area: "Whitefield, Bangalore",
      city: "Bangalore",
      category: "Executive Suite",
      rating: "9.1",
      ratingLabel: "Superb",
      price: "₹3,420",
      amenities: ["Breakfast", "Lounge"],
      image: "/images/hotel2.png",
      alt: "Warm wood-paneled executive suite with seating area",
      link: "/hotels/oakwood-manor-whitefield",
    },
    {
      id: "blr-3",
      name: "Solace Residency Sarjapur",
      area: "Sarjapur Road, Bangalore",
      city: "Bangalore",
      category: "Cozy Studio",
      rating: "8.9",
      ratingLabel: "Fabulous",
      price: "₹1,890",
      amenities: ["Free Wi-Fi", "Workspace"],
      image: "/images/hotel3.png",
      alt: "Minimalist bright wooden bed suite in Sarjapur",
      link: "/hotels/solace-residency-sarjapur",
    },
    {
      id: "blr-4",
      name: "Olive Crest Koramangala",
      area: "Koramangala, Bangalore",
      city: "Bangalore",
      category: "Designer Room",
      rating: "8.8",
      ratingLabel: "Fabulous",
      price: "₹2,150",
      amenities: ["Free Cancel", "Breakfast"],
      image: "/images/hotel4.png",
      alt: "Olive green accent wall hotel bedroom with warm lighting",
      link: "/hotels/olive-crest-koramangala",
    },
    {
      id: "blr-5",
      name: "Skyline Grand MG Road",
      area: "MG Road, Bangalore",
      city: "Bangalore",
      category: "Luxury Suite",
      rating: "9.5",
      ratingLabel: "Exceptional",
      price: "₹4,950",
      amenities: ["City View", "Breakfast"],
      image: "/images/hotel5.png",
      alt: "Luxury hotel suite with panoramic evening skyline view",
      link: "/hotels/skyline-grand-mg-road",
    },
    {
      id: "blr-6",
      name: "Banyan Retreat HSR Layout",
      area: "HSR Layout, Bangalore",
      city: "Bangalore",
      category: "Garden Villa",
      rating: "9.2",
      ratingLabel: "Superb",
      price: "₹3,180",
      amenities: ["Patio View", "Free Wi-Fi"],
      image: "/images/hotel6.png",
      alt: "Warm natural wood boutique bedroom with rattan lamps",
      link: "/hotels/banyan-retreat-hsr",
    },
  ],
  Goa: [
    {
      id: "goa-1",
      name: "Palms & Sand Boutique Villa",
      area: "Candolim, North Goa",
      city: "Goa",
      category: "Beach Retreat",
      rating: "9.5",
      ratingLabel: "Exceptional",
      price: "₹4,120",
      amenities: ["Garden Patio", "Breakfast"],
      image: "/images/hotel6.png",
      alt: "Tropical boutique villa bedroom with palm views in Goa",
      link: "/hotels/palms-sand-candolim",
    },
    {
      id: "goa-2",
      name: "Sunlit Terrace Calangute",
      area: "Calangute, Goa",
      city: "Goa",
      category: "Coastal Stay",
      rating: "8.9",
      ratingLabel: "Fabulous",
      price: "₹2,480",
      amenities: ["Balcony", "Free Wi-Fi"],
      image: "/images/hotel1.png",
      alt: "Sunlit coastal bedroom opening to sunny terrace",
      link: "/hotels/sunlit-terrace-calangute",
    },
    {
      id: "goa-3",
      name: "Casa Verde Anjuna",
      area: "Anjuna, North Goa",
      city: "Goa",
      category: "Boutique Room",
      rating: "9.0",
      ratingLabel: "Superb",
      price: "₹2,890",
      amenities: ["Pool Access", "Free Cancel"],
      image: "/images/hotel4.png",
      alt: "Warm olive-toned boutique hotel room in Anjuna",
      link: "/hotels/casa-verde-anjuna",
    },
    {
      id: "goa-4",
      name: "Amber Haven Panjim",
      area: "Panjim, Goa",
      city: "Goa",
      category: "Premium Suite",
      rating: "9.2",
      ratingLabel: "Superb",
      price: "₹3,650",
      amenities: ["Breakfast", "Lounge"],
      image: "/images/hotel2.png",
      alt: "Premium warm suite with lounge sofa in Panjim",
      link: "/hotels/amber-haven-panjim",
    },
    {
      id: "goa-5",
      name: "Breeze Studio Benaulim",
      area: "Benaulim, South Goa",
      city: "Goa",
      category: "Beach Studio",
      rating: "8.7",
      ratingLabel: "Very Good",
      price: "₹1,950",
      amenities: ["Free Wi-Fi", "Quiet Zone"],
      image: "/images/hotel3.png",
      alt: "Airy minimal hotel studio in South Goa",
      link: "/hotels/breeze-studio-benaulim",
    },
    {
      id: "goa-6",
      name: "Horizon Bay Dona Paula",
      area: "Dona Paula, Goa",
      city: "Goa",
      category: "Luxury Suite",
      rating: "9.4",
      ratingLabel: "Superb",
      price: "₹5,290",
      amenities: ["Bay View", "Breakfast"],
      image: "/images/hotel5.png",
      alt: "Luxury suite overlooking twilight coastal skyline",
      link: "/hotels/horizon-bay-dona-paula",
    },
  ],
  Mumbai: [
    {
      id: "bom-1",
      name: "Marina Skyline Residency",
      area: "Bandra West, Mumbai",
      city: "Mumbai",
      category: "Skyline Suite",
      rating: "9.6",
      ratingLabel: "Exceptional",
      price: "₹5,450",
      amenities: ["City View", "Breakfast"],
      image: "/images/hotel5.png",
      alt: "High-rise luxury suite with Mumbai skyline view",
      link: "/hotels/marina-skyline-bandra",
    },
    {
      id: "bom-2",
      name: "The Timber Loft Juhu",
      area: "Juhu, Mumbai",
      city: "Mumbai",
      category: "Executive Suite",
      rating: "9.2",
      ratingLabel: "Superb",
      price: "₹4,180",
      amenities: ["Lounge", "Free Cancel"],
      image: "/images/hotel2.png",
      alt: "Executive wood-accented suite in Juhu Mumbai",
      link: "/hotels/timber-loft-juhu",
    },
    {
      id: "bom-3",
      name: "Palm Courtyard Colaba",
      area: "Colaba, South Mumbai",
      city: "Mumbai",
      category: "Boutique Stay",
      rating: "9.1",
      ratingLabel: "Superb",
      price: "₹3,890",
      amenities: ["Breakfast", "Free Wi-Fi"],
      image: "/images/hotel6.png",
      alt: "Warm boutique hotel room in Colaba",
      link: "/hotels/palm-courtyard-colaba",
    },
    {
      id: "bom-4",
      name: "Cove Studio Powai",
      area: "Powai, Mumbai",
      city: "Mumbai",
      category: "Business Room",
      rating: "8.8",
      ratingLabel: "Fabulous",
      price: "₹2,640",
      amenities: ["Workspace", "Free Wi-Fi"],
      image: "/images/hotel3.png",
      alt: "Clean contemporary business room in Powai",
      link: "/hotels/cove-studio-powai",
    },
    {
      id: "bom-5",
      name: "Verdant Inn Andheri East",
      area: "Andheri East, Mumbai",
      city: "Mumbai",
      category: "Comfort Stay",
      rating: "8.7",
      ratingLabel: "Very Good",
      price: "₹2,390",
      amenities: ["Airport Shuttle", "Wi-Fi"],
      image: "/images/hotel4.png",
      alt: "Cozy modern bedroom near Mumbai airport",
      link: "/hotels/verdant-inn-andheri",
    },
    {
      id: "bom-6",
      name: "Breeze Patio Lower Parel",
      area: "Lower Parel, Mumbai",
      city: "Mumbai",
      category: "Urban Retreat",
      rating: "9.0",
      ratingLabel: "Superb",
      price: "₹3,250",
      amenities: ["Balcony", "Breakfast"],
      image: "/images/hotel1.png",
      alt: "Bright urban hotel room with private greenery balcony",
      link: "/hotels/breeze-patio-lower-parel",
    },
  ],
};

export default function Hotel() {
  const [activeCity, setActiveCity] = useState<HotelCityKey>("Bangalore");

  const hotels = HOTELS_BY_CITY[activeCity];

  return (
    <section
      className="skyroute-hotel-section"
      aria-label="Need hotels for your trip"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-hotel-container">
        {/* Header Section matching Category.tsx */}
        <div className="hotel-section-header">
          <div className="hotel-title-track-wrap">
            <h2 className="hotel-section-heading">
              Need{" "}
              <span className="hotel-heading-highlight">
                hotels for your trip
              </span>
            </h2>
          </div>

          <p className="hotel-section-desc">
            Handpicked stays, city-view suites, and cozy retreats across top destinations at transparent nightly rates.
          </p>
        </div>

        {/* Distinct Segmented City Tab Switcher + Explore Link */}
        <div className="hotel-toolbar-row">
          <div
            className="hotel-tabs-track"
            role="tablist"
            aria-label="Filter hotels by city"
          >
            {CITY_TABS.map((city) => {
              const isActive = activeCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`hotel-tab-pill ${isActive ? "is-active" : ""}`}
                  onClick={() => setActiveCity(city)}
                >
                  <span className="hotel-tab-dot" aria-hidden="true" />
                  <span>{city}</span>
                </button>
              );
            })}
          </div>

          <div className="hotel-toolbar-right">
            <Link
              href={`/allHotels?${new URLSearchParams({ city: activeCity }).toString()}`}
              className="hotel-see-more-link"
            >
              <span>Explore {activeCity} stays</span>
              <svg
                width="14"
                height="14"
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
            </Link>
          </div>
        </div>

        {/* Swiper Carousel (4.2 Cards Visible on Desktop) */}
        <div className="hotel-swiper-wrapper">
          <Swiper
            key={activeCity}
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              momentum: true,
            }}
            slidesPerView={1.4}
            spaceBetween={10}
            grabCursor={true}
            simulateTouch={true}
            watchOverflow={true}
            breakpoints={{
              451: {
                slidesPerView: 2.4,
                spaceBetween: 11,
              },
              576: {
                slidesPerView: 3.1,
                spaceBetween: 12,
              },
              877: {
                slidesPerView: 3.4,
                spaceBetween: 15,
              },
              1100: {
                slidesPerView: 4.2,
                spaceBetween: 18,
              },
            }}
            className="hotel-swiper"
          >
            {hotels.map((hotel) => (
              <SwiperSlide key={hotel.id} className="hotel-swiper-slide">
                <Link
                  href={`/bookingDetails?type=hotel&hotelId=${encodeURIComponent(hotel.id)}`}
                  className="hotel-card"
                  title={`${hotel.name} - ${hotel.area}`}
                >
                  {/* Top Media Frame with Category Pill & Frosted Rating Pill */}
                  <div className="hotel-card-media">
                    <Image
                      src={hotel.image}
                      alt={hotel.alt}
                      fill
                      sizes="(max-width: 450px) 72vw, (max-width: 678px) 44vw, (max-width: 1099px) 32vw, 310px"
                      className="hotel-card-img"
                    />
                    <div className="hotel-media-vignette" aria-hidden="true" />
                    <span className="hotel-category-pill">{hotel.category}</span>
                    <div className="hotel-rating-pill">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="#facc15"
                        aria-hidden="true"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="hotel-rating-score">{hotel.rating}</span>
                      <span className="hotel-rating-sep" aria-hidden="true">
                        ·
                      </span>
                      <span className="hotel-rating-word">
                        {hotel.ratingLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="hotel-card-body">
                    <div className="hotel-area-row">
                      <svg
                        className="hotel-area-pin"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                      </svg>
                      <span className="hotel-area-text">{hotel.area}</span>
                    </div>

                    <h3 className="hotel-card-name">{hotel.name}</h3>

                    <div className="hotel-amenities-row">
                      {hotel.amenities.map((amenity) => (
                        <span key={amenity} className="hotel-amenity-tag">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Dashed Price Footer Row */}
                    <div className="hotel-price-footer">
                      <div className="hotel-price-block">
                        <div className="hotel-price-line">
                          <span className="hotel-price-amount">
                            {hotel.price}
                          </span>
                          <span className="hotel-price-unit">/ night</span>
                        </div>
                        <span className="hotel-price-note">
                          Before taxes &amp; fees
                        </span>
                      </div>

                      <span className="hotel-view-chip" aria-hidden="true">
                        View
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
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </span>
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
