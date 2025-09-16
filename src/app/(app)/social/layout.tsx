import type { ReactNode } from "react";
import { FeaturedSocialSidebar } from "@/features/social/components/featured-social-sidebar/featured-social-sidebar";

export default function SocialLayout({
 children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="relative flex gap-4 w-full">
    <div className="w-1/2">
      {children}
    </div>
    <div className="w-1/2">
      <FeaturedSocialSidebar />
    </div>
  </div>
}