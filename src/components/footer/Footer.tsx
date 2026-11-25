"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="skyroute-footer-wrapper">
      <div className="skyroute-footer-container">
        {/* Main 6-Column Row */}
        <div className="footer-main-row">
          {/* 1. Brand Logo & Message */}
          <div className="footer-logo-col">
            <Link href="/" className="footer-logo-link" aria-label="SkyRoute Home">
              <div className="footer-logo-circle">
                <Image
                  src="/images/logo.webp"
                  alt="SkyRoute Logo"
                  width={46}
                  height={46}
                  className="footer-logo-img"
                />
              </div>
              <div className="footer-brand-text">
                <span className="footer-brand-name">
                  Sky<span>Route</span>
                </span>
                <span className="footer-brand-tagline">Fly • Stay • Travel</span>
              </div>
            </Link>
            <p className="footer-brand-message">
              Explore the world with seamless flight bookings, luxury stays, and unforgettable journeys crafted for modern travelers.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link href="/">
                  <span className="footer-link-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </span>
                  <span>Flights</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link href="/hotel">
                  <span className="footer-link-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
                    </svg>
                  </span>
                  <span>Hotels</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link href="/bus">
                  <span className="footer-link-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
                    </svg>
                  </span>
                  <span>Bus</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link href="/train">
                  <span className="footer-link-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm4.5-7H6V6h6v4zm4.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-6V6h6v4z" />
                    </svg>
                  </span>
                  <span>Train</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. About Us */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">About Us</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link href="/aboutUs">
                  <span className="footer-link-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </span>
                  <span>About Us</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link href="/contact">
                  <span className="footer-link-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                  <span>Contact Us</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link href="/faq">
                  <span className="footer-link-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                    </svg>
                  </span>
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Support */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links-list">
              <li className="footer-contact-item">
                <span className="footer-contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 3.92c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.54c0-.54-.45-1-.99-1z" />
                  </svg>
                </span>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <a href="mailto:support@skyroute.com">support@skyroute.com</a>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                  </svg>
                </span>
                <span>24/7 Support</span>
              </li>
            </ul>
          </div>

          {/* 5. Subscribe to our Newsletter & Social Media */}
          <div className="footer-newsletter-col">
            <h4 className="footer-col-title">Subscribe to our Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
              <input
                type="email"
                className="footer-newsletter-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="footer-newsletter-btn"
                aria-label="Subscribe"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
            {isSubscribed && (
              <p className="newsletter-success-msg">✓ Subscribed successfully!</p>
            )}

            {/* Social Media Under Newsletter */}
            <div className="footer-social-section">
              <span className="footer-social-title">Follow Us</span>
              <div className="footer-social-icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Facebook"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="YouTube"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Instagram"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="LinkedIn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.88 0 1.6-.72 1.6-1.6s-.72-1.6-1.6-1.6c-.89 0-1.6.72-1.6 1.6s.71 1.6 1.6 1.6m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="X"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Path Curve & Airplane Divider */}
        <div className="footer-flight-divider">
          <div className="footer-flight-line" />
          <div className="footer-flight-plane" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 SkyRoute. All rights reserved.
          </p>
          <ul className="footer-legal-links">
            <li>
              <Link href="/privacyPolicy">Privacy Policy</Link>
            </li>
            <li className="footer-legal-divider">|</li>
            <li>
              <Link href="/privacyPolicy">Terms &amp; Conditions</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
