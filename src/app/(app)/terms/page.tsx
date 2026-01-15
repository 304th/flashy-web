"use client";

import Image from "next/image";

const sections = [
  {
    title: "1. Eligibility",
    content: `You must be at least 18 years old (or the age of majority in your jurisdiction) to use Flashy Social. By using the Platform, you represent and warrant that you meet this requirement.`,
  },
  {
    title: "2. Account Registration",
    content: `To access certain features, you may be required to create an account.

You agree to:
• Provide accurate and complete information
• Maintain the security of your account credentials
• Accept responsibility for all activity under your account

You are solely responsible for safeguarding your account and any associated wallets or authentication mechanisms.`,
  },
  {
    title: "3. User Content",
    content: `**3.1 Ownership of Content**
You retain ownership of any content you submit, post, stream, upload, or otherwise make available on Flashy Social ("User Content").

By posting User Content, you grant Flashy a non-exclusive, worldwide, royalty-free, sublicensable license to host, display, distribute, reproduce, stream, and use such content solely for operating, promoting, and improving the Platform.

**3.2 Rights to Broadcast and Share Content**
You may not upload, stream, broadcast, or share any content unless you have the legal right to do so.

This includes, but is not limited to:
• Music, audio, or sound recordings
• Videos, films, or clips
• Live broadcasts
• Images, artwork, or photographs
• Written works
• Any third-party intellectual property

By posting or broadcasting content, you represent and warrant that:
• You own the content, or
• You have obtained all necessary rights, licenses, permissions, and consents required to broadcast, distribute, and monetize the content on Flashy Social

Flashy Social does not permit:
• Pirated content
• Unauthorized live streams
• Content that infringes copyrights, trademarks, or other intellectual property rights
• Content taken from third-party platforms where redistribution is prohibited

Flashy reserves the right to remove content, suspend accounts, or terminate access if we believe content violates these requirements.`,
  },
  {
    title: "4. Prohibited Conduct",
    content: `You agree not to use Flashy Social to:
• Violate any applicable law or regulation
• Infringe intellectual property rights
• Post misleading, fraudulent, or deceptive content
• Harass, threaten, abuse, or defame others
• Distribute malware, spam, or harmful code
• Manipulate rewards, incentives, or platform mechanics
• Circumvent platform safeguards or security features

Flashy reserves the right to investigate and take appropriate action against violations, including suspension or termination of accounts.`,
  },
  {
    title: "5. Digital Rewards, Tokens, and Incentives",
    content: `Flashy Social may include reward mechanisms, points, XP, digital gold units, tokens, or other incentives ("Digital Rewards").

You acknowledge and agree that:
• Digital Rewards may have no guaranteed monetary value
• Digital Rewards are not investments, securities, or financial products
• Availability, mechanics, and conversion rules may change at any time
• Flashy makes no guarantees regarding future value, liquidity, or usability

Participation in reward systems is voluntary and at your own risk.`,
  },
  {
    title: "6. No Financial, Legal, or Investment Advice",
    content: `Content on Flashy Social is provided for informational and entertainment purposes only.

Nothing on the Platform constitutes:
• Financial advice
• Investment advice
• Legal advice
• Tax advice

You are solely responsible for your decisions and actions.`,
  },
  {
    title: "7. Moderation and Enforcement",
    content: `Flashy reserves the right (but not the obligation) to:
• Review, monitor, or remove User Content
• Restrict or terminate access to the Platform
• Take action to protect the integrity, safety, and operation of Flashy Social

We may take such actions with or without notice.`,
  },
  {
    title: "8. Termination",
    content: `You may stop using Flashy Social at any time.

Flashy may suspend or terminate your access at any time if:
• You violate these Terms
• You pose a risk to the Platform or other users
• Required by law or regulation

Termination does not affect provisions that should survive by nature, including intellectual property, disclaimers, and limitation of liability.`,
  },
  {
    title: "9. Disclaimers",
    content: `Flashy Social is provided "as is" and "as available."

We make no warranties, express or implied, regarding:
• Platform availability
• Accuracy of content
• Reliability of Digital Rewards
• Security or error-free operation

Use of the Platform is at your own risk.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `To the maximum extent permitted by law, Flashy and its affiliates shall not be liable for:
• Indirect, incidental, or consequential damages
• Loss of data, profits, or digital assets
• Content posted by users
• Unauthorized access or third-party actions`,
  },
  {
    title: "11. Indemnification",
    content: `You agree to indemnify and hold harmless Flashy, its affiliates, officers, and partners from any claims, damages, or liabilities arising from:
• Your use of the Platform
• Your User Content
• Your violation of these Terms or applicable laws`,
  },
  {
    title: "12. Changes to These Terms",
    content: `Flashy may update these Terms from time to time.

Continued use of the Platform after changes constitutes acceptance of the updated Terms.`,
  },
  {
    title: "13. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of Nevada, without regard to conflict-of-law principles.`,
  },
  {
    title: "14. Contact",
    content: `For questions or legal notices, contact:
admin@flashy.social or via the Platform's official support channels.`,
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full">
      <div
        className="relative w-full h-[200px] md:h-[280px] rounded-lg
          overflow-hidden"
      >
        <Image
          src="/images/placeholder-banner.png"
          alt="Terms and Conditions"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center z-1">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Terms and Conditions
          </h1>
        </div>
      </div>
      <div className="flex flex-col max-w-page mx-auto px-4 py-12 gap-8">
        <div>
          <p className="text-lg font-semibold text-white">Last updated: January 14, 2026</p>
          <p className="mt-4">
            Welcome to Flashy Social (&quot;Flashy,&quot; &quot;Flashy Social,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p className="mt-4">
            These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Flashy Social platform, including any websites, applications, content, features, or services offered by Flashy (collectively, the &quot;Platform&quot;).
          </p>
          <p className="mt-4">
            By accessing or using Flashy Social, you agree to be bound by these Terms. If you do not agree, you may not access or use the Platform.
          </p>
        </div>
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {section.title}
            </h2>
            <div className="whitespace-pre-line">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
