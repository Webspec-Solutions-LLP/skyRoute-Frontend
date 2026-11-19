"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./BusRoute.css";

export type BusRouteFilter = "all" | "express" | "overnight" | "volvo";

export interface PopularBusRouteItem {
  id: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  busesCount: string;
  startingFare: string;
  operators: string;
  image: string;
  alt: string;
  tags: Exclude<BusRouteFilter, "all">[];
}

export const POPULAR_BUS_ROUTES: PopularBusRouteItem[] = [
  {
    id: "bangalore-hyderabad",
    from: "Bangalore",
    to: "Hyderabad",
    duration: "8h 30m",
    distance: "570 km",
    busesCount: "165+ Buses",
    startingFare: "₹649",
    operators: "Private & TSRTC",
    image: "/images/location12.png",
    alt: "Charminar landmark on the Bangalore to Hyderabad bus route",
    tags: ["overnight", "volvo"],
  },
  {
    id: "bangalore-chennai",
    from: "Bangalore",
    to: "Chennai",
    duration: "6h 15m",
    distance: "345 km",
    busesCount: "140+ Buses",
    startingFare: "₹499",
    operators: "SETC & AC Volvo",
    image: "/images/location10.png",
    alt: "Kapaleeshwarar Temple landmark on the Bangalore to Chennai bus route",
    tags: ["express", "overnight", "volvo"],
  },
  {
    id: "mumbai-pune",
    from: "Mumbai",
    to: "Pune",
    duration: "3h 20m",
    distance: "150 km",
    busesCount: "210+ Buses",
    startingFare: "₹349",
    operators: "MSRTC & Private",
    image: "/images/location8.png",
    alt: "Gateway of India landmark on the Mumbai to Pune bus route",
    tags: ["express", "volvo"],
  },
  {
    id: "delhi-jaipur",
    from: "Delhi",
    to: "Jaipur",
    duration: "5h 10m",
    distance: "275 km",
    busesCount: "130+ Buses",
    startingFare: "₹429",
    operators: "RSRTC & Volvo AC",
    image: "/images/location9.png",
    alt: "India Gate monument on the Delhi to Jaipur bus route",
    tags: ["express", "volvo"],
  },
  {
    id: "kolkata-digha",
    from: "Kolkata",
    to: "Digha",
    duration: "4h 40m",
    distance: "185 km",
    busesCount: "95+ Buses",
    startingFare: "₹299",
    operators: "SBSTC & AC Seater",
    image: "/images/location11.png",
    alt: "Howrah Bridge landmark on the Kolkata to Digha bus route",
    tags: ["express"],
  },
  {
    id: "ahmedabad-mumbai",
    from: "Ahmedabad",
    to: "Mumbai",
    duration: "9h 15m",
    distance: "525 km",
    busesCount: "120+ Buses",
    startingFare: "₹699",
    operators: "GSRTC & AC Sleeper",
    image: "/images/location13.png",
    alt: "Historic gateway monument on the Ahmedabad to Mumbai bus route",
    tags: ["overnight", "volvo"],
  },
];

const ROUTE_FILTERS: { id: BusRouteFilter; label: string }[] = [
  { id: "all", label: "All Routes" },
  { id: "express", label: "Day Express" },
  { id: "overnight", label: "Overnight" },
  { id: "volvo", label: "Volvo AC" },
];

export default function BusRoute() {
  const [activeFilter, setActiveFilter] = useState<BusRouteFilter>("all");

  const visibleRoutes =
    activeFilter === "all"
      ? POPULAR_BUS_ROUTES
      : POPULAR_BUS_ROUTES.filter((route) => route.tags.includes(activeFilter));

  return (
    <section
      className="skyroute-busroute-section"
      aria-label="Popular Bus Routes"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-busroute-container">
        {/* Header Section matching SkyRoute typography + Interactive Route Filter Pills */}
        <div className="busroute-section-header">
          <div className="busroute-header-top">
            <div className="busroute-title-group">
              <div className="busroute-title-track-wrap">
                <h2 className="busroute-section-heading">
                  Popular{" "}
                  <span className="busroute-heading-highlight">Bus Routes</span>
                </h2>
              </div>
              <p className="busroute-section-desc">
                Check popular bus routes on SkyRoute, compare timings and fares, and book your bus tickets online with ease across trusted private and government operators.
              </p>
            </div>

            <div
              className="busroute-filter-bar"
              role="tablist"
              aria-label="Filter popular bus routes"
            >
              {ROUTE_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter.id}
                  className={`busroute-filter-pill ${
                    activeFilter === filter.id ? "is-active" : ""
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Corridor Grid with 1:1 Square Landmark Thumbnails & 6px Radius */}
        <div className="busroute-grid">
          {visibleRoutes.map((route) => {
            const routeHref = `/bus?from=${encodeURIComponent(
              route.from
            )}&to=${encodeURIComponent(route.to)}#search-widget`;

            return (
              <article key={route.id} className="busroute-card">
                {/* Left 1:1 Square Landmark Photo */}
                <div className="busroute-card-media">
                  <Image
                    src={route.image}
                    alt={route.alt}
                    fill
                    sizes="(max-width: 520px) 88px, (max-width: 991px) 104px, 122px"
                    className="busroute-card-img"
                  />
                  <div className="busroute-media-overlay" aria-hidden="true" />
                  <span className="busroute-fleet-badge">
                    <span className="busroute-live-dot" aria-hidden="true" />
                    {route.busesCount}
                  </span>
                </div>

                {/* Right Corridor Details & CTA */}
                <div className="busroute-card-body">
                  {/* Top Corridor Bar: Departure -> Bus Timeline -> Arrival */}
                  <div className="busroute-corridor">
                    <div className="busroute-stop busroute-stop-from">
                      <span className="busroute-stop-label">Departure</span>
                      <h3 className="busroute-city-name">{route.from}</h3>
                    </div>

                    <div className="busroute-track-mid" aria-hidden="true">
                      <span className="busroute-duration-tag">
                        {route.duration}
                      </span>
                      <div className="busroute-highway-line">
                        <span className="busroute-node busroute-node-start" />
                        <span className="busroute-dashes" />
                        <span className="busroute-bus-badge">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V6h12v5z" />
                          </svg>
                        </span>
                        <span className="busroute-dashes" />
                        <span className="busroute-node busroute-node-end" />
                      </div>
                      <span className="busroute-distance-tag">
                        {route.distance}
                      </span>
                    </div>

                    <div className="busroute-stop busroute-stop-to">
                      <span className="busroute-stop-label">Arrival</span>
                      <h3 className="busroute-city-name">{route.to}</h3>
                    </div>
                  </div>

                  {/* Bottom Footer: Operator + Starting Fare + View Buses CTA */}
                  <div className="busroute-card-footer">
                    <div className="busroute-meta-left">
                      <span className="busroute-operator-pill">
                        <svg
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
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>{route.operators}</span>
                      </span>

                      <span className="busroute-fare-badge">
                        From <strong>{route.startingFare}</strong>
                      </span>
                    </div>

                    <Link
                      href={routeHref}
                      className="busroute-view-btn"
                      title={`View buses from ${route.from} to ${route.to}`}
                    >
                      <span>View Buses</span>
                      <svg
                        className="busroute-btn-arrow"
                        width="14"
                        height="14"
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
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
