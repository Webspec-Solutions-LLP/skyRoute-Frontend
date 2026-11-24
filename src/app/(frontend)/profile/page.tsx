"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./Profile.css";

export default function ProfilePage() {
  const router = useRouter();

  // Active Tab: "profile" | "travellers" | "alerts" | "devices" | "support"
  const [activeTab, setActiveTab] = useState<string>("profile");

  // User Profile Form States
  const [firstName, setFirstName] = useState("Joydeep");
  const [lastName, setLastName] = useState("Barik");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("1996-08-15");
  const [nationality, setNationality] = useState("Indian");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [stateName, setStateName] = useState("West Bengal");

  // Contact States
  const [phone, setPhone] = useState("9749708386");
  const [email, setEmail] = useState("joydeepbarik007@gmail.com");
  const [altPhone, setAltPhone] = useState("");

  // Document States
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [passportCountry, setPassportCountry] = useState("India");
  const [panNumber, setPanNumber] = useState("");

  // Avatar state
  const [avatar, setAvatar] = useState("/images/user-avatar.png");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("skyroute_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          if (parsed.fullName) {
            const parts = parsed.fullName.trim().split(" ");
            if (parts.length > 1) {
              setFirstName(parts.slice(0, -1).join(" "));
              setLastName(parts[parts.length - 1]);
            } else {
              setFirstName(parsed.fullName);
              setLastName("");
            }
          }
          if (parsed.firstName) setFirstName(parsed.firstName);
          if (parsed.lastName) setLastName(parsed.lastName);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.city) setCity(parsed.city);
          if (parsed.gender) setGender(parsed.gender);
          if (parsed.avatar) setAvatar(parsed.avatar);
          if (parsed.dob) setDob(parsed.dob);
          if (parsed.nationality) setNationality(parsed.nationality);
          if (parsed.maritalStatus) setMaritalStatus(parsed.maritalStatus);
          if (parsed.state) setStateName(parsed.state);
          if (parsed.passportNumber) setPassportNumber(parsed.passportNumber);
          if (parsed.passportExpiry) setPassportExpiry(parsed.passportExpiry);
          if (parsed.panNumber) setPanNumber(parsed.panNumber);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAvatarChange = () => {
    const newAvatar = prompt("Enter image URL for your profile avatar:", avatar);
    if (newAvatar && newAvatar.trim()) {
      setAvatar(newAvatar.trim());
      setToastMsg("Avatar updated!");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFullName = `${firstName.trim()} ${lastName.trim()}`.trim() || "Joydeep Barik";

    const userData = {
      isLoggedIn: true,
      fullName: finalFullName,
      firstName: firstName.trim() || "Joydeep",
      lastName: lastName.trim() || "Barik",
      email: email.trim() || "joydeepbarik007@gmail.com",
      phone: phone.trim() || "9749708386",
      city: city.trim() || "Kolkata",
      state: stateName.trim() || "West Bengal",
      gender,
      dob,
      nationality,
      maritalStatus,
      anniversaryDate,
      passportNumber: passportNumber.trim(),
      passportExpiry,
      passportCountry,
      panNumber: panNumber.trim().toUpperCase(),
      avatar: avatar || "/images/user-avatar.png",
    };

    try {
      localStorage.setItem("skyroute_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("skyroute_auth_change"));
      setToastMsg("Profile details saved successfully!");
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("skyroute_user");
      window.dispatchEvent(new Event("skyroute_auth_change"));
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="sky-profile-page">
      <div className="sky-profile-container">
        {/* ==========================================================================
            Top Branded Hero Profile Banner
            ========================================================================== */}
        <section className="profile-banner-card">
          <div className="profile-banner-left">
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrap">
                <Image
                  src={avatar}
                  alt={`${firstName} ${lastName}`}
                  width={82}
                  height={82}
                  className="profile-avatar-img"
                  priority
                />
              </div>
              <button
                type="button"
                className="profile-avatar-badge"
                title="Change Photo"
                onClick={handleAvatarChange}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>

            <div className="profile-banner-info">
              <div className="profile-banner-name-row">
                <h1 className="profile-banner-name">{firstName} {lastName}</h1>
                <span className="profile-tier-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>SkyPass Voyager • Verified</span>
                </span>
              </div>

              <div className="profile-banner-contacts">
                <span className="profile-contact-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +91 {phone}
                </span>
                <span className="profile-contact-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {email}
                </span>
                <span className="profile-contact-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {city}, India
                </span>
              </div>

              <div className="profile-completion-meter">
                <div className="profile-completion-bar">
                  <div className="profile-completion-fill" style={{ width: "85%" }} />
                </div>
                <span className="profile-completion-text">Profile 85% Complete</span>
              </div>
            </div>
          </div>

          {/* Quick Action Cards on Right */}
          <div className="profile-banner-actions">
            {/* SkyWallet Widget (Static informational display) */}
            <div className="profile-quick-card is-static">
              <div className="profile-quick-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </div>
              <div className="profile-quick-info">
                <span className="profile-quick-label">SkyWallet</span>
                <span className="profile-quick-val">₹1,500</span>
              </div>
            </div>

            {/* Travel Gift Card Link */}
            <Link href="/giftCard" className="profile-quick-card">
              <div className="profile-quick-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect width="20" height="5" x="2" y="7" />
                  <line x1="12" x2="12" y1="22" y2="7" />
                </svg>
              </div>
              <div className="profile-quick-info">
                <span className="profile-quick-label">Have a Gift Card?</span>
                <span className="profile-quick-val">
                  Redeem
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="profile-quick-arrow">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ==========================================================================
            Main 2-Column Layout
            ========================================================================== */}
        <div className="profile-grid-layout">
          {/* Left Sidebar Menu */}
          <aside className="profile-sidebar-card">
            <div className="profile-sidebar-section-title">My Account</div>

            <button
              type="button"
              className={`profile-nav-btn ${activeTab === "profile" ? "is-active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <div className="profile-nav-btn-content">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>My Profile</span>
              </div>
              {activeTab === "profile" && <span className="profile-nav-dot" />}
            </button>

            <button
              type="button"
              className={`profile-nav-btn ${activeTab === "alerts" ? "is-active" : ""}`}
              onClick={() => setActiveTab("alerts")}
            >
              <div className="profile-nav-btn-content">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span>Fare Alerts</span>
              </div>
            </button>

            <button
              type="button"
              className={`profile-nav-btn ${activeTab === "devices" ? "is-active" : ""}`}
              onClick={() => setActiveTab("devices")}
            >
              <div className="profile-nav-btn-content">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                <span>Logged in Devices</span>
              </div>
            </button>

            <div className="profile-sidebar-divider" />
            <div className="profile-sidebar-section-title">Support &amp; Preferences</div>

            <button
              type="button"
              className={`profile-nav-btn ${activeTab === "support" ? "is-active" : ""}`}
              onClick={() => setActiveTab("support")}
            >
              <div className="profile-nav-btn-content">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Customer Service</span>
              </div>
            </button>

            <Link href="/terms" className="profile-nav-btn">
              <div className="profile-nav-btn-content">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Terms of Use</span>
              </div>
            </Link>

            <Link href="/privacyPolicy" className="profile-nav-btn">
              <div className="profile-nav-btn-content">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Privacy Policy</span>
              </div>
            </Link>

            <div className="profile-sidebar-divider" />

            <button
              type="button"
              className="profile-nav-btn is-logout"
              onClick={handleLogout}
            >
              <div className="profile-nav-btn-content">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log Out</span>
              </div>
            </button>
          </aside>

          {/* Right Content Area */}
          <main className="profile-main-container">
            {activeTab === "profile" && (
              <form onSubmit={handleSave}>
                {/* Header Action Bar */}
                <div className="profile-content-header-card">
                  <div className="profile-content-header-titles">
                    <h2>My Profile</h2>
                    <p>Manage your personal identification, contact details and official travel documents</p>
                  </div>
                  <button type="submit" className="profile-save-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    <span>Save Changes</span>
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
                  {/* Card 1: General Information */}
                  <div className="profile-section-card">
                    <div className="profile-card-title-row">
                      <div className="profile-card-title-left">
                        <div className="profile-card-icon-pill">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="profile-card-title">General Information</h3>
                          <p className="profile-card-subtitle">Personal details matching your official travel photo IDs</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-fields-grid">
                      {/* First & Middle Name */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">
                          First &amp; Middle Name <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          className="profile-text-input"
                          placeholder="e.g. Joydeep"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Last Name */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">
                          Last Name <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          className="profile-text-input"
                          placeholder="e.g. Barik"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Gender Segmented Selection */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">
                          Gender <span className="required-star">*</span>
                        </label>
                        <div className="profile-gender-segmented">
                          {["Male", "Female", "Others"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              className={`profile-gender-btn ${gender === g ? "is-selected" : ""}`}
                              onClick={() => setGender(g)}
                            >
                              {g === "Male" && "♂ "}
                              {g === "Female" && "♀ "}
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">Date of Birth</label>
                        <input
                          type="date"
                          className="profile-text-input"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>

                      {/* Nationality */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">Nationality</label>
                        <select
                          className="profile-select-input"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                        >
                          <option value="Indian">Indian</option>
                          <option value="American">American</option>
                          <option value="British">British</option>
                          <option value="Australian">Australian</option>
                          <option value="Canadian">Canadian</option>
                          <option value="Emirati">Emirati</option>
                          <option value="Singaporean">Singaporean</option>
                        </select>
                      </div>

                      {/* Marital Status */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">Marital Status</label>
                        <select
                          className="profile-select-input"
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Anniversary Date */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">Anniversary Date</label>
                        <input
                          type="date"
                          className="profile-text-input"
                          value={anniversaryDate}
                          onChange={(e) => setAnniversaryDate(e.target.value)}
                        />
                      </div>

                      {/* City */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">City</label>
                        <input
                          type="text"
                          className="profile-text-input"
                          placeholder="e.g. Kolkata"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      {/* State */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">State</label>
                        <select
                          className="profile-select-input"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                        >
                          <option value="West Bengal">West Bengal</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Goa">Goa</option>
                        </select>
                      </div>
                    </div>

                    <div className="profile-info-callout">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>
                        City &amp; State details are required for GST tax invoicing compliance on flight bookings.
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Contact Details */}
                  <div className="profile-section-card">
                    <div className="profile-card-title-row">
                      <div className="profile-card-title-left">
                        <div className="profile-card-icon-pill">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="profile-card-title">Contact Details</h3>
                          <p className="profile-card-subtitle">Receive flight tickets, WhatsApp boarding passes and gate change alerts</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-fields-grid">
                      {/* Mobile Number */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">
                          Mobile Number <span className="required-star">*</span>
                        </label>
                        <div className="profile-input-with-badge">
                          <input
                            type="tel"
                            className="profile-text-input"
                            value={phone}
                            maxLength={10}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            required
                          />
                          <span className="profile-verified-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Verified
                          </span>
                        </div>
                      </div>

                      {/* Email ID */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">
                          Email ID <span className="required-star">*</span>
                        </label>
                        <div className="profile-input-with-badge">
                          <input
                            type="email"
                            className="profile-text-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <span className="profile-verified-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Verified
                          </span>
                        </div>
                      </div>

                      {/* Alternate Contact */}
                      <div className="profile-field-group full-span">
                        <label className="profile-field-label">Emergency / Alternate Contact (Optional)</label>
                        <input
                          type="tel"
                          className="profile-text-input"
                          placeholder="Optional emergency mobile number"
                          value={altPhone}
                          onChange={(e) => setAltPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Documents Details */}
                  <div className="profile-section-card">
                    <div className="profile-card-title-row">
                      <div className="profile-card-title-left">
                        <div className="profile-card-icon-pill">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <rect width="18" height="14" x="3" y="5" rx="2" />
                            <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="profile-card-title">Documents Details</h3>
                          <p className="profile-card-subtitle">Add official IDs for seamless international &amp; domestic boarding</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-fields-grid">
                      {/* Passport Number */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">Passport Number</label>
                        <input
                          type="text"
                          className="profile-text-input"
                          placeholder="e.g. Z1234567"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                        />
                      </div>

                      {/* Expiry Date */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">Passport Expiry Date</label>
                        <input
                          type="date"
                          className="profile-text-input"
                          value={passportExpiry}
                          onChange={(e) => setPassportExpiry(e.target.value)}
                        />
                      </div>

                      {/* Issuing Country */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">Issuing Country</label>
                        <select
                          className="profile-select-input"
                          value={passportCountry}
                          onChange={(e) => setPassportCountry(e.target.value)}
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                          <option value="Singapore">Singapore</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                        </select>
                      </div>

                      {/* PAN Card Number */}
                      <div className="profile-field-group">
                        <label className="profile-field-label">PAN Card Number</label>
                        <input
                          type="text"
                          className="profile-text-input"
                          placeholder="e.g. ABCDE1234F"
                          maxLength={10}
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        />
                      </div>
                    </div>

                    <div className="profile-warning-callout">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span>
                        <strong>NOTE:</strong> Your PAN No. will only be used for international flight bookings as mandated by the Reserve Bank of India (RBI) under the Liberalised Remittance Scheme (LRS).
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Tab 2: Fare Alerts */}
            {activeTab === "alerts" && (
              <div className="profile-tab-content-card">
                <div className="profile-card-title-row">
                  <div>
                    <h3 className="profile-card-title">Flight Fare Alerts</h3>
                    <p className="profile-card-subtitle">Track price drops on your favorite flight routes</p>
                  </div>
                  <Link href="/allflights" className="profile-action-btn-outline">
                    + Track New Route
                  </Link>
                </div>

                <div className="profile-devices-list">
                  <div className="profile-device-item">
                    <div className="profile-device-info">
                      <div className="profile-device-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="profile-device-title">Kolkata (CCU) ➔ New Delhi (DEL)</div>
                        <div className="profile-device-meta">Alert set for fares below ₹4,200 • Daily instant alert enabled</div>
                      </div>
                    </div>
                    <span className="profile-active-tag">Active Tracker</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Logged in Devices */}
            {activeTab === "devices" && (
              <div className="profile-tab-content-card">
                <div className="profile-card-title-row">
                  <div>
                    <h3 className="profile-card-title">Logged in Devices</h3>
                    <p className="profile-card-subtitle">Manage active sessions across your browsers and SkyRoute mobile apps</p>
                  </div>
                </div>

                <div className="profile-devices-list">
                  <div className="profile-device-item">
                    <div className="profile-device-info">
                      <div className="profile-device-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect width="20" height="14" x="2" y="3" rx="2" />
                          <line x1="8" x2="16" y1="21" y2="21" />
                          <line x1="12" x2="12" y1="17" y2="21" />
                        </svg>
                      </div>
                      <div>
                        <div className="profile-device-title">Windows PC • Chrome 124</div>
                        <div className="profile-device-meta">Kolkata, India • IP: 103.21.***.*** • Current Device</div>
                      </div>
                    </div>
                    <span className="profile-active-tag">Active Now</span>
                  </div>

                  <div className="profile-device-item">
                    <div className="profile-device-info">
                      <div className="profile-device-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                          <line x1="12" x2="12.01" y1="18" y2="18" />
                        </svg>
                      </div>
                      <div>
                        <div className="profile-device-title">iPhone 15 Pro • SkyRoute iOS App</div>
                        <div className="profile-device-meta">Kolkata, India • Last active 2 hours ago</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => alert("Session logged out")}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Customer Service */}
            {activeTab === "support" && (
              <div className="profile-tab-content-card">
                <div className="profile-card-title-row">
                  <div>
                    <h3 className="profile-card-title">Customer Service &amp; Support</h3>
                    <p className="profile-card-subtitle">Get round-the-clock priority assistance for your SkyRoute flight bookings</p>
                  </div>
                </div>

                <div className="profile-devices-list">
                  <div className="profile-device-item">
                    <div className="profile-device-info">
                      <div className="profile-device-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <div className="profile-device-title">24x7 SkyRoute Priority Helpline</div>
                        <div className="profile-device-meta">Toll-free: 1800-SKY-ROUTE (1800-759-76883)</div>
                      </div>
                    </div>
                    <span className="profile-active-tag">Toll Free</span>
                  </div>

                  <div className="profile-device-item">
                    <div className="profile-device-info">
                      <div className="profile-device-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <div>
                        <div className="profile-device-title">Email Customer Support</div>
                        <div className="profile-device-meta">support@skyroute.com • Average response under 15 minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ==========================================================================
            Toast Notification
            ========================================================================== */}
        {toastMsg && (
          <div className="profile-toast-notification">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
