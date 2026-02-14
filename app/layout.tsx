import type { Metadata } from "next";
import "./globals.css";
import TopBar from "./components/TopBar";

export const metadata: Metadata = {
  title: "Job Notification Tracker — KodNest",
  description: "Job Notification Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="kn-layout">
          <TopBar />
          <main className="kn-layout__main">{children}</main>
        </div>
      </body>
    </html>
  );
}
