import type { ReactNode } from "react";
import { FeaturedSocialSidebar } from "@/features/social/components/featured-social-sidebar/featured-social-sidebar";

export default function SocialLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative flex gap-4 w-full justify-center max-w-page">
      <div className="w-2/3 max-xl:w-3/5 max-w-[750px]">{children}</div>
      <div className="w-1/3 max-xl:w-2/5">
        <FeaturedSocialSidebar />
      </div>
    </div>
  );
}
