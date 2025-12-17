import type { Metadata } from "next";
import "./globals.css";

// Metadata for your application
export const metadata: Metadata = {
  title: "Library Management System",
  description: "Manage books, students, and requests efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}