"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./TrainRoute.css";

export interface TrainHubRoute {
  from: string;
  to: string;
  label: string;
  href: string;
}

export interface TrainHubDestination {
  id: string;
  destination: string;
  title: string;
  stations: string;
  image: string;
  alt: string;
  trainsCount: string;
  routes: TrainHubRoute[];
}

export const POPULAR_TRAIN_HUBS: TrainHubDestination[] = [
  {
    id: "goa",
    destination: "Goa",
    title: "Trains to Goa",
    stations: "MAO • KRMI • THVM",
    image: "/images/location8.png",
    alt: "Scenic coastal beaches and palm trees of Goa",
    trainsCount: "35+ Daily Trains",
    routes: [
      {
        from: "Mumbai",
        to: "Goa",
        label: "Mumbai to Goa Trains",
        href: "/train?from=Mumbai&to=Goa#search-widget",
      },
      {
        from: "Bengaluru",
        to: "Goa",
        label: "Bengaluru to Goa Trains",
        href: "/train?from=Bengaluru&to=Goa#search-widget",
      },
      {
        from: "New Delhi",
        to: "Goa",
        label: "New Delhi to Goa Trains",
        href: "/train?from=New%20Delhi&to=Goa#search-widget",
      },
      {
        from: "Pune",
        to: "Goa",
        label: "Pune to Goa Trains",
        href: "/train?from=Pune&to=Goa#search-widget",
      },
    ],
  },
  {
    id: "mumbai",
    destination: "Mumbai",
    title: "Trains to Mumbai",
    stations: "CSMT • BCT • LTT • BDTS",
    image: "/images/location9.png",
    alt: "Iconic Gateway of India landmark in Mumbai",
    trainsCount: "120+ Daily Trains",
    routes: [
      {
        from: "Pune",
        to: "Mumbai",
        label: "Pune to Mumbai Trains",
        href: "/train?from=Pune&to=Mumbai#search-widget",
      },
      {
        from: "New Delhi",
        to: "Mumbai",
        label: "New Delhi to Mumbai Trains",
        href: "/train?from=New%20Delhi&to=Mumbai#search-widget",
      },
      {
        from: "Ahmedabad",
        to: "Mumbai",
        label: "Ahmedabad to Mumbai Trains",
        href: "/train?from=Ahmedabad&to=Mumbai#search-widget",
      },
      {
        from: "Surat",
        to: "Mumbai",
        label: "Surat to Mumbai Trains",
        href: "/train?from=Surat&to=Mumbai#search-widget",
      },
    ],
  },
  {
    id: "bengaluru",
    destination: "Bengaluru",
    title: "Trains to Bengaluru",
    stations: "SBC • YPR • SMVB • BNC",
    image: "/images/location10.png",
    alt: "Historic Vidhana Soudha architecture in Bengaluru",
    trainsCount: "85+ Daily Trains",
    routes: [
      {
        from: "Mumbai",
        to: "Bengaluru",
        label: "Mumbai to Bengaluru Trains",
        href: "/train?from=Mumbai&to=Bengaluru#search-widget",
      },
      {
        from: "Chennai",
        to: "Bengaluru",
        label: "Chennai to Bengaluru Trains",
        href: "/train?from=Chennai&to=Bengaluru#search-widget",
      },
      {
        from: "Delhi",
        to: "Bengaluru",
        label: "Delhi to Bengaluru Trains",
        href: "/train?from=Delhi&to=Bengaluru#search-widget",
      },
      {
        from: "Hyderabad",
        to: "Bengaluru",
        label: "Hyderabad to Bengaluru Trains",
        href: "/train?from=Hyderabad&to=Bengaluru#search-widget",
      },
    ],
  },
  {
    id: "new-delhi",
    destination: "New Delhi",
    title: "Trains to New Delhi",
    stations: "NDLS • DLI • NZM • ANVT",
    image: "/images/location11.png",
    alt: "Majestic India Gate war memorial in New Delhi",
    trainsCount: "160+ Daily Trains",
    routes: [
      {
        from: "Mumbai",
        to: "New Delhi",
        label: "Mumbai to New Delhi Trains",
        href: "/train?from=Mumbai&to=New%20Delhi#search-widget",
      },
      {
        from: "Jaipur",
        to: "New Delhi",
        label: "Jaipur to New Delhi Trains",
        href: "/train?from=Jaipur&to=New%20Delhi#search-widget",
      },
      {
        from: "Bengaluru",
        to: "New Delhi",
        label: "Bengaluru to New Delhi Trains",
        href: "/train?from=Bengaluru&to=New%20Delhi#search-widget",
      },
      {
        from: "Chandigarh",
        to: "New Delhi",
        label: "Chandigarh to New Delhi Trains",
        href: "/train?from=Chandigarh&to=New%20Delhi#search-widget",
      },
    ],
  },
  {
    id: "pune",
    destination: "Pune",
    title: "Trains to Pune",
    stations: "PUNE • SVJR • HAD",
    image: "/images/location12.png",
    alt: "Historic landmarks and scenic hills of Pune",
    trainsCount: "65+ Daily Trains",
    routes: [
      {
        from: "Mumbai",
        to: "Pune",
        label: "Mumbai to Pune Trains",
        href: "/train?from=Mumbai&to=Pune#search-widget",
      },
      {
        from: "Delhi",
        to: "Pune",
        label: "Delhi to Pune Trains",
        href: "/train?from=Delhi&to=Pune#search-widget",
      },
      {
        from: "Bengaluru",
        to: "Pune",
        label: "Bengaluru to Pune Trains",
        href: "/train?from=Bengaluru&to=Pune#search-widget",
      },
      {
        from: "Nagpur",
        to: "Pune",
        label: "Nagpur to Pune Trains",
        href: "/train?from=Nagpur&to=Pune#search-widget",
      },
    ],
  },
  {
    id: "chennai",
    destination: "Chennai",
    title: "Trains to Chennai",
    stations: "MAS • MS • TBM • PER",
    image: "/images/location13.png",
    alt: "Famous Dravidian temple gopuram architecture in Chennai",
    trainsCount: "75+ Daily Trains",
    routes: [
      {
        from: "Bengaluru",
        to: "Chennai",
        label: "Bengaluru to Chennai Trains",
        href: "/train?from=Bengaluru&to=Chennai#search-widget",
      },
      {
        from: "Delhi",
        to: "Chennai",
        label: "Delhi to Chennai Trains",
        href: "/train?from=Delhi&to=Chennai#search-widget",
      },
      {
        from: "Madurai",
        to: "Chennai",
        label: "Madurai to Chennai Trains",
        href: "/train?from=Madurai&to=Chennai#search-widget",
      },
      {
        from: "Coimbatore",
        to: "Chennai",
        label: "Coimbatore to Chennai Trains",
        href: "/train?from=Coimbatore&to=Chennai#search-widget",
      },
    ],
  },
];

export default function TrainRoute() {
  return (
    <section className="skyroute-trainroute-section" aria-label="Popular Train Routes in India">
      {/* 1320px Standard Container */}
      <div className="skyroute-trainroute-container">
        {/* Clean Project-Standard Heading (No Description) */}
        <div className="trainroute-section-header">
          <h2 className="trainroute-section-heading">
            Popular <span className="trainroute-heading-highlight">Train Routes in India</span>
          </h2>
        </div>

        {/* Modern 2-Column Rail Corridor Grid (Distinct from screenshot, logic preserved) */}
        <div className="trainroute-corridor-grid">
          {POPULAR_TRAIN_HUBS.map((hub) => (
            <article key={hub.id} className="trainroute-corridor-card">
              {/* Left Side: Strictly 1:1 Aspect Ratio Square Landmark Photo */}
              <div className="trainroute-square-media">
                <Image
                  src={hub.image}
                  alt={hub.alt}
                  fill
                  sizes="(max-width: 768px) 110px, 140px"
                  className="trainroute-square-img"
                />
                <div className="trainroute-media-overlay" aria-hidden="true" />

                {/* Floating Live Trains Frequency Badge */}
                <div className="trainroute-media-badge">
                  <span className="trainroute-live-dot" aria-hidden="true" />
                  <span>{hub.trainsCount}</span>
                </div>

                {/* Station Codes Chip on Image Footer */}
                <span className="trainroute-media-stations">{hub.stations}</span>
              </div>

              {/* Right Side: Destination Info & 2x2 Interactive Route Matrix */}
              <div className="trainroute-corridor-content">
                {/* Header Row: Eyebrow + Destination Title + Direct 'All Trains' Link */}
                <div className="trainroute-corridor-header">
                  <div className="trainroute-header-titles">
                    <span className="trainroute-eyebrow">Major Rail Corridor</span>
                    <h3 className="trainroute-hub-title">{hub.title}</h3>
                  </div>

                  <Link
                    href={`/allTrains?${new URLSearchParams({ to: hub.destination }).toString()}`}
                    className="trainroute-hub-all-link"
                    title={`View all trains to ${hub.destination}`}
                  >
                    <span>All Trains</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>

                {/* 2x2 Interactive Route Matrix (Tactile Route Tiles) */}
                <div className="trainroute-routes-matrix">
                  {hub.routes.map((route, idx) => (
                    <Link
                      key={idx}
                      href={`/allTrains?${new URLSearchParams({ from: route.from, to: route.to }).toString()}`}
                      className="trainroute-route-tile"
                      title={`Book ${route.label}`}
                    >
                      <span className="trainroute-tile-icon" aria-hidden="true">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="3" width="16" height="15" rx="2.5" />
                          <line x1="4" y1="11" x2="20" y2="11" />
                          <circle cx="8" cy="15" r="1.5" fill="currentColor" />
                          <circle cx="16" cy="15" r="1.5" fill="currentColor" />
                        </svg>
                      </span>

                      <span className="trainroute-tile-corridor">
                        <span className="trainroute-from-city">{route.from}</span>
                        <span className="trainroute-corridor-arrow" aria-hidden="true">→</span>
                        <span className="trainroute-to-city">{route.to}</span>
                      </span>

                      <span className="trainroute-tile-chevron" aria-hidden="true">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
