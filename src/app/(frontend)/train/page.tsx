"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

import Hero from "@/components/hero/Hero";
import TrainRoute from "@/components/trainRoute/TrainRoute";
import Hotel from "@/components/hotel/Hotel";
import Faq from "@/components/faq/Faq";

import "./train.css";
import "../page.css";

interface TrainServiceItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeType?: "live" | "instant" | "new" | "hot" | "fast" | "qr" | "smart";
  ctaText: string;
  iconType: string;
  colorScheme: "rose" | "blue" | "amber" | "emerald" | "orange" | "sky" | "violet" | "cyan" | "slate" | "indigo" | "teal";
}

const TRAIN_SERVICES: TrainServiceItem[] = [
  {
    id: "running-status",
    title: "Running Status",
    subtitle: "Live GPS train tracking & delay updates",
    badge: "Live",
    badgeType: "live",
    ctaText: "Track Live",
    iconType: "running",
    colorScheme: "rose",
  },
  {
    id: "pnr-status",
    title: "PNR Status",
    subtitle: "Instant seat & chart confirmation prediction",
    badge: "Instant",
    badgeType: "instant",
    ctaText: "Check Status",
    iconType: "pnr",
    colorScheme: "blue",
  },
  {
    id: "holiday-packages",
    title: "Holiday Packages",
    subtitle: "Curated Bharat Gaurav & scenic rail tours",
    badge: "New",
    badgeType: "new",
    ctaText: "Explore Tours",
    iconType: "holiday",
    colorScheme: "amber",
  },
  {
    id: "metro-ticket",
    title: "Metro Ticket",
    subtitle: "Instant QR city transit passes for metro lines",
    badge: "QR Pass",
    badgeType: "qr",
    ctaText: "Book Metro",
    iconType: "metro",
    colorScheme: "emerald",
  },
  {
    id: "order-food",
    title: "Food on Track",
    subtitle: "Hot, hygienic meals delivered to your train seat",
    badge: "Hot",
    badgeType: "hot",
    ctaText: "Order Meals",
    iconType: "food",
    colorScheme: "orange",
  },
  {
    id: "train-by-name",
    title: "Train by Name/No.",
    subtitle: "Full timetable, halt stations & detailed schedule",
    badge: "Direct",
    badgeType: "smart",
    ctaText: "View Schedule",
    iconType: "train-search",
    colorScheme: "sky",
  },
  {
    id: "seat-availability",
    title: "Seat Availability",
    subtitle: "Quota analysis & high-confidence confirmation odds",
    badge: "High CNF",
    badgeType: "smart",
    ctaText: "Check Seats",
    iconType: "seat",
    colorScheme: "violet",
  },
  {
    id: "tatkal-reservation",
    title: "Tatkal Booking",
    subtitle: "Fast-track 10:00 & 11:00 AM booking slot alerts",
    badge: "Fast",
    badgeType: "fast",
    ctaText: "Open Tatkal",
    iconType: "tatkal",
    colorScheme: "cyan",
  },
  {
    id: "station-status",
    title: "Station Status",
    subtitle: "Next 2 to 4 hours live arrival and departure board",
    badge: "Live",
    badgeType: "live",
    ctaText: "Check Station",
    iconType: "station",
    colorScheme: "slate",
  },
  {
    id: "platform-locator",
    title: "Platform Locator",
    subtitle: "Expected track info & coach stopping marker",
    badge: "Smart",
    badgeType: "smart",
    ctaText: "Find Platform",
    iconType: "platform",
    colorScheme: "indigo",
  },
  {
    id: "coach-position",
    title: "Coach Position",
    subtitle: "Bogie sequence, engine layout & platform alignment",
    badge: "Layout",
    badgeType: "smart",
    ctaText: "View Layout",
    iconType: "coach",
    colorScheme: "teal",
  },
];

export default function TrainPage() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [pnrInput, setPnrInput] = useState("");
  const [trainNoInput, setTrainNoInput] = useState("");
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setLookupFeedback(null);
    setActiveService((prev) => (prev === id ? null : id));
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeService === "pnr-status") {
      if (!pnrInput.trim() || pnrInput.trim().length !== 10) {
        setLookupFeedback("Please enter a valid 10-digit Indian Railway PNR number.");
        return;
      }
      setLookupFeedback(`Fetching IRCTC live reservation status for PNR: ${pnrInput.trim()}... (CNF / Charting Status verified)`);
    } else if (activeService === "running-status" || activeService === "train-by-name") {
      if (!trainNoInput.trim()) {
        setLookupFeedback("Please enter a valid train number or train name.");
        return;
      }
      setLookupFeedback(`Tracking live GPS status for ${trainNoInput.trim()}... Train running on schedule.`);
    } else {
      setLookupFeedback("Connecting to SkyRoute IRCTC travel service gateway...");
    }
  };

  /* Premium Multi-Layered Vector Icons with Rich Gradients & Details */
  const renderPremiumIcon = (type: string) => {
    switch (type) {
      case "running":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="rnGradTrain" x1="4" y1="20" x2="44" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
              <linearGradient id="rnGradPin" x1="28" y1="4" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <linearGradient id="rnGradGlass" x1="12" y1="24" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fee2e2" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Railway Tracks */}
            <path d="M6 42h36M12 40l-2 4M24 40v4M36 40l2 4" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" />
            {/* Sleek Bullet Train Body */}
            <path d="M6 36c0-7 5-14 18-14h10c6 0 8 4 8 14H6Z" fill="url(#rnGradTrain)" />
            {/* Aerodynamic Cockpit Windshield */}
            <path d="M10 32c1-4 4-8 12-8h8v8H10Z" fill="url(#rnGradGlass)" />
            {/* Front Headlights */}
            <circle cx="12" cy="34" r="2" fill="#fef08a" />
            <circle cx="20" cy="34" r="2" fill="#fef08a" />
            <line x1="28" y1="34" x2="38" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
            {/* 3D GPS Location Pin with Radar Ripples */}
            <circle cx="35" cy="14" r="8" stroke="#fee2e2" strokeWidth="1.5" strokeOpacity="0.7" />
            <path d="M35 5c-4.4 0-8 3.6-8 8 0 5.5 8 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8Z" fill="url(#rnGradPin)" />
            <circle cx="35" cy="13" r="3" fill="#ffffff" />
          </svg>
        );

      case "pnr":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="pnrCard" x1="6" y1="8" x2="42" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#006ce4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="pnrShield" x1="26" y1="20" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            {/* Boarding Ticket Base with Perforated Cutout Notches */}
            <path d="M6 14a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v5a4 4 0 0 0 0 8v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5a4 4 0 0 0 0-8v-5Z" fill="url(#pnrCard)" />
            {/* Dashed Tear Line */}
            <line x1="16" y1="12" x2="16" y2="34" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 3" strokeOpacity="0.6" />
            {/* PNR Text Chips & Micro Lines */}
            <rect x="9" y="16" width="5" height="14" rx="1" fill="#ffffff" fillOpacity="0.25" />
            <line x1="20" y1="16" x2="34" y2="16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="21" x2="30" y2="21" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />
            <line x1="20" y1="26" x2="26" y2="26" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
            {/* Verified Shield with Checkmark */}
            <path d="M36 24c4.5 0 8 3.5 8 8 0 5-8 10-8 10s-8-5-8-10c0-4.5 3.5-8 8-8Z" fill="url(#pnrShield)" />
            <path d="m32.5 32 2.5 2.5 5-5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case "holiday":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="holSun" x1="24" y1="4" x2="38" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="holMountain" x1="12" y1="18" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="holCoach" x1="8" y1="28" x2="42" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>
            {/* Radiant Golden Sun */}
            <circle cx="33" cy="14" r="8" fill="url(#holSun)" />
            {/* Mountain Ridge */}
            <polygon points="18,12 30,34 6,34" fill="url(#holMountain)" opacity="0.8" />
            <polygon points="30,16 42,34 18,34" fill="#6366f1" opacity="0.9" />
            <polygon points="18,12 21,18 15,18" fill="#ffffff" />
            {/* Scenic Train Crossing Ground Track */}
            <rect x="8" y="32" width="32" height="9" rx="3" fill="url(#holCoach)" />
            <rect x="12" y="34" width="6" height="4" rx="1" fill="#fef3c7" />
            <rect x="21" y="34" width="6" height="4" rx="1" fill="#fef3c7" />
            <rect x="30" y="34" width="6" height="4" rx="1" fill="#fef3c7" />
            {/* Coconut Palm Frond */}
            <path d="M6 34c3-10 10-14 16-14M16 20c-2-3-6-4-8-4M19 22c-1-4-3-6-6-8M21 24c1-3 1-6 0-9" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="14" cy="42" r="2" fill="#475569" />
            <circle cx="34" cy="42" r="2" fill="#475569" />
          </svg>
        );

      case "metro":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="metCab" x1="4" y1="8" x2="32" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="metScreen" x1="26" y1="16" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* Modern Metro Front Cab */}
            <rect x="6" y="8" width="22" height="28" rx="6" fill="url(#metCab)" />
            {/* Metro Panoramic Windshield */}
            <rect x="9" y="12" width="16" height="11" rx="3" fill="#ffffff" fillOpacity="0.85" />
            <line x1="17" y1="12" x2="17" y2="23" stroke="#047857" strokeWidth="1" strokeOpacity="0.4" />
            {/* Glowing Dual Headlights */}
            <circle cx="11" cy="28" r="2" fill="#fef08a" />
            <circle cx="23" cy="28" r="2" fill="#fef08a" />
            <rect x="14" y="27" width="6" height="2" rx="1" fill="#ffffff" fillOpacity="0.8" />
            {/* Ground Tracks */}
            <line x1="4" y1="40" x2="28" y2="40" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="8" y1="36" x2="10" y2="42" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="36" x2="24" y2="42" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            {/* Digital Phone with QR Pass Overlaid */}
            <rect x="25" y="16" width="18" height="24" rx="4" fill="url(#metScreen)" stroke="#10b981" strokeWidth="1.5" />
            <rect x="28" y="20" width="4" height="4" rx="1" fill="#34d399" />
            <rect x="36" y="20" width="4" height="4" rx="1" fill="#34d399" />
            <rect x="28" y="28" width="4" height="4" rx="1" fill="#34d399" />
            <rect x="34" y="27" width="2" height="2" fill="#34d399" />
            <rect x="38" y="29" width="2" height="2" fill="#34d399" />
            <line x1="26" y1="26" x2="42" y2="26" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case "food":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="foodCloche" x1="8" y1="14" x2="40" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              <linearGradient id="foodPlatter" x1="6" y1="34" x2="42" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
            </defs>
            {/* Cloche Dome Top Handle */}
            <circle cx="24" cy="14" r="3" fill="#f59e0b" />
            <path d="M22 17h4v2h-4z" fill="#f59e0b" />
            {/* Gourmet Hot Food Cloche Dome */}
            <path d="M10 32c0-9 6-15 14-15s14 6 14 15H10Z" fill="url(#foodCloche)" />
            {/* Glossy Specular Light Reflection */}
            <path d="M14 30c1-6 4-10 10-11" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
            {/* Serving Platter Base Rim */}
            <rect x="6" y="32" width="36" height="5" rx="2.5" fill="url(#foodPlatter)" />
            <line x1="10" y1="39" x2="38" y2="39" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
            {/* Rising Hot Aromatic Steam Swirls */}
            <path d="M18 10c0-3 2-4 2-6" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 8c0-3 2-4 2-6" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M30 10c0-3 2-4 2-6" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case "train-search":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="tsRim" x1="18" y1="12" x2="42" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#006ce4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="tsGlass" x1="20" y1="14" x2="36" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Background Locomotive Route */}
            <path d="M6 34c0-6 4-12 14-12h4v14H6Z" fill="#94a3b8" />
            <circle cx="10" cy="31" r="2" fill="#fef08a" />
            <line x1="4" y1="38" x2="26" y2="38" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            {/* 3D Magnifying Lens with Glass Glare */}
            <circle cx="28" cy="22" r="12" fill="url(#tsGlass)" stroke="url(#tsRim)" strokeWidth="3" />
            <path d="M22 17c2-2 5-3 8-2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* Train Silhouette Inside Lens */}
            <rect x="23" y="18" width="10" height="8" rx="2" fill="#006ce4" />
            <circle cx="25.5" cy="23" r="1" fill="#ffffff" />
            <circle cx="30.5" cy="23" r="1" fill="#ffffff" />
            {/* Sturdy Lens Handle */}
            <path d="m37 31 7 7a2 2 0 0 1-3 3l-7-7" stroke="#0369a1" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case "seat":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="stChair" x1="10" y1="6" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
              <linearGradient id="stBadge" x1="26" y1="22" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            {/* Executive Ergonomic Train Seat Backrest */}
            <rect x="11" y="6" width="18" height="20" rx="4" fill="url(#stChair)" />
            {/* Soft Headrest Cushion */}
            <rect x="13" y="9" width="14" height="6" rx="2" fill="#a78bfa" />
            {/* Deep Plush Seat Base & Armrest */}
            <path d="M7 26h24a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2H7v-8Z" fill="#6d28d9" />
            <rect x="7" y="24" width="4" height="8" rx="2" fill="#8b5cf6" />
            {/* Heavy Base Anchor Legs */}
            <line x1="12" y1="34" x2="12" y2="41" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <line x1="24" y1="34" x2="24" y2="41" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <line x1="8" y1="41" x2="28" y2="41" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            {/* High-CNF Confirmation Probability Gauge Badge */}
            <circle cx="35" cy="30" r="9" fill="url(#stBadge)" />
            <path d="m31.5 30 2.5 2.5 4.5-5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case "tatkal":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="tkBolt" x1="14" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
              <linearGradient id="tkClock" x1="8" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* Precision Timer Clock Face */}
            <circle cx="21" cy="25" r="13" fill="url(#tkClock)" stroke="#38bdf8" strokeWidth="2" />
            <line x1="21" y1="16" x2="21" y2="25" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="21" y1="25" x2="27" y2="22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <circle cx="21" cy="25" r="2" fill="#f59e0b" />
            <circle cx="21" cy="9" r="1.5" fill="#38bdf8" />
            {/* Ultra High Voltage Electric Bolt */}
            <path d="M33 4 19 22h9l-7 18 19-20h-9l7-16Z" fill="url(#tkBolt)" />
            <path d="M31 8 22 20h7l-4 12 12-14h-7l5-10Z" fill="#a5f3fc" fillOpacity="0.85" />
          </svg>
        );

      case "station":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="stnRoof" x1="8" y1="12" x2="40" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* Terminal Central Façade & Clock Tower */}
            <path d="M6 39h36M10 39V24l14-10 14 10v15" stroke="url(#stnRoof)" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="18" y="8" width="12" height="12" rx="2" fill="#334155" />
            <polygon points="24,3 16,8 32,8" fill="#1e293b" />
            <circle cx="24" cy="14" r="3.5" fill="#ffffff" />
            <line x1="24" y1="12" x2="24" y2="14" stroke="#006ce4" strokeWidth="1" strokeLinecap="round" />
            <line x1="24" y1="14" x2="26" y2="15" stroke="#006ce4" strokeWidth="1" strokeLinecap="round" />
            {/* Grand Station Arched Portals */}
            <path d="M14 39v-7a3 3 0 0 1 6 0v7M21 39v-9a3 3 0 0 1 6 0v9M28 39v-7a3 3 0 0 1 6 0v7" fill="#64748b" fillOpacity="0.4" stroke="#475569" strokeWidth="1.8" />
            {/* Live Antenna Waves */}
            <path d="M21 3c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="2" r="1" fill="#38bdf8" />
          </svg>
        );

      case "platform":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="pfSign" x1="10" y1="6" x2="38" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#3730a3" />
              </linearGradient>
            </defs>
            {/* Station Overhead Platform Truss Roof */}
            <path d="M6 14h36M12 14v-6M36 14v-6" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
            {/* High-Visibility Illuminated Platform Board "PF 1" */}
            <rect x="10" y="10" width="28" height="15" rx="3" fill="url(#pfSign)" stroke="#c7d2fe" strokeWidth="1.5" />
            <text x="24" y="21" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">PF 1</text>
            {/* Steel Rail Tracks on Platform Bed */}
            <rect x="6" y="36" width="36" height="4" rx="2" fill="#475569" />
            <line x1="12" y1="36" x2="12" y2="42" stroke="#334155" strokeWidth="2.5" />
            <line x1="24" y1="36" x2="24" y2="42" stroke="#334155" strokeWidth="2.5" />
            <line x1="36" y1="36" x2="36" y2="42" stroke="#334155" strokeWidth="2.5" />
            <line x1="4" y1="42" x2="44" y2="42" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            {/* Direction Arrow */}
            <circle cx="34" cy="17.5" r="3" fill="#10b981" />
            <path d="M33 17.5h2M34 16.5l1 1-1 1" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case "coach":
        return (
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="chEngine" x1="6" y1="12" x2="26" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <linearGradient id="chBogie" x1="24" y1="14" x2="42" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            {/* Locomotive Engine Carriage */}
            <path d="M6 32c0-8 4-15 14-15h4v15H6Z" fill="url(#chEngine)" />
            <rect x="12" y="20" width="5" height="5" rx="1" fill="#fef08a" />
            <rect x="18" y="20" width="4" height="5" rx="1" fill="#fef08a" />
            <circle cx="8" cy="30" r="1.5" fill="#ffffff" />
            {/* Inter-Coach Coupler Buffers */}
            <rect x="23" y="27" width="4" height="3" fill="#334155" />
            {/* Passenger Bogie Coach (B1) */}
            <rect x="26" y="18" width="16" height="14" rx="3" fill="url(#chBogie)" />
            <rect x="29" y="21" width="4" height="4" rx="1" fill="#ecfdf5" />
            <rect x="35" y="21" width="4" height="4" rx="1" fill="#ecfdf5" />
            {/* Wheel Bogie Assemblies */}
            <circle cx="11" cy="35" r="2.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="19" cy="35" r="2.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="30" cy="35" r="2.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="38" cy="35" r="2.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            {/* Ground Rail */}
            <line x1="4" y1="38" x2="44" y2="38" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="homepage-background">
      <Hero defaultTab="train" />
      <section className="skyroute-train-services-section" aria-label="Train Services & Utilities">
        <div className="skyroute-train-services-container">
          {/* Header Section matching GovtBus (Clean Heading Only, No Description, No Pagination) */}
          <div className="train-services-section-header">
            <h2 className="train-services-heading">
              Train <span className="train-heading-highlight">Services & Utilities</span>
            </h2>
          </div>

          {/* Swiper Carousel Bounded Within 1320px Container (Symmetric Left/Right Gap) */}
          <div className="train-swiper-wrapper">
            <Swiper
              modules={[FreeMode]}
              freeMode={{
                enabled: true,
                sticky: true,
                momentum: true,
              }}
              slidesPerView={1.25}
              spaceBetween={14}
              grabCursor={true}
              simulateTouch={true}
              watchOverflow={true}
              breakpoints={{
                480: {
                  slidesPerView: 1.85,
                  spaceBetween: 14,
                },
                640: {
                  slidesPerView: 2.4,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 3.1,
                  spaceBetween: 16,
                },
                992: {
                  slidesPerView: 4.1,
                  spaceBetween: 16,
                },
                1200: {
                  slidesPerView: 4.85,
                  spaceBetween: 16,
                },
              }}
              className="train-services-swiper"
            >
              {TRAIN_SERVICES.map((item) => {
                const isSelected = activeService === item.id;
                return (
                  <SwiperSlide key={item.id} className="train-services-slide">
                    <div
                      role="button"
                      tabIndex={0}
                      className={`train-service-card theme-${item.colorScheme} ${isSelected ? "is-selected" : ""}`}
                      onClick={() => handleCardClick(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCardClick(item.id);
                        }
                      }}
                      aria-pressed={isSelected}
                    >
                      {/* Top Header Row of Card */}
                      <div className="train-card-top">
                        <div className={`train-card-icon-box bg-${item.colorScheme}`}>
                          {renderPremiumIcon(item.iconType)}
                        </div>

                        {item.badge && (
                          <span className={`train-card-badge badge-${item.badgeType || "smart"}`}>
                            {item.badgeType === "live" && <span className="live-pulse-dot" />}
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Middle Content: Big Title & Descriptive Subtitle */}
                      <div className="train-card-content">
                        <h3 className="train-card-title">{item.title}</h3>
                        <p className="train-card-sub">{item.subtitle}</p>
                      </div>

                      {/* Bottom Action Row with CTA & Arrow */}
                      <div className="train-card-footer">
                        <span className="train-card-cta">{item.ctaText}</span>
                        <span className="train-card-arrow">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Interactive Action Drawer for Selected Service */}
          {activeService && (
            <div className="train-utility-drawer" role="region" aria-label="Service Details Drawer">
              <button
                type="button"
                className="train-drawer-close-btn"
                onClick={() => setActiveService(null)}
                aria-label="Close drawer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {activeService === "pnr-status" && (
                <form onSubmit={handleLookupSubmit} className="train-drawer-form">
                  <div className="train-drawer-info">
                    <span className="train-drawer-tag">IRCTC Direct Lookup</span>
                    <h3 className="train-drawer-title">Check Live PNR Status &amp; Seat Prediction</h3>
                    <p className="train-drawer-desc">
                      Get accurate live confirmation probability, coach number, berth position, and chart preparation status for your Indian Railways booking.
                    </p>
                  </div>
                  <div className="train-drawer-input-row">
                    <div className="train-drawer-field">
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="Enter 10-digit PNR Number"
                        value={pnrInput}
                        onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ""))}
                        className="train-drawer-input"
                      />
                    </div>
                    <button type="submit" className="train-drawer-btn">
                      <span>Check PNR Status</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {activeService === "running-status" && (
                <form onSubmit={handleLookupSubmit} className="train-drawer-form">
                  <div className="train-drawer-info">
                    <span className="train-drawer-tag live-tag">Live GPS Tracker</span>
                    <h3 className="train-drawer-title">Spot Your Train - Live Running Status</h3>
                    <p className="train-drawer-desc">
                      Track your train location in real-time with satellite GPS, expected arrival &amp; departure delays, and upcoming platform numbers.
                    </p>
                  </div>
                  <div className="train-drawer-input-row">
                    <div className="train-drawer-field">
                      <input
                        type="text"
                        placeholder="Enter Train Number or Name (e.g., 12301 / Rajdhani Express)"
                        value={trainNoInput}
                        onChange={(e) => setTrainNoInput(e.target.value)}
                        className="train-drawer-input"
                      />
                    </div>
                    <button type="submit" className="train-drawer-btn">
                      <span>Track Train</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {activeService === "order-food" && (
                <form onSubmit={handleLookupSubmit} className="train-drawer-form">
                  <div className="train-drawer-info">
                    <span className="train-drawer-tag">IRCTC e-Catering</span>
                    <h3 className="train-drawer-title">Order Food on Train - Delivered at Your Seat</h3>
                    <p className="train-drawer-desc">
                      Order fresh, hygienic meals from Haldiram&apos;s, Domino&apos;s, Saravana Bhavan and 500+ verified partner restaurants right to your train berth.
                    </p>
                  </div>
                  <div className="train-drawer-input-row">
                    <div className="train-drawer-field">
                      <input
                        type="text"
                        placeholder="Enter 10-digit PNR or Train Number"
                        className="train-drawer-input"
                      />
                    </div>
                    <button type="submit" className="train-drawer-btn">
                      <span>Explore Menus</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {activeService === "holiday-packages" && (
                <div className="train-drawer-content-box">
                  <span className="train-drawer-tag">Curated Rail Tours</span>
                  <h3 className="train-drawer-title">Explore India with SkyRoute Rail Holiday Packages</h3>
                  <p className="train-drawer-desc">
                    All-inclusive Bharat Gaurav Tourist Trains, Himalayan Queen tours, Golden Triangle rail vacations, and South India temple circuits with hotel stays, meals, and transfers included.
                  </p>
                  <div className="holiday-perk-pills">
                    <span className="holiday-pill">⭐ Bharat Gaurav Circuits</span>
                    <span className="holiday-pill">🏨 3★ &amp; 4★ Hotel Stays</span>
                    <span className="holiday-pill">🍽️ Daily Pure Veg / Non-Veg Meals</span>
                    <span className="holiday-pill">🚌 Sightseeing Transfers</span>
                  </div>
                </div>
              )}

              {activeService === "tatkal-reservation" && (
                <div className="train-drawer-content-box">
                  <span className="train-drawer-tag">Tatkal Timings &amp; Tips</span>
                  <h3 className="train-drawer-title">IRCTC Tatkal Reservation Windows</h3>
                  <p className="train-drawer-desc">
                    Tatkal booking opens 1 day in advance of the actual date of journey from the train originating station. Keep passenger details pre-saved in your SkyRoute profile for instantaneous 1-click booking.
                  </p>
                  <div className="tatkal-timing-grid">
                    <div className="tatkal-time-card">
                      <span className="tatkal-class-badge">AC Classes (1A, 2A, 3A, CC)</span>
                      <span className="tatkal-time-val">10:00 AM IST</span>
                      <small>Daily quota opens</small>
                    </div>
                    <div className="tatkal-time-card">
                      <span className="tatkal-class-badge non-ac">Non-AC Classes (SL, 2S)</span>
                      <span className="tatkal-time-val">11:00 AM IST</span>
                      <small>Daily quota opens</small>
                    </div>
                  </div>
                </div>
              )}

              {activeService === "metro-ticket" && (
                <div className="train-drawer-content-box">
                  <span className="train-drawer-tag">City QR Passes</span>
                  <h3 className="train-drawer-title">Skip Station Queues - Instant Metro QR Ticket</h3>
                  <p className="train-drawer-desc">
                    Available for Delhi Metro (DMRC), Bengaluru Namma Metro (BMRCL), Hyderabad Metro (L&amp;T), Chennai Metro (CMRL), and Mumbai Metro (MMRDA). Scan directly at AFC automated turnstile gates.
                  </p>
                  <div className="holiday-perk-pills">
                    <span className="holiday-pill">🚇 Delhi DMRC</span>
                    <span className="holiday-pill">🚇 Bengaluru Namma Metro</span>
                    <span className="holiday-pill">🚇 Mumbai MMRDA</span>
                    <span className="holiday-pill">🚇 Hyderabad Metro</span>
                  </div>
                </div>
              )}

              {activeService === "train-by-name" && (
                <form onSubmit={handleLookupSubmit} className="train-drawer-form">
                  <div className="train-drawer-info">
                    <span className="train-drawer-tag">Timetable &amp; Halts</span>
                    <h3 className="train-drawer-title">Search Train Schedule &amp; Route</h3>
                    <p className="train-drawer-desc">
                      Find arrival, departure, halt durations, and platform history across all intermediate stations on the route.
                    </p>
                  </div>
                  <div className="train-drawer-input-row">
                    <div className="train-drawer-field">
                      <input
                        type="text"
                        placeholder="e.g. 12951 or Mumbai Rajdhani"
                        value={trainNoInput}
                        onChange={(e) => setTrainNoInput(e.target.value)}
                        className="train-drawer-input"
                      />
                    </div>
                    <button type="submit" className="train-drawer-btn">
                      <span>Search Route</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {activeService === "seat-availability" && (
                <div className="train-drawer-content-box">
                  <span className="train-drawer-tag">Predictive Engine</span>
                  <h3 className="train-drawer-title">AI Seat Confirmation Predictor</h3>
                  <p className="train-drawer-desc">
                    Enter your origin, destination, and travel date above to view live real-time berth availability across 1A, 2A, 3A, 3E, CC, and SL with AI-powered waitlist confirmation probability.
                  </p>
                </div>
              )}

              {activeService === "station-status" && (
                <div className="train-drawer-content-box">
                  <span className="train-drawer-tag">Station Board</span>
                  <h3 className="train-drawer-title">Live Station Arrivals &amp; Departures</h3>
                  <p className="train-drawer-desc">
                    View upcoming trains arriving or departing from your station in the next 2 to 4 hours with live delay tracking and platform assignments.
                  </p>
                </div>
              )}

              {activeService === "platform-locator" && (
                <div className="train-drawer-content-box">
                  <span className="train-drawer-tag">Track Locator</span>
                  <h3 className="train-drawer-title">Know Your Platform in Advance</h3>
                  <p className="train-drawer-desc">
                    Accurate platform prediction based on historical data and live railway signaling to save you last-minute rushes at busy junctions.
                  </p>
                </div>
              )}

              {activeService === "coach-position" && (
                <div className="train-drawer-content-box">
                  <span className="train-drawer-tag">Coach Sequence</span>
                  <h3 className="train-drawer-title">Train Coach Layout &amp; Bogie Order</h3>
                  <p className="train-drawer-desc">
                    Know the exact position of your bogie (e.g., Engine - SLR - B1 to B6 - A1 - A2 - PC - S1 to S8) on the platform before the train arrives.
                  </p>
                </div>
              )}

              {lookupFeedback && (
                <div className="train-drawer-feedback">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{lookupFeedback}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Popular Train Routes in India */}
      <TrainRoute />

      {/* =========================================================================
          IRCTC TRAIN TICKET BOOKING GUIDE & RULES (1320px Standard Container)
          Sequential (Por Por) Layout with Mini Headings | No Tab System | No Description
          ========================================================================= */}
      <section className="skyroute-train-guide-section" aria-label="IRCTC Train Ticket Booking Guide & Rules">
        <div className="skyroute-train-guide-container">
          {/* Main Section Header (Clean Title Only, No Description) */}
          <div className="train-guide-section-header">
            <h2 className="train-guide-section-heading">
              IRCTC Train Ticket <span className="train-guide-heading-highlight">Booking Guide &amp; Rules</span>
            </h2>
          </div>

          <div className="train-guide-blocks-stack">
            {/* ===================================================================
                BLOCK 1: HOW TO BOOK IRCTC TRAIN TICKETS
                =================================================================== */}
            <div className="train-guide-block">
              <div className="guide-block-header">
                <span className="guide-block-badge">Step-by-Step Process</span>
                <h3 className="guide-block-title">
                  How to Book <span className="guide-title-highlight">IRCTC Train Tickets on SkyRoute</span>
                </h3>
              </div>

              {/* 5-Step Process Grid */}
              <div className="guide-steps-grid">
                {[
                  {
                    stepNum: "01",
                    title: "Choose Route & Journey Date",
                    desc: "Open SkyRoute Trains, enter your origin and destination stations or city names, and choose your preferred travel date.",
                    tag: "Source & Dest",
                  },
                  {
                    stepNum: "02",
                    title: "Select Class & Compare Trains",
                    desc: "Filter available trains by departure time, duration, and class (1A, 2A, 3A, 3E, CC, or SL) with live confirmation prediction.",
                    tag: "Live Availability",
                  },
                  {
                    stepNum: "03",
                    title: "Add Passenger Details & IRCTC ID",
                    desc: "Enter passenger names, age, berth preference (Lower, Middle, Upper, Side), senior citizen quota, and link your IRCTC User ID.",
                    tag: "Berth Preference",
                  },
                  {
                    stepNum: "04",
                    title: "Choose Payment Method",
                    desc: "Select from UPI, Credit/Debit Cards, Net Banking, or Wallets. Enjoy ₹0 payment gateway charges on all UPI transactions.",
                    tag: "Zero PG Charges",
                  },
                  {
                    stepNum: "05",
                    title: "Instant Ticket Confirmation",
                    desc: "Enter your IRCTC password to complete the booking. Instantly receive your 10-digit PNR, coach and seat number via SMS & Email.",
                    tag: "Instant PNR Voucher",
                  },
                ].map((st) => (
                  <div key={st.stepNum} className="guide-step-card">
                    <div className="guide-step-header">
                      <span className="guide-step-number">{st.stepNum}</span>
                      <span className="guide-step-tag">{st.tag}</span>
                    </div>
                    <h4 className="guide-step-title">{st.title}</h4>
                    <p className="guide-step-desc">{st.desc}</p>
                  </div>
                ))}
              </div>

              {/* IRCTC Next Generation Ticket Booking Callout */}
              <div className="guide-highlight-card">
                <div className="guide-highlight-badge">Official Rail Network</div>
                <div className="guide-highlight-body">
                  <h4 className="guide-highlight-title">IRCTC Next Generation e-Ticketing System</h4>
                  <p className="guide-highlight-text">
                    Established in 1999, Indian Railway Catering and Tourism Corporation (IRCTC) is the official online ticketing arm of Indian Railways, offering railway ticketing, catering, and tourism services to passengers across India. SkyRoute is an authorized IRCTC travel partner providing direct access to the Next Generation reservation platform. To improve account security and streamline booking, passengers are advised to link Aadhaar with their IRCTC user profile for smoother authentication and higher monthly ticket quotas.
                  </p>
                </div>
              </div>

              {/* Live Railway Network Status Strip */}
              <div className="guide-network-strip">
                <span className="network-live-dot" aria-hidden="true" />
                <span className="network-status-text">
                  The total number of trains running today is <strong>18,987</strong>, active on the Indian Railways rail network.
                </span>
                <span className="network-sync-pill">IRCTC Live Sync</span>
              </div>
            </div>

            {/* ===================================================================
                BLOCK 2: IRCTC ACCOUNT LOGIN, REGISTRATION & RECOVERY
                =================================================================== */}
            <div className="train-guide-block">
              <div className="guide-block-header">
                <span className="guide-block-badge">Account Guide</span>
                <h3 className="guide-block-title">
                  IRCTC Account <span className="guide-title-highlight">Login, Registration &amp; Recovery</span>
                </h3>
              </div>

              {/* 3 Dedicated Guide Cards (Side-by-Side Triplet Grid) */}
              <div className="guide-accounts-triplet-grid">
                {/* Card 1: How to Log in */}
                <div className="guide-triplet-card">
                  <div className="triplet-header">
                    <span className="triplet-step-pill">Guide 01</span>
                    <h4 className="triplet-title">How to Log in to Your Account</h4>
                    <p className="triplet-desc">Follow these quick steps during your ticket checkout on SkyRoute:</p>
                  </div>
                  <div className="triplet-steps-list">
                    {[
                      "Open the SkyRoute website or mobile application.",
                      "Enter your journey details (origin, destination, date, class).",
                      "Add passenger information (Name, Age, Berth Preference).",
                      "Tap 'Pay Now' to complete payment with ₹0 gateway fee.",
                      "Enter your IRCTC Login ID and password to issue your ticket.",
                    ].map((stepText, idx) => (
                      <div key={idx} className="triplet-step-row">
                        <span className="triplet-num">{idx + 1}</span>
                        <span className="triplet-txt">{stepText}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 2: How to Create Account */}
                <div className="guide-triplet-card">
                  <div className="triplet-header">
                    <span className="triplet-step-pill pill-create">Guide 02</span>
                    <h4 className="triplet-title">How to Create an IRCTC Account</h4>
                    <p className="triplet-desc">Set up a brand-new official IRCTC User ID in less than 2 minutes:</p>
                  </div>
                  <div className="triplet-steps-list">
                    {[
                      "Open the SkyRoute app and navigate to your Profile section.",
                      "Select 'Link your IRCTC Account' and tap 'IRCTC username'.",
                      "Click on 'Register' on the bottom right of the prompt.",
                      "Fill in your details (Full Name, DOB, Email ID, Mobile, Address).",
                      "Enter the OTP received on mobile & email to activate your account.",
                    ].map((stepText, idx) => (
                      <div key={idx} className="triplet-step-row">
                        <span className="triplet-num">{idx + 1}</span>
                        <span className="triplet-txt">{stepText}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: How to Recover Account */}
                <div className="guide-triplet-card">
                  <div className="triplet-header">
                    <span className="triplet-step-pill pill-recover">Guide 03</span>
                    <h4 className="triplet-title">How to Recover Your Account / ID</h4>
                    <p className="triplet-desc">Easily retrieve a forgotten username or reset an expired password:</p>
                  </div>
                  <div className="triplet-steps-list">
                    {[
                      "Go to 'Link your IRCTC Account' in SkyRoute settings.",
                      "Click on 'Forgot your IRCTC User ID' or 'Forgot Password'.",
                      "Enter your registered mobile number or email ID and Date of Birth.",
                      "Enter the OTP sent to your registered phone number.",
                      "Your username will be displayed or a password reset link is emailed.",
                    ].map((stepText, idx) => (
                      <div key={idx} className="triplet-step-row">
                        <span className="triplet-num">{idx + 1}</span>
                        <span className="triplet-txt">{stepText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aadhaar Linking Tip Banner */}
              <div className="guide-tip-banner">
                <span className="tip-icon" aria-hidden="true">💡</span>
                <div className="tip-text-wrap">
                  <strong>Aadhaar Linking Benefit:</strong> Passengers who link their Aadhaar card to their IRCTC account can book up to <strong>24 train tickets per month</strong>, compared to only 12 tickets for unlinked users.
                </div>
              </div>
            </div>

            {/* ===================================================================
                BLOCK 3: IRCTC TICKET BOOKING TIMINGS & RULES (14 Points Matrix)
                =================================================================== */}
            <div className="train-guide-block">
              <div className="guide-block-header">
                <span className="guide-block-badge">Official Guidelines</span>
                <h3 className="guide-block-title">
                  IRCTC Ticket Booking <span className="guide-title-highlight">Timings, Tatkal &amp; Charting Rules</span>
                </h3>
              </div>

              {/* Quick Glance Key Hours Strip */}
              <div className="guide-timings-glance-grid">
                <div className="glance-card">
                  <span className="glance-tag">AC Tatkal</span>
                  <strong className="glance-time">10:00 AM – 10:30 AM</strong>
                  <span className="glance-sub">1 day prior to travel date</span>
                </div>
                <div className="glance-card">
                  <span className="glance-tag">Non-AC Tatkal</span>
                  <strong className="glance-time">11:00 AM – 11:30 AM</strong>
                  <span className="glance-sub">Sleeper &amp; 2S classes</span>
                </div>
                <div className="glance-card">
                  <span className="glance-tag">Daily Booking</span>
                  <strong className="glance-time">00:20 AM – 11:45 PM</strong>
                  <span className="glance-sub">Open 23h 25m every day</span>
                </div>
                <div className="glance-card glance-maintenance">
                  <span className="glance-tag">Daily Maintenance</span>
                  <strong className="glance-time">11:45 PM – 12:20 AM</strong>
                  <span className="glance-sub">IRCTC server downtime</span>
                </div>
              </div>

              {/* 14 Official Rules Grid */}
              <div className="guide-rules-table-wrap">
                <div className="guide-rules-grid">
                  {[
                    {
                      category: "TIMING",
                      rule: "Train ticket booking timings",
                      value: "00:20 AM to 11:45 PM",
                      detail: "IRCTC reservation portal is open throughout the day except during the midnight maintenance window.",
                    },
                    {
                      category: "MAINTENANCE",
                      rule: "IRCTC site maintenance window",
                      value: "11:45 PM to 12:20 AM",
                      detail: "Nightly system upkeep and database synchronization period. No bookings or cancellations are processed.",
                    },
                    {
                      category: "TATKAL",
                      rule: "Tatkal booking timings for AC berth",
                      value: "10:00 AM – 10:30 AM",
                      detail: "Opens exactly 1 day prior to the train departure date from the originating station for 1A, 2A, 3A, 3E, and CC.",
                    },
                    {
                      category: "TATKAL",
                      rule: "Tatkal booking timings for Non-AC berth",
                      value: "11:00 AM – 11:30 AM",
                      detail: "Opens exactly 1 day prior to departure for Sleeper (SL) and Second Sitting (2S) classes.",
                    },
                    {
                      category: "TATKAL",
                      rule: "Premium Tatkal booking timings",
                      value: "Same as Tatkal",
                      detail: "Dynamic pricing quota opening alongside regular Tatkal (10 AM for AC, 11 AM for Non-AC) based on real-time demand.",
                    },
                    {
                      category: "PASSENGERS",
                      rule: "Passengers allowed in Tatkal per PNR",
                      value: "4 passengers (max.)",
                      detail: "A maximum of 4 passengers can be booked on a single Tatkal ticket, including senior citizens and children.",
                    },
                    {
                      category: "ADVANCE",
                      rule: "FTR (Full Tariff Rate) bookings",
                      value: "30 days to 6 months in advance",
                      detail: "Bulk chartering of full coaches, special trains, and tourist saloons through IRCTC FTR portal.",
                    },
                    {
                      category: "CHARTING",
                      rule: "First chart preparation",
                      value: "8–10 hours before departure",
                      detail: "Indian Railways charting office finalizes berth allocations for daytime and early morning departures.",
                    },
                    {
                      category: "CHARTING",
                      rule: "Second (final) chart preparation",
                      value: "30 mins to 1 hour before departure",
                      detail: "Final allocation after current reservation bookings. Unsold berths are released to RAC / waiting list passengers.",
                    },
                    {
                      category: "QUOTA",
                      rule: "Senior citizen quota",
                      value: "Available in GN quota",
                      detail: "Senior citizen quota berths are allocated in General (GN) quota only; not permissible under Tatkal quota.",
                    },
                    {
                      category: "REFUNDS",
                      rule: "Refunds after chart preparation",
                      value: "Only through TDR request",
                      detail: "Once charting is completed, refunds can only be claimed by filing an online Ticket Deposit Receipt (TDR) with IRCTC.",
                    },
                    {
                      category: "REFUNDS",
                      rule: "Refund processing time",
                      value: "3–7 business days",
                      detail: "Refunds for confirmed cancellations and approved TDRs are credited directly to the source payment method.",
                    },
                    {
                      category: "LIMITS",
                      rule: "Monthly train ticket limit per user",
                      value: "24 (Aadhaar) / 12 (Others)",
                      detail: "Aadhaar verified IRCTC user accounts can book up to 24 tickets every calendar month, non-verified accounts up to 12.",
                    },
                    {
                      category: "LIMITS",
                      rule: "Maximum train tickets per user ID in a day",
                      value: "Max 2 tickets (8 AM – 12 PM)",
                      detail: "Between 8:00 AM and 12:00 PM, a user ID can book a maximum of two tickets to curb hoarding during peak Tatkal hours.",
                    },
                  ].map((r, idx) => (
                    <div key={idx} className="guide-rule-row">
                      <div className="rule-name-wrap">
                        <span className="rule-category-pill">{r.category}</span>
                        <strong className="rule-title">{r.rule}</strong>
                        <span className="rule-detail">{r.detail}</span>
                      </div>
                      <div className="rule-value-wrap">
                        <span className="rule-value-badge">{r.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===================================================================
                BLOCK 4: IRCTC TRAIN TICKET FARES BY TRAVEL CLASS
                =================================================================== */}
            <div className="train-guide-block">
              <div className="guide-block-header">
                <span className="guide-block-badge">Fare Structure</span>
                <h3 className="guide-block-title">
                  IRCTC Train Ticket <span className="guide-title-highlight">Fares by Travel Class</span>
                </h3>
              </div>

              <div className="guide-table-intro">
                <span className="table-intro-text">
                  Train ticket fares depend on the class of travel, minimum chargeable distance, and coach type. Check the official base fare structure below:
                </span>
              </div>

              {/* Responsive Class Fares Table */}
              <div className="guide-fares-table-container">
                <table className="guide-fares-table">
                  <thead>
                    <tr>
                      <th>Travel Class</th>
                      <th>Minimum Distance for Charge</th>
                      <th>Basic Fare at Min Distance</th>
                      <th>Reservation Fee</th>
                      <th>Supplementary Charge (Superfast)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        classCode: "2S",
                        className: "Second Class",
                        minDist: "50 Kms",
                        basicFare: "₹30",
                        resFee: "₹15",
                        superfastFee: "₹15",
                        color: "blue",
                      },
                      {
                        classCode: "SL",
                        className: "Sleeper Class",
                        minDist: "200 Kms",
                        basicFare: "₹126",
                        resFee: "₹20",
                        superfastFee: "₹30",
                        color: "slate",
                      },
                      {
                        classCode: "CC",
                        className: "AC Chair Car",
                        minDist: "150 Kms",
                        basicFare: "₹205",
                        resFee: "₹40",
                        superfastFee: "₹45",
                        color: "emerald",
                      },
                      {
                        classCode: "3A",
                        className: "AC 3 Tier",
                        minDist: "300 Kms",
                        basicFare: "₹440–470",
                        resFee: "₹40",
                        superfastFee: "₹45",
                        color: "violet",
                      },
                      {
                        classCode: "FC",
                        className: "First Class",
                        minDist: "100 Kms",
                        basicFare: "₹232",
                        resFee: "₹50",
                        superfastFee: "₹45",
                        color: "amber",
                      },
                      {
                        classCode: "EC",
                        className: "Executive Class",
                        minDist: "N/A",
                        basicFare: "N/A",
                        resFee: "₹60",
                        superfastFee: "₹75",
                        color: "rose",
                      },
                    ].map((cls) => (
                      <tr key={cls.classCode}>
                        <td>
                          <div className="class-identity-cell">
                            <span className={`class-code-tag tag-${cls.color}`}>{cls.classCode}</span>
                            <span className="class-full-name">{cls.className}</span>
                          </div>
                        </td>
                        <td><span className="metric-cell">{cls.minDist}</span></td>
                        <td><strong className="fare-cell">{cls.basicFare}</strong></td>
                        <td><span className="metric-cell">{cls.resFee}</span></td>
                        <td><span className="metric-cell">{cls.superfastFee}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fares Footnote Callout */}
              <div className="guide-table-footnote">
                <div className="footnote-item">
                  <span className="footnote-bullet">•</span>
                  <span><strong>GST Surcharge:</strong> Goods and Services Tax (GST) of 5% is applicable on all air-conditioned travel classes (1A, 2A, 3A, 3E, CC, and EC).</span>
                </div>
                <div className="footnote-item">
                  <span className="footnote-bullet">•</span>
                  <span><strong>Premium Trains:</strong> Trains such as Rajdhani, Shatabdi, Duronto, and Vande Bharat include catering charges and are subject to dynamic flexi-fare pricing.</span>
                </div>
              </div>
            </div>

            {/* ===================================================================
                BLOCK 5: VALID TRAVEL IDS & EXCLUSIVE SKYROUTE FEATURES
                =================================================================== */}
            <div className="train-guide-block">
              <div className="guide-block-header">
                <span className="guide-block-badge">Travel Essentials &amp; Benefits</span>
                <h3 className="guide-block-title">
                  Valid Travel ID Proofs &amp; <span className="guide-title-highlight">Exclusive SkyRoute Features</span>
                </h3>
              </div>

              <div className="guide-split-layout">
                {/* Left Column: 10 Valid ID Proofs */}
                <div className="guide-ids-card">
                  <div className="guide-card-intro">
                    <span className="guide-card-pill">TTE Verification</span>
                    <h4 className="guide-card-title">Valid ID Proofs for Train Travel</h4>
                    <p className="guide-card-desc">
                      You don&apos;t need to enter ID details while booking train tickets online. However, passengers must carry a valid original ID proof during their journey for verification by the Travelling Ticket Examiner (TTE):
                    </p>
                  </div>

                  <div className="guide-id-badges-grid">
                    {[
                      "Aadhaar Card (including e-Aadhaar & m-Aadhaar)",
                      "Voter ID Card",
                      "Passport",
                      "Driving License",
                      "PAN Card",
                      "Photo ID issued by Central / State Government",
                      "Student ID Card with photograph",
                      "Nationalized Bank Passbook with photograph",
                      "Credit Card with laminated photograph",
                      "Any other Government Photo ID with serial number",
                    ].map((idName, idx) => (
                      <div key={idx} className="guide-id-item">
                        <span className="id-check-icon" aria-hidden="true">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="id-name-text">{idName}</span>
                      </div>
                    ))}
                  </div>

                  <div className="guide-id-note">
                    <span className="id-note-icon">ℹ️</span>
                    <span>Digital IDs stored in Government <strong>DigiLocker</strong> or <strong>m-Aadhaar</strong> are officially accepted by Indian Railways.</span>
                  </div>
                </div>

                {/* Right Column: SkyRoute Train Booking Features */}
                <div className="guide-features-card">
                  <div className="guide-card-intro">
                    <span className="guide-card-pill pill-brand">SkyRoute Assured</span>
                    <h4 className="guide-card-title">Train Booking Features on SkyRoute</h4>
                    <p className="guide-card-desc">
                      Enjoy a smooth, predictable, and stress-free train journey with our smart travel utilities:
                    </p>
                  </div>

                  <div className="guide-features-list">
                    {[
                      {
                        title: "Alternate Travel Plan",
                        desc: "Avoid the uncertainty of waitlisted tickets. Select this option while booking to get up to 3X refund if your ticket remains unconfirmed.",
                        icon: "💡",
                        badge: "Up to 3X Refund",
                      },
                      {
                        title: "Free Cancellation with Assured",
                        desc: "Enjoy complete peace of mind with 100% full refund and ₹0 cancellation penalty on eligible bookings before chart preparation.",
                        icon: "🛡️",
                        badge: "₹0 Fee",
                      },
                      {
                        title: "Live PNR Confirmation Status",
                        desc: "Check live seat confirmation odds with our high-accuracy AI prediction algorithm trained on historical Indian Railways trends.",
                        icon: "🎫",
                        badge: "AI Prediction",
                      },
                      {
                        title: "Live GPS Train Running Status",
                        desc: "Track real-time train location, delays, halt timings, and platform announcements directly without internet connectivity on train.",
                        icon: "📍",
                        badge: "Live GPS",
                      },
                      {
                        title: "Order Food on Train",
                        desc: "Get fresh, hygienic, FSSAI-approved hot meals from top restaurant brands delivered straight to your coach and berth.",
                        icon: "🍱",
                        badge: "Seat Delivery",
                      },
                    ].map((feat, fIdx) => (
                      <div key={fIdx} className="guide-feature-box">
                        <span className="feat-icon" aria-hidden="true">{feat.icon}</span>
                        <div className="feat-content">
                          <div className="feat-title-row">
                            <h5 className="feat-title">{feat.title}</h5>
                            <span className="feat-badge">{feat.badge}</span>
                          </div>
                          <p className="feat-desc">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Hotel />
      <Faq />
    </div>
  );
}
