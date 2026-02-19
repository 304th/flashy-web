"use client";

import Image from "next/image";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information to provide better services to all users and to improve, secure, and operate the Flashy ecosystem.

**Information You Provide to Us**
We collect information you provide directly, including when you:
• create an account,
• interact with social features,
• communicate with us,
• participate in community activities, promotions, or incentives.

This may include:
• username or display name,
• email address,
• wallet addresses or blockchain identifiers,
• profile information you choose to share,
• communications sent to Flashy.

You may choose not to provide certain information, but this may limit your ability to use some features.

**Information We Collect Automatically**
When you use flashy.social, we automatically collect certain information, including:
• Device information: browser type, operating system, device identifiers.
• Usage information: interactions with content, pages viewed, features used, referral activity.
• Log data: IP address, date and time of access, error logs.
• Cookies and similar technologies: used to remember preferences, understand usage patterns, and improve performance.

We may associate this information with your account where applicable.

**Blockchain and Public Ledger Data**
Flashy may interact with blockchain networks. Blockchain transactions are public by nature and may be visible to anyone. Flashy does not control and is not responsible for information stored on public blockchains.

Wallet addresses and transaction data may be linked to your use of the Services, but Flashy does not custody private keys.`,
  },
  {
    title: "2. How We Use Information",
    content: `We use the information we collect to:
• provide, operate, and maintain the Services,
• personalize user experience,
• enable social and community features,
• facilitate incentives, rewards, or engagement mechanics,
• communicate with users about updates, security, or support,
• improve performance, functionality, and safety,
• comply with legal and regulatory obligations.

We do not sell personal information.`,
  },
  {
    title: "3. Sharing of Information",
    content: `We share information only as necessary and in the following circumstances:

**With Service Providers**
We may share information with trusted third parties who assist us in operating the Services (e.g., hosting, analytics, communications), subject to confidentiality and data protection obligations.

**For Legal Reasons**
We may disclose information if required to:
• comply with applicable law or legal process,
• enforce our terms or protect rights, safety, or property,
• prevent fraud or security issues.

**Business Transfers**
If Flashy is involved in a merger, acquisition, restructuring, or sale of assets, user information may be transferred as part of that transaction, subject to this Privacy Policy.`,
  },
  {
    title: "4. Cookies and Tracking Technologies",
    content: `We use cookies and similar technologies to:
• keep users signed in,
• remember preferences,
• analyze usage and performance,
• support security and fraud prevention.

You can control cookies through your browser settings. Disabling cookies may affect functionality.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain personal information only as long as necessary to:
• provide the Services,
• comply with legal obligations,
• resolve disputes,
• enforce agreements.

Blockchain data may persist indefinitely due to the nature of distributed ledgers.`,
  },
  {
    title: "6. Security",
    content: `We use commercially reasonable safeguards designed to protect information from unauthorized access, alteration, disclosure, or destruction. However, no system is completely secure, and we cannot guarantee absolute security.

Users are responsible for safeguarding their account credentials and wallet access.`,
  },
  {
    title: "7. Your Rights and Choices",
    content: `Depending on your jurisdiction, you may have rights to:
• access your personal information,
• correct inaccurate information,
• request deletion of certain data,
• object to or restrict processing,
• withdraw consent where applicable.

Requests can be submitted by contacting us at the address below.`,
  },
  {
    title: "8. International Users",
    content: `Flashy operates globally. Information may be processed and stored in jurisdictions outside your country of residence, including jurisdictions that may have different data protection laws.

By using the Services, you consent to such transfers.`,
  },
  {
    title: "9. Children's Privacy",
    content: `Flashy.social is not intended for children under 13 (or under the age required by local law). We do not knowingly collect personal information from children.

If you believe a child has provided us with personal information, please contact us.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.

Material changes will be communicated where required by law.`,
  },
  {
    title: "11. Contact Us",
    content: `If you have questions about this Privacy Policy or Flashy's data practices, contact us at:

Flashy Group
Email: admin@flashy.social
Website: https://flashy.social`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full">
      <div
        className="relative w-full h-[200px] md:h-[280px] rounded-lg
          overflow-hidden"
      >
        <Image
          src="/images/placeholder-banner.png"
          alt="Privacy Policy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center z-1">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Privacy Policy
          </h1>
        </div>
      </div>
      <div className="flex flex-col max-w-page mx-auto px-4 py-12 gap-8">
        <div>
          <p className="text-lg font-semibold text-white">
            Effective Date: January 3, 2026
          </p>
          <p className="mt-4">
            Flashy Labs, Inc (&quot;Flashy Group&quot;, &quot;Flashy,&quot;
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
            website flashy.social and related products, services, and platforms
            (collectively, the &quot;Services&quot;).
          </p>
          <p className="mt-4">
            This Privacy Policy explains what information we collect, why we
            collect it, how we use it, and the choices you have. It is designed
            to help you understand how Flashy handles information when you use
            our Services.
          </p>
          <p className="mt-4">
            By using flashy.social, you agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>
        </div>
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {section.title}
            </h2>
            <div className="whitespace-pre-line">{section.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
