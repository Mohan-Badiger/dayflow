import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata = {
  title: "DayFlow - Personal Daily Tracker",
  description: "Track and analyze your daily life patterns.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-(--background) text-(--foreground)`}>
        {children}
      </body>
    </html>
  );
}
