import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DayFlow | Personal Tracker",
  description: "Track your daily routine, work sessions, health, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
