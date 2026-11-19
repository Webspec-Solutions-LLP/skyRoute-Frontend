"use client";

import React, { useState } from "react";
import "./Faq.css";

export interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  bullets?: string[];
}

export const SKYROUTE_FAQS: FaqItem[] = [
  {
    id: "faq-cheaper-flights",
    number: "01",
    question: "Why is flight ticket booking cheaper on SkyRoute?",
    answer:
      "SkyRoute compares real-time fares across leading domestic and international airlines, applies instant bank and promo offers, and eliminates hidden convenience markups so you consistently get the lowest available airfare.",
  },
  {
    id: "faq-find-cheap-tickets",
    number: "02",
    question: "How can I find cheap flight tickets on SkyRoute?",
    answer:
      "Book 3 to 6 weeks in advance, compare nearby departure dates using SkyRoute's flexible fare calendar, and subscribe to SkyRoute fare alerts to catch flash airline sales and exclusive seasonal coupon codes.",
  },
  {
    id: "faq-online-benefits",
    number: "03",
    question: "What are the benefits of online flight booking with SkyRoute?",
    answer: "Booking flights on SkyRoute offers:",
    bullets: [
      "Lowest airfare comparison",
      "Exclusive partner discounts",
      "Flexible date options",
      "Price lock feature",
      "Automatic web check-in",
      "Travel insurance add-ons",
      "LIVE flight status tracking",
      "Quick refunds & 24×7 support",
    ],
  },
  {
    id: "faq-modify-cancel",
    number: "04",
    question: "Can I modify or cancel my SkyRoute booking?",
    answer:
      "Yes. You can reschedule dates, update passenger details, or cancel eligible tickets directly from the SkyRoute My Trips dashboard. Instant refund status tracking keeps you informed at every step.",
  },
  {
    id: "faq-hotel-packages",
    number: "05",
    question: "Can I bundle hotels and holiday stays on SkyRoute?",
    answer:
      "Absolutely. SkyRoute lets you combine flights with handpicked hotels, boutique villas, and curated holiday packages in one checkout to unlock extra bundle savings and unified trip support.",
  },
  {
    id: "faq-refund-support",
    number: "06",
    question: "How fast are refunds and support on SkyRoute?",
    answer:
      "Most eligible cancellations are processed automatically back to your original payment method within 3 to 5 business days, backed by SkyRoute's 24×7 live chat, call, and email travel assistance.",
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="skyroute-faq-section"
      aria-label="Frequently Asked Questions"
    >
      {/* 1320px Standard Container */}
      <div className="skyroute-faq-container">
        {/* Heading Matching Other Sections (No Description) */}
        <div className="faq-section-header">
          <h2 className="faq-section-heading">
            Frequently Asked{" "}
            <span className="faq-heading-highlight">Questions</span>
          </h2>
        </div>

        {/* 2-Column Independent FAQ Accordion Cards */}
        <div className="faq-grid">
          {SKYROUTE_FAQS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${item.id}-panel`;

            return (
              <div
                key={item.id}
                className={`faq-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="faq-index-badge" aria-hidden="true">
                    {item.number}
                  </span>

                  <span className="faq-question-text">{item.question}</span>

                  <span className="faq-toggle-icon" aria-hidden="true">
                    <span className="faq-plus-bar faq-bar-h" />
                    <span className="faq-plus-bar faq-bar-v" />
                  </span>
                </button>

                <div
                  id={panelId}
                  className="faq-answer-collapse"
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <div className="faq-answer-inner">
                    <div className="faq-answer-body">
                      <p className="faq-answer-text">{item.answer}</p>

                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="faq-bullets-grid">
                          {item.bullets.map((point) => (
                            <li key={point} className="faq-bullet-item">
                              <svg
                                className="faq-bullet-check"
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
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
