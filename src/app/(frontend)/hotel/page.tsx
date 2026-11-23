import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import HotelService from "@/components/hotelService/HotelService";
import Location3 from "@/components/location3/Location3";
import "../page.css";
import "./Hotel.css";
import Category from "@/components/category/Category";
import Offer from "@/components/offer/Offer";
import Hotel from "@/components/hotel/Hotel";
import Faq from "@/components/faq/Faq";

export const metadata: Metadata = {
  title: "Hotels & Stays | SkyRoute",
  description: "Discover top-rated hotels, boutique stays, and luxury holiday resorts worldwide on SkyRoute.",
};

export default function HotelPage() {
  return (
    <div className="homepage-background hotel-page-wrapper">
      <Hero defaultTab="hotels" />
      <Category />
      <HotelService />
      <Location3 />
      <Hotel />
      <Offer />
      <Faq />
    </div>
  );
}
