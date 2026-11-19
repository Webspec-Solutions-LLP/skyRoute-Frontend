import Hero from "@/components/hero/Hero";
import Category from "@/components/category/Category";
import Location1 from "@/components/location1/Location1";
import Offer from "@/components/offer/Offer";
import Location2 from "@/components/location2/Location2";
import Hotel from "@/components/hotel/Hotel";
import AirLineLocation from "@/components/airLineLocation/AirLineLocation";
import AirLineCompany from "@/components/airLineCompany/AirLineCompany";
import Faq from "@/components/faq/Faq";
import OtherSection from "@/components/otherSection/OtherSection";
import "./page.css";

export default function HomePage() {
  return (
    <div className="homepage-background">
      <Hero />
      <Category />
      <AirLineLocation />
      <AirLineCompany />
      <Offer />
      <Location2 />
      <Hotel />
      <Location1 />
      <Faq />
      <OtherSection />
    </div>
  );
}
