"use client";

import React from "react";
import Image from "next/image";
import "./HotelService.css";

export interface HotelServiceItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  alt: string;
}

export const HOTEL_SERVICES: HotelServiceItem[] = [
  {
    id: "wifi",
    title: "Free Wi-Fi",
    tag: "High-Speed",
    description: "Fast, reliable wireless internet in all rooms & public areas",
    image: "/images/hotelService/service1-wifi-3d.png",
    alt: "Free high-speed Wi-Fi for all hotel guests",
  },
  {
    id: "ac",
    title: "AC rooms",
    tag: "Climate Control",
    description: "Modern air-conditioning with individual temperature control",
    image: "/images/hotelService/service2-ac-3d.png",
    alt: "Fully air-conditioned hotel rooms with remote control",
  },
  {
    id: "clean",
    title: "Clean rooms",
    tag: "Sanitized",
    description: "Immaculately sanitized spaces with fresh, crisp premium linens",
    image: "/images/hotelService/service3-clean-3d.png",
    alt: "Sparkling clean hotel rooms with fresh comfortable bedding",
  },
  {
    id: "toiletries",
    title: "Essential toiletries",
    tag: "Complimentary",
    description: "Complimentary bath essentials, soaps, and plush clean towels",
    image: "/images/hotelService/service4-toiletries-3d.png",
    alt: "Essential bath toiletries, shampoo and fresh towels kit",
  },
  {
    id: "staff",
    title: "Helpful staff",
    tag: "24/7 Service",
    description: "Dedicated 24/7 front desk team ready for check-in and assistance",
    image: "/images/hotelService/service5-staff-3d.png",
    alt: "Friendly and helpful 24/7 hotel front-desk concierge staff",
  },
];

export default function HotelService() {
  return (
    <section
      className="skyroute-hotel-service-section"
      aria-label="Hotel Services and Amenities"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-hotel-service-container">
        
        {/* Header Section: Heading matching rest of project, NO description */}
        <div className="hotel-service-section-header">
          <h2 className="hotel-service-section-heading">
            Essential{" "}
            <span className="hotel-service-heading-highlight">
              Hotel Amenities
            </span>
          </h2>
        </div>

        {/* 5-Card Modern Amenities Showcase (6px border-radius, 1320px width) */}
        <div className="hotel-services-grid">
          {HOTEL_SERVICES.map((service) => (
            <article key={service.id} className="hotel-service-card">
              {/* Top Subtle Status Bar */}
              <div className="hotel-service-top-bar">
                <span className="hotel-service-status-dot" aria-hidden="true">
                  <span className="status-ping" />
                  <span className="status-core" />
                </span>
                <span className="hotel-service-tag">{service.tag}</span>
              </div>

              {/* 3D Visual Stage with Soft Illuminated Podium */}
              <div className="hotel-service-visual-stage">
                <div className="hotel-service-podium-glow" aria-hidden="true" />
                <div className="hotel-service-icon-wrap">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    width={170}
                    height={124}
                    className="hotel-service-3d-img"
                    priority
                  />
                </div>
              </div>

              {/* Content Block */}
              <div className="hotel-service-body">
                <h3 className="hotel-service-title">{service.title}</h3>
                <p className="hotel-service-desc">{service.description}</p>

                {/* Bottom Assurance Seal */}
                <div className="hotel-service-seal">
                  <svg
                    className="seal-check-icon"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>SkyRoute Assured</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
