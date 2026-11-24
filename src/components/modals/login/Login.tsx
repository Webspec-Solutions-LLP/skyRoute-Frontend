"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./Login.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: { phone: string }) => void;
}

export default function Login({ isOpen, onClose, onSuccess }: LoginModalProps) {
  // Navigation / step state: "phone" | "otp" | "success"
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // OTP 6-digits state
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30s Timer state
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animation trigger state
  const [isExpanding, setIsExpanding] = useState<boolean>(false);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setStep("phone");
      setPhone("");
      setPhoneError("");
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setTimer(30);
      setCanResend(false);
      setIsExpanding(false);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 30s Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Auto focus first OTP box when transitioning to OTP step
  useEffect(() => {
    if (step === "otp") {
      const t = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 450);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (!isOpen) return null;

  // Handle phone input change (digits only, max 10)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    if (rawVal.length <= 10) {
      setPhone(rawVal);
      if (phoneError) setPhoneError("");
    }
  };

  // Continue button handler -> Triggers the top-right blue slow-motion animation
  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length === 0) {
      setPhoneError("Please enter your mobile number");
      return;
    }
    if (phone.length < 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }

    setPhoneError("");
    setIsExpanding(true);

    // Transition to OTP step with animation
    setStep("otp");
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setToastMessage(`OTP sent to +91 ${phone}`);
  };

  // OTP inputs change handler
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1); // Take the last digit entered
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (otpError) setOtpError("");

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // OTP backspace & arrow key handler
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Current is empty, go to previous and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste full 6-digit OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    if (otpError) setOtpError("");

    // Focus the box following the last pasted digit or the last box
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Resend OTP handler
  const handleResendOtp = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setToastMessage(`New 6-digit OTP resent to +91 ${phone}`);
    inputRefs.current[0]?.focus();
  };

  // Back to phone edit
  const handleBackToPhone = () => {
    setStep("phone");
    setIsExpanding(false);
    setOtpError("");
  };

  // Submit OTP handler
  const handleSubmitOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP");
      return;
    }

    setIsSubmitting(true);
    setOtpError("");

    // Simulate verification
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");

      // Save user session
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("skyroute_user", JSON.stringify({ phone, isLoggedIn: true }));
        }
      } catch (err) {
        console.error("Session storage error", err);
      }

      if (onSuccess) {
        onSuccess({ phone });
      }

      // Automatically close modal after success feedback
      setTimeout(() => {
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="sky-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="sky-modal-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Centered Modal Card */}
      <div
        className={`sky-modal-card ${step === "otp" ? "in-otp-mode" : ""} ${step === "success" ? "in-success-mode" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =====================================================================
            VIEW 1: PHONE NUMBER INPUT (Always rendered as the base layer)
            ===================================================================== */}
        <div className="sky-phone-view">
          {/* Close Modal Button */}
          <button
            type="button"
            className="sky-close-btn"
            onClick={onClose}
            aria-label="Close Login Modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Header Branding */}
          <div className="sky-brand-header">
            <div className="sky-logo-badge">
              <Image
                src="/images/logo.webp"
                alt="SkyRoute"
                width={40}
                height={40}
                className="sky-logo-img"
              />
            </div>
            <h2 className="sky-brand-title">Welcome to SkyRoute</h2>
            <span className="sky-brand-sub">Book Flights, Hotels, Buses &amp; Trains in one place</span>
          </div>

          <div className="sky-divider-line" />

          {/* Form Area */}
          <form onSubmit={handleContinue} className="sky-phone-form">
            <div className="sky-form-title-group">
              <h3 className="sky-login-heading">Login</h3>
              <p className="sky-login-subtext">Enter your mobile number to get an OTP and continue</p>
            </div>

            {/* Mobile Number Input Group */}
            <div className="sky-input-group">
              <div className={`sky-phone-input-box ${phoneError ? "has-error" : ""}`}>
                <div className="sky-country-code">
                  <span className="sky-flag">🇮🇳</span>
                  <span className="sky-code-text">+91</span>
                </div>
                <div className="sky-input-separator" />
                <input
                  type="tel"
                  autoFocus
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your Mobile num"
                  className="sky-phone-text-field"
                  maxLength={10}
                  autoComplete="tel"
                />
              </div>
              {phoneError && <p className="sky-error-message">{phoneError}</p>}
            </div>

            {/* Continue Button */}
            <button type="submit" className="sky-continue-btn">
              <span>Continue</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </form>

          {/* Safe Travel / Terms Footer */}
          <div className="sky-terms-footer">
            <p>
              By proceeding, you agree to SkyRoute&apos;s{" "}
              <a href="#terms" className="sky-legal-link">Terms of Service</a> &amp;{" "}
              <a href="#privacy" className="sky-legal-link">Privacy Policy</a>
            </p>
            <div className="sky-security-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>100% Safe &amp; Verified Travel Booking</span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            VIEW 2: OTP VERIFICATION (Visibly expands from top-right corner over the phone view)
            ===================================================================== */}
        <div
          className={`sky-otp-view ${step === "otp" ? "is-active" : ""}`}
          aria-hidden={step !== "otp"}
        >
          {/* Top-right expanding blue wave pulse elements */}
          <div className="sky-otp-decor-container">
            <div className="sky-otp-radial-glow" />
            <div className="sky-otp-radial-ring" />
          </div>

          {/* OTP Top Bar with Back & Close */}
          <div className="sky-otp-nav-bar sky-otp-stagger-1">
            <button
              type="button"
              className="sky-otp-back-btn"
              onClick={handleBackToPhone}
              aria-label="Back to mobile number"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back</span>
            </button>

            <button
              type="button"
              className="sky-otp-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* OTP Header */}
          <div className="sky-otp-header sky-otp-stagger-1">
            <div className="sky-otp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="sky-otp-title">Verify with OTP</h3>
            <p className="sky-otp-sub">
              We&apos;ve sent a 6-digit verification code to
              <strong className="sky-otp-phone-highlight"> +91 {phone}</strong>
              <button
                type="button"
                className="sky-otp-edit-num-btn"
                onClick={handleBackToPhone}
              >
                Edit
              </button>
            </p>
          </div>

          {/* OTP 6-Digit Boxes Form */}
          <form onSubmit={handleSubmitOtp} className="sky-otp-form">
            <div className="sky-otp-boxes-row sky-otp-stagger-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className={`sky-otp-input-cell ${digit ? "filled" : ""} ${otpError ? "cell-error" : ""}`}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {otpError && <p className="sky-otp-error-text sky-otp-stagger-2">{otpError}</p>}

            {/* 30s Countdown Timer & Resend OTP Text Design */}
            <div className="sky-otp-timer-box sky-otp-stagger-3">
              {timer > 0 ? (
                <div className="sky-timer-running">
                  <span className="sky-timer-icon">⏱️</span>
                  <span>
                    Didn&apos;t receive the code? Resend OTP in{" "}
                    <strong className="sky-timer-countdown">
                      00:{timer < 10 ? `0${timer}` : timer}s
                    </strong>
                  </span>
                </div>
              ) : (
                <div className="sky-timer-expired">
                  <span>Didn&apos;t receive the code? </span>
                  <button
                    type="button"
                    className="sky-resend-otp-btn"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button (Directly below OTP boxes and timer as requested) */}
            <div className="sky-otp-submit-wrap sky-otp-stagger-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`sky-otp-submit-btn ${isSubmitting ? "loading" : ""}`}
              >
                {isSubmitting ? (
                  <span className="sky-btn-loader">
                    <span className="sky-spinner-dot" />
                    Verifying...
                  </span>
                ) : (
                  <>
                    <span>Submit</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Note at bottom of OTP view */}
          <div className="sky-otp-footer-note sky-otp-stagger-4">
            <span>🔒 Your credentials &amp; bookings are end-to-end encrypted</span>
          </div>
        </div>

        {/* =====================================================================
            VIEW 3: SUCCESS CONFIRMATION
            ===================================================================== */}
        {step === "success" && (
          <div className="sky-success-view">
            <div className="sky-success-circle">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="sky-success-title">Login Successful!</h3>
            <p className="sky-success-sub">
              Welcome back to SkyRoute. You are now verified for all bookings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
