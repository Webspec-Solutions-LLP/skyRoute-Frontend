"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import "./GiftCard.css";

// Travel-centric Gifting Occasions (strictly NO bank offers!)
export type OccasionType =
  | "Birthday & Milestones"
  | "Romantic & Honeymoon"
  | "Festive & Celebrations"
  | "Corporate & Rewards"
  | "Solo & Adventure"
  | "Family Getaways";

export interface TravelVoucher {
  id: string;
  title: string;
  category: "Flights" | "Hotels" | "Holidays" | "Luxury" | "Festive";
  occasion: OccasionType;
  scope: "Domestic" | "International" | "Both";
  tag: string;
  isUrgent?: boolean;
  discountText: string;
  description: string;
  promoCode: string;
  minSpend: string;
  validity: string;
  imageUrl: string;
  priceTier: "budget" | "standard" | "premium" | "luxury";
  terms: string[];
}

const SAMPLE_VOUCHERS: TravelVoucher[] = [
  {
    id: "gc-1",
    title: "Global Flight Explorer Card",
    category: "Flights",
    occasion: "Solo & Adventure",
    scope: "International",
    tag: "Bestseller",
    discountText: "Flat ₹2,500 Extra Credit",
    description: "Gift unlimited flight choices across 500+ global airlines. Zero blackout dates on economy & business classes.",
    promoCode: "SKYGLOBAL",
    minSpend: "Min. spend ₹12,000",
    validity: "Valid for 365 Days",
    imageUrl: "/images/banner.webp",
    priceTier: "premium",
    terms: [
      "Applicable on all international flight bookings via SkyRoute.",
      "Can be combined with ongoing seasonal airline sales.",
      "Card balance can be used across multiple bookings until depleted.",
      "Includes complimentary priority airport assistance.",
    ],
  },
  {
    id: "gc-2",
    title: "Royal Heritage & Palace Stay Pass",
    category: "Luxury",
    occasion: "Romantic & Honeymoon",
    scope: "Domestic",
    tag: "VIP Luxury",
    discountText: "Flat 25% Off + High Tea",
    description: "Experience regal hospitality at premier heritage palaces, forts, and 5-star royal suites across Rajasthan & South India.",
    promoCode: "ROYALRETREAT",
    minSpend: "Min. 2 nights stay",
    validity: "Expires in 6 days",
    isUrgent: true,
    imageUrl: "/images/hotel1.png",
    priceTier: "luxury",
    terms: [
      "Valid at select luxury heritage hotels and palace properties.",
      "Includes daily royal breakfast and traditional evening high tea.",
      "Free room upgrade subject to availability at check-in.",
      "Full refund available on cancellation 48 hours prior.",
    ],
  },
  {
    id: "gc-3",
    title: "Goa Beach Villa & Resort Voucher",
    category: "Hotels",
    occasion: "Birthday & Milestones",
    scope: "Domestic",
    tag: "Popular",
    discountText: "Up to ₹4,500 Off",
    description: "Private sea-facing villas, boutique beach shacks, and infinity pool stays across North and South Goa.",
    promoCode: "GOAWANDER",
    minSpend: "Min. spend ₹7,500",
    validity: "Valid for 12 months",
    imageUrl: "/images/location1.webp",
    priceTier: "standard",
    terms: [
      "Applicable on verified beachfront resorts and luxury homestays in Goa.",
      "Complimentary welcome drinks and airport transfer voucher.",
      "100% stackable with ongoing weekend deals.",
    ],
  },
  {
    id: "gc-4",
    title: "Himalayan Snow Trek & Valley Stay",
    category: "Holidays",
    occasion: "Solo & Adventure",
    scope: "Domestic",
    tag: "Adventure Special",
    discountText: "Save ₹3,000 on Packages",
    description: "Curated mountain expeditions, guided pine-forest treks, and cozy heated chalet stays in Manali, Leh & Kashmir.",
    promoCode: "HIMALAYAS",
    minSpend: "Min. 3-day tour",
    validity: "Valid for 365 Days",
    imageUrl: "/images/category1.webp",
    priceTier: "standard",
    terms: [
      "Valid on all guided holiday packages in Himachal, Kashmir, and Uttarakhand.",
      "Includes certified mountaineering guide and trekking permits.",
      "Flexible rescheduling up to 7 days before departure.",
    ],
  },
  {
    id: "gc-5",
    title: "Diwali Grand Travel Spark Card",
    category: "Festive",
    occasion: "Festive & Celebrations",
    scope: "Both",
    tag: "Festive Limited",
    discountText: "Get ₹1,500 Bonus Travel Cash",
    description: "The ultimate festive gift for loved ones to travel home or escape on a grand family holiday during festival season.",
    promoCode: "DIWALISPARK",
    minSpend: "On purchase of ₹8,000+",
    validity: "Expires in 3 days",
    isUrgent: true,
    imageUrl: "/images/banner1.webp",
    priceTier: "premium",
    terms: [
      "Usable on Flights, Hotels, Bus, and IRCTC Trains.",
      "Includes customizable golden festive greetings card.",
      "Instant delivery directly to recipient's email & WhatsApp.",
    ],
  },
  {
    id: "gc-6",
    title: "Executive Corporate Milestone Pass",
    category: "Holidays",
    occasion: "Corporate & Rewards",
    scope: "Both",
    tag: "Corporate Choice",
    discountText: "Lounge Access + 15% Bonus",
    description: "Reward outstanding teams and business partners with premier corporate travel privileges and business-class flexibility.",
    promoCode: "CORPREWARD",
    minSpend: "Corporate accounts only",
    validity: "Valid for 18 months",
    imageUrl: "/images/allFlightsBackground.webp",
    priceTier: "luxury",
    terms: [
      "Includes complimentary domestic & international airport lounge passes.",
      "Dedicated corporate concierge support 24/7.",
      "Bulk GST invoicing and tax exemptions applicable.",
    ],
  },
  {
    id: "gc-7",
    title: "Overwater Villa Maldives Romance Pass",
    category: "Luxury",
    occasion: "Romantic & Honeymoon",
    scope: "International",
    tag: "Exclusive",
    discountText: "Up to ₹9,000 Off Package",
    description: "Sunset overwater villas, private catamaran cruises, and candlelit beach dinners across the Indian Ocean.",
    promoCode: "ISLANDLOVE",
    minSpend: "Min. spend ₹35,000",
    validity: "Valid for 12 months",
    imageUrl: "/images/hotel2.png",
    priceTier: "luxury",
    terms: [
      "Valid on selected luxury island resorts in Maldives, Bali & Mauritius.",
      "Complimentary honeymoon bed decoration & sunset champagne.",
      "Includes speed boat or seaplane return transfer credits.",
    ],
  },
  {
    id: "gc-8",
    title: "Weekend Nature Homestay & Farm Retreat",
    category: "Hotels",
    occasion: "Family Getaways",
    scope: "Domestic",
    tag: "Family Special",
    discountText: "Flat ₹1,800 Off Stays",
    description: "Escape the city rush with organic farmstays, coffee estate bungalows, and tranquil lakeside cottages.",
    promoCode: "NATUREESCAPE",
    minSpend: "Min. spend ₹4,500",
    validity: "Valid for 365 Days",
    imageUrl: "/images/hotel3.png",
    priceTier: "budget",
    terms: [
      "Valid at certified eco-friendly plantations and homestays.",
      "Includes farm-to-table breakfast and nature trail guided walk.",
      "Pet-friendly stays available on select properties.",
    ],
  },
  {
    id: "gc-9",
    title: "Golden Triangle Cultural Odyssey",
    category: "Holidays",
    occasion: "Birthday & Milestones",
    scope: "Domestic",
    tag: "Top Rated",
    discountText: "20% Off All-Inclusive Tour",
    description: "Immerse in timeless heritage across Delhi, Agra, and Jaipur with 4-star stays and private chauffeured AC travel.",
    promoCode: "GOLDENTRI",
    minSpend: "Min. 2 travelers",
    validity: "Valid for 6 months",
    imageUrl: "/images/location10.png",
    priceTier: "standard",
    terms: [
      "Includes Taj Mahal sunrise guided tour and Amber Fort elephant ride.",
      "Chauffeured sedan included for all city inter-transfers.",
      "Zero rescheduling penalty up to 3 days before travel date.",
    ],
  },
];

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 25000];

export default function GiftCardPage() {
  // Studio Interactive Card State
  const [selectedTheme, setSelectedTheme] = useState<"sky" | "sunset" | "emerald" | "obsidian" | "festive">("sky");
  const [cardAmount, setCardAmount] = useState<number>(5000);
  const [recipientPreviewName, setRecipientPreviewName] = useState<string>("PRIYANKA SEN");

  // Filters State
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedScope, setSelectedScope] = useState<"All" | "Domestic" | "International">("All");
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionType[]>([]);
  const [selectedPriceTiers, setSelectedPriceTiers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Modal States
  const [isCheckBalanceModalOpen, setIsCheckBalanceModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeVoucherForModal, setActiveVoucherForModal] = useState<TravelVoucher | null>(null);

  // Check Balance Form
  const [cardCheckNumber, setCardCheckNumber] = useState("");
  const [cardCheckPin, setCardCheckPin] = useState("");
  const [balanceResult, setBalanceResult] = useState<{ checked: boolean; amount: number; validTill: string } | null>(null);

  // Customize & Buy Modal Form
  const [giftMode, setGiftMode] = useState<"self" | "gift">("gift");
  const [recipName, setRecipName] = useState("Priyanka Sen");
  const [recipEmail, setRecipEmail] = useState("");
  const [recipPhone, setRecipPhone] = useState("");
  const [personalMessage, setPersonalMessage] = useState("Wishing you boundless adventures and memorable journeys ahead! ✨");
  const [deliverySchedule, setDeliverySchedule] = useState<"now" | "later">("now");

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const copyPromoCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast(`Copied voucher code "${code}" to clipboard!`);
    } else {
      showToast(`Voucher code: ${code}`);
    }
  };

  const toggleOccasion = (occ: OccasionType) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((item) => item !== occ) : [...prev, occ]
    );
  };

  const togglePriceTier = (tier: string) => {
    setSelectedPriceTiers((prev) =>
      prev.includes(tier) ? prev.filter((item) => item !== tier) : [...prev, tier]
    );
  };

  const resetAllFilters = () => {
    setActiveCategoryTab("All");
    setSearchQuery("");
    setSelectedScope("All");
    setSelectedOccasions([]);
    setSelectedPriceTiers([]);
    setSortBy("featured");
    showToast("All filters have been reset.");
  };

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return SAMPLE_VOUCHERS.filter((item) => {
      // Category Tab
      if (activeCategoryTab !== "All" && item.category !== activeCategoryTab) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchCode = item.promoCode.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchOcc = item.occasion.toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchDesc && !matchOcc) {
          return false;
        }
      }

      // Scope
      if (selectedScope !== "All") {
        if (item.scope !== "Both" && item.scope !== selectedScope) {
          return false;
        }
      }

      // Occasion
      if (selectedOccasions.length > 0) {
        if (!selectedOccasions.includes(item.occasion)) {
          return false;
        }
      }

      // Price Tier
      if (selectedPriceTiers.length > 0) {
        if (!selectedPriceTiers.includes(item.priceTier)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "urgent") {
        return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
      }
      if (sortBy === "alpha") {
        return a.title.localeCompare(b.title);
      }
      return 0; // featured default
    });
  }, [activeCategoryTab, searchQuery, selectedScope, selectedOccasions, selectedPriceTiers, sortBy]);

  // Handle Check Balance Submit
  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardCheckNumber || cardCheckNumber.length < 12) {
      showToast("Please enter a valid 16-digit card number.");
      return;
    }
    // Simulated realistic response
    setBalanceResult({
      checked: true,
      amount: 7500,
      validTill: "30 Nov 2027",
    });
    showToast("Active balance retrieved successfully!");
  };

  // Handle Order Submit
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCustomizeModalOpen(false);
    showToast(`Order confirmed! ₹${cardAmount.toLocaleString("en-IN")} Gift Card delivered to ${recipName}.`);
  };

  return (
    <div className="giftcard-page">
      <div className="giftcard-container">
        
        {/* ====================================================================
            HERO BANNER (Signature SkyRoute Blue Theme)
            ==================================================================== */}
        <section className="giftcard-hero-banner">
          <div className="giftcard-hero-content">
            <div className="giftcard-hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>SkyRoute Travel Passport • Gift Boundless Skies</span>
            </div>
            <h1 className="giftcard-hero-title">
              SkyRoute Gift Cards & Experiential Vouchers
            </h1>
            <p className="giftcard-hero-subtitle">
              Gift the joy of spontaneous holidays, five-star heritage retreats, and sky journeys with 100% flexibility and zero blackout dates across flights, hotels, trains & holiday packages.
            </p>
            <div className="giftcard-hero-pills">
              <span className="giftcard-pill-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
                <span>500+ Partner Airlines</span>
              </span>
              <span className="giftcard-pill-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
                </svg>
                <span>10,000+ Luxury Hotels</span>
              </span>
              <span className="giftcard-pill-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>365-Day Extended Validity</span>
              </span>
              <span className="giftcard-pill-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Instant Digital Delivery</span>
              </span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            TOP DUAL INTERACTIVE HUB (LIVE CARD STUDIO + QUICK ACTIONS)
            ==================================================================== */}
        <section className="giftcard-top-hub">
          {/* LEFT: Live Interactive Studio Card */}
          <div className="giftcard-studio-card">
            <div className="giftcard-studio-header">
              <h2 className="giftcard-studio-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" color="#075bd5">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span>Interactive Gift Card Studio</span>
              </h2>
              <span className="giftcard-studio-badge">Live 3D Preview</span>
            </div>

            {/* Interactive Visual 3D Card Face */}
            <div className="giftcard-preview-wrapper">
              <div className={`giftcard-visual-card giftcard-theme-${selectedTheme}`}>
                <div className="card-shine-effect" />
                
                {/* Watermark Logo */}
                <div className="card-watermark">
                  <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                </div>

                <div className="card-top-row">
                  <div className="card-brand-logo">
                    <div className="card-logo-dot">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                      </svg>
                    </div>
                    <span className="card-brand-name">Sky<span>Route</span> Travel Card</span>
                  </div>
                  <div className="card-chip" title="Smart Travel Chip" />
                </div>

                <div className="card-middle-row">
                  <div className="card-value-label">Card Value & Travel Credits</div>
                  <div className="card-value-display">
                    ₹{cardAmount.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="card-bottom-row">
                  <div>
                    <div className="card-holder-name">{recipientPreviewName}</div>
                    <div style={{ fontSize: "10px", opacity: 0.75, letterSpacing: "1.5px", marginTop: "2px" }}>
                      •••• 8920 4419
                    </div>
                  </div>
                  <div className="card-meta-valid">
                    <span>VALID FOR 365 DAYS</span>
                    <br />
                    <span>PAN-INDIA & GLOBAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Controls */}
            <div className="giftcard-studio-controls">
              {/* Color Theme Selector */}
              <div className="studio-control-group">
                <span className="studio-label">Card Theme:</span>
                <div className="studio-color-picks">
                  <button
                    type="button"
                    className={`color-dot-btn ${selectedTheme === "sky" ? "is-active" : ""}`}
                    style={{ background: "#075bd5" }}
                    onClick={() => setSelectedTheme("sky")}
                    title="Sky Blue"
                    aria-label="Select Sky Blue theme"
                  />
                  <button
                    type="button"
                    className={`color-dot-btn ${selectedTheme === "sunset" ? "is-active" : ""}`}
                    style={{ background: "#ea580c" }}
                    onClick={() => setSelectedTheme("sunset")}
                    title="Sunset Orange"
                    aria-label="Select Sunset Orange theme"
                  />
                  <button
                    type="button"
                    className={`color-dot-btn ${selectedTheme === "emerald" ? "is-active" : ""}`}
                    style={{ background: "#059669" }}
                    onClick={() => setSelectedTheme("emerald")}
                    title="Emerald Forest"
                    aria-label="Select Emerald Forest theme"
                  />
                  <button
                    type="button"
                    className={`color-dot-btn ${selectedTheme === "obsidian" ? "is-active" : ""}`}
                    style={{ background: "#1e293b" }}
                    onClick={() => setSelectedTheme("obsidian")}
                    title="Obsidian Dark"
                    aria-label="Select Obsidian Dark theme"
                  />
                  <button
                    type="button"
                    className={`color-dot-btn ${selectedTheme === "festive" ? "is-active" : ""}`}
                    style={{ background: "#d97706" }}
                    onClick={() => setSelectedTheme("festive")}
                    title="Festive Gold"
                    aria-label="Select Festive Gold theme"
                  />
                </div>
              </div>

              {/* Amount Selector */}
              <div className="studio-control-group">
                <span className="studio-label">Denomination:</span>
                <div className="studio-amount-pills">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`amount-pill-btn ${cardAmount === amt ? "is-selected" : ""}`}
                      onClick={() => setCardAmount(amt)}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Studio Action Buttons */}
            <div className="giftcard-studio-actions">
              <button
                type="button"
                className="btn-studio-primary"
                onClick={() => {
                  setRecipName(recipientPreviewName);
                  setIsCustomizeModalOpen(true);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                </svg>
                <span>Customize & Send Gift</span>
              </button>
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={() => showToast("Card design saved to your SkyRoute wallet draft!")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Quick Actions & Management Hub */}
          <div className="giftcard-actions-card">
            <div className="giftcard-actions-header">
              <h2 className="giftcard-actions-title">Quick Actions & Management</h2>
              <p className="giftcard-actions-desc">
                Easily track balance, claim voucher codes, or arrange corporate bulk gifting.
              </p>
            </div>

            <div className="giftcard-action-tiles-grid">
              {/* Action 1: Check Balance */}
              <div
                className="giftcard-action-tile"
                onClick={() => {
                  setBalanceResult(null);
                  setIsCheckBalanceModalOpen(true);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="action-tile-left">
                  <div className="action-tile-icon icon-blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div className="action-tile-content">
                    <h4>Check Gift Card Balance</h4>
                    <p>Verify active balance & remaining days in real-time</p>
                  </div>
                </div>
                <div className="action-tile-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>

              {/* Action 2: Redeem Voucher */}
              <div
                className="giftcard-action-tile"
                onClick={() => {
                  setCardCheckNumber("");
                  setCardCheckPin("");
                  setBalanceResult(null);
                  setIsCheckBalanceModalOpen(true);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="action-tile-left">
                  <div className="action-tile-icon icon-emerald">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" x2="12" y1="22.08" y2="12" />
                    </svg>
                  </div>
                  <div className="action-tile-content">
                    <h4>Add / Redeem Card to Wallet</h4>
                    <p>Link your 16-digit card code to SkyRoute profile</p>
                  </div>
                </div>
                <div className="action-tile-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>

              {/* Action 3: Corporate & Bulk Gifting */}
              <div
                className="giftcard-action-tile"
                onClick={() => {
                  showToast("Connecting you with SkyRoute Corporate Gifting Concierge: 1800-SKY-GIFT");
                }}
                role="button"
                tabIndex={0}
              >
                <div className="action-tile-left">
                  <div className="action-tile-icon icon-amber">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="14" x="3" y="7" rx="2" />
                      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M3 13h18" />
                    </svg>
                  </div>
                  <div className="action-tile-content">
                    <h4>Corporate & Bulk Orders</h4>
                    <p>Custom company branding & volume discounts</p>
                  </div>
                </div>
                <div className="action-tile-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>

              {/* Action 4: Instant Delivery & Safety Assurance */}
              <div
                className="giftcard-action-tile"
                onClick={() => {
                  showToast("SkyRoute Travel Cards are 100% verified, encrypted & guaranteed against blackout dates.");
                }}
                role="button"
                tabIndex={0}
              >
                <div className="action-tile-left">
                  <div className="action-tile-icon icon-indigo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="action-tile-content">
                    <h4>100% Safe & Guaranteed</h4>
                    <p>Zero deduction with instant WhatsApp & Email delivery</p>
                  </div>
                </div>
                <div className="action-tile-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CATEGORY TABS & SEARCH BAR ROW
            ==================================================================== */}
        <div className="giftcard-category-tabs-bar">
          <div className="giftcard-category-pills">
            {["All", "Flights", "Hotels", "Holidays", "Luxury", "Festive"].map((cat) => {
              const count = cat === "All" ? SAMPLE_VOUCHERS.length : SAMPLE_VOUCHERS.filter((v) => v.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill-btn ${activeCategoryTab === cat ? "is-active" : ""}`}
                  onClick={() => setActiveCategoryTab(cat)}
                >
                  <span>{cat === "All" ? "All Vouchers" : cat}</span>
                  <span className="category-count-badge">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="giftcard-search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search vouchers, themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search travel vouchers"
            />
          </div>
        </div>

        {/* ====================================================================
            MAIN CATALOG LAYOUT: STICKY FILTERS (NO BANK OFFERS!) + CARDS GRID
            ==================================================================== */}
        <div className="giftcard-main-layout">
          {/* ------------------------------------------------------------------
              STICKY SIDEBAR FILTERS (NO BANK OFFERS - FIXED WHILE RIGHT SCROLLS)
              ------------------------------------------------------------------ */}
          <aside className="giftcard-sidebar">
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter Deals</span>
              </h3>
              <button type="button" className="sidebar-reset-btn" onClick={resetAllFilters}>
                Reset
              </button>
            </div>

            {/* Filter 1: Journey Scope (Domestic / International) */}
            <div className="filter-section">
              <div className="filter-heading">Journey Scope</div>
              <div className="filter-scope-grid">
                <div
                  className={`scope-btn ${selectedScope === "Domestic" ? "is-active" : ""}`}
                  onClick={() => setSelectedScope((prev) => (prev === "Domestic" ? "All" : "Domestic"))}
                  role="button"
                  tabIndex={0}
                >
                  <span className="scope-title">Domestic</span>
                  <span className="scope-count">Pan-India Stays</span>
                </div>
                <div
                  className={`scope-btn ${selectedScope === "International" ? "is-active" : ""}`}
                  onClick={() => setSelectedScope((prev) => (prev === "International" ? "All" : "International"))}
                  role="button"
                  tabIndex={0}
                >
                  <span className="scope-title">International</span>
                  <span className="scope-count">Global Escapes</span>
                </div>
              </div>
            </div>

            {/* Filter 2: Gifting Occasion (Instead of Bank Offers) */}
            <div className="filter-section">
              <div className="filter-heading">Travel Occasions</div>
              <div className="filter-checklist">
                {(
                  [
                    "Birthday & Milestones",
                    "Romantic & Honeymoon",
                    "Festive & Celebrations",
                    "Corporate & Rewards",
                    "Solo & Adventure",
                    "Family Getaways",
                  ] as OccasionType[]
                ).map((occ) => {
                  const count = SAMPLE_VOUCHERS.filter((v) => v.occasion === occ).length;
                  const isChecked = selectedOccasions.includes(occ);
                  return (
                    <div
                      key={occ}
                      className="filter-check-item"
                      onClick={() => toggleOccasion(occ)}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                    >
                      <div className="check-label-wrap">
                        <div className={`custom-checkbox ${isChecked ? "is-checked" : ""}`}>
                          {isChecked && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span>{occ}</span>
                      </div>
                      <span className="filter-count-badge">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Experience & Price Tier */}
            <div className="filter-section">
              <div className="filter-heading">Experience Tier</div>
              <div className="filter-checklist">
                {[
                  { id: "budget", label: "Budget Friendly (Under ₹2,500)" },
                  { id: "standard", label: "Standard Holiday (₹2,500 - ₹7,500)" },
                  { id: "premium", label: "Premium Voyager (₹7,500 - ₹15,000)" },
                  { id: "luxury", label: "Ultra Luxury Villas (₹15,000+)" },
                ].map((tier) => {
                  const isChecked = selectedPriceTiers.includes(tier.id);
                  const count = SAMPLE_VOUCHERS.filter((v) => v.priceTier === tier.id).length;
                  return (
                    <div
                      key={tier.id}
                      className="filter-check-item"
                      onClick={() => togglePriceTier(tier.id)}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                    >
                      <div className="check-label-wrap">
                        <div className={`custom-checkbox ${isChecked ? "is-checked" : ""}`}>
                          {isChecked && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span>{tier.label}</span>
                      </div>
                      <span className="filter-count-badge">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter 4: Delivery Format */}
            <div className="filter-section">
              <div className="filter-heading">Delivery Format</div>
              <div className="filter-checklist">
                <div className="filter-check-item">
                  <div className="check-label-wrap">
                    <div className="custom-checkbox is-checked">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Instant E-Voucher (Email/SMS)</span>
                  </div>
                  <span className="filter-count-badge">Fast</span>
                </div>
                <div className="filter-check-item">
                  <div className="check-label-wrap">
                    <div className="custom-checkbox is-checked">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Luxury Keepsake Box (Courier)</span>
                  </div>
                  <span className="filter-count-badge">Gift</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ------------------------------------------------------------------
              MAIN CATALOG CARDS GRID
              ------------------------------------------------------------------ */}
          <main className="giftcard-catalog-main">
            <div className="catalog-header-bar">
              <p className="catalog-results-info">
                Showing <span>{filteredVouchers.length}</span> curated travel gift vouchers
              </p>
              <div className="catalog-sort-wrap">
                <label htmlFor="catalog-sort">Sort By:</label>
                <select
                  id="catalog-sort"
                  className="catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured First</option>
                  <option value="urgent">Expiring Soonest</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {filteredVouchers.length === 0 ? (
              <div className="catalog-empty-state">
                <div className="empty-state-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                </div>
                <h3>No Matching Gift Vouchers Found</h3>
                <p>Try clearing your occasion or scope filters to discover more travel passes.</p>
                <button type="button" className="btn-studio-primary" onClick={resetAllFilters} style={{ margin: "0 auto" }}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="giftcard-grid">
                {filteredVouchers.map((voucher) => (
                  <article key={voucher.id} className="voucher-card">
                    {/* Media Header */}
                    <div className="voucher-card-media">
                      <Image
                        src={voucher.imageUrl}
                        alt={voucher.title}
                        width={400}
                        height={220}
                        className="voucher-card-img"
                        priority={false}
                      />
                      <div className="voucher-card-gradient" />

                      {/* Floating Category & Tag Badges */}
                      <div className="card-floating-badges">
                        <span className={`badge-category cat-${voucher.category.toLowerCase()}`}>
                          {voucher.category}
                        </span>
                        <span className={`badge-tag ${voucher.isUrgent ? "tag-urgent" : ""}`}>
                          {voucher.tag}
                        </span>
                      </div>

                      {/* Deal Discount Strip */}
                      <div className="card-deal-highlight">
                        <span className="deal-discount-pill">{voucher.discountText}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="voucher-card-body">
                      <div>
                        <h3 className="voucher-title">{voucher.title}</h3>
                        <p className="voucher-desc">{voucher.description}</p>
                      </div>

                      {/* Occasion & Validity Info */}
                      <div className="voucher-meta-row">
                        <div className="voucher-meta-item">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                          </svg>
                          <span>{voucher.occasion}</span>
                        </div>
                        <div className="voucher-meta-item">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{voucher.validity}</span>
                        </div>
                      </div>

                      {/* Promo Code Row with Copy Button */}
                      <div className="voucher-code-row">
                        <button
                          type="button"
                          className="promo-code-pill"
                          onClick={() => copyPromoCode(voucher.promoCode)}
                          title="Click to copy voucher code"
                        >
                          <span>{voucher.promoCode}</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="btn-card-details"
                          onClick={() => {
                            setActiveVoucherForModal(voucher);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <span>Details</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="voucher-card-footer">
                      <button
                        type="button"
                        className="btn-gift-voucher"
                        onClick={() => {
                          setActiveVoucherForModal(voucher);
                          setIsCustomizeModalOpen(true);
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 12 20 22 4 22 4 12" />
                          <rect width="20" height="5" x="2" y="7" />
                          <line x1="12" x2="12" y1="22" y2="7" />
                        </svg>
                        <span>Gift This Voucher</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* ====================================================================
            WHY CHOOSE SKYROUTE GIFT CARDS SECTION
            ==================================================================== */}
        <section className="giftcard-why-section">
          <div className="why-header">
            <h2>Why Travelers Love SkyRoute Gift Cards</h2>
            <p>Thoughtfully crafted for wanderers, friends, and families with complete freedom.</p>
          </div>

          <div className="why-features-grid">
            <div className="why-feature-box">
              <div className="why-feature-icon icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h4>Zero Hidden Fees</h4>
              <p>Full face value redeemed seamlessly with zero administrative deduction.</p>
            </div>

            <div className="why-feature-box">
              <div className="why-feature-icon icon-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 14 14" />
                </svg>
              </div>
              <h4>365 Days Long Validity</h4>
              <p>Take your time planning the dream itinerary across seasons and festivals.</p>
            </div>

            <div className="why-feature-box">
              <div className="why-feature-icon icon-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <h4>Split & Multiple Trips</h4>
              <p>Use whatever amount you need today; remaining credits stay secure for next trips.</p>
            </div>

            <div className="why-feature-box">
              <div className="why-feature-icon icon-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4>100% Stackable Savings</h4>
              <p>Combine your gift card with SkyRoute flight & hotel promo codes for double discounts!</p>
            </div>
          </div>
        </section>

      </div>

      {/* ====================================================================
          MODAL 1: CHECK BALANCE & REDEEM MODAL
          ==================================================================== */}
      {isCheckBalanceModalOpen && (
        <div className="giftcard-modal-backdrop" onClick={() => setIsCheckBalanceModalOpen(false)}>
          <div className="giftcard-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-title-group">
                <h3>Check Balance & Card Validity</h3>
                <p>Enter your 16-digit card code to view remaining travel funds</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCheckBalanceModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckBalance}>
              <div className="modal-body-content">
                <div className="modal-form-group">
                  <label className="modal-label">16-Digit Gift Card Number</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="e.g. 5044 1928 3341 8920"
                    maxLength={19}
                    value={cardCheckNumber}
                    onChange={(e) => setCardCheckNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">6-Digit Security PIN</label>
                  <input
                    type="password"
                    className="modal-input"
                    placeholder="••••••"
                    maxLength={6}
                    value={cardCheckPin}
                    onChange={(e) => setCardCheckPin(e.target.value)}
                    required
                  />
                </div>

                {balanceResult && (
                  <div className="balance-result-box">
                    <div>
                      <div className="balance-sub">Active Card Balance</div>
                      <div className="balance-val">₹{balanceResult.amount.toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="balance-sub">Status: Active ✓</div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#004bb7" }}>
                        Valid Till {balanceResult.validTill}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer-bar">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsCheckBalanceModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <span>Verify Balance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: CUSTOMIZE & SEND GIFT CARD MODAL
          ==================================================================== */}
      {isCustomizeModalOpen && (
        <div className="giftcard-modal-backdrop" onClick={() => setIsCustomizeModalOpen(false)}>
          <div className="giftcard-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-title-group">
                <h3>{activeVoucherForModal ? `Gift: ${activeVoucherForModal.title}` : "Personalize SkyRoute Travel Card"}</h3>
                <p>Delivered instantly via Email & SMS with your custom note</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCustomizeModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderSubmit}>
              <div className="modal-body-content">
                {/* Gifting For Who */}
                <div className="modal-form-group">
                  <label className="modal-label">Who is this Gift Card for?</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className={`amount-pill-btn ${giftMode === "gift" ? "is-selected" : ""}`}
                      onClick={() => setGiftMode("gift")}
                    >
                      🎁 For Someone Special
                    </button>
                    <button
                      type="button"
                      className={`amount-pill-btn ${giftMode === "self" ? "is-selected" : ""}`}
                      onClick={() => {
                        setGiftMode("self");
                        setRecipName("Myself");
                      }}
                    >
                      👤 For My Own Trips
                    </button>
                  </div>
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Recipient's Full Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={recipName}
                    onChange={(e) => {
                      setRecipName(e.target.value);
                      setRecipientPreviewName(e.target.value || "PRIYANKA SEN");
                    }}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="modal-form-group">
                    <label className="modal-label">Recipient Email</label>
                    <input
                      type="email"
                      className="modal-input"
                      placeholder="priyanka@example.com"
                      value={recipEmail}
                      onChange={(e) => setRecipEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label className="modal-label">WhatsApp Number</label>
                    <input
                      type="tel"
                      className="modal-input"
                      placeholder="+91 98765 43210"
                      value={recipPhone}
                      onChange={(e) => setRecipPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="modal-form-group">
                  <label className="modal-label">Select Card Denomination</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`amount-pill-btn ${cardAmount === amt ? "is-selected" : ""}`}
                        onClick={() => setCardAmount(amt)}
                      >
                        ₹{amt.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Message */}
                <div className="modal-form-group">
                  <label className="modal-label">Personal Greeting Message</label>
                  <textarea
                    className="modal-textarea"
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Delivery Option */}
                <div className="modal-form-group">
                  <label className="modal-label">Delivery Schedule</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className={`amount-pill-btn ${deliverySchedule === "now" ? "is-selected" : ""}`}
                      onClick={() => setDeliverySchedule("now")}
                    >
                      ⚡ Instant (Within 60 seconds)
                    </button>
                    <button
                      type="button"
                      className={`amount-pill-btn ${deliverySchedule === "later" ? "is-selected" : ""}`}
                      onClick={() => setDeliverySchedule("later")}
                    >
                      📅 Schedule for Birthday/Anniversary
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer-bar">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsCustomizeModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <span>Pay ₹{cardAmount.toLocaleString("en-IN")} & Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: VOUCHER TERMS & DETAILS MODAL
          ==================================================================== */}
      {isDetailsModalOpen && activeVoucherForModal && (
        <div className="giftcard-modal-backdrop" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="giftcard-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-title-group">
                <h3>{activeVoucherForModal.title}</h3>
                <p>Terms, Conditions & Usage Guidelines</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsDetailsModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-body-content">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#eff6ff", padding: "12px 16px", borderRadius: "6px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Promo Code</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#075bd5", fontFamily: "monospace" }}>
                    {activeVoucherForModal.promoCode}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={() => copyPromoCode(activeVoucherForModal.promoCode)}
                >
                  Copy Code
                </button>
              </div>

              <div className="modal-form-group">
                <label className="modal-label">Detailed Highlights:</label>
                <ul style={{ paddingLeft: "20px", margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.7" }}>
                  {activeVoucherForModal.terms.map((term, i) => (
                    <li key={i}>{term}</li>
                  ))}
                  <li>Validity: {activeVoucherForModal.validity} from date of purchase.</li>
                  <li>Applicable across both SkyRoute desktop and mobile website.</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer-bar">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-modal-submit"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsCustomizeModalOpen(true);
                }}
              >
                <span>Gift This Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TOAST NOTIFICATION
          ==================================================================== */}
      {toastMessage && (
        <div className="giftcard-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
