"use client";

import React, { useState } from "react";
import "./OtherSection.css";

export default function OtherSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="skyroute-other-section" aria-label="Newsletter Subscription">
      {/* 1320px Standard Container */}
      <div className="skyroute-other-container">
        <div className="newsletter-banner-card">
          {/* Scenic Sky, Soft Clouds & Misty Mountain Backdrop */}
          <svg
            className="newsletter-bg-scenery"
            viewBox="0 0 1288 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="nlSkyBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94deff" />
                <stop offset="32%" stopColor="#cceeff" />
                <stop offset="68%" stopColor="#e8f6ff" />
                <stop offset="100%" stopColor="#b5e5ff" />
              </linearGradient>

              <radialGradient id="nlCloudLeft" cx="18%" cy="48%" r="44%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                <stop offset="55%" stopColor="#eef8ff" stopOpacity="0.58" />
                <stop offset="100%" stopColor="#cdeeff" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="nlCloudCenter" cx="55%" cy="32%" r="42%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#f0f9ff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#d8f1ff" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="nlCloudRight" cx="82%" cy="18%" r="36%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
                <stop offset="65%" stopColor="#e2f4ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#b6e4ff" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="nlMountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c5e6fc" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#8ed4fa" stopOpacity="0.52" />
              </linearGradient>

              <linearGradient id="nlOceanWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a7e1ff" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#77cffb" stopOpacity="0.78" />
                <stop offset="100%" stopColor="#6bc9fa" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Base Sky Fill */}
            <rect width="1288" height="260" fill="url(#nlSkyBase)" />

            {/* Soft Cloudy Highlights */}
            <rect width="1288" height="260" fill="url(#nlCloudLeft)" />
            <rect width="1288" height="260" fill="url(#nlCloudCenter)" />
            <rect width="1288" height="260" fill="url(#nlCloudRight)" />

            {/* Distant Misty Mountain Silhouettes (Right & Mid Horizon) */}
            <path
              d="M 520 260 L 675 182 Q 730 156 792 178 L 930 140 Q 985 126 1042 152 L 1165 96 Q 1218 72 1288 106 L 1288 260 Z"
              fill="url(#nlMountainFar)"
            />
            <path
              d="M 1085 162 L 1185 104 L 1230 132 L 1288 102 L 1288 260 L 1030 260 Z"
              fill="#e4f4ff"
              fillOpacity="0.55"
            />

            {/* Soft Lower Cloud Mist & Cerulean Horizon Sweep */}
            <path
              d="M 0 198 Q 160 165 340 202 T 720 194 T 1100 180 T 1288 192 L 1288 260 L 0 260 Z"
              fill="url(#nlOceanWave)"
            />
            <path
              d="M 0 228 Q 220 204 455 232 T 960 226 T 1288 214 L 1288 260 L 0 260 Z"
              fill="#62c5f9"
              fillOpacity="0.45"
            />
          </svg>

          {/* Decorative Curved Loop Flight Trail & Airplane (Top-Right) */}
          <div className="newsletter-flight-art" aria-hidden="true">
            <svg
              className="newsletter-flight-svg"
              viewBox="0 0 270 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Graceful Looped Dashed Flight Path */}
              <path
                d="M 12 104 C 48 86, 98 64, 96 42 C 94 20, 44 20, 32 40 C 20 58, 56 76, 108 72 C 154 68, 192 50, 218 32"
                stroke="#3b82f6"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeDasharray="4.5 5.5"
                opacity="0.78"
              />
              {/* Royal Blue Airplane Icon Positioned at Path Tip */}
              <g transform="translate(236, 21) rotate(52)">
                <path
                  d="M0 -18 C1.6 -18 2.8 -15.6 2.8 -12.4 L2.8 -3.6 L15.5 3.6 L15.5 7.4 L2.8 3.6 L2.8 11.4 L7.2 14.4 L7.2 17.2 L0 15.2 L-7.2 17.2 L-7.2 14.4 L-2.8 11.4 L-2.8 3.6 L-15.5 7.4 L-15.5 3.6 L-2.8 -3.6 L-2.8 -12.4 C-2.8 -15.6 -1.6 -18 0 -18 Z"
                  fill="#0b46b5"
                />
              </g>
            </svg>
          </div>

          {/* Foreground Content */}
          <div className="newsletter-banner-inner">
            {/* Top Row: Envelope Badge + Title & Subtitle */}
            <div className="newsletter-header-row">
              <div className="newsletter-icon-badge" aria-hidden="true">
                <svg
                  className="newsletter-mail-icon"
                  width="34"
                  height="26"
                  viewBox="0 0 36 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="2" y="2" width="32" height="24" rx="4" fill="#ffffff" />
                  <path
                    d="M3.5 4.2L18 15.2L32.5 4.2"
                    stroke="#047a86"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.8 23.4L13.2 14.2"
                    stroke="#047a86"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32.2 23.4L22.8 14.2"
                    stroke="#047a86"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="newsletter-heading-group">
                <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
                <p className="newsletter-subtitle">
                  Get the latest travel deals, tips and more.
                </p>
              </div>
            </div>

            {/* Bottom Row: Unified White Pill Input + Royal Blue Subscribe Button */}
            <form
              className="newsletter-form-bar"
              onSubmit={handleSubmit}
              noValidate
            >
              <label htmlFor="skyroute-newsletter-email" className="newsletter-sr-only">
                Email address
              </label>
              <input
                id="skyroute-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Enter your email address"
                className="newsletter-email-input"
                autoComplete="email"
                required
              />

              <button type="submit" className="newsletter-submit-btn">
                <span>Subscribe</span>
                <svg
                  className="newsletter-submit-arrow"
                  width="19"
                  height="19"
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
              </button>
            </form>

            {status === "success" && (
              <p className="newsletter-feedback newsletter-feedback-success" role="status">
                Thank you for subscribing! Check your inbox for our latest travel deals.
              </p>
            )}
            {status === "error" && (
              <p className="newsletter-feedback newsletter-feedback-error" role="alert">
                Please enter a valid email address.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
