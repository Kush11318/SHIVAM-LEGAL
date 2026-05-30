import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivam Gupta | Chambers of Legal Advocacy & Counsel",
  description: "Digital chambers and legal portfolio of Shivam Gupta, future advocate, drafting specialist, and legal researcher. Discover high court internships, moot court milestones, and precise consultancy options.",
  keywords: ["Shivam Gupta", "Lawyer Portfolio", "Advocate Indore", "Legal Drafting Specialist", "High Court MP", "Legal Researcher", "Government New Law College"],
  authors: [{ name: "Shivam Gupta" }],
  openGraph: {
    title: "Shivam Gupta | Chambers of Legal Advocacy",
    description: "Digital portfolio of Shivam Gupta, aspiring advocate, corporate counsel, and draftsmanship specialist.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#090909] text-[#F8F5EE]">
        {children}
      </body>
    </html>
  );
}
