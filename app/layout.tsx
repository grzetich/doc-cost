import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docs Cost Calculator — What your documentation costs AI to read",
  description:
    "Analyze the token cost of your API documentation across formats. See how format choices impact AI consumption costs at scale.",
  metadataBase: new URL("https://doc-cost.vercel.app"),
  openGraph: {
    title: "Docs Cost Calculator",
    description:
      "What your API documentation costs AI to read. Compare token counts across formats.",
    url: "https://doc-cost.vercel.app",
    siteName: "Docs Cost Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docs Cost Calculator",
    description:
      "What your API documentation costs AI to read. Compare token counts across formats.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
