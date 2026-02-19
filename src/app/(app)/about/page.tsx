"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";

const services = [
  {
    id: "wallet",
    title: "Wallet Services",
    subtitle: "Store your assets across multiple networks.",
    description:
      "Flashy Finance decentralised wallet technology lets users on Flashy Social store assets across multiple chains, send/receive via a unique username and have access a library of defi services such as staking, lending/borrowing and swaps.",
    icons: [
      "/icons/borrowing.svg",
      "/icons/staking.svg",
      "/icons/private-swaps.svg",
    ],
  },
  {
    id: "streaming",
    title: "Streaming",
    subtitle: "Reach your fans around the world, in real time.",
    description:
      "Flashy Social's Streaming service empowers creators to go live and connect with their audience in real time. Viewers can watch, comment, and show support by tipping in BLAZE tokens, creating an interactive and rewarding experience for streamers and fans.",
    icons: ["/icons/live.svg", "/icons/referrals.svg", "/icons/topics.svg"],
  },
  {
    id: "content",
    title: "Content Creation",
    subtitle: "Create and share your talent to your community.",
    description:
      "Flashy Social's Content Creation feature gives users the tools to share their voice through video and written content. Whether you're filming tutorials, posting updates, or writing articles, you can publish your work for the world to watch or read.",
    icons: ["/icons/web-video.svg", "/icons/likes.svg", "/icons/topics.svg"],
  },
  {
    id: "media",
    title: "Social Media",
    subtitle: "Connect with friends and people around the world.",
    description:
      "Flashy Social's Social Media feature lets you express yourself freely by sharing thoughts, images, videos, and hashtags with your community. Post updates, start conversations, and connect with others through likes, comments, and shares.",
    icons: [
      "/icons/copia.svg",
      "/icons/internet-user.svg",
      "/icons/purchase-username.svg",
    ],
  },
];

export default function AboutPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(["mobile"]));

  return (
    <div className="flex flex-col w-full">
      <div
        className="relative w-full h-[200px] md:h-[280px] rounded-lg
          overflow-hidden"
      >
        <Image
          src="/images/placeholder-banner.png"
          alt="About Flashy Social"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center z-1">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            About Flashy Social
          </h1>
        </div>
      </div>
      <div className="flex flex-col max-w-page mx-auto px-4 py-24 gap-24">
        <section className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col gap-4 flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Giving Power Back To The Creators
            </h1>
            <p className="text-white md:text-base leading-relaxed">
              Flashy Social is your space to create, stream, and have fun on
              your own terms. Whether you're sharing behind-the-scenes moments,
              going live with your community, or dropping your next big video,
              the platform is built to make content creation exciting, seamless,
              and engaging. It’s all about giving creators the tools to shine
              and the freedom to build their own creative world.
            </p>
            <p className="text-white md:text-base leading-relaxed">
              While your content stays front and center, Flashy Social is
              connected to the Web3 world through a rewards system that gives
              back to creators. As you grow your audience and stay active on the
              platform, you can earn tokens that reflect your impact and
              engagement, rewards you truly own and can use across the wider
              Flashy ecosystem.
            </p>
          </div>
          <div
            className="flex-1 relative w-full aspect-video rounded-full
              bg-radial from-brand-200/20 to-70% to-transparent"
          >
            <div className="absolute inset-0" />
            <motion.div className="absolute left-0 bottom-0 w-[55%] h-[110%]">
              <Image
                src="/images/about-person-1.png"
                alt="Creator 1"
                fill
                className="object-contain object-bottom"
                priority
              />
            </motion.div>
            <motion.div className="absolute right-0 -bottom-8 w-[55%] h-[110%]">
              <Image
                src="/images/about-person-2.png"
                alt="Creator 2"
                fill
                className="object-contain object-bottom"
                priority
              />
            </motion.div>
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
            Flashy Services We Offer
          </h2>
          <div className="flex flex-col gap-2">
            {services.map((service, index) => {
              const isOpen = openItems.has(service.id);

              return (
                <Collapsible
                  key={service.id}
                  open={isOpen}
                  onOpenChange={(open) => {
                    setOpenItems((prev) => {
                      const next = new Set(prev);
                      if (open) {
                        next.add(service.id);
                      } else {
                        next.delete(service.id);
                      }
                      return next;
                    });
                  }}
                >
                  <CollapsibleTrigger
                    className="flex w-full items-center justify-between p-4
                      bg-base-200 hover:bg-base-300 rounded-lg transition-colors
                      cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white text-2xl font-bold">
                        0{index + 1}. {service.title}
                      </span>
                    </div>
                    <div
                      className={`text-base-600 transition-transform
                      duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <ChevronDownIcon />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    className="overflow-hidden data-[state=open]:animate-in
                      data-[state=closed]:animate-out
                      data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                      bg-linear-to-b from-transparent to-brand-200/10 py-8
                      rounded-b-lg"
                  >
                    <div
                      className="px-4 py-3 flex flex-col md:flex-row gap-6
                        items-start"
                    >
                      <div className="text-white flex-1">
                        {service.description}
                      </div>
                      <div className="flex gap-4">
                        {service.icons.map((icon, iconIndex) => (
                          <div
                            key={iconIndex}
                            className="w-40 h-40 relative bg-base-200 border
                              rounded-lg"
                          >
                            <Image
                              src={icon}
                              alt=""
                              fill
                              className="object-contain p-8"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </section>
        <section
          className="relative flex flex-col items-center gap-6 py-8 bg-base-200
            rounded-lg"
        >
          <div
            className="absolute h-[150%] w-[70%] top-1/2 -translate-y-1/2
              bg-radial from-brand-200/20 to-70% to-transparent z-[-1]"
          />
          <div className="text-center relative z-1">
            <h2 className="text-xl md:text-3xl font-bold text-white">
              Become A Part Of The
            </h2>
            <span className="text-xl md:text-3xl font-bold text-brand-200">
              Flashy Universe
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/socialflashy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full
                bg-brand-200 hover:scale-125 transition"
              aria-label="Twitter"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-base-100"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://discord.gg/d9USbg4UuY"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full
                bg-brand-200 hover:scale-125 transition"
              aria-label="Discord"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-base-100"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/flashysocial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full
                bg-brand-200 hover:scale-125 transition"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-base-100"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
