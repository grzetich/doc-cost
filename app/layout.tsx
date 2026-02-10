import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docs Cost Calculator — What your documentation costs AI to read",
  description:
    "Analyze the token cost of your API documentation across formats. See how format choices impact AI consumption costs at scale.",
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
