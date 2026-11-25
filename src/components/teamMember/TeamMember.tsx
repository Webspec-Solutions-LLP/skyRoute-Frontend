"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./Teammember.css";

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  shortBio: string;
  fullBio: string;
  linkedin?: string;
  twitter?: string;
}

const TEAM_MEMBERS: TeamMemberData[] = [
  {
    id: "member-1",
    name: "Devraj Mukherjee",
    role: "Founder & Chief Executive Officer",
    department: "Executive Leadership",
    image: "/images/member1.png",
    shortBio: "Spearheading SkyRoute's long-term vision, global airline partnerships, and transparent travel technology.",
    fullBio: "Devraj founded SkyRoute to democratize air travel through transparent pricing and instant ticketing. With over 14 years of executive leadership in aviation commerce, he steers global carrier alliances, strategic investment, and flyer-first booking innovations across domestic and international markets.",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
  {
    id: "member-2",
    name: "Dr. Ananya Bose",
    role: "Chief Technology Officer (CTO)",
    department: "AI & Cloud Platforms",
    image: "/images/member2.png",
    shortBio: "Architecting SkyRoute's real-time fare intelligence, distributed cloud rails, and predictive search engines.",
    fullBio: "Ananya leads the engineering and data platforms at SkyRoute. Holding a doctorate in distributed computing, she oversees real-time GDS connections, 256-bit transactional security, and sub-second flight route discovery processing millions of live queries daily.",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
  {
    id: "member-3",
    name: "Rajeshwar Banerji",
    role: "Head of Aviation Operations & Alliances",
    department: "Flight Operations",
    image: "/images/member3.png",
    shortBio: "Directing international airline partnerships, route frequency integrations, and DGCA aviation compliance.",
    fullBio: "With more than two decades of aviation industry mastery across major global carriers, Rajeshwar leads SkyRoute's airline network operations, bilateral charter routes, and regulatory aviation compliance, ensuring smooth boarding and seamless ticketing for every flyer.",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
  {
    id: "member-4",
    name: "Megha Chatterjee",
    role: "VP – Product Experience & Flyer Care",
    department: "Product & Design",
    image: "/images/member4.png",
    shortBio: "Championing frictionless booking design, automated check-in systems, and 24/7 flyer support.",
    fullBio: "Megha champions user-first product design across web and mobile platforms. Her team is responsible for SkyPass rewards, instant WhatsApp boarding passes, and maintaining SkyRoute's benchmark 4.8★ passenger satisfaction rating across all travel touchpoints.",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
];

export default function TeamMember() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="sky-team-wrapper">
      <div className="sky-team-container">
        {/* Header Block */}
        <div className="team-header-block">
          <div className="team-badge-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Leadership Team</span>
          </div>
          <h2 className="team-section-title">The Visionaries Guiding SkyRoute</h2>
          <p className="team-section-sub">
            Meet the experienced aviation pioneers, technology architects, and travel innovators committed to making flight travel effortless, transparent, and affordable.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="team-cards-grid">
          {TEAM_MEMBERS.map((member) => {
            const isExpanded = expandedId === member.id;

            return (
              <div key={member.id} className="team-member-card">
                {/* Top Gradient Banner */}
                <div className="team-card-banner" />

                {/* Avatar */}
                <div className="team-avatar-wrapper">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="team-avatar-img"
                  />
                </div>

                {/* Card Body */}
                <div className="team-card-body">
                  <span className="team-dept-tag">{member.department}</span>
                  <h3 className="team-member-name">{member.name}</h3>
                  <div className="team-member-role">{member.role}</div>

                  {/* Bio Description with Expand/Collapse */}
                  <div className="team-bio-wrapper">
                    <p className="team-bio-text">{member.shortBio}</p>
                    {isExpanded && (
                      <p className="team-bio-full">{member.fullBio}</p>
                    )}
                  </div>

                  {/* Read More / Read Less Toggle Button */}
                  <button
                    type="button"
                    className={`team-expand-btn ${isExpanded ? "is-expanded" : ""}`}
                    onClick={() => toggleExpand(member.id)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? "Show Less" : "Read Full Bio"}</span>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="team-expand-icon"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Social Links Footer */}
                  <div className="team-social-bar">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-social-link"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.88 0 1.6-.72 1.6-1.6s-.72-1.6-1.6-1.6c-.89 0-1.6.72-1.6 1.6s.71 1.6 1.6 1.6m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                        </svg>
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-social-link"
                        aria-label={`${member.name} Twitter`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
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
