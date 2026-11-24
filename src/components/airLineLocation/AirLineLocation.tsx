"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./AirLineLocation.css";

export interface RouteDestination {
  name: string;
  href: string;
}

export interface AirlineRouteItem {
  id: string;
  city: string;
  code: string;
  image: string;
  alt: string;
  hubHref: string;
  destinations: RouteDestination[];
}

export const AIRLINE_ROUTE_ITEMS: AirlineRouteItem[] = [
  {
    id: "mumbai",
    city: "Mumbai Flights",
    code: "BOM",
    image: "/images/location8.png",
    alt: "Gateway of India in Mumbai",
    hubHref: "/flights/mumbai",
    destinations: [
      { name: "Goa", href: "/flights/mumbai-to-goa" },
      { name: "Delhi", href: "/flights/mumbai-to-delhi" },
      { name: "Bangalore", href: "/flights/mumbai-to-bangalore" },
      { name: "Kolkata", href: "/flights/mumbai-to-kolkata" },
    ],
  },
  {
    id: "delhi",
    city: "Delhi Flights",
    code: "DEL",
    image: "/images/location9.png",
    alt: "India Gate in New Delhi",
    hubHref: "/flights/delhi",
    destinations: [
      { name: "Mumbai", href: "/flights/delhi-to-mumbai" },
      { name: "Goa", href: "/flights/delhi-to-goa" },
      { name: "Bangalore", href: "/flights/delhi-to-bangalore" },
      { name: "Srinagar", href: "/flights/delhi-to-srinagar" },
    ],
  },
  {
    id: "kolkata",
    city: "Kolkata Flights",
    code: "CCU",
    image: "/images/location11.png",
    alt: "Howrah Bridge in Kolkata",
    hubHref: "/flights/kolkata",
    destinations: [
      { name: "Mumbai", href: "/flights/kolkata-to-mumbai" },
      { name: "Delhi", href: "/flights/kolkata-to-delhi" },
      { name: "Bangalore", href: "/flights/kolkata-to-bangalore" },
      { name: "Port Blair", href: "/flights/kolkata-to-port-blair" },
    ],
  },
  {
    id: "chennai",
    city: "Chennai Flights",
    code: "MAA",
    image: "/images/location10.png",
    alt: "Kapaleeshwarar Temple in Chennai",
    hubHref: "/flights/chennai",
    destinations: [
      { name: "Mumbai", href: "/flights/chennai-to-mumbai" },
      { name: "Delhi", href: "/flights/chennai-to-delhi" },
      { name: "Kolkata", href: "/flights/chennai-to-kolkata" },
      { name: "Coimbatore", href: "/flights/chennai-to-coimbatore" },
    ],
  },
  {
    id: "hyderabad",
    city: "Hyderabad Flights",
    code: "HYD",
    image: "/images/location12.png",
    alt: "Charminar in Hyderabad",
    hubHref: "/flights/hyderabad",
    destinations: [
      { name: "Mumbai", href: "/flights/hyderabad-to-mumbai" },
      { name: "Goa", href: "/flights/hyderabad-to-goa" },
      { name: "Bangalore", href: "/flights/hyderabad-to-bangalore" },
      { name: "Delhi", href: "/flights/hyderabad-to-delhi" },
    ],
  },
  {
    id: "ahmedabad",
    city: "Ahmedabad Flights",
    code: "AMD",
    image: "/images/location13.png",
    alt: "Historic gateway architecture in Ahmedabad",
    hubHref: "/flights/ahmedabad",
    destinations: [
      { name: "Mumbai", href: "/flights/ahmedabad-to-mumbai" },
      { name: "Delhi", href: "/flights/ahmedabad-to-delhi" },
      { name: "Bangalore", href: "/flights/ahmedabad-to-bangalore" },
      { name: "Goa", href: "/flights/ahmedabad-to-goa" },
    ],
  },
];

export default function AirLineLocation() {
  const airportCodes: Record<string, string> = {
    Mumbai: "BOM",
    Delhi: "DEL",
    Bangalore: "BLR",
    Bengaluru: "BLR",
    Kolkata: "CCU",
    Chennai: "MAA",
    Hyderabad: "HYD",
    Goa: "GOI",
    "Port Blair": "IXZ",
    Srinagar: "SXR",
    Coimbatore: "CJB",
    Ahmedabad: "AMD",
  };
  const allFlightsHref = (from: string, to: string) =>
    `/allFlights?${new URLSearchParams({ from, to }).toString()}`;

  return (
    <section
      className="skyroute-airline-section"
      aria-label="Popular Flight Routes"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-airline-container">
        {/* Header Section matching Category.tsx */}
        <div className="airline-section-header">
          <div className="airline-title-track-wrap">
            <h2 className="airline-section-heading">
              Popular{" "}
              <span className="airline-heading-highlight">Flight Routes</span>
            </h2>
          </div>

          <p className="airline-section-desc">
            Discover top domestic flight connections from major departure cities with flexible schedules and great fares.
          </p>
        </div>

        {/* 2-Column Compact Boarding-Pass Style Route Grid */}
        <div className="airline-routes-grid">
          {AIRLINE_ROUTE_ITEMS.map((item) => (
            <article key={item.id} className="airline-route-card">
              {/* Left Framed Landmark Thumbnail with IATA Code */}
              <Link
                href={allFlightsHref(`${item.city.replace(" Flights", "")} (${item.code})`, "New Delhi (DEL)")}
                className="airline-thumb-box"
                aria-label={`Explore ${item.city}`}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="72px"
                  className="airline-thumb-img"
                />
                <span className="airline-iata-badge">{item.code}</span>
              </Link>

              {/* Center Hub Title & Clickable Destination Chips */}
              <div className="airline-route-info">
                <div className="airline-route-title-row">
                  <svg
                    className="airline-plane-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                  <Link href={allFlightsHref(`${item.city.replace(" Flights", "")} (${item.code})`, "New Delhi (DEL)")} className="airline-city-title">
                    {item.city}
                  </Link>
                </div>

                <div className="airline-destinations-list">
                  <span className="airline-to-label">To</span>
                  {item.destinations.map((dest) => (
                    <Link
                      key={dest.name}
                      href={allFlightsHref(
                        `${item.city.replace(" Flights", "")} (${item.code})`,
                        `${dest.name} (${airportCodes[dest.name] || dest.name.slice(0, 3).toUpperCase()})`,
                      )}
                      className="airline-dest-chip"
                    >
                      {dest.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Boarding-Pass Stub Action */}
              <div className="airline-card-stub">
                <Link
                  href={allFlightsHref(`${item.city.replace(" Flights", "")} (${item.code})`, "New Delhi (DEL)")}
                  className="airline-stub-btn"
                  title={`View all ${item.city}`}
                  aria-label={`View all ${item.city}`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
