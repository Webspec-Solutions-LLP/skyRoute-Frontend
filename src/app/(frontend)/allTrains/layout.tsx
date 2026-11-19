import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Trains & Book IRCTC Tickets | SkyRoute",
  description: "View all live trains, check seat availability, waitlist confirmation probability, and book Indian Railway tickets online with zero cancellation fee.",
};

export default function AllTrainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
